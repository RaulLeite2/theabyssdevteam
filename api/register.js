import { kv } from '@vercel/kv';
import crypto from 'crypto';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'the-abyss-salt').digest('hex');
}

export default async function handler(req, res) {
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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Validações
    if (username.length < 3) {
      return res.status(400).json({ error: 'O usuário deve ter pelo menos 3 caracteres' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Verificar se usuário já existe
    const existingUser = await kv.get(`user:${username}`);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criar usuário com status pendente
    const passwordHash = hashPassword(password);
    const userData = {
      username,
      email,
      passwordHash,
      approved: false,
      role: 'poster', // Pode ser: 'poster' ou 'admin'
      createdAt: Date.now()
    };

    // Salvar usuário no KV
    await kv.set(`user:${username}`, JSON.stringify(userData));

    // Adicionar à lista de usuários pendentes
    const pendingUsers = await kv.get('pending_users') || [];
    const parsedPending = typeof pendingUsers === 'string' ? JSON.parse(pendingUsers) : pendingUsers;
    const pendingArray = Array.isArray(parsedPending) ? parsedPending : [];
    
    if (!pendingArray.includes(username)) {
      pendingArray.push(username);
      await kv.set('pending_users', JSON.stringify(pendingArray));
    }

    return res.status(201).json({
      success: true,
      message: 'Conta criada com sucesso. Aguarde aprovação do administrador.'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
