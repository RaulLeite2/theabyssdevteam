# 🔐 Sistema de Login e Blog - The Abyss Dev Team

## 📋 Visão Geral

Sistema completo de autenticação e blog integrado ao Vercel com armazenamento em **Vercel KV** (Redis).

## 🏗️ Arquitetura

### APIs Serverless (pasta `/api`)
- **`/api/login.js`** - Autenticação de usuário
- **`/api/logout.js`** - Encerrar sessão
- **`/api/verify.js`** - Verificar token de sessão
- **`/api/posts.js`** - CRUD de posts do blog

### Páginas
- **`login.html`** - Tela de login administrativa
- **`admin.html`** - Painel de gerenciamento de posts
- **`index.html`** - Site público com exibição de posts

## 🚀 Configuração no Vercel

### 1. Ativar Vercel KV

1. Acesse o dashboard do Vercel
2. Vá em seu projeto → **Storage** → **Create Database**
3. Selecione **KV** (Redis)
4. Crie o database e conecte ao projeto

### 2. Instalar Dependências

Crie um arquivo `package.json` na raiz do projeto:

```json
{
  "name": "theabyssdevteam",
  "version": "1.0.0",
  "dependencies": {
    "@vercel/kv": "^1.0.1"
  }
}
```

### 3. Configurar Variáveis de Ambiente

No Vercel, vá em **Settings** → **Environment Variables** e adicione:

```bash
# Credenciais do Admin (ALTERE ESTAS CREDENCIAIS!)
ADMIN_USERNAME=seu_usuario_admin
ADMIN_PASSWORD_HASH=sua_senha_hash_aqui
```

#### Gerar Hash da Senha

Execute no terminal Node.js ou no console do navegador:

```javascript
const crypto = require('crypto');
const password = 'sua_senha_secreta_aqui';
const hash = crypto.createHash('sha256').update(password + 'the-abyss-salt').digest('hex');
console.log(hash);
```

Copie o hash gerado e use como valor de `ADMIN_PASSWORD_HASH`.

### 4. Deploy

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Deploy
vercel --prod
```

## 🔑 Como Usar

### Acessar o Painel Admin

1. Acesse `https://seu-dominio.vercel.app/login.html`
2. Faça login com as credenciais configuradas
3. Crie, edite ou delete posts no painel

### Gerenciar Posts

**Criar Post:**
- Clique em "➕ Novo Post"
- Preencha título, autor e conteúdo
- Clique em "Salvar"

**Editar Post:**
- Clique em "Editar" no post desejado
- Modifique os campos
- Salve as alterações

**Deletar Post:**
- Clique em "Deletar" e confirme

### Visualizar Posts

Os posts aparecem automaticamente na página principal (`index.html`) na seção "Blog & Novidades".

## 🛠️ Estrutura de Dados

### Sessão (KV Key: `session:{token}`)
```json
{
  "username": "admin",
  "createdAt": 1704844800000,
  "expiresAt": 1705449600000
}
```

### Posts (KV Key: `blog:posts`)
```json
[
  {
    "id": "1704844800000",
    "title": "Primeiro Post",
    "content": "Conteúdo do post...",
    "author": "Admin",
    "createdAt": 1704844800000,
    "updatedAt": 1704844800000
  }
]
```

## 🔒 Segurança

- ✅ Senhas hasheadas com SHA-256 + salt
- ✅ Sessões com expiração (7 dias)
- ✅ Tokens armazenados no localStorage
- ✅ Verificação de autenticação em todas APIs protegidas
- ✅ CORS configurado

## 📝 Rotas da API

### Públicas
- `GET /api/posts` - Listar todos os posts

### Protegidas (requer token)
- `POST /api/login` - Login
- `POST /api/logout` - Logout  
- `GET /api/verify` - Verificar sessão
- `POST /api/posts` - Criar post
- `PUT /api/posts` - Atualizar post
- `DELETE /api/posts` - Deletar post

## 🎨 Customização

### Alterar Tempo de Expiração de Sessão

Em [`api/login.js`](api/login.js), linha 47:
```javascript
expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
```

### Limitar Número de Posts Exibidos

Em [`script.js`](script.js), linha 640:
```javascript
const recentPosts = data.posts.slice(0, 3); // Mostra 3 posts
```

## 🐛 Troubleshooting

### Erro: "KV não está disponível"
- Verifique se o Vercel KV está ativado no projeto
- Confirme que as variáveis de ambiente `KV_*` foram geradas automaticamente

### Erro: "Credenciais inválidas"
- Verifique se `ADMIN_USERNAME` e `ADMIN_PASSWORD_HASH` estão corretos
- Regenere o hash da senha se necessário

### Posts não aparecem
- Verifique o console do navegador para erros
- Confirme que a API `/api/posts` retorna dados corretos
- Teste criando um post pelo painel admin

## 📚 Recursos

- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)

## 🎯 Próximos Passos

- [ ] Adicionar editor Markdown para posts
- [ ] Implementar sistema de comentários
- [ ] Adicionar upload de imagens
- [ ] Criar página de visualização individual de posts
- [ ] Implementar busca de posts
- [ ] Adicionar categorias/tags

---

**Desenvolvido por The Abyss Development Team** ⚡
