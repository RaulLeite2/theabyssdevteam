import { kvGet, kvSet } from './redis.js';
import crypto from 'crypto';

// Configuração - ALTERE estas credenciais!
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword('admin123'); // Altere isso!

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'the-abyss-salt').digest('hex');
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    const passwordHash = hashPassword(password);
    let isValidUser = false;
    let userRole = null;

    // Verificar se é o admin original
    if (username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
      isValidUser = true;
      userRole = 'admin';
    } else {
      // Verificar se é um usuário registrado
      const userData = await kvGet(`user:${username}`);
      
      if (userData) {
        const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
        
        // Verificar senha
        if (user.passwordHash === passwordHash) {
          // Verificar se está aprovado
          if (!user.approved) {
            return res.status(403).json({ error: 'Conta pendente de aprovação' });
          }
          isValidUser = true;
          userRole = user.role || 'poster';
        }
      }
    }

    if (!isValidUser) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Criar sessão
    const sessionToken = generateSessionToken();
    const sessionData = {
      username,
      role: userRole,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
    };

    // Salvar sessão no Redis
    await kvSet(`session:${sessionToken}`, sessionData, {
      ex: 7 * 24 * 60 * 60 // 7 dias em segundos
    });

    return res.status(200).json({
      success: true,
      token: sessionToken,
      user: { username, role: userRole }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
