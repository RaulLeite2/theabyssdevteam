// ============================================
// THE ABYSS DEVELOPMENT TEAM
// Animations and Interactive Elements
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initHoverEffects();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            body.classList.toggle('nav-open');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            body.classList.remove('nav-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            body.classList.remove('nav-open');
        }
    });

    // Update active link based on current page
    updateActiveLink();
}

function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in effect
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    // Card hover animations
    const cards = document.querySelectorAll('.nav-card, .concept-card, .system-card, .trait-card, .area-card, .contact-option');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn, .card-link');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== SMOOTH SCROLL BEHAVIOR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== LOAD ANIMATIONS =====
// Fade in hero section on load
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== CONSOLE MESSAGE =====
console.log('%c⚙️ The Abyss Development Team ⚙️', 'color: #64c8ff; font-size: 16px; font-weight: bold;');
console.log('%cThe Gear of Cataclysm - A MMORPG in Development', 'color: #64c8ff; font-size: 14px;');
console.log('%cJoin us: https://discord.gg/theabyss', 'color: #a0a0a0; font-size: 12px;');
