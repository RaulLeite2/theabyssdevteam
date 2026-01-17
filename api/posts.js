import { kvGet, kvDel, createPost, updatePost, deletePost, getAllPosts } from './database.js';

// Verificar autenticação
async function isAuthenticated(token) {
  if (!token) return false;
  
  const sessionData = await kvGet(`session:${token}`);
  if (!sessionData) return false;
  
  const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
  
  if (session.expiresAt < Date.now()) {
    await kvDel(`session:${token}`);
    return false;
  }
  
  return true;
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

  try {
    // GET - Listar todos os posts (público)
    if (req.method === 'GET') {
      const posts = await getAllPosts();
      return res.status(200).json({ posts });
    }

    // POST - Criar novo post (requer autenticação)
    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!await isAuthenticated(token)) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { title, content, author } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
      }

      const newPost = await createPost(title, content, author || 'Admin');
      return res.status(201).json({ success: true, post: newPost });
    }

    // PUT - Atualizar post (requer autenticação)
    if (req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!await isAuthenticated(token)) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { id, title, content } = req.body;

      if (!id || !title || !content) {
        return res.status(400).json({ error: 'ID, título e conteúdo são obrigatórios' });
      }

      const updatedPost = await updatePost(id, title, content);
      
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      return res.status(200).json({ success: true, post: updatedPost });
    }

    // DELETE - Deletar post (requer autenticação)
    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!await isAuthenticated(token)) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' });
      }

      await deletePost(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Erro na API de posts:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
