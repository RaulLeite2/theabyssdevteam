// ============================================
// SISTEMA DE AUTENTICAÇÃO
// ============================================

let isUserLoggedIn = false;
let currentUser = null;

// Modal de Auth
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const authModalClose = document.getElementById('authModalClose');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form-container');

// Botões
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');

// Abrir modal de login
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Fechar modal
if (authModalClose) {
    authModalClose.addEventListener('click', () => {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Fechar ao clicar fora
authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Trocar entre abas de auth
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.authTab;
        
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${target}Form`).classList.add('active');
    });
});

// Esqueci minha senha
forgotPasswordBtn?.addEventListener('click', () => {
    authForms.forEach(f => f.classList.remove('active'));
    document.getElementById('forgotPasswordForm').classList.add('active');
});

// Voltar ao login
backToLoginBtn?.addEventListener('click', () => {
    authForms.forEach(f => f.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
});

// Form de Login
const loginForm = document.getElementById('loginFormElement');
loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulação de login (substituir por API real)
    if (email && password) {
        // Simular sucesso
        currentUser = {
            name: email.split('@')[0],
            email: email,
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('abyssUser', JSON.stringify(currentUser));
        isUserLoggedIn = true;
        
        // Feedback visual
        showNotification('Login realizado com sucesso!', 'success');
        
        // Fechar modal e mostrar dashboard
        authModal.classList.remove('active');
        document.body.style.overflow = '';
        
        updateUIForLoggedInUser();
        switchToTab('dashboard');
    }
});

// Form de Registro
const registerForm = document.getElementById('registerFormElement');
registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('A senha deve ter pelo menos 8 caracteres!', 'error');
        return;
    }
    
    // Simulação de registro
    currentUser = {
        name: name,
        email: email,
        joinDate: new Date().toISOString()
    };
    
    localStorage.setItem('abyssUser', JSON.stringify(currentUser));
    isUserLoggedIn = true;
    
    showNotification('Conta criada com sucesso!', 'success');
    
    authModal.classList.remove('active');
    document.body.style.overflow = '';
    
    updateUIForLoggedInUser();
    switchToTab('dashboard');
});

// Form de Recuperação de Senha
const forgotPasswordForm = document.getElementById('forgotPasswordFormElement');
forgotPasswordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('recoveryEmail').value;
    
    showNotification(`Link de recuperação enviado para ${email}!`, 'success');
    
    setTimeout(() => {
        authForms.forEach(f => f.classList.remove('active'));
        document.getElementById('loginForm').classList.add('active');
    }, 2000);
});

// Logout
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn?.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('abyssUser');
        isUserLoggedIn = false;
        currentUser = null;
        
        showNotification('Logout realizado com sucesso!', 'success');
        updateUIForLoggedOut();
        switchToTab('home');
    }
});

// Atualizar UI quando logado
function updateUIForLoggedInUser() {
    if (loginBtn) {
        loginBtn.innerHTML = '<span class="login-icon">👤</span><span class="login-text">' + currentUser.name + '</span>';
        loginBtn.onclick = () => switchToTab('dashboard');
    }
    
    // Atualizar dashboard
    document.getElementById('dashboardUserName').textContent = currentUser.name;
    document.getElementById('dashboardUserEmail').textContent = currentUser.email;
    
    const joinDate = new Date(currentUser.joinDate);
    const daysActive = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('activeDays').textContent = daysActive;
}

// Atualizar UI quando deslogado
function updateUIForLoggedOut() {
    if (loginBtn) {
        loginBtn.innerHTML = '<span class="login-icon">👤</span><span class="login-text">Entrar</span>';
        loginBtn.onclick = () => {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }
}

// Verificar se já está logado ao carregar página
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('abyssUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isUserLoggedIn = true;
        updateUIForLoggedInUser();
    }
});

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : '#667eea'};
        color: ${type === 'success' || type === 'error' ? '#000' : '#fff'};
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ============================================
// EASTER EGGS & CONSOLE ART
// ============================================

// Console Art
console.log('%c⚡ THE ABYSS DEV TEAM ⚡', 'font-size: 24px; font-weight: bold; color: #00ff88; text-shadow: 0 0 10px #00ff88;');
console.log('%cBem-vindo ao console, desenvolvedor! 👨‍💻', 'font-size: 14px; color: #667eea;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #333;');
console.log('%cComandos secretos:', 'font-weight: bold; color: #00ff88;');
console.log('%c  abyss.info()    - Informações sobre a equipe', 'color: #fff;');
console.log('%c  abyss.easter()  - Encontrar easter eggs', 'color: #fff;');
console.log('%c  abyss.matrix()  - Modo Matrix', 'color: #fff;');
console.log('%c  abyss.konami()  - Ativar código Konami', 'color: #fff;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #333;');

// Objeto global com comandos
window.abyss = {
    info: function() {
        console.log('%c╔════════════════════════════════════╗', 'color: #00ff88;');
        console.log('%c║   THE ABYSS DEVELOPMENT TEAM      ║', 'color: #00ff88; font-weight: bold;');
        console.log('%c╠════════════════════════════════════╣', 'color: #00ff88;');
        console.log('%c║ Fundador: Raul "Milk" Leite       ║', 'color: #fff;');
        console.log('%c║ Stack: Python, Node.js, React      ║', 'color: #fff;');
        console.log('%c║ Status: Elite Development 🔥       ║', 'color: #fff;');
        console.log('%c╚════════════════════════════════════╝', 'color: #00ff88;');
        return '⚡ Código que emerge do abismo';
    },
    
    easter: function() {
        const eggs = [
            '🥚 Digite "theabyss" em qualquer lugar do site',
            '🥚 Pressione Ctrl+Shift+D para debug mode',
            '🥚 Código Konami: ↑↑↓↓←→←→BA',
            '🥚 Clique 10x no logo',
            '🥚 Digite "matrix" no console'
        ];
        console.log('%c🎮 Easter Eggs Encontrados:', 'font-size: 16px; font-weight: bold; color: #00ff88;');
        eggs.forEach(egg => console.log(`%c${egg}`, 'color: #fff;'));
        return '🥚 Continue explorando...';
    },
    
    matrix: function() {
        activateMatrixMode();
        return '🟢 Matrix Mode Activated';
    },
    
    konami: function() {
        triggerKonamiCode();
        return '🎮 Konami Code Activated!';
    }
};

// Modo Matrix
function activateMatrixMode() {
    const style = document.createElement('style');
    style.id = 'matrix-mode';
    style.textContent = `
        * {
            color: #00ff88 !important;
            text-shadow: 0 0 5px #00ff88 !important;
        }
        body {
            background: #000 !important;
        }
    `;
    document.head.appendChild(style);
    
    showNotification('🟢 Matrix Mode Activated', 'success');
    
    setTimeout(() => {
        const matrixStyle = document.getElementById('matrix-mode');
        if (matrixStyle) matrixStyle.remove();
        showNotification('Matrix Mode Deactivated', 'info');
    }, 10000);
}

// Código Konami
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        triggerKonamiCode();
    }
});

function triggerKonamiCode() {
    document.body.style.transform = 'rotate(360deg)';
    document.body.style.transition = 'transform 2s ease';
    
    setTimeout(() => {
        document.body.style.transform = '';
    }, 2000);
    
    showNotification('🎮 Konami Code! +30 Lives', 'success');
    
    // Adicionar efeito de confetti
    createConfetti();
}

// Confetti effect
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}%;
            width: 10px;
            height: 10px;
            background: ${['#00ff88', '#667eea', '#764ba2', '#ff4444'][Math.floor(Math.random() * 4)]};
            animation: fall ${2 + Math.random() * 3}s linear;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Animação de queda
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Detecção de digitação "theabyss"
let typedSequence = '';
document.addEventListener('keypress', (e) => {
    typedSequence += e.key;
    typedSequence = typedSequence.slice(-8);
    
    if (typedSequence === 'theabyss') {
        showNotification('🎯 Secret code found!', 'success');
        document.body.classList.add('pulse-animation');
        setTimeout(() => document.body.classList.remove('pulse-animation'), 2000);
    }
});

// Contador de cliques no logo
let logoClicks = 0;
const logoIcon = document.querySelector('.logo-icon');
logoIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    logoClicks++;
    
    if (logoClicks === 10) {
        showNotification('🎉 Logo Master Achievement Unlocked!', 'success');
        logoIcon.style.animation = 'spin 1s linear infinite';
        setTimeout(() => {
            logoIcon.style.animation = '';
            logoClicks = 0;
        }, 5000);
    }
});

// Debug Mode (Ctrl+Shift+D)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        document.body.classList.toggle('debug-mode');
        
        if (document.body.classList.contains('debug-mode')) {
            showNotification('🔧 Debug Mode ON', 'info');
            
            // Adicionar estilo de debug
            if (!document.getElementById('debug-style')) {
                const debugStyle = document.createElement('style');
                debugStyle.id = 'debug-style';
                debugStyle.textContent = `
                    .debug-mode * {
                        outline: 1px solid rgba(255, 0, 0, 0.3) !important;
                    }
                    .debug-mode *:hover {
                        outline: 2px solid rgba(0, 255, 136, 0.8) !important;
                    }
                `;
                document.head.appendChild(debugStyle);
            }
        } else {
            showNotification('🔧 Debug Mode OFF', 'info');
        }
    }
});

// ============================================
// ANIMAÇÕES DE SCROLL
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

console.log('%c✨ Sistema carregado com sucesso!', 'font-size: 12px; color: #00ff88;');
console.log('%cDigite abyss.info() para começar', 'font-size: 12px; color: #667eea;');
