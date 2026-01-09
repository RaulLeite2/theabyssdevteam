import { kv } from '@vercel/kv';

// Verificar se é admin
async function isAdmin(token) {
  if (!token) return false;
  
  const sessionData = await kv.get(`session:${token}`);
  if (!sessionData) return false;
  
  const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
  
  if (session.expiresAt < Date.now()) {
    await kv.del(`session:${token}`);
    return false;
  }

  // Verificar se o usuário é admin
  const userData = await kv.get(`user:${session.username}`);
  if (!userData) {
    // Se não existe como user, verificar se é o admin original
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    return session.username === ADMIN_USERNAME;
  }

  const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
  return user.role === 'admin';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!await isAdmin(token)) {
    return res.status(401).json({ error: 'Não autorizado. Apenas administradores.' });
  }

  try {
    // GET - Listar todos os usuários
    if (req.method === 'GET') {
      const pendingUsers = await kv.get('pending_users') || [];
      const parsedPending = typeof pendingUsers === 'string' ? JSON.parse(pendingUsers) : pendingUsers;
      const pendingArray = Array.isArray(parsedPending) ? parsedPending : [];

      // Buscar dados de todos os usuários
      const users = [];
      const allKeys = await kv.keys('user:*');
      
      for (const key of allKeys) {
        const userData = await kv.get(key);
        if (userData) {
          const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
          users.push({
            username: user.username,
            email: user.email,
            approved: user.approved,
            role: user.role,
            createdAt: user.createdAt
          });
        }
      }

      return res.status(200).json({ 
        users: users.sort((a, b) => b.createdAt - a.createdAt),
        pending: pendingArray
      });
    }

    // POST - Aprovar usuário
    if (req.method === 'POST') {
      const { username, action } = req.body;

      if (!username || !action) {
        return res.status(400).json({ error: 'Username e action são obrigatórios' });
      }

      const userData = await kv.get(`user:${username}`);
      if (!userData) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const user = typeof userData === 'string' ? JSON.parse(userData) : userData;

      if (action === 'approve') {
        user.approved = true;
        await kv.set(`user:${username}`, JSON.stringify(user));

        // Remover da lista de pendentes
        const pendingUsers = await kv.get('pending_users') || [];
        const parsedPending = typeof pendingUsers === 'string' ? JSON.parse(pendingUsers) : pendingUsers;
        const pendingArray = Array.isArray(parsedPending) ? parsedPending : [];
        const updatedPending = pendingArray.filter(u => u !== username);
        await kv.set('pending_users', JSON.stringify(updatedPending));

        return res.status(200).json({ success: true, message: 'Usuário aprovado' });
      }

      if (action === 'reject') {
        // Deletar usuário
        await kv.del(`user:${username}`);

        // Remover da lista de pendentes
        const pendingUsers = await kv.get('pending_users') || [];
        const parsedPending = typeof pendingUsers === 'string' ? JSON.parse(pendingUsers) : pendingUsers;
        const pendingArray = Array.isArray(parsedPending) ? parsedPending : [];
        const updatedPending = pendingArray.filter(u => u !== username);
        await kv.set('pending_users', JSON.stringify(updatedPending));

        return res.status(200).json({ success: true, message: 'Usuário rejeitado' });
      }

      return res.status(400).json({ error: 'Action inválida' });
    }

    // DELETE - Deletar usuário
    if (req.method === 'DELETE') {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ error: 'Username é obrigatório' });
      }

      await kv.del(`user:${username}`);

      // Remover da lista de pendentes se existir
      const pendingUsers = await kv.get('pending_users') || [];
      const parsedPending = typeof pendingUsers === 'string' ? JSON.parse(pendingUsers) : pendingUsers;
      const pendingArray = Array.isArray(parsedPending) ? parsedPending : [];
      const updatedPending = pendingArray.filter(u => u !== username);
      await kv.set('pending_users', JSON.stringify(updatedPending));

      return res.status(200).json({ success: true, message: 'Usuário deletado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Erro na API de usuários:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
