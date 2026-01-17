import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './api/database.js';

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

console.log('   ✅ Routes configured');
console.log('');

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
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('✅ HTTP Server started successfully!');
      console.log('');
      console.log('🌐 Server Information:');
      console.log('   Local: http://localhost:' + PORT);
      console.log('   Network: http://0.0.0.0:' + PORT);
      console.log('   Port:', PORT);
      console.log('   Status: READY');
      console.log('   Railway URL: Check Railway dashboard for public URL');
      console.log('');
      console.log('═'.repeat(60));
      console.log('✅✅✅ SERVER FULLY OPERATIONAL ✅✅✅');
      console.log('═'.repeat(60));
      console.log('');
      console.log('🟢 Waiting for requests...');
      console.log('');
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
