import pg from 'pg';
const { Pool } = pg;

let pool = null;
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 segundos

// Função para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function getPool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('❌❌❌ DATABASE_URL NOT CONFIGURED ❌❌❌');
      console.error('');
      console.error('🚨 PostgreSQL is REQUIRED for this application to work!');
      console.error('');
      console.error('👉 Railway Setup:');
      console.error('   1. Go to your Railway project');
      console.error('   2. Click "+ New" button');
      console.error('   3. Select "Database" → "Add PostgreSQL"');
      console.error('   4. Railway will auto-configure DATABASE_URL');
      console.error('   5. Redeploy your application');
      console.error('');
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('📊 Database URL detected:', databaseUrl.replace(/:[^:]*@/, ':****@'));
    
    try {
      // Configuração otimizada para Railway
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        min: 2,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000, // Aumentado para 30s
        // Railway specific settings
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      });
      
      pool.on('error', (err) => {
        console.error('❌ Unexpected error on idle PostgreSQL client:', err.message);
      });
      
      pool.on('connect', () => {
        console.log('✅ New client connected to PostgreSQL');
      });
      
      console.log('✅ PostgreSQL pool created successfully');
    } catch (error) {
      console.error('❌ Failed to create PostgreSQL pool:', error.message);
      throw error;
    }
  }
  
  return pool;
}

// Inicializar banco de dados com retry
export async function initDatabase() {
  const pool = getPool();
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 Database connection attempt ${attempt}/${MAX_RETRIES}...`);
      
      // Testar conexão primeiro
      const result = await pool.query('SELECT NOW() as time, version() as version');
      console.log('✅ Database connection successful!');
      console.log('⏰ Database time:', result.rows[0].time);
      console.log('📦 PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
      
      // Criar tabela de posts se não existir
      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          content TEXT NOT NULL,
          author VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Criar tabela de sessões se não existir
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          token VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          expires_at BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Criar índice para expiração de sessões
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_sessions_expires_at 
        ON sessions(expires_at)
      `);
      
      // Verificar se as tabelas foram criadas
      const tables = await pool.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `);
      
      console.log('✅ Database tables initialized successfully');
      console.log('📋 Available tables:', tables.rows.map(r => r.tablename).join(', '));
      
      return true;
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt} failed:`, error.message);
      
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY/1000} seconds...`);
        await sleep(RETRY_DELAY);
      } else {
        console.error('');
        console.error('❌❌❌ ALL DATABASE CONNECTION ATTEMPTS FAILED ❌❌❌');
        console.error('');
        console.error('🔍 Diagnostic Information:');
        console.error('   Error:', error.message);
        console.error('   Code:', error.code);
        console.error('');
        console.error('💡 Common Solutions:');
        console.error('   1. Make sure PostgreSQL service is in the SAME Railway project');
        console.error('   2. Check if DATABASE_URL variable is set correctly');
        console.error('   3. Verify PostgreSQL service is running (not crashed)');
        console.error('   4. Try using PUBLIC database URL instead of internal');
        console.error('');
        console.error('🔧 How to get PUBLIC URL:');
        console.error('   1. Go to your PostgreSQL service in Railway');
        console.error('   2. Click "Connect" tab');
        console.error('   3. Copy "Postgres Connection URL" (public)');
        console.error('   4. Add it as DATABASE_URL variable in your app service');
        console.error('');
        throw error;
      }
    }
  }
}

// Helper functions para manter compatibilidade com código existente
export async function kvGet(key) {
  const pool = getPool();
  
  if (key.startsWith('session:')) {
    const token = key.replace('session:', '');
    const result = await pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > $2',
      [token, Date.now()]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      userId: row.user_id,
      username: row.username,
      expiresAt: parseInt(row.expires_at)
    };
  }
  
  if (key === 'blog:posts') {
    const result = await pool.query(
      'SELECT id, title, content, author, created_at, updated_at FROM posts ORDER BY created_at DESC'
    );
    
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      author: row.author,
      createdAt: new Date(row.created_at).getTime(),
      updatedAt: new Date(row.updated_at).getTime()
    }));
  }
  
  return null;
}

export async function kvSet(key, value, options = {}) {
  const pool = getPool();
  
  if (key.startsWith('session:')) {
    const token = key.replace('session:', '');
    await pool.query(
      'INSERT INTO sessions (token, user_id, username, expires_at) VALUES ($1, $2, $3, $4) ON CONFLICT (token) DO UPDATE SET expires_at = $4',
      [token, value.userId, value.username, value.expiresAt]
    );
    return;
  }
  
  if (key === 'blog:posts') {
    // Este caso não deve ser usado, posts individuais devem ser criados
    console.warn('kvSet with blog:posts key is not recommended for PostgreSQL');
    return;
  }
}

export async function kvDel(key) {
  const pool = getPool();
  
  if (key.startsWith('session:')) {
    const token = key.replace('session:', '');
    await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    return;
  }
}

export async function kvKeys(pattern) {
  const pool = getPool();
  
  if (pattern === 'session:*') {
    const result = await pool.query('SELECT token FROM sessions WHERE expires_at > $1', [Date.now()]);
    return result.rows.map(row => `session:${row.token}`);
  }
  
  return [];
}

// Funções específicas para posts
export async function createPost(title, content, author) {
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *',
    [title, content, author]
  );
  
  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime()
  };
}

export async function updatePost(id, title, content) {
  const pool = getPool();
  const result = await pool.query(
    'UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  
  if (result.rows.length === 0) return null;
  
  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime()
  };
}

export async function deletePost(id) {
  const pool = getPool();
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
}

export async function getAllPosts() {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id, title, content, author, created_at, updated_at FROM posts ORDER BY created_at DESC'
  );
  
  return result.rows.map(row => ({
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime()
  }));
}
