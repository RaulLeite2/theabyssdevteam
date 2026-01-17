# 🔍 Wait-for-Server Script

Script Node.js standalone para monitorar a disponibilidade de um servidor web. Ideal para aguardar o deploy do Railway terminar antes de continuar com outras tarefas.

---

## 🎯 Características

- ✅ **Apenas módulos nativos** (https/http) - zero dependências externas
- ✅ **Configurável via variáveis de ambiente**
- ✅ **Logs detalhados** com tentativas, tempo decorrido e status
- ✅ **Timeout inteligente** por requisição
- ✅ **Exit codes apropriados** para CI/CD
- ✅ **Interruptível** com Ctrl+C

---

## 🚀 Uso Básico

### Uso Simples (URL padrão)
```bash
node wait-for-server.js
```

### Uso com URL Customizada
```bash
TARGET_URL=https://seu-app.up.railway.app node wait-for-server.js
```

### Uso com todas as opções
```bash
TARGET_URL=https://seu-app.up.railway.app \
CHECK_INTERVAL=3000 \
MAX_ATTEMPTS=100 \
TIMEOUT=15000 \
node wait-for-server.js
```

---

## ⚙️ Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `TARGET_URL` | `https://theabyssdevteam.up.railway.app` | URL a ser monitorada |
| `CHECK_INTERVAL` | `5000` | Intervalo entre tentativas (ms) |
| `MAX_ATTEMPTS` | `60` | Número máximo de tentativas |
| `TIMEOUT` | `10000` | Timeout por requisição (ms) |

### Exemplos de configuração:

**Deploy rápido (verificar a cada 2 segundos):**
```bash
CHECK_INTERVAL=2000 node wait-for-server.js
```

**Deploy lento (aguardar até 10 minutos):**
```bash
MAX_ATTEMPTS=120 node wait-for-server.js
```

**URL diferente:**
```bash
TARGET_URL=http://localhost:3000 node wait-for-server.js
```

---

## 📊 Exemplos de Output

### ✅ Sucesso

```
════════════════════════════════════════════════════════════
🔍 WAITING FOR SERVER TO BE AVAILABLE
════════════════════════════════════════════════════════════

📋 Configuration:
   Target URL: https://theabyssdevteam.up.railway.app
   Check Interval: 5s
   Max Attempts: 60
   Timeout per request: 10s

════════════════════════════════════════════════════════════

🔄 Attempt 1/60 (elapsed: 0s)
   Checking: https://theabyssdevteam.up.railway.app
   ❌ Failed: getaddrinfo ENOTFOUND theabyssdevteam.up.railway.app
   📝 Code: ENOTFOUND
   ⏱️ Duration: 1024ms
   ⏳ Waiting 5s before next attempt...

🔄 Attempt 2/60 (elapsed: 6s)
   Checking: https://theabyssdevteam.up.railway.app
   ❌ Failed: connect ECONNREFUSED
   📝 Code: ECONNREFUSED
   ⏱️ Duration: 156ms
   ⏳ Waiting 5s before next attempt...

🔄 Attempt 3/60 (elapsed: 12s)
   Checking: https://theabyssdevteam.up.railway.app

════════════════════════════════════════════════════════════
✅✅✅ SERVIDOR DISPONÍVEL! ✅✅✅
════════════════════════════════════════════════════════════

📊 Success Details:
   Status: 200 OK
   Response Time: 342ms
   Content-Type: text/html; charset=utf-8
   Total Wait Time: 12s
   Total Attempts: 3

🎉 Server is ready to accept requests!

════════════════════════════════════════════════════════════
```

### ❌ Timeout (após MAX_ATTEMPTS)

```
🔄 Attempt 60/60 (elapsed: 4m 55s)
   Checking: https://theabyssdevteam.up.railway.app
   ❌ Failed: Request timeout
   📝 Code: ETIMEDOUT
   ⏱️ Duration: 10000ms

════════════════════════════════════════════════════════════
❌❌❌ TIMEOUT: SERVER NOT AVAILABLE ❌❌❌
════════════════════════════════════════════════════════════

📊 Summary:
   Total Attempts: 60
   Total Time: 5m 0s
   Target URL: https://theabyssdevteam.up.railway.app

💡 Troubleshooting:
   1. Check if the URL is correct
   2. Verify the server is actually running
   3. Check Railway logs for deployment errors
   4. Ensure the domain is properly configured
   5. Try accessing the URL manually in a browser

════════════════════════════════════════════════════════════
```

---

## 🔧 Casos de Uso

### 1. **Monitorar Deploy do Railway**

Após fazer push para o GitHub, execute:

```bash
# URL do seu app no Railway
TARGET_URL=https://seu-app.up.railway.app node wait-for-server.js

# Quando der sucesso, pode continuar com testes
echo "Deploy finalizado! Executando testes..."
npm test
```

### 2. **Script de CI/CD**

