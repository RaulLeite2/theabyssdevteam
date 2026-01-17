import https from 'https';
import http from 'http';

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════
const TARGET_URL = process.env.TARGET_URL || 'https://theabyssdevteam.up.railway.app';
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL) || 5000; // 5 segundos
const MAX_ATTEMPTS = parseInt(process.env.MAX_ATTEMPTS) || 60; // 5 minutos total
const TIMEOUT = parseInt(process.env.TIMEOUT) || 10000; // 10 segundos por tentativa

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
        'User-Agent': 'Railway-Wait-Script/1.0'
      }
    };
    
    const startTime = Date.now();
    
    const req = protocol.request(options, (res) => {
      const duration = Date.now() - startTime;
      
      // Consumir response data para liberar socket
      res.on('data', () => {});
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          duration,
          headers: res.headers
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
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════

async function waitForServer() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('🔍 WAITING FOR SERVER TO BE AVAILABLE');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📋 Configuration:');
  console.log('   Target URL:', TARGET_URL);
  console.log('   Check Interval:', formatTime(CHECK_INTERVAL));
  console.log('   Max Attempts:', MAX_ATTEMPTS);
  console.log('   Timeout per request:', formatTime(TIMEOUT));
  console.log('');
  console.log('═'.repeat(60));
  console.log('');
  
  const totalStartTime = Date.now();
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const attemptStartTime = Date.now();
    const elapsed = attemptStartTime - totalStartTime;
    
    console.log(`🔄 Attempt ${attempt}/${MAX_ATTEMPTS} (elapsed: ${formatTime(elapsed)})`);
    console.log(`   Checking: ${TARGET_URL}`);
    
    try {
      const result = await makeRequest(TARGET_URL);
      
      if (result.status === 200) {
        console.log('');
        console.log('═'.repeat(60));
        console.log('✅✅✅ SERVIDOR DISPONÍVEL! ✅✅✅');
        console.log('═'.repeat(60));
        console.log('');
        console.log('📊 Success Details:');
        console.log('   Status:', result.status, result.statusText);
        console.log('   Response Time:', result.duration + 'ms');
        console.log('   Content-Type:', result.headers['content-type'] || 'N/A');
        console.log('   Total Wait Time:', formatTime(elapsed));
        console.log('   Total Attempts:', attempt);
        console.log('');
        console.log('🎉 Server is ready to accept requests!');
        console.log('');
        console.log('═'.repeat(60));
        console.log('');
        
        // Sucesso! Sair do processo com código 0
        process.exit(0);
      } else {
        console.log(`   ⚠️ Status: ${result.status} ${result.statusText} (not OK)`);
        console.log(`   ⏱️ Response Time: ${result.duration}ms`);
      }
    } catch (error) {
      console.log(`   ❌ Failed: ${error.error}`);
      console.log(`   📝 Code: ${error.code || 'N/A'}`);
      console.log(`   ⏱️ Duration: ${error.duration}ms`);
    }
    
    // Se não é a última tentativa, aguardar antes de tentar novamente
    if (attempt < MAX_ATTEMPTS) {
      console.log(`   ⏳ Waiting ${formatTime(CHECK_INTERVAL)} before next attempt...`);
      console.log('');
      
      await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
    }
  }
  
  // Se chegou aqui, todas as tentativas falhar am
  const totalElapsed = Date.now() - totalStartTime;
  console.log('');
  console.log('═'.repeat(60));
  console.log('❌❌❌ TIMEOUT: SERVER NOT AVAILABLE ❌❌❌');
  console.log('═'.repeat(60));
  console.log('');
  console.log('📊 Summary:');
  console.log('   Total Attempts:', MAX_ATTEMPTS);
  console.log('   Total Time:', formatTime(totalElapsed));
  console.log('   Target URL:', TARGET_URL);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log('   1. Check if the URL is correct');
  console.log('   2. Verify the server is actually running');
  console.log('   3. Check Railway logs for deployment errors');
  console.log('   4. Ensure the domain is properly configured');
  console.log('   5. Try accessing the URL manually in a browser');
  console.log('');
  console.log('═'.repeat(60));
  console.log('');
  
  // Sair com código de erro
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════
// INICIAR SCRIPT
// ═══════════════════════════════════════════════════════════

// Tratar Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('');
  console.log('');
  console.log('⚠️ Script interrupted by user (Ctrl+C)');
  console.log('');
  process.exit(130);
});

// Iniciar verificação
waitForServer().catch(error => {
  console.error('');
  console.error('❌ Unexpected error:', error.message);
  console.error('');
  process.exit(1);
});
