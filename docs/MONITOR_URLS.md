# 🔍 Monitor URLs Script

Script Node.js para monitorar múltiplas URLs simultaneamente. Perfeito para aguardar que vários ambientes (staging, production) estejam disponíveis após deploy.

---

## 🎯 Características

- ✅ **Monitoramento simultâneo** de múltiplas URLs
- ✅ **Zero dependências externas** (apenas módulos nativos)
- ✅ **Para individualmente** cada URL quando disponível
- ✅ **Continua monitorando** URLs que ainda não responderam
- ✅ **Logs detalhados** com tentativas e tempo decorrido
- ✅ **Status resumido** a cada intervalo
- ✅ **Interruptível** com Ctrl+C

---

## 🚀 Uso Básico

### Rodar com npm:
```bash
npm run monitor
```

### Rodar diretamente:
```bash
node monitor-urls.js
```

---

## ⚙️ Configuração

Edite o arquivo `monitor-urls.js` para customizar:

```javascript
// Lista de URLs para monitorar
const URLS = [
  'https://theabyssdevteam.up.railway.app',
  'https://theabyssdevteam-production.up.railway.app'
];

// Intervalo entre verificações (milissegundos)
const CHECK_INTERVAL = 5000; // 5 segundos

// Timeout por requisição (milissegundos)
const TIMEOUT = 10000; // 10 segundos
```

### Adicionar mais URLs:

```javascript
const URLS = [
  'https://app-staging.railway.app',
  'https://app-production.railway.app',
  'https://app-eu.railway.app',
  'https://app-asia.railway.app'
];
```

---

## 📊 Exemplos de Output

### ✅ Monitoramento em Progresso

```
════════════════════════════════════════════════════════════
🔍 MULTI-URL MONITORING STARTED
════════════════════════════════════════════════════════════

📋 Configuration:
   URLs to monitor: 2
   1. https://theabyssdevteam.up.railway.app
   2. https://theabyssdevteam-production.up.railway.app
   Check Interval: 5s
   Timeout per request: 10s

════════════════════════════════════════════════════════════

🔍 Checking: https://theabyssdevteam.up.railway.app
   Attempt: 1 | Elapsed: 0s
   ❌ Failed: getaddrinfo ENOTFOUND
   Code: ENOTFOUND
   Duration: 1024ms

🔍 Checking: https://theabyssdevteam-production.up.railway.app
   Attempt: 1 | Elapsed: 0s
   ❌ Failed: connect ECONNREFUSED
   Code: ECONNREFUSED
   Duration: 156ms

────────────────────────────────────────────────────────────
📊 Status: 0/2 URLs disponíveis
────────────────────────────────────────────────────────────

🔍 Checking: https://theabyssdevteam.up.railway.app
   Attempt: 2 | Elapsed: 5s
   ✅✅✅ URL DISPONÍVEL! ✅✅✅
   Status: 200 OK
   Response Time: 342ms
   Total Attempts: 2
   Total Time: 5s

🔍 Checking: https://theabyssdevteam-production.up.railway.app
   Attempt: 2 | Elapsed: 5s
   ❌ Failed: Request timeout
   Code: ETIMEDOUT
   Duration: 10000ms

────────────────────────────────────────────────────────────
📊 Status: 1/2 URLs disponíveis
────────────────────────────────────────────────────────────

🔍 Checking: https://theabyssdevteam-production.up.railway.app
   Attempt: 3 | Elapsed: 10s
   ✅✅✅ URL DISPONÍVEL! ✅✅✅
   Status: 200 OK
   Response Time: 287ms
   Total Attempts: 3
   Total Time: 10s

════════════════════════════════════════════════════════════
🎉🎉🎉 TODAS AS URLs DISPONÍVEIS! 🎉🎉🎉
════════════════════════════════════════════════════════════

📊 Summary:
   https://theabyssdevteam.up.railway.app
   ✅ Status: Available
   🔄 Attempts: 2

   https://theabyssdevteam-production.up.railway.app
   ✅ Status: Available
   🔄 Attempts: 3

   ⏱️ Total Time: 10s

════════════════════════════════════════════════════════════
```

### ⚠️ Interrompido com Ctrl+C

```
⚠️ Monitoring interrupted by user (Ctrl+C)

📊 Final Status:
   ✅ https://theabyssdevteam.up.railway.app
      Attempts: 2
   ❌ https://theabyssdevteam-production.up.railway.app
      Attempts: 5
      Last Error: Request timeout
```

---

## 🔧 Casos de Uso

### 1. **Monitorar Deploy em Múltiplos Ambientes**

Após fazer deploy para staging e production:

```bash
# 1. Deploy para ambos os ambientes
git push origin main
git push railway-staging main
git push railway-production main

# 2. Monitorar até ambos estarem prontos
npm run monitor

# 3. Quando ambos estiverem disponíveis, executar testes
npm run test:e2e
```

### 2. **CI/CD com Múltiplos Ambientes**

```yaml
# GitHub Actions
- name: Deploy to environments
  run: |
    git push railway-staging main
    git push railway-production main

- name: Wait for all deployments
  run: npm run monitor

- name: Run smoke tests
  run: npm run test:smoke
```

### 3. **Verificação de Redundância**

Monitorar múltiplas réplicas ou regiões:

```javascript
const URLS = [
  'https://app-us-east.railway.app',
  'https://app-eu-west.railway.app',
  'https://app-asia-pacific.railway.app'
];
```

### 4. **Load Balancer Health Check**

Verificar se todos os backends estão respondendo:

