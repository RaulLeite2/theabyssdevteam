# 📁 Estrutura do Projeto - The Abyss Dev Team

## 📋 Visão Geral

Este documento descreve a organização de arquivos e pastas do projeto The Abyss Development Team.

## 🗂️ Estrutura de Diretórios

```
theabyssdevteam/
│
├── 📄 index.html              # Página principal do site
├── 📄 dashboard.html          # Dashboard administrativo
├── 📄 server.js               # Servidor Express.js
├── 📄 package.json            # Dependências do projeto
├── 📄 vercel.json             # Configuração do Vercel
├── 📄 manifest.json           # PWA Manifest
├── 📄 .env.example            # Exemplo de variáveis de ambiente
├── 📄 .gitignore              # Arquivos ignorados pelo Git
│
├── 📁 assets/                 # Recursos estáticos
│   ├── 📁 css/                # Arquivos de estilo
│   │   ├── style.css          # Estilos principais
│   │   └── auth-dashboard.css # Estilos de autenticação/dashboard
│   │
│   └── 📁 js/                 # Arquivos JavaScript
│       ├── script.js          # Script principal
│       ├── auth-system.js     # Sistema de autenticação
│       ├── dashboard.js       # Funcionalidades do dashboard
│       ├── monitor-urls.js    # Monitoramento de URLs
│       └── wait-for-server.js # Espera do servidor
│
├── 📁 api/                    # Endpoints da API
│   ├── contact.js             # API de contato
│   ├── database.js            # Configuração do banco de dados
│   ├── logout.js              # API de logout
│   ├── posts.js               # API de posts
│   ├── redis.js               # Configuração do Redis
│   └── users.js               # API de usuários
│
├── 📁 docs/                   # Documentação
│   ├── README.md              # Documentação principal
│   ├── PROJECT_STRUCTURE.md  # Este arquivo
│   ├── DASHBOARD_README.md   # Documentação do dashboard
│   ├── DATABASE_SETUP.md     # Configuração do banco de dados
│   ├── FEATURES.md            # Lista de funcionalidades
│   ├── MONITOR_URLS.md        # Monitoramento de URLs
│   └── WAIT_FOR_SERVER.md    # Configuração de espera do servidor
│
├── 📁 img/                    # Imagens e ícones
│   └── (arquivos de imagem)
│
├── 📁 pages/                  # Páginas secundárias
│   └── gerador-icones.html   # Gerador de ícones
│
└── 📁 posts/                  # Posts do blog/portfólio
    ├── post1.html
    ├── post1.json
    ├── post2.html
    ├── post2.json
    ├── post3.html
    ├── post3.json
    ├── post4.html
    └── post4.json
```

## 📝 Descrição dos Diretórios

### 🎨 `/assets`
Contém todos os recursos estáticos do site (CSS e JavaScript).

- **`/assets/css/`**: Arquivos de estilo CSS
  - `style.css`: Estilos principais do site
  - `auth-dashboard.css`: Estilos específicos para autenticação e dashboard

- **`/assets/js/`**: Arquivos JavaScript
  - `script.js`: Funcionalidades principais do site
  - `auth-system.js`: Sistema de login/registro
  - `dashboard.js`: Lógica do dashboard
  - `monitor-urls.js`: Monitoramento de URLs
  - `wait-for-server.js`: Gerenciamento de espera do servidor

### 🔌 `/api`
Contém todos os endpoints da API backend.

- `contact.js`: Gerencia mensagens de contato
- `database.js`: Configuração e conexão com PostgreSQL
- `logout.js`: Endpoint de logout
- `posts.js`: Gerencia posts do blog
- `redis.js`: Configuração do Redis para cache
- `users.js`: Gerencia usuários (registro/login)

### 📚 `/docs`
Documentação completa do projeto.

- `README.md`: Documentação principal
- `PROJECT_STRUCTURE.md`: Estrutura de pastas (este arquivo)
- `DASHBOARD_README.md`: Guia do dashboard
- `DATABASE_SETUP.md`: Configuração do banco de dados
- `FEATURES.md`: Lista de funcionalidades
- `MONITOR_URLS.md`: Documentação de monitoramento
- `WAIT_FOR_SERVER.md`: Documentação de espera do servidor

### 🖼️ `/img`
Recursos de imagem do site (logos, ícones, imagens de fundo).

### 📄 `/pages`
Páginas HTML secundárias e utilitários.

- `gerador-icones.html`: Ferramenta para gerar ícones

### 📝 `/posts`
Posts do blog/portfólio em formato HTML e JSON.

## 🚀 Arquivos Principais

### `index.html`
Página principal do site com:
- Hero section estilo PyCharm
- Seção de projetos
- Seção de tecnologias
- Formulário de contato
- Informações da equipe

### `dashboard.html`
Dashboard administrativo com:
- Sidebar de navegação
- Cards de estatísticas
- Lista de projetos recentes
- Feed de atividades
- Design responsivo

### `server.js`
Servidor Express.js que:
- Serve arquivos estáticos
- Gerencia rotas da API
- Conecta com PostgreSQL
- Implementa autenticação

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` baseado em `.env.example`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
PORT=3000
NODE_ENV=development
```

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🎨 Estilo e Design

### Tema
- Paleta de cores escura com gradientes vibrantes
- Glassmorphism e blur effects
- Animações suaves
- Inspiração: PyCharm, JetBrains

### Tecnologias de Frontend
- HTML5
- CSS3 (Gradients, Animations, Grid, Flexbox)
- JavaScript Vanilla
- Font: Segoe UI

## 🔗 Integrações

- PostgreSQL (Banco de dados)
- Redis (Cache)
- Vercel (Deploy)
- Express.js (Backend)

## 📄 Licença

© 2026 The Abyss Development Team - Elite Development

---

**Última atualização:** 17 de Janeiro de 2026
