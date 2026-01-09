# 🔐 Sistema Multi-Usuário com Aprovação - The Abyss Dev Team

## 🎯 Funcionalidades

### Para Visitantes
- ✅ Criar conta de poster
- ✅ Aguardar aprovação do administrador

### Para Posters (Aprovados)
- ✅ Login no painel
- ✅ Criar posts no blog
- ✅ Editar seus posts
- ✅ Deletar seus posts

### Para Administradores
- ✅ Todas as permissões de posters
- ✅ Aprovar/Rejeitar novos usuários
- ✅ Gerenciar todos os usuários
- ✅ Deletar usuários

## 📁 Estrutura de Arquivos

### Páginas
- **register.html** - Página de cadastro para novos usuários
- **login.html** - Login para admins e posters aprovados
- **admin.html** - Dashboard com tabs:
  - 📝 Posts do Blog (todos os usuários autenticados)
  - 👥 Gerenciar Usuários (apenas admins)

### APIs (/api)
- **register.js** - Criar nova conta (pendente de aprovação)
- **login.js** - Autenticar usuário (admin ou poster aprovado)
- **logout.js** - Encerrar sessão
- **verify.js** - Verificar token e role
- **users.js** - Listar, aprovar, rejeitar e deletar usuários
- **posts.js** - CRUD de posts

## 🚀 Fluxo de Uso

### 1. Novo Usuário
```
1. Acessa register.html
2. Preenche: username, email, senha
3. Conta criada com status "Pendente"
4. Aguarda aprovação do admin
```

### 2. Administrador Aprova
```
1. Login como admin em login.html
2. Vai para aba "Gerenciar Usuários"
3. Vê usuários pendentes destacados
4. Clica em "✓ Aprovar" ou "✗ Rejeitar"
```

### 3. Usuário Aprovado
```
1. Faz login em login.html
2. Acessa dashboard admin.html
3. Pode criar/editar posts na aba "Posts do Blog"
```

## 🔧 Configuração

### 1. Variáveis de Ambiente no Vercel

```bash
# Admin Original (tem acesso total mesmo sem registro)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=seu_hash_aqui
```

### 2. Gerar Hash da Senha

No terminal Node.js ou console do navegador:

```javascript
const crypto = require('crypto');
const password = 'sua_senha_secreta';
const hash = crypto.createHash('sha256').update(password + 'the-abyss-salt').digest('hex');
console.log(hash);
```

### 3. Ativar Vercel KV

1. Dashboard Vercel → Seu Projeto
2. Storage → Create Database
3. Selecione **KV** (Redis)
4. Conecte ao projeto

### 4. Deploy

```bash
npm install
vercel --prod
```

## 📊 Estrutura de Dados no KV

### Usuários
```
Key: user:{username}
Value: {
  "username": "joao",
  "email": "joao@example.com",
  "passwordHash": "...",
  "approved": false,
  "role": "poster",
  "createdAt": 1704844800000
}
```

### Lista de Pendentes
```
Key: pending_users
Value: ["joao", "maria", ...]
```

### Sessões
```
Key: session:{token}
Value: {
  "username": "joao",
  "role": "poster",
  "createdAt": 1704844800000,
  "expiresAt": 1705449600000
}
```

### Posts
```
Key: blog:posts
Value: [{
  "id": "1704844800000",
  "title": "Título",
  "content": "Conteúdo...",
  "author": "joao",
  "createdAt": 1704844800000,
  "updatedAt": 1704844800000
}]
```

## 🎨 Interface

### Página de Registro
- Campo de usuário (mínimo 3 caracteres)
- Campo de email
- Campo de senha (mínimo 6 caracteres)
- Confirmação de senha
- Aviso sobre aprovação necessária

### Página de Login
- Campos de usuário e senha
- Botão "Criar nova conta" destacado
- Link voltar ao site

### Dashboard Admin
- **Header:** Mostra nome e role do usuário
- **Tabs:**
  - 📝 Posts do Blog (sempre visível)
  - 👥 Gerenciar Usuários (apenas para admins)
- **Aba de Usuários:**
  - Lista todos os usuários
  - Destaca pendentes em amarelo
  - Botões aprovar/rejeitar para pendentes
  - Botão deletar para usuários comuns

## 🔒 Segurança

### Camadas de Proteção
1. **Senha:** Hasheada com SHA-256 + salt
2. **Sessão:** Token aleatório de 32 bytes
3. **Expiração:** 7 dias (configurável)
4. **Aprovação:** Novos usuários precisam ser aprovados
5. **Roles:** Admin vs Poster (controle de acesso)

### Validações
- Username: mínimo 3 caracteres
- Senha: mínimo 6 caracteres
- Email: validação de formato
- Duplicação: verifica username existente
- Autenticação: verifica aprovação antes do login

## 🛡️ Controle de Acesso

### Endpoints Públicos
- `POST /api/register` - Qualquer pessoa pode criar conta
- `GET /api/posts` - Listar posts (público)

### Endpoints Protegidos (Requer Login)
- `POST /api/posts` - Criar post (poster ou admin)
- `PUT /api/posts` - Editar post (poster ou admin)
- `DELETE /api/posts` - Deletar post (poster ou admin)

### Endpoints Admin (Requer Role Admin)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Aprovar/Rejeitar usuário
- `DELETE /api/users` - Deletar usuário

## 📝 Comandos Úteis

### Instalar Dependências
```bash
npm install
```

### Desenvolvimento Local
```bash
vercel dev
```

### Deploy para Produção
```bash
vercel --prod
```

### Ver Logs
```bash
vercel logs
```

## 🐛 Troubleshooting

### Usuário não consegue fazer login
- Verifique se a conta foi aprovada pelo admin
- Confira se o username e senha estão corretos
- Veja os logs no Vercel para erros

### Aba "Gerenciar Usuários" não aparece
- Certifique-se de estar logado como admin
- Apenas o admin original ou usuários com role "admin" veem esta aba

### Erro ao criar conta
- Verifique se o username já existe
- Confirme que todos os campos foram preenchidos
- Valide o formato do email

### KV não está salvando
- Verifique se o Vercel KV está ativo no projeto
- Confirme que as variáveis de ambiente `KV_*` existem
- Veja os logs para erros de conexão

## 🎯 Próximas Melhorias

- [ ] Editor Markdown para posts
- [ ] Upload de imagens
- [ ] Página individual de cada post
- [ ] Sistema de comentários
- [ ] Busca de posts
- [ ] Tags/Categorias
- [ ] Notificação de novos registros
- [ ] Email de aprovação
- [ ] Recuperação de senha
- [ ] 2FA (autenticação de dois fatores)

---

**Desenvolvido por The Abyss Development Team** ⚡
