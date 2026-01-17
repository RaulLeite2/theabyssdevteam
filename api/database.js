import pg from 'pg';
const { Pool } = pg;

let pool = null;
let connectionAttempts = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000; // 3 segundos

// Função para esperar
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para mascarar senha nos logs
function maskPassword(password) {
  if (!password) return '(empty)';
  if (password.length <= 4) return '*'.repeat(password.length);
  return password.substring(0, 2) + '*'.repeat(password.length - 4) + password.substring(password.length - 2);
}

// Função para construir configuração do PostgreSQL
function buildDatabaseConfig() {
  console.log('🔍 Detecting database configuration method...');
  console.log('');
  
  // PRIORIDADE 1: DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    console.log('✅ METHOD: DATABASE_URL detected');
    console.log('   Priority: 1 (highest)');
    console.log('');
    
    // Parsear URL para validação e logs
    const urlMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:/?]+):?(\d+)?\/([^?]+)/);
    
    if (urlMatch) {
      const [, user, password, host, port, database] = urlMatch;
      console.log('📊 Parsed Database Configuration:');
      console.log('   Protocol: PostgreSQL');
      console.log('   User:', user);
      console.log('   Password:', maskPassword(password));
      console.log('   Host:', host);
      console.log('   Port:', port || '5432 (default)');
      console.log('   Database:', database);
      console.log('');
      
      return {
        method: 'DATABASE_URL',
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
    } else {
      console.warn('⚠️ DATABASE_URL format not recognized, using as-is');
      console.log('   Format expected: postgresql://user:pass@host:port/db');
      console.log('');
      
      return {
        method: 'DATABASE_URL (unparsed)',
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      };
    }
  }
  
  // PRIORIDADE 2: Variáveis separadas (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)
  console.log('ℹ️ DATABASE_URL not found, checking individual variables...');
  console.log('');
  
  const pgHost = process.env.PGHOST;
  const pgPort = process.env.PGPORT;
  const pgUser = process.env.PGUSER;
  const pgPassword = process.env.PGPASSWORD;
  const pgDatabase = process.env.PGDATABASE;
  
  // Validar variáveis necessárias
  const missing = [];
  if (!pgHost) missing.push('PGHOST');
  if (!pgUser) missing.push('PGUSER');
  if (!pgPassword) missing.push('PGPASSWORD');
  if (!pgDatabase) missing.push('PGDATABASE');
  
  if (missing.length > 0) {
    console.error('');
    console.error('═'.repeat(60));
    console.error('❌❌❌ DATABASE CONFIGURATION MISSING ❌❌❌');
    console.error('═'.repeat(60));
    console.error('');
    console.error('🚨 PostgreSQL is REQUIRED for this application!');
    console.error('');
    console.error('📋 Missing variables:', missing.join(', '));
    console.error('');
    console.error('💡 Configuration Options:');
    console.error('');
    console.error('   OPTION 1 (Recommended): Single DATABASE_URL');
    console.error('   ────────────────────────────────────────');
    console.error('   DATABASE_URL=postgresql://user:pass@host:port/db');
    console.error('');
    console.error('   OPTION 2: Separate Variables');
    console.error('   ────────────────────────────────────────');
    console.error('   PGHOST=your-host.com');
    console.error('   PGPORT=5432');
    console.error('   PGUSER=your-user');
    console.error('   PGPASSWORD=your-password');
    console.error('   PGDATABASE=your-database');
    console.error('');
    console.error('👉 Railway Setup:');
    console.error('   1. Add PostgreSQL service to your project');
    console.error('   2. Railway auto-configures DATABASE_URL');
    console.error('   3. Redeploy your application');
    console.error('');
    console.error('═'.repeat(60));
    console.error('');
    
    throw new Error(`Missing required database configuration: ${missing.join(', ')}`);
  }
  
  console.log('✅ METHOD: Individual variables (PG*)');
  console.log('   Priority: 2 (fallback)');
  console.log('');
  console.log('📊 Database Configuration:');
  console.log('   Host:', pgHost);
  console.log('   Port:', pgPort || '5432 (default)');
  console.log('   User:', pgUser);
  console.log('   Password:', maskPassword(pgPassword));
  console.log('   Database:', pgDatabase);
  console.log('');
  
  return {
    method: 'PG Variables',
    host: pgHost,
    port: parseInt(pgPort) || 5432,
    user: pgUser,
    password: pgPassword,
    database: pgDatabase,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
}

