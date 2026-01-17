import { 
  getUserById, 
  getUserByEmail,
  createUser,
  updateUserLastLogin,
  updateUserXP,
  getUserStats
} from './database.js';
import crypto from 'crypto';

// Hash simples de senha (em produção use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

export async function handler(req, res) {
  const { method } = req;
  
  if (method === 'POST') {
    // Registrar novo usuário ou fazer login
    const { action, username, email, password, role } = req.body;
    
    if (action === 'register') {
      try {
        // Verificar se email já existe
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
        
        // Criar novo usuário
        const passwordHash = hashPassword(password);
        const user = await createUser(username, email, passwordHash, role || 'viewer');
        
        // Adicionar XP inicial
        await updateUserXP(user.id, 50); // XP por criar conta
        
        return res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        });
      } catch (error) {
        console.error('❌ Erro ao registrar usuário:', error);
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
    }
    
    if (action === 'login') {
      try {
        const user = await getUserByEmail(email);
        if (!user) {
          return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        
        if (!verifyPassword(password, user.password_hash)) {
          return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        
        // Atualizar last_login
        await updateUserLastLogin(user.id);
        
        // Adicionar XP por fazer login
        await updateUserXP(user.id, 10);
        
        return res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            xp: user.xp,
            level: user.level
          }
        });
      } catch (error) {
        console.error('❌ Erro ao fazer login:', error);
        return res.status(500).json({ error: 'Erro ao fazer login' });
      }
    }
    
    return res.status(400).json({ error: 'Ação inválida' });
  }
  
  if (method === 'GET') {
    // Obter informações do usuário
    const userId = req.query.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido' });
    }
    
    try {
      const user = await getUserById(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      const stats = await getUserStats(parseInt(userId));
      
      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          xp: user.xp,
          level: user.level,
          streakDays: user.streak_days,
          lastLogin: user.last_login,
          createdAt: user.created_at
        },
        stats
      });
    } catch (error) {
      console.error('❌ Erro ao obter usuário:', error);
      return res.status(500).json({ error: 'Erro ao obter usuário' });
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' });
}

// Middleware para verificar permissões
export function requirePermission(...allowedRoles) {
  return async (req, res, next) => {
    const userId = req.session?.userId; // Assumindo que temos sessão
    
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    
    try {
      const user = await getUserById(userId);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Permissão negada' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('❌ Erro ao verificar permissões:', error);
      return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
  };
}

export default router;
