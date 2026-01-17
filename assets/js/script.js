// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// ============================================
// NAVEGAÇÃO POR ABAS
// ============================================
const tabs = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

// Função para mudar de aba
function switchToTab(target) {
    // Remove active de tudo
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    // Ativa a aba
    const targetTab = document.querySelector(`.tab-link[data-tab="${target}"]`);
    if (targetTab) targetTab.classList.add('active');
    
    const targetContent = document.getElementById(target);
    if (targetContent) targetContent.classList.add('active');
    
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Fecha o menu mobile se estiver aberto
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('mobileMenuToggle');
    if (nav && toggle) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
    }
}

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tab.dataset.tab;
        switchToTab(target);
    });
});

// Botões de CTA que levam para outras abas
document.addEventListener('click', (e) => {
    if (e.target.closest('[data-tab]') && !e.target.classList.contains('tab-link')) {
        e.preventDefault();
        const target = e.target.closest('[data-tab]').dataset.tab;
        switchToTab(target);
    }
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
    setupThemeToggle();
    setupMobileMenu();
    setupTypingEffect();
    setupCustomCursor();
    setupProjectModal();
    setupTestimonialCarousel();
    setupFAQ();
    setupContactForm();
    
    console.log('%c🌊 The Abyss Dev Team 🌊', 'font-size: 20px; color: #00ffff; font-weight: bold;');
    console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #7f00ff;');
});

// ============================================
// THEME TOGGLE
// ============================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        
        themeToggle.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// ============================================
// MOBILE MENU
// ============================================
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mainNav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// ============================================
// TYPING EFFECT
// ============================================
function setupTypingEffect() {
    const element = document.getElementById('typingText');
    if (!element) return;
    
    const text = 'Código que emerge do abismo.';
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 500);
}

// ============================================
// CURSOR CUSTOMIZADO
// ============================================
function setupCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const trail = document.getElementById('cursorTrail');
    
    if (!cursor || !trail) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// ============================================