export function getPool() {
  if (!pool) {
    console.log('📦 Creating PostgreSQL connection pool...');
    console.log('');
    
    try {
      const dbConfig = buildDatabaseConfig();
      
      console.log('⚙️ Pool Configuration:');
      console.log('   Connection Method:', dbConfig.method);
      console.log('   Max connections: 20');
      console.log('   Min connections: 2');
      console.log('   Idle timeout: 30000ms');
      console.log('   Connection timeout: 30000ms');
      console.log('   SSL:', dbConfig.ssl ? 'enabled' : 'disabled');
      console.log('   Keep-alive: enabled');
      console.log('');
      
      // Configuração otimizada para Railway e outros ambientes
      pool = new Pool({
        ...dbConfig,
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
      
      // Criar tabela de usuários
      console.log('📦 Creating table: users...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'viewer',
          avatar VARCHAR(10) DEFAULT '🤖',
          bio TEXT,
          xp INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          streak_days INTEGER DEFAULT 0,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT valid_role CHECK (role IN ('viewer', 'editor', 'admin'))
        )
      `);
      console.log('   ✅ Table "users" ready');
      
      // Criar tabela de contatos
      console.log('📦 Creating table: contacts...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT valid_status CHECK (status IN ('pending', 'read', 'replied'))
        )
      `);
      console.log('   ✅ Table "contacts" ready');
      
      // Criar índices
      console.log('📦 Creating indexes...');
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_sessions_expires_at 
        ON sessions(expires_at)
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_users_email 
        ON users(email)
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_contacts_status 
        ON contacts(status)
      `);
      console.log('   ✅ Indexes created');
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
      
      const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
      console.log(`   users: ${userCount.rows[0].count} records`);
      
      const contactCount = await pool.query('SELECT COUNT(*) as count FROM contacts');
      console.log(`   contacts: ${contactCount.rows[0].count} records`);
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

// Funções específicas para users
export async function createUser(username, email, passwordHash, role = 'viewer') {
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, avatar, xp, level, created_at',
    [username, email, passwordHash, role]
  );
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getUserById(id) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id, username, email, role, avatar, bio, xp, level, streak_days, last_login, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function updateUserLastLogin(userId) {
  const pool = getPool();
  await pool.query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [userId]
  );
}

export async function updateUserXP(userId, xpToAdd) {
  const pool = getPool();
  const result = await pool.query(
    'UPDATE users SET xp = xp + $1, level = FLOOR((xp + $1) / 100) + 1 WHERE id = $2 RETURNING xp, level',
    [xpToAdd, userId]
  );
  return result.rows[0];
}

export async function getUserStats(userId) {
  const pool = getPool();
  
  // Contar posts do usuário
  const postsResult = await pool.query(
    'SELECT COUNT(*) as count FROM posts WHERE author = (SELECT username FROM users WHERE id = $1)',
    [userId]
  );
  
  // Contar sessões ativas
  const sessionsResult = await pool.query(
    'SELECT COUNT(*) as count FROM sessions WHERE user_id = $1 AND expires_at > $2',
    [userId.toString(), Date.now()]
  );
  
  // Obter dados do usuário
  const user = await getUserById(userId);
  
  return {
    posts: parseInt(postsResult.rows[0].count),
    sessions: parseInt(sessionsResult.rows[0].count),
    xp: user.xp,
    level: user.level,
    streak: user.streak_days
  };
}

// Funções específicas para contacts
export async function createContact(name, email, message) {
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
    [name, email, message]
  );
  return result.rows[0];
}

export async function getAllContacts() {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM contacts ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function updateContactStatus(id, status) {
  const pool = getPool();
  await pool.query(
    'UPDATE contacts SET status = $1 WHERE id = $2',
    [status, id]
  );
}
