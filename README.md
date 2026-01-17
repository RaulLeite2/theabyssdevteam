# The Abyss Development Team - Blog Platform

Plataforma de blog moderna com sistema de posts dinâmicos e integração com PostgreSQL para gerenciamento de dados.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Railway** - Deploy e hospedagem

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- PostgreSQL (Railway fornece automaticamente)

## 🔧 Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/theabyssdevteam.git
cd theabyssdevteam
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```
DATABASE_URL=postgresql://user:password@localhost:5432/theabyss
PORT=3000
NODE_ENV=development
```

4. Execute o servidor:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 🚂 Deploy no Railway

### ⚠️ IMPORTANTE: Ordem de Deploy

**O servidor agora roda mesmo SEM banco de dados!** Isso permite deploy em 2 fases:

#### Fase 1: Deploy Inicial (Só Frontend)
1. Acesse [Railway](https://railway.app)
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione este repositório
4. **Deploy será feito automaticamente** ✅
5. Seu site estará online rodando em modo estático

#### Fase 2: Adicionar PostgreSQL (Opcional)
1. No seu projeto Railway, clique em "+ New"
2. Selecione "Database" → "Add PostgreSQL"
3. Railway criará automaticamente a variável `DATABASE_URL`
4. **Redesploy automático** - banco será inicializado
5. Features de blog/posts estarão habilitadas ✅

### Opção 2: Deploy via CLI

```bash
# Instale o Railway CLI
npm i -g @railway/cli

# Faça login
railway login

# Inicialize o projeto
railway init

# Deploy (funciona sem banco!)
railway up

# [Opcional] Adicionar PostgreSQL depois
railway add
```

### Configuração Railway

O Railway usará automaticamente:
- **Start Command**: `npm start` (definido no package.json)
- **Port**: Detectado automaticamente via variável `PORT`
- **Node Version**: >= 18.0.0 (definido em engines)
- **Database**: PostgreSQL com `DATABASE_URL` configurado automaticamente

### Estrutura do Banco de Dados

O banco será inicializado automaticamente na primeira execução com as seguintes tabelas:

**posts**
- `id` - Chave primária (auto-incremento)
- `title` - Título do post (VARCHAR 500)
- `content` - Conteúdo do post (TEXT)
- `author` - Autor do post (VARCHAR 255)
- `created_at` - Data de criação (TIMESTAMP)
- `updated_at` - Data de atualização (TIMESTAMP)

**sessions**
- `token` - Token de sessão (VARCHAR 255, PK)
- `user_id` - ID do usuário (VARCHAR 255)
- `username` - Nome de usuário (VARCHAR 255)
- `expires_at` - Timestamp de expiração (BIGINT)
- `created_at` - Data de criação (TIMESTAMP)

## 📦 Estrutura do Projeto

```
theabyssdevteam/
├── api/                    # API endpoints
│   ├── logout.js          # Endpoint de logout
│   ├── posts.js           # Gerenciamento de posts
│   └── database.js        # Cliente PostgreSQL
├── posts/                 # Posts do blog
│   ├── post1.html/json
│   ├── post2.html/json
│   ├── post3.html/json
│   └── post4.html/json
├── img/                   # Imagens e recursos
├── server.js              # Servidor Express
├── index.html             # Página principal
├── script.js              # Scripts do frontend
├── style.css              # Estilos
├── manifest.json          # PWA manifest
├── package.json           # Dependências
└── vercel.json           # Configuração Vercel

```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | URL de conexão PostgreSQL | Obrigatório |
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente de execução | production |

## 📝 API Endpoints

- `GET /` - Página principal
- `GET /api/posts` - Lista todos os posts
- `POST /api/posts` - Cria novo post
- `GET /api/posts/:id` - Obtém post específico
- `DELETE /api/posts/:id` - Remove post
- `POST /api/logout` - Logout de usuário

## 🛠️ Scripts Disponíveis

```bash
npm start      # Inicia o servidor
npm run dev    # Inicia em modo desenvolvimento
```

## 🐛 Troubleshooting

### Erro de conexão PostgreSQL
```
Error: DATABASE_URL environment variable is not set
```
**Solução**: Configure a variável `DATABASE_URL` no Railway ou arquivo `.env`

### Erro de SSL na conexão
```
Error: SSL connection required
```
**Solução**: O código já está configurado para usar SSL em produção automaticamente

### Porta já em uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solução**: Altere a variável `PORT` para outra porta disponível

### Tabelas não criadas
**Solução**: As tabelas são criadas automaticamente na primeira execução. Verifique os logs do servidor.

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👥 Equipe

The Abyss Development Team

---

Feito com ❤️ pela The Abyss Development Team
