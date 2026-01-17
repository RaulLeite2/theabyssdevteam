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
    console.log('📦 Creating PostgreSQL connection pool...');
    
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('');
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
    
    // Parsear URL para mostrar detalhes (escondendo senha)
    const urlParts = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (urlParts) {
      console.log('📊 Database Connection Details:');
      console.log('   User:', urlParts[1]);
      console.log('   Password:', '*'.repeat(urlParts[2].length));
      console.log('   Host:', urlParts[3]);
      console.log('   Port:', urlParts[4]);
      console.log('   Database:', urlParts[5]);
    } else {
      console.log('📊 Database URL:', databaseUrl.substring(0, 40) + '...');
    }
    console.log('');
    
    try {
      console.log('⚙️ Pool Configuration:');
      console.log('   Max connections: 20');
      console.log('   Min connections: 2');
      console.log('   Idle timeout: 30000ms');
      console.log('   Connection timeout: 30000ms');
      console.log('   SSL:', process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled');
      console.log('   Keep-alive: enabled');
      console.log('');
      
      // Configuração otimizada para Railway
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        min: 2,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
      });
      
      pool.on('error', (err) => {
        console.error('❌ [POOL ERROR] Unexpected error on idle client:', err.message);
      });
      
      pool.on('connect', (client) => {
        console.log('🔗 [POOL] New client connected to database');
      });
      
      pool.on('acquire', (client) => {
        console.log('🔒 [POOL] Client acquired from pool');
      });
      
      pool.on('remove', (client) => {
        console.log('🗑️ [POOL] Client removed from pool');
      });
      
      console.log('✅ PostgreSQL pool created successfully');
      console.log('');
    } catch (error) {
      console.error('❌ Failed to create PostgreSQL pool:', error.message);
      throw error;
    }
  }
  
  return pool;
}

// Inicializar banco de dados com retry
export async function initDatabase() {
  console.log('📦 Starting database initialization...');
  console.log('');
  
  const pool = getPool();
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log('═'.repeat(50));
      console.log(`🔄 CONNECTION ATTEMPT ${attempt}/${MAX_RETRIES}`);
      console.log('═'.repeat(50));
      console.log('');
      
      console.log('🔌 Executing test query (SELECT NOW())...');
      const startTime = Date.now();
      const result = await pool.query('SELECT NOW() as time, version() as version, current_database() as db');
      const duration = Date.now() - startTime;
      
      console.log(`✅ Query executed successfully in ${duration}ms`);
      console.log('');
      console.log('📊 Database Information:');
      console.log('   Current Time:', result.rows[0].time);
      console.log('   Database Name:', result.rows[0].db);
      console.log('   PostgreSQL Version:', result.rows[0].version.split(',')[0]);
      console.log('');
      
      // Criar tabela de posts
      console.log('📦 Creating table: posts...');
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
      console.log('   ✅ Table "posts" ready');
      
      // Criar tabela de sessões
      console.log('📦 Creating table: sessions...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sessions (
          token VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          expires_at BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('   ✅ Table "sessions" ready');
      
      // Criar índice
      console.log('📦 Creating index: idx_sessions_expires_at...');
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_sessions_expires_at 
        ON sessions(expires_at)
      `);
      console.log('   ✅ Index created');
      console.log('');
      
      // Verificar tabelas criadas
      console.log('🔍 Verifying database schema...');
      const tables = await pool.query(`
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `);
      
      console.log('📋 Available Tables:', tables.rows.length);
      tables.rows.forEach((row, idx) => {
        console.log(`   ${idx + 1}. ${row.tablename}`);
      });
      console.log('');
      
      // Contar registros em cada tabela
      console.log('📈 Table Statistics:');
      const postCount = await pool.query('SELECT COUNT(*) as count FROM posts');
      console.log(`   posts: ${postCount.rows[0].count} records`);
      
      const sessionCount = await pool.query('SELECT COUNT(*) as count FROM sessions');
      console.log(`   sessions: ${sessionCount.rows[0].count} records`);
      console.log('');
      
      console.log('═'.repeat(50));
      console.log('✅✅✅ DATABASE INITIALIZATION SUCCESSFUL ✅✅✅');
      console.log('═'.repeat(50));
      console.log('');
      
      return true;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} FAILED`);
      console.error('   Error:', error.message);
      console.error('   Code:', error.code || 'N/A');
      console.error('   Detail:', error.detail || 'N/A');
      console.error('');
      
      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Waiting ${RETRY_DELAY/1000} seconds before retry...`);
        console.log('');
        await sleep(RETRY_DELAY);
      } else {
        console.log('');
        console.log('═'.repeat(50));
        console.log('❌❌❌ ALL CONNECTION ATTEMPTS FAILED ❌❌❌');
        console.log('═'.repeat(50));
        console.log('');
        console.log('🔍 Diagnostic Information:');
        console.log('   Error Message:', error.message);
        console.log('   Error Code:', error.code);
        console.log('   Error Name:', error.name);
        console.log('');
        console.log('💡 Common Solutions:');
        console.log('   1. Make sure PostgreSQL service is in the SAME Railway project');
        console.log('   2. Check if DATABASE_URL variable is set correctly');
        console.log('   3. Verify PostgreSQL service is running (not crashed)');
        console.log('   4. Try using PUBLIC database URL instead of internal');
        console.log('');
        console.log('🔧 How to get PUBLIC URL:');
        console.log('   1. Go to your PostgreSQL service in Railway');
        console.log('   2. Click "Connect" tab');
        console.log('   3. Copy "Postgres Connection URL" (public)');
        console.log('   4. Add it as DATABASE_URL variable in your app service');
        console.log('');
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
