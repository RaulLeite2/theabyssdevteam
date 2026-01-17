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
  console.log('');
  
  try {
    await initDatabase();
    console.log('✅ Database initialized successfully');
    console.log('');
    
    app.listen(PORT, () => {
      console.log('✅ Servidor rodando na porta ' + PORT);
      console.log('🌐 Server ready at http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('');
    console.error('❌❌❌ FAILED TO START SERVER ❌❌❌');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    console.error('👉 Make sure PostgreSQL is configured on Railway!');
    console.error('');
    process.exit(1);
  }
}

start();
