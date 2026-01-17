import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { initDatabase } from './api/database.js';
import { handler as usersHandler } from './api/users.js';
import { handler as contactHandler } from './api/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('\n');
console.log('═'.repeat(60));
console.log('🚀 THE ABYSS DEV TEAM - SERVER STARTING');
console.log('═'.repeat(60));
console.log('');

// Log de todas as variáveis de ambiente importantes
console.log('📝 ENVIRONMENT VARIABLES:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   PORT:', PORT);
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : '❌ NOT SET');
console.log('   PWD:', process.cwd());
console.log('');

console.log('💻 SYSTEM INFO:');
console.log('   Node Version:', process.version);
console.log('   Platform:', process.platform);
console.log('   Architecture:', process.arch);
console.log('   Memory:', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB used');
console.log('');

console.log('🛠️ CONFIGURING EXPRESS...');

app.use(express.json());
console.log('   ✅ JSON parser configured');

app.use(express.static(path.join(__dirname)));
console.log('   ✅ Static files middleware configured');
console.log('   📂 Serving from:', __dirname);
console.log('');

app.get("/", (req, res) => {
  console.log('🌐 [REQUEST] GET / - Serving index.html');
  res.sendFile(path.join(__dirname, "index.html"));
});

// Health check endpoint para monitoramento
app.get("/health", async (req, res) => {
  console.log('🏥 [REQUEST] GET /health - Health check');
  try {
    const { getPool } = await import('./api/database.js');
    const pool = getPool();
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime() + 's'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.all('/api/users', usersHandler);
app.all('/api/users/:action', usersHandler);
app.all('/api/contact', contactHandler);
app.all('/api/contact/:action', contactHandler);

console.log('   ✅ Routes configured');
console.log('   📍 Main: GET /');
console.log('   📍 Health: GET /health');
console.log('   📍 API Users: /api/users (POST register, POST login, GET profile)');
console.log('   📍 API Contact: /api/contact (POST, GET, PATCH)');
console.log('');

// Função para fazer auto-request ao servidor após inicialização
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 10000,
      headers: {
        'User-Agent': 'Railway-Auto-Ping/1.0'
      }
    };
    
    const req = protocol.request(options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          contentLength: Buffer.concat(chunks).length
        });
      });
    });
    
    req.on('error', (error) => reject(error));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function pingServer() {
  // Aguardar 2 segundos para garantir que o servidor está pronto
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    console.log('');
    console.log('═'.repeat(60));
    console.log('🔔 AUTO-PING: Testing server availability...');
    console.log('═'.repeat(60));
    console.log('');
    
    const startTime = Date.now();
    
    // Detectar URL do Railway ou usar localhost
    const railwayUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : process.env.RAILWAY_STATIC_URL
      ? `https://${process.env.RAILWAY_STATIC_URL}`
      : `http://localhost:${PORT}`;
    
    console.log('📍 Target URL:', railwayUrl);
    console.log('🔌 Sending GET request...');
    
    const response = await makeRequest(railwayUrl);
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      console.log('');
      console.log('✅ Auto-ping SUCCESSFUL!');
      console.log('   Status:', response.status, response.statusText);
      console.log('   Response Time:', duration + 'ms');
      console.log('   Content-Type:', response.headers['content-type'] || 'N/A');
      console.log('   Content-Length:', response.contentLength ? response.contentLength + ' bytes' : 'N/A');
      console.log('');
      console.log('🎉 Server is publicly accessible and responding!');
      console.log('');
      console.log('═'.repeat(60));
    } else {
      console.log('');
      console.log('⚠️ Auto-ping received non-OK status:', response.status);
      console.log('');
    }
  } catch (error) {
    console.log('');
    console.log('⚠️ Auto-ping failed (this is normal for Railway during first deploy)');
    console.log('   Reason:', error.message);
    console.log('   Note: Server is running, but public URL may not be ready yet');
    console.log('');
    console.log('💡 Railway Setup:');
    console.log('   1. Go to your service settings');
    console.log('   2. Click "Networking" tab');
    console.log('   3. Generate a public domain if not already created');
    console.log('');
    console.log('═'.repeat(60));
    console.log('');
  }
}

// Inicializar banco de dados e iniciar servidor
async function start() {
  console.log('═'.repeat(60));
  console.log('📦 PHASE 1: DATABASE INITIALIZATION');
  console.log('═'.repeat(60));
  console.log('');
  
  try {
    console.log('🔌 Attempting to connect to PostgreSQL...');
    console.log('');
    
    await initDatabase();
    
    console.log('');
    console.log('═'.repeat(60));
    console.log('📦 PHASE 2: STARTING HTTP SERVER');
    console.log('═'.repeat(60));
    console.log('');
    
    app.listen(PORT, '0.0.0.0', async () => {
      console.log('✅ HTTP Server started successfully!');
      console.log('');
      console.log('🌐 Server Information:');
      console.log('   Local: http://localhost:' + PORT);
      console.log('   Network: http://0.0.0.0:' + PORT);
      console.log('   Port:', PORT);
      console.log('   Status: READY');
      
      // Detectar Railway URL
      const railwayUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : process.env.RAILWAY_STATIC_URL
        ? `https://${process.env.RAILWAY_STATIC_URL}`
        : 'Check Railway dashboard';
      
      console.log('   Railway URL:', railwayUrl);
      console.log('');
      console.log('═'.repeat(60));
      console.log('✅✅✅ SERVER FULLY OPERATIONAL ✅✅✅');
      console.log('═'.repeat(60));
      console.log('');
      console.log('🟢 Waiting for requests...');
      
      // Auto-ping para iniciar o servidor
      pingServer().catch(err => {
        console.log('⚠️ Auto-ping error:', err.message);
      });
    });
  } catch (error) {
    console.log('');
    console.log('═'.repeat(60));
    console.log('❌❌❌ FATAL ERROR - SERVER FAILED TO START ❌❌❌');
    console.log('═'.repeat(60));
    console.log('');
    console.log('🐛 Error Details:');
    console.log('   Message:', error.message);
    console.log('   Code:', error.code || 'N/A');
    console.log('   Name:', error.name);
    console.log('');
    console.log('📍 Stack Trace:');
    console.log(error.stack);
    console.log('');
    console.log('👉 Make sure PostgreSQL is configured on Railway!');
    console.log('');
    process.exit(1);
  }
}

start();
