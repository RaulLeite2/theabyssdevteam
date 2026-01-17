# 🎮 Dashboard de Usuário - The Abyss Dev Team

## 📋 Visão Geral

Sistema completo de dashboard com autenticação, permissões de usuário e formulário de contato integrado.

## ✨ Funcionalidades

### 1. **Sistema de Autenticação**
- ✅ Registro de novos usuários
- ✅ Login com validação de credenciais
- ✅ Senha criptografada (SHA256)
- ✅ Sistema de XP e níveis
- ✅ Streak days (dias consecutivos de login)

### 2. **Níveis de Permissão**
| Nível | Permissões |
|-------|-----------|
| **Viewer** 👁️ | Visualizar conteúdo, perfil básico |
| **Editor** ✏️ | Tudo do Viewer + Criar/editar posts |
| **Admin** 👑 | Tudo do Editor + Gerenciar usuários, ver contatos |

### 3. **Dashboard Interativo**
- 📊 **Estatísticas em tempo real**
  - Total de posts criados
  - Dias de streak
  - Total de XP acumulado
  - Nível atual do usuário

- 👤 **Perfil do Usuário**
  - Avatar customizável (emojis)
  - Badge de role (Visualizador/Editor/Admin)
  - Badge de nível
  - Informações pessoais

- ⚡ **Ações Rápidas**
  - Criar Post (apenas Editor/Admin)
  - Ver Sessões Ativas
  - Explorar Conteúdo
  - Formulário de Contato

- 🎯 **Sistema de Missões**
  - Missão diária: "Crie seu primeiro post"
  - Barra de progresso visual
  - Recompensa: +100 XP

- 📬 **Formulário de Contato**
  - Envio de mensagens para o admin
  - Email automático via Nodemailer
  - Validação de campos
  - Status da mensagem (pendente/lida/respondida)

- 📈 **Feed de Atividades**
  - Histórico de ações recentes
  - Timestamps automáticos

## 🗄️ Estrutura do Banco de Dados

### Tabela: `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  avatar VARCHAR(10) DEFAULT '🤖',
  bio TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `contacts`
```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Configuração

### 1. Variáveis de Ambiente (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=3000
NODE_ENV=production

# Email (para formulário de contato)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app
ADMIN_EMAIL=raulpereira@theabyssdevteam.net
```

### 2. Instalar Dependências

```bash
npm install
```

**Principais dependências:**
- `express` - Web server
- `pg` - PostgreSQL client
- `nodemailer` - Envio de emails
- `dotenv` - Gerenciamento de variáveis de ambiente

### 3. Inicializar Banco de Dados

O banco de dados é inicializado automaticamente na primeira execução:

```bash
npm start
```

### 4. Criar Primeiro Admin (via API)

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@theabyssdevteam.net",
    "password": "sua-senha-segura",
    "role": "admin"
  }'
```

## 📡 Endpoints da API

### **Usuários** (`/api/users`)

#### POST `/api/users/register`
Registrar novo usuário.

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "senha123",
  "role": "viewer"  // opcional, padrão: viewer
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso! +50 XP",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "viewer",
    "xp": 50,
    "level": 1
  }
}
```

#### POST `/api/users/login`
Fazer login.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado! +10 XP",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "viewer",
    "avatar": "🤖",
    "xp": 60,
    "level": 1,
    "streak_days": 1
  }
}
```

#### GET `/api/users?id={userId}`
Obter perfil e estatísticas do usuário.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "viewer",
    "avatar": "🤖",
    "bio": null,
    "xp": 60,
    "level": 1,
    "streak_days": 1
  },
  "stats": {
    "posts": 0,
    "xp": 60,
    "level": 1,
    "streak": 1
  }
}
```

### **Contato** (`/api/contact`)

