import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './api/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Inicializar banco de dados e iniciar servidor
async function start() {
  console.log('🚀 Starting The Abyss Dev Team server...');
  console.log('📍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔌 Port:', PORT);
  
  try {
    // Tentar inicializar banco (não crítico)
    const dbInitialized = await initDatabase();
    
    if (dbInitialized) {
      console.log('✅ Database features enabled');
    } else {
      console.log('⚠️  Running in static mode (database features disabled)');
      console.log('💡 To enable database: Set DATABASE_URL environment variable');
    }
    
    app.listen(PORT, () => {
      console.log('✅ Servidor rodando na porta ' + PORT);
      console.log('🌐 Server ready and accepting connections');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

start();
