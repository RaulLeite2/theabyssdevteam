# The Abyss Development Team - Blog Platform

Plataforma de blog moderna com sistema de posts dinâmicos e integração com Redis para gerenciamento de dados.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Redis** - Banco de dados em memória
- **Vercel/Railway** - Deploy e hospedagem

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- Instância Redis (Railway fornece automaticamente)

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
REDIS_URL=redis://localhost:6379
PORT=3000
NODE_ENV=development
```

4. Execute o servidor:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 🚂 Deploy no Railway

### Opção 1: Deploy Automático (Recomendado)

1. Acesse [Railway](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Escolha este repositório
5. Railway detectará automaticamente o projeto Node.js
6. Adicione o serviço Redis:
   - Clique em "+ New"
   - Selecione "Database" → "Add Redis"
7. Configure a variável de ambiente:
   - Vá em "Variables"
   - Railway adicionará automaticamente `REDIS_URL`
8. Deploy automático será iniciado!

### Opção 2: Deploy via CLI

```bash
# Instale o Railway CLI
npm i -g @railway/cli

# Faça login
railway login

# Inicialize o projeto
railway init

# Adicione Redis
railway add

# Deploy
railway up
```

### Configuração Railway

O Railway usará automaticamente:
- **Start Command**: `npm start` (definido no package.json)
- **Port**: Detectado automaticamente via variável `PORT`
- **Node Version**: >= 18.0.0 (definido em engines)

## 📦 Estrutura do Projeto

```
theabyssdevteam/
├── api/                    # API endpoints
│   ├── logout.js          # Endpoint de logout
│   ├── posts.js           # Gerenciamento de posts
│   └── redis.js           # Cliente Redis
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
| `REDIS_URL` | URL de conexão Redis | Obrigatório |
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

### Erro de conexão Redis
```
Error: REDIS_URL environment variable is not set
```
**Solução**: Configure a variável `REDIS_URL` no Railway ou arquivo `.env`

### Porta já em uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solução**: Altere a variável `PORT` para outra porta disponível

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👥 Equipe

The Abyss Development Team

---

Feito com ❤️ pela The Abyss Development Team