// PROJECT MODAL
// ============================================
function setupProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const projectCards = document.querySelectorAll('.project-card');
    
    const projectData = {
        abyss: {
            title: 'The Abyss Bot',
            status: 'Live',
            description: 'Bot de RPG completo para Discord com sistema de combate, missões, inventário e progressão de personagem.',
            features: [
                'Sistema de combate em tempo real',
                'Mais de 50 missões únicas',
                'Sistema de classes e habilidades',
                'Economia integrada',
                'Boss battles épicos',
                'Sistema de guilds'
            ],
            tech: ['Python', 'Discord.py', 'PostgreSQL', 'Redis'],
            stats: {
                users: '1000+',
                uptime: '99.9%',
                commands: '150+'
            }
        },
        luma: {
            title: 'Luma Bot',
            status: 'Em Desenvolvimento',
            description: 'Bot multi-propósito inspirado na Loritta com foco em entretenimento e utilidades.',
            features: [
                'Moderação automática',
                'Mini-games diversos',
                'Sistema de economia',
                'Comandos de utilidade',
                'Integração com APIs',
                'Dashboard web'
            ],
            tech: ['Python', 'Discord.py', 'FastAPI', 'MongoDB'],
            stats: {
                progress: '60%',
                eta: 'Q2 2026',
                commands: '80+'
            }
        }
    };
    
    projectCards.forEach(card => {
        const detailsBtn = card.querySelector('.project-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                const projectId = card.dataset.project;
                const data = projectData[projectId];
                
                if (data) {
                    modalBody.innerHTML = `
                        <div class="modal-project-header">
                            <h2>${data.title}</h2>
                            <span class="project-status ${data.status === 'Live' ? 'live' : 'upcoming'}">
                                ● ${data.status}
                            </span>
                        </div>
                        <p class="modal-description">${data.description}</p>
                        
                        <div class="modal-section">
                            <h3>🚀 Funcionalidades</h3>
                            <ul class="modal-features">
                                ${data.features.map(f => `<li>✓ ${f}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>⚙️ Tecnologias</h3>
                            <div class="modal-tech">
                                ${data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-section">
                            <h3>📊 Estatísticas</h3>
                            <div class="modal-stats">
                                ${Object.entries(data.stats).map(([key, value]) => 
                                    `<div class="stat-item">
                                        <span class="stat-label">${key}</span>
                                        <span class="stat-value">${value}</span>
                                    </div>`
                                ).join('')}
                            </div>
                        </div>
                    `;
                    
                    modal.classList.add('active');
                }
            });
        }
    });
    
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// ============================================
// TESTIMONIAL CAROUSEL
// ============================================
function setupTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showTestimonial(currentIndex);
        });
    });
    
    // Auto-rotate
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

// ============================================
// FAQ
// ============================================
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Abre o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const projectType = document.getElementById('projectType').value;
            const message = document.getElementById('message').value;
            
            // Aqui você pode adicionar integração com backend
            console.log('Form submitted:', { name, email, projectType, message });
            
            // Feedback visual
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Mensagem Enviada!';
            submitBtn.style.background = 'linear-gradient(135deg, #00ff00, #00aa00)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #00ffff, #7f00ff)';
                form.reset();
            }, 3000);
        });
    }
}

// ============================================
// BLOG POSTS LOADER
// ============================================
async function loadBlogPosts() {
    const container = document.getElementById('blogPosts');
    
    if (!container) return;
    
    try {
        // Lista de posts disponíveis (adicione mais conforme criar novos posts)
        const postFiles = ['post1', 'post2', 'post3'];
        const posts = [];
        
        // Carregar metadados de cada post
        for (const postFile of postFiles) {
            try {
                const metaResponse = await fetch(`/posts/${postFile}.json`);
                const metadata = await metaResponse.json();
                
                posts.push({
                    id: postFile,
                    title: metadata.title,
                    author: metadata.author,
                    date: metadata.date,
                    excerpt: metadata.excerpt,
                    htmlFile: `/posts/${postFile}.html`
                });
            } catch (error) {
                console.error(`Erro ao carregar ${postFile}:`, error);
            }
        }
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="no-posts">Nenhum post publicado ainda. Em breve teremos novidades! 🚀</div>';
            return;
        }
        
        // Ordenar por data (mais recentes primeiro)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Mostrar apenas os 3 posts mais recentes
        const recentPosts = posts.slice(0, 3);
        
        container.innerHTML = recentPosts.map(post => `
            <div class="blog-post-card" onclick="window.open('${post.htmlFile}', '_blank')">
                <h3>${escapeHtml(post.title)}</h3>
                <div class="blog-post-meta">
                    <span>👤 ${escapeHtml(post.author)}</span>
                    <span>📅 ${formatDate(post.date)}</span>
                </div>
                <div class="blog-post-content">
                    ${escapeHtml(post.excerpt)}
                </div>
                <span class="blog-post-read-more">Ler mais →</span>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        container.innerHTML = '<div class="no-posts">Erro ao carregar posts. Tente novamente mais tarde.</div>';
    }
}

// Funções auxiliares para blog
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
}

// Carregar posts quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogPosts);
} else {
    loadBlogPosts();
}

// ============================================
// AUTO-ROTATING TABS - ESTILO JETBRAINS
// ============================================

class RotatingTabs {
    constructor(section, autoRotateInterval = 5000) {
        this.section = section;
        this.buttons = section.querySelectorAll('.tab-btn');
        this.contents = section.querySelectorAll('.tab-content-item');
        this.autoRotateInterval = autoRotateInterval;
        this.currentIndex = 0;
        this.isPaused = false;
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        // Event listeners para os botões
        this.buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.switchTab(index);
                this.pauseAutoRotate();
            });
            
            // Pausa a rotação quando hover no botão
            btn.addEventListener('mouseenter', () => this.pauseAutoRotate());
            btn.addEventListener('mouseleave', () => this.resumeAutoRotate());
        });
        
        // Pausa quando hover no conteúdo
        this.contents.forEach(content => {
            content.addEventListener('mouseenter', () => this.pauseAutoRotate());
            content.addEventListener('mouseleave', () => this.resumeAutoRotate());
        });
        
        // Inicia a rotação automática
        this.startAutoRotate();
    }
    
    switchTab(index) {
        // Remove active de todos
        this.buttons.forEach(btn => btn.classList.remove('active'));
        this.contents.forEach(content => content.classList.remove('active'));
        
        // Adiciona active no selecionado
        this.buttons[index].classList.add('active');
        this.contents[index].classList.add('active');
        
        this.currentIndex = index;
    }
    
    nextTab() {
        const nextIndex = (this.currentIndex + 1) % this.buttons.length;
        this.switchTab(nextIndex);
    }
    
    startAutoRotate() {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.nextTab();
            }
        }, this.autoRotateInterval);
    }
    
    pauseAutoRotate() {
        this.isPaused = true;
    }
    
    resumeAutoRotate() {
        this.isPaused = false;
    }
    
    stopAutoRotate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Inicializa todas as seções de rotating tabs
document.addEventListener('DOMContentLoaded', () => {
    const rotatingSections = document.querySelectorAll('.rotating-section');
    
    rotatingSections.forEach(section => {
        new RotatingTabs(section, 5000); // 5 segundos por tab
    });
});

// Pausa a rotação quando a aba não está visível
document.addEventListener('visibilitychange', () => {
    const rotatingSections = document.querySelectorAll('.rotating-section');
    
    rotatingSections.forEach(section => {
        const buttons = section.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            if (document.hidden) {
                btn.dispatchEvent(new Event('mouseenter'));
            } else {
                btn.dispatchEvent(new Event('mouseleave'));
            }
        });
    });
});
