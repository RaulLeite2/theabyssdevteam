// ============================================
// NAVEGAÇÃO POR ABAS
// ============================================
const tabs = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.dataset.tab;

        // Remove active de tudo
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Ativa a aba clicada
        tab.classList.add('active');
        document.getElementById(target).classList.add('active');
        
        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ============================================
// INDICADOR DE PROGRESSO DE SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-progress');
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    if (scrollIndicator) {
        scrollIndicator.style.width = scrolled + '%';
    }
});

// ============================================
// PARTÍCULAS ANIMADAS NO FUNDO
// ============================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(0, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        
        particlesContainer.appendChild(particle);
    }
    
    // Adicionar CSS para animação float
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                50% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(1.5);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// CONTADOR ANIMADO
// ============================================
function animateCounter() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Verificar se está visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ============================================
// ANIMAÇÃO AO SCROLL (ELEMENTOS APARECEM)
// ============================================
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    elements.forEach(el => observer.observe(el));
}

// ============================================
// EFEITO PARALLAX SUAVE
// ============================================
function setupParallax() {
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.parallax-section');
        parallaxElements.forEach(element => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ============================================
// HEADER DINÂMICO (MUDA AO SCROLL)
// ============================================
function setupDynamicHeader() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            header.style.padding = '10px 20px';
            header.style.background = 'rgba(0,0,0,0.8)';
        } else {
            header.style.padding = '20px';
            header.style.background = 'rgba(0,0,0,0.3)';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// MOUSE TRAIL EFFECT (EFEITO DE RASTRO)
// ============================================
function setupMouseTrail() {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.circle');
    
    // Criar círculos para o trail se ainda não existirem
    if (circles.length === 0) {
        for (let i = 0; i < 15; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: rgba(0, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
            `;
            document.body.appendChild(circle);
        }
    }
    
    const circles2 = document.querySelectorAll('.circle');
    
    circles2.forEach((circle, index) => {
        circle.x = 0;
        circle.y = 0;
    });
    
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });
    
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;
        
        circles2.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(circles2.length - index) / circles2.length})`;
            
            circle.x = x;
            circle.y = y;
            
            const nextCircle = circles2[index + 1] || circles2[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });
        
        requestAnimationFrame(animateCircles);
    }
    
    animateCircles();
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    animateCounter();
    setupScrollAnimations();
    setupParallax();
    setupDynamicHeader();
    setupMouseTrail();
    
    console.log('%c🌊 The Abyss Dev Team 🌊', 'font-size: 20px; color: #00ffff; font-weight: bold;');
    console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #7f00ff;');
});

// ============================================
// EASTER EGG - KONAMI CODE
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        if (!document.getElementById('rainbow-animation')) {
            const style = document.createElement('style');
            style.id = 'rainbow-animation';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});
