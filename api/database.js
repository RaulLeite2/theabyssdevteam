import pg from 'pg';
const { Pool } = pg;

let pool = null;

export function getPool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.warn('⚠️  DATABASE_URL not configured - database features disabled');
      return null;
    }
    
    try {
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      
      pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client', err);
      });
      
      console.log('✅ PostgreSQL pool created successfully');
    } catch (error) {
      console.error('❌ Failed to create PostgreSQL pool:', error.message);
      return null;
    }
  }
  
  return pool;
}

// Inicializar banco de dados
export async function initDatabase() {
  const pool = getPool();
  
  if (!pool) {
    console.warn('⚠️  Skipping database initialization - no database connection');
    return false;
  }
  
  try {
    // Testar conexão primeiro
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
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
    
    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.warn('⚠️  Server will run without database features');
    return false;
  }
}

// Helper functions para manter compatibilidade com código existente
export async function kvGet(key) {
  const pool = getPool();
  if (!pool) return null;
  
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
  if (!pool) return false;
  
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
  if (!pool) return false;
  
  if (key.startsWith('session:')) {
    const token = key.replace('session:', '');
    await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    return;
  }
}

export async function kvKeys(pattern) {
  const pool = getPool();
  if (!pool) return [];
  
  if (pattern === 'session:*') {
    const result = await pool.query('SELECT token FROM sessions WHERE expires_at > $1', [Date.now()]);
    return result.rows.map(row => `session:${row.token}`);
  }
  
  return [];
}

// Funções específicas para posts
export async function createPost(title, content, author) {
  const pool = getPool();
  if (!pool) throw new Error('Database not available');
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
  if (!pool) throw new Error('Database not available');
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
  if (!pool) throw new Error('Database not available');
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
}

export async function getAllPosts() {
  const pool = getPool();
  if (!pool) return [];
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
