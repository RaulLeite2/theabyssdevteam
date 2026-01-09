import { kv } from '@vercel/kv';

// Verificar autenticação
async function isAuthenticated(token) {
  if (!token) return false;
  
  const sessionData = await kv.get(`session:${token}`);
  if (!sessionData) return false;
  
  const session = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
  
  if (session.expiresAt < Date.now()) {
    await kv.del(`session:${token}`);
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
      const posts = await kv.get('blog:posts') || [];
      const parsedPosts = typeof posts === 'string' ? JSON.parse(posts) : posts;
      
      // Ordenar por data (mais recente primeiro)
      const sortedPosts = Array.isArray(parsedPosts) 
        ? parsedPosts.sort((a, b) => b.createdAt - a.createdAt)
        : [];
      
      return res.status(200).json({ posts: sortedPosts });
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

      // Gerar ID único
      const postId = Date.now().toString();
      
      const newPost = {
        id: postId,
        title,
        content,
        author: author || 'Admin',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // Buscar posts existentes
      const posts = await kv.get('blog:posts') || [];
      const parsedPosts = typeof posts === 'string' ? JSON.parse(posts) : posts;
      const postsArray = Array.isArray(parsedPosts) ? parsedPosts : [];
      
      // Adicionar novo post
      postsArray.push(newPost);
      
      // Salvar
      await kv.set('blog:posts', JSON.stringify(postsArray));

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

      const posts = await kv.get('blog:posts') || [];
      const parsedPosts = typeof posts === 'string' ? JSON.parse(posts) : posts;
      const postsArray = Array.isArray(parsedPosts) ? parsedPosts : [];
      
      const postIndex = postsArray.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      postsArray[postIndex] = {
        ...postsArray[postIndex],
        title,
        content,
        updatedAt: Date.now()
      };

      await kv.set('blog:posts', JSON.stringify(postsArray));

      return res.status(200).json({ success: true, post: postsArray[postIndex] });
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

      const posts = await kv.get('blog:posts') || [];
      const parsedPosts = typeof posts === 'string' ? JSON.parse(posts) : posts;
      const postsArray = Array.isArray(parsedPosts) ? parsedPosts : [];
      
      const filteredPosts = postsArray.filter(p => p.id !== id);

      if (filteredPosts.length === postsArray.length) {
        return res.status(404).json({ error: 'Post não encontrado' });
      }

      await kv.set('blog:posts', JSON.stringify(filteredPosts));

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Erro na API de posts:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