```yaml
# GitHub Actions
- name: Deploy to Railway
  run: git push railway main

- name: Wait for deployment
  run: |
    TARGET_URL=${{ secrets.RAILWAY_URL }} \
    CHECK_INTERVAL=3000 \
    MAX_ATTEMPTS=100 \
    node wait-for-server.js

- name: Run E2E tests
  run: npm run test:e2e
```

### 3. **Desenvolvimento Local**

Aguardar servidor local inicializar:

```bash
# Terminal 1: Iniciar servidor
npm start &

# Terminal 2: Aguardar estar pronto
TARGET_URL=http://localhost:3000 \
CHECK_INTERVAL=1000 \
node wait-for-server.js

# Depois executar seeder, testes, etc
```

### 4. **Docker Compose Health Check**

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "node", "wait-for-server.js"]
      interval: 5s
      timeout: 10s
      retries: 12
```

---

## 🎯 Exit Codes

O script retorna códigos de saída apropriados para automação:

| Exit Code | Significado |
|-----------|-------------|
| `0` | ✅ Servidor disponível (status 200) |
| `1` | ❌ Timeout ou erro fatal |
| `130` | ⚠️ Interrompido pelo usuário (Ctrl+C) |

### Uso em scripts bash:

```bash
#!/bin/bash

if node wait-for-server.js; then
  echo "✅ Server is up!"
  npm run seed-database
else
  echo "❌ Server failed to start"
  exit 1
fi
```

---

## 📦 Integração com package.json

Adicione scripts convenientes:

```json
{
  "scripts": {
    "wait": "node wait-for-server.js",
    "wait:local": "TARGET_URL=http://localhost:3000 node wait-for-server.js",
    "wait:railway": "TARGET_URL=https://seu-app.up.railway.app node wait-for-server.js",
    "deploy:wait": "git push railway main && npm run wait:railway"
  }
}
```

Uso:

```bash
npm run wait              # URL padrão
npm run wait:local        # Localhost
npm run wait:railway      # Railway
npm run deploy:wait       # Deploy + aguardar
```

---

## 🐛 Troubleshooting

### Erro: ENOTFOUND

**Causa:** URL não existe ou DNS não resolveu.

**Solução:**
- Verifique se a URL está correta
- Aguarde alguns minutos para propagação DNS
- Tente acessar manualmente no navegador

---

### Erro: ECONNREFUSED

**Causa:** Servidor não está aceitando conexões.

**Solução:**
- Verifique se o servidor está rodando
- Confirme que a porta está correta
- Para Railway, verifique se o deploy terminou

---

### Erro: ETIMEDOUT

**Causa:** Requisição excedeu o timeout.

**Solução:**
- Aumente o `TIMEOUT`: `TIMEOUT=30000 node wait-for-server.js`
- Verifique se há problemas de rede
- Para servidores lentos, aumente também `CHECK_INTERVAL`

---

### Status 503 ou 502

**Causa:** Servidor está em manutenção ou erro.

**Solução:**
- Verifique logs do servidor
- Para Railway, veja logs no dashboard
- Confirme que o código está correto

---

## 💡 Dicas Avançadas

### 1. **Verificar endpoint específico**

```bash
# Verificar health check ao invés da home
TARGET_URL=https://seu-app.up.railway.app/health node wait-for-server.js
```

### 2. **Logs em arquivo**

```bash
# Salvar logs para análise posterior
node wait-for-server.js > deploy-wait.log 2>&1
```

### 3. **Notificação sonora quando pronto**

```bash
# macOS/Linux
node wait-for-server.js && say "Server is ready"

# Windows PowerShell
node wait-for-server.js; if ($?) { [console]::beep(800,300) }
```

### 4. **Combinar com outros comandos**

```bash
# Deploy → Aguardar → Seed → Teste
git push railway main && \
  node wait-for-server.js && \
  npm run seed && \
  npm test
```

---

## 📚 Comparação com Alternativas

| Ferramenta | Dependências | Timeout | Status Check | Logs |
|------------|--------------|---------|--------------|------|
| **wait-for-server.js** | ✅ Nenhuma | ✅ Sim | ✅ HTTP | ✅ Detalhados |
| wait-for-it.sh | Bash | ✅ Sim | ❌ TCP only | ⚠️ Básicos |
| wait-on (npm) | ❌ npm package | ✅ Sim | ✅ HTTP | ✅ Detalhados |
| dockerize | ❌ Binary externo | ✅ Sim | ✅ HTTP | ⚠️ Básicos |

**Vantagens deste script:**
- ✅ Zero dependências externas
- ✅ Logs extremamente detalhados
- ✅ Configurável via env vars
- ✅ Exit codes apropriados
- ✅ Funciona em qualquer OS com Node.js

---

## 🔒 Segurança

O script apenas faz requisições GET HTTP/HTTPS. Não:
- ❌ Envia dados sensíveis
- ❌ Modifica o servidor
- ❌ Armazena informações
- ❌ Requer autenticação

Safe para usar em qualquer ambiente.

---

## 📄 Licença

Código open-source, use livremente em seus projetos! 🎉