```javascript
const URLS = [
  'https://backend-1.internal:3000/health',
  'https://backend-2.internal:3000/health',
  'https://backend-3.internal:3000/health'
];
```

---

## 💡 Comportamento Inteligente

### URLs Disponíveis Individualmente

Quando uma URL responde com status 200:
- ✅ Marca como disponível
- ✅ **Para de pingar essa URL**
- ✅ **Continua monitorando as outras**

### Exemplo:

```
Tentativa 1:
  URL1: ❌ ECONNREFUSED
  URL2: ❌ ECONNREFUSED

Tentativa 2:
  URL1: ✅ Disponível (para de pingar)
  URL2: ❌ ETIMEDOUT

Tentativa 3:
  URL1: (não verifica mais)
  URL2: ✅ Disponível (para de pingar)

→ Script termina com sucesso ✅
```

---

## 📊 Exit Codes

| Exit Code | Significado |
|-----------|-------------|
| `0` | ✅ Todas as URLs disponíveis |
| `130` | ⚠️ Interrompido pelo usuário (Ctrl+C) |
| `1` | ❌ Erro fatal |

---

## 🔄 Comparação: monitor-urls vs wait-for-server

| Recurso | monitor-urls.js | wait-for-server.js |
|---------|-----------------|-------------------|
| **URLs** | Múltiplas | Uma única |
| **Parada individual** | ✅ Sim | N/A |
| **Monitoramento contínuo** | ✅ Sim | ❌ Para ao sucesso |
| **Timeout global** | ❌ Não | ✅ MAX_ATTEMPTS |
| **Melhor para** | Deploy multi-ambiente | Deploy single-environment |

### Quando usar cada um:

**Use `monitor-urls.js` quando:**
- Você tem múltiplos ambientes (staging, production)
- Precisa aguardar várias réplicas
- Quer monitoramento contínuo até todas estarem prontas

**Use `wait-for-server.js` quando:**
- Você tem apenas uma URL para aguardar
- Precisa de timeout global (MAX_ATTEMPTS)
- Quer exit code específico após timeout

---

## 🎯 Personalizações Avançadas

### 1. **Adicionar Headers Customizados**

```javascript
const options = {
  // ... existing options
  headers: {
    'User-Agent': 'Railway-Multi-Monitor/1.0',
    'Authorization': 'Bearer your-token',  // Adicione isso
    'X-Custom-Header': 'value'
  }
};
```

### 2. **Verificar Endpoints Específicos**

```javascript
const URLS = [
  'https://app-staging.railway.app/health',
  'https://app-production.railway.app/health',
  'https://app-production.railway.app/api/status'
];
```

### 3. **Diferentes Intervals por URL**

Modifique o código para ter Map de intervalos:

```javascript
const URL_CONFIG = new Map([
  ['https://fast-app.com', { interval: 2000 }],
  ['https://slow-app.com', { interval: 10000 }]
]);
```

### 4. **Notificação Sonora**

Adicione na função `checkIfAllAvailable()`:

```javascript
// macOS/Linux
if (allAvailable) {
  console.log('\x07'); // Beep
}
```

### 5. **Salvar Logs em Arquivo**

```bash
npm run monitor > monitor-logs.txt 2>&1
```

---

## 🐛 Troubleshooting

### Script não para após todas as URLs disponíveis

**Causa:** Alguma URL retorna status diferente de 200.

**Solução:**
- Verifique os logs para ver qual status está sendo retornado
- Modifique o código para aceitar outros status codes:

```javascript
if (result.status === 200 || result.status === 301) {
  status.available = true;
  // ...
}
```

---

### ENOTFOUND ou ECONNREFUSED persistente

**Causa:** URL incorreta ou serviço não está rodando.

**Solução:**
- Verifique se a URL está correta
- Confirme que o deploy foi concluído no Railway
- Tente acessar a URL manualmente no navegador

---

### Timeout muito frequente

**Causa:** Requisições levam mais de 10 segundos.

**Solução:**

```javascript
const TIMEOUT = 30000; // Aumentar para 30 segundos
```

---

## 📚 Integração com Outros Scripts

### Executar após monitoramento completo:

```bash
#!/bin/bash

# Monitorar todas as URLs
if npm run monitor; then
  echo "✅ Todos os ambientes disponíveis!"
  
  # Executar seed em staging
  curl -X POST https://app-staging.railway.app/seed
  
  # Executar testes
  npm run test:e2e
  
  # Notificar equipe
  curl -X POST https://slack.com/webhook \
    -d '{"text": "Deploy concluído com sucesso!"}'
else
  echo "❌ Monitoramento falhou"
  exit 1
fi
```

---

## 🔒 Segurança

O script apenas faz requisições GET. Não:
- ❌ Envia dados sensíveis
- ❌ Modifica o servidor
- ❌ Armazena informações
- ❌ Requer autenticação (por padrão)

Safe para usar em qualquer ambiente.

---

## 💡 Pro Tips

1. **Adicione ao package.json scripts**:
   ```json
   {
     "scripts": {
       "deploy:all": "git push railway main && npm run monitor",
       "monitor:staging": "node monitor-urls.js --env=staging"
     }
   }
   ```

2. **Use com ferramentas de CI/CD** como GitHub Actions, GitLab CI, CircleCI

3. **Combine com `wait-for-server.js`** para verificação inicial + monitoramento contínuo

4. **Logs estruturados**: Redirecione para arquivo para análise posterior

---

## 📄 Licença

Código open-source, use livremente! 🎉