#### POST `/api/contact`
Enviar mensagem de contato.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Olá! Gostaria de mais informações..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso! Responderemos em breve.",
  "contactId": 1
}
```

#### GET `/api/contact` (Admin apenas)
Listar todas as mensagens de contato.

**Response:**
```json
{
  "success": true,
  "contacts": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Olá! Gostaria de mais informações...",
      "status": "pending",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### PATCH `/api/contact` (Admin apenas)
Atualizar status de mensagem.

**Body:**
```json
{
  "contactId": 1,
  "status": "read"  // ou "replied"
}
```

## 🎨 Sistema de XP e Níveis

### Como Ganhar XP
- ✅ **Registro**: +50 XP
- ✅ **Login diário**: +10 XP
- 🎯 **Criar primeiro post**: +100 XP (missão)
- 📝 **Criar post**: +25 XP (futuro)
- 💬 **Comentar**: +5 XP (futuro)

### Cálculo de Nível
```javascript
nivel = Math.floor(xp / 100) + 1
```

**Exemplos:**
- 0-99 XP = Nível 1
- 100-199 XP = Nível 2
- 200-299 XP = Nível 3
- etc.

### Streak Days
- Incrementa +1 a cada login consecutivo (se last_login foi ontem)
- Reseta se pular um dia

## 🔒 Sistema de Permissões

### Middleware de Permissão

```javascript
import { requirePermission } from './api/users.js';

// Proteger rota (apenas editor e admin)
app.post('/api/posts', requirePermission('editor', 'admin'), (req, res) => {
  // Criar post
});

// Proteger rota (apenas admin)
app.get('/api/contacts', requirePermission('admin'), (req, res) => {
  // Listar contatos
});
```

### Como Funciona
1. Usuário faz request com `userId` no body/query
2. Middleware busca usuário no banco
3. Verifica se role do usuário está na lista permitida
4. Se sim, continua; se não, retorna 403 Forbidden

## 📧 Configuração de Email

### Gmail (Recomendado)

1. Ative a verificação em 2 etapas na sua conta Google
2. Crie uma senha de app: https://myaccount.google.com/apppasswords
3. Use no `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app-de-16-digitos
ADMIN_EMAIL=raulpereira@theabyssdevteam.net
```

### Outros Provedores

**Outlook:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

**Custom SMTP:**
```env
EMAIL_HOST=seu-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=usuario
EMAIL_PASS=senha
```

## 🧪 Testando o Sistema

### 1. Registro de Usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Enviar Contato
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello!"}'
```

## 🎯 Roadmap Futuro

- [ ] Sistema de conquistas/achievements
- [ ] Ranking de usuários por XP
- [ ] Notificações em tempo real (WebSocket)
- [ ] Upload de avatar personalizado
- [ ] Sistema de amigos/seguidores
- [ ] Chat interno
- [ ] Recuperação de senha por email
- [ ] Two-factor authentication (2FA)
- [ ] Logs de atividade detalhados
- [ ] Dashboard admin completo

## 🐛 Troubleshooting

### Email não está enviando
- Verifique se as credenciais estão corretas no `.env`
- Confirme que a senha de app foi criada (Gmail)
- Teste a conexão SMTP manualmente
- Veja os logs do servidor para erros detalhados

### Usuário não consegue criar posts
- Verifique se o role é `editor` ou `admin`
- Confirme no banco: `SELECT * FROM users WHERE id = ?`
- Atualize role se necessário: `UPDATE users SET role = 'editor' WHERE id = ?`

### XP não está atualizando
- Verifique se a função `updateUserXP()` está sendo chamada
- Confirme triggers do database
- Veja logs do servidor

### Dashboard não carrega
- Abra o console do navegador (F12)
- Verifique se `dashboard.js` está sendo carregado
- Confirme se usuário está logado: `localStorage.getItem('abyssUser')`

## 📝 Notas de Segurança

⚠️ **IMPORTANTE:** Este sistema usa SHA256 para hash de senhas, que é adequado para desenvolvimento/demonstração, mas **NÃO é recomendado para produção**. 

Para produção, use:
```bash
npm install bcrypt
```

E atualize a função `hashPassword()` em `api/users.js`:
```javascript
import bcrypt from 'bcrypt';

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

## 📄 Licença

MIT License - The Abyss Dev Team © 2024

---

**Desenvolvido com 💚 por The Abyss Dev Team**

Para mais informações: raulpereira@theabyssdevteam.net
