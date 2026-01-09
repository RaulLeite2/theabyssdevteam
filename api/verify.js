import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    // Verificar sessão no KV
    const sessionData = await kv.get(`session:${token}`);

    if (!sessionData) {
      return res.status(401).json({ authenticated: false });
    }

    const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;

    // Verificar se a sessão expirou
    if (session.expiresAt < Date.now()) {
      await kv.del(`session:${token}`);
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({
      authenticated: true,
      user: { 
        username: session.username,
        role: session.role || 'poster'
      }
    });

  } catch (error) {
    console.error('Erro na verificação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
