import https from 'https';
import http from 'http';

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════

const URLS = [
  'https://theabyssdevteam.up.railway.app',
  'https://theabyssdevteam-production.up.railway.app'
];

const CHECK_INTERVAL = 5000; // 5 segundos
const TIMEOUT = 10000; // 10 segundos por request

// ═══════════════════════════════════════════════════════════
// ESTADO DO MONITORAMENTO
// ═══════════════════════════════════════════════════════════

const urlStatus = new Map();
let intervalId = null;
let startTime = Date.now();

// Inicializar status de cada URL
URLS.forEach(url => {
  urlStatus.set(url, {
    available: false,
    attempts: 0,
    lastError: null
  });
});

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Railway-Multi-Monitor/1.0'
      }
    };
    
    const startTime = Date.now();
    
    const req = protocol.request(options, (res) => {
      const duration = Date.now() - startTime;
      
      // Consumir response data
      res.on('data', () => {});
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          duration
        });
      });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - startTime;
      reject({
        error: error.message,
        code: error.code,
        duration
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject({
        error: 'Request timeout',
        code: 'ETIMEDOUT',
        duration: TIMEOUT
      });
    });
    
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL DE MONITORAMENTO
// ═══════════════════════════════════════════════════════════

async function checkURL(url) {
  const status = urlStatus.get(url);
  
  // Pular URLs que já estão disponíveis
  if (status.available) {
    return;
  }
  
  status.attempts++;
  const elapsed = Date.now() - startTime;
  
  console.log('');
  console.log(`🔍 Checking: ${url}`);
  console.log(`   Attempt: ${status.attempts} | Elapsed: ${formatTime(elapsed)}`);
  
  try {
    const result = await makeRequest(url);
    
    if (result.status === 200) {
      status.available = true;
      console.log(`   ✅✅✅ URL DISPONÍVEL! ✅✅✅`);
      console.log(`   Status: ${result.status} ${result.statusText}`);
      console.log(`   Response Time: ${result.duration}ms`);
      console.log(`   Total Attempts: ${status.attempts}`);
      console.log(`   Total Time: ${formatTime(elapsed)}`);
      
      // Verificar se todas as URLs estão disponíveis
      checkIfAllAvailable();
    } else {
      status.lastError = `Status ${result.status}`;
      console.log(`   ⚠️ Status: ${result.status} ${result.statusText} (not OK)`);
      console.log(`   Response Time: ${result.duration}ms`);
    }
  } catch (error) {
    status.lastError = error.error;
    console.log(`   ❌ Failed: ${error.error}`);
    console.log(`   Code: ${error.code || 'N/A'}`);
    console.log(`   Duration: ${error.duration}ms`);
  }
}

async function checkAllURLs() {
  const promises = [];
  
  for (const url of URLS) {
    const status = urlStatus.get(url);
    // Apenas verificar URLs que ainda não estão disponíveis
    if (!status.available) {
      promises.push(checkURL(url));
    }
  }
  
  await Promise.allSettled(promises);
}

function checkIfAllAvailable() {
  const allAvailable = Array.from(urlStatus.values()).every(status => status.available);
  
  if (allAvailable) {
    console.log('');
    console.log('═'.repeat(60));
    console.log('🎉🎉🎉 TODAS AS URLs DISPONÍVEIS! 🎉🎉🎉');
    console.log('═'.repeat(60));
    console.log('');
    
    const totalTime = Date.now() - startTime;
    
    console.log('📊 Summary:');
    URLS.forEach(url => {
      const status = urlStatus.get(url);
      console.log('');
      console.log(`   ${url}`);
      console.log(`   ✅ Status: Available`);
      console.log(`   🔄 Attempts: ${status.attempts}`);
    });
    
    console.log('');
    console.log(`   ⏱️ Total Time: ${formatTime(totalTime)}`);
    console.log('');
    console.log('═'.repeat(60));
    console.log('');
    
    // Parar o monitoramento
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    process.exit(0);
  }
}

function printStatus() {
  const available = Array.from(urlStatus.entries()).filter(([, status]) => status.available).length;
  const total = URLS.length;
  
  console.log('');
  console.log('─'.repeat(60));
  console.log(`📊 Status: ${available}/${total} URLs disponíveis`);
  console.log('─'.repeat(60));
}

// ═══════════════════════════════════════════════════════════
// INICIAR MONITORAMENTO
// ═══════════════════════════════════════════════════════════

async function start() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('🔍 MULTI-URL MONITORING STARTED');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📋 Configuration:');
  console.log(`   URLs to monitor: ${URLS.length}`);
  URLS.forEach((url, idx) => {
    console.log(`   ${idx + 1}. ${url}`);
  });
  console.log(`   Check Interval: ${formatTime(CHECK_INTERVAL)}`);
  console.log(`   Timeout per request: ${formatTime(TIMEOUT)}`);
  console.log('');
  console.log('═'.repeat(60));
  
  // Primeira verificação imediata
  await checkAllURLs();
  printStatus();
  
  // Configurar verificações periódicas
  intervalId = setInterval(async () => {
    await checkAllURLs();
    printStatus();
  }, CHECK_INTERVAL);
}

// Tratamento de Ctrl+C
process.on('SIGINT', () => {
  console.log('');
  console.log('');
  console.log('⚠️ Monitoring interrupted by user (Ctrl+C)');
  console.log('');
  console.log('📊 Final Status:');
  
  URLS.forEach(url => {
    const status = urlStatus.get(url);
    const icon = status.available ? '✅' : '❌';
    console.log(`   ${icon} ${url}`);
    console.log(`      Attempts: ${status.attempts}`);
    if (status.lastError && !status.available) {
      console.log(`      Last Error: ${status.lastError}`);
    }
  });
  
  console.log('');
  
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  process.exit(130);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('');
  console.error('❌ Uncaught Exception:', error.message);
  console.error('');
  process.exit(1);
});

// Iniciar o script
start().catch(error => {
  console.error('');
  console.error('❌ Fatal Error:', error.message);
  console.error('');
  process.exit(1);
});
