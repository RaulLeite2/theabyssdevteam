// ============================================
// DASHBOARD COMPLETO - THE ABYSS DEV TEAM
// Sistema completo de dashboard com HTML, CSS e funcionalidades
// ============================================

class CompleteDashboard {
    constructor() {
        this.API_URL = window.location.origin;
        this.currentUser = null;
        this.projects = [];
        this.teamMembers = [];
        
        this.initialize();
    }

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    
    initialize() {
        this.injectStyles();
        this.createDashboardStructure();
        this.checkAuthentication();
    }

    // ============================================
    // ESTILOS CSS
    // ============================================
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Reset e Base */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #1a1625;
                color: #fff;
                overflow-x: hidden;
            }
            
            /* Dashboard Wrapper */
            .dashboard-wrapper {
                display: flex;
                min-height: 100vh;
                background: #1a1625;
            }

            /* Sidebar */
            .dashboard-sidebar {
                width: 370px;
                background: #221c35;
                border-right: 1px solid rgba(255, 255, 255, 0.05);
                padding: 32px 24px;
                display: flex;
                flex-direction: column;
                gap: 32px;
                position: fixed;
                height: 100vh;
                overflow-y: auto;
                z-index: 1000;
            }

            .sidebar-section-title {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: rgba(255, 255, 255, 0.4);
                font-weight: 700;
                margin-bottom: 16px;
                margin-top: 16px;
            }

            .sidebar-brand {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 0;
                margin-bottom: 8px;
            }

            .sidebar-brand-icon { 
                font-size: 2.5rem;
                filter: drop-shadow(0 0 20px rgba(124, 104, 238, 0.8));
            }
            
            .sidebar-brand-text {
                display: flex;
                flex-direction: column;
            }

            .sidebar-brand-name {
                font-size: 1.4rem;
                font-weight: 800;
                background: linear-gradient(135deg, #7c68ee, #a78bfa);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .sidebar-brand-tagline {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.5);
                font-weight: 500;
            }

            .sidebar-nav {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .sidebar-link {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 14px 20px;
                color: rgba(255, 255, 255, 0.65);
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                position: relative;
            }

            .sidebar-link span:first-child {
                font-size: 1.3rem;
                opacity: 0.9;
            }

            .sidebar-link:hover {
                background: rgba(124, 104, 238, 0.1);
                color: #a78bfa;
                transform: translateX(4px);
            }

            .sidebar-link.active {
                background: linear-gradient(135deg, #7c68ee 0%, #a78bfa 100%);
                color: #fff;
                box-shadow: 0 8px 24px rgba(124, 104, 238, 0.4);
            }

            .sidebar-link.active span:first-child {
                opacity: 1;
            }

            .sidebar-user {
                display: flex;
                align-items: center;
                gap: 14px;
                padding: 18px;
                background: rgba(124, 104, 238, 0.08);
                border: 1px solid rgba(124, 104, 238, 0.2);
                border-radius: 16px;
                margin-top: auto;
                transition: all 0.3s ease;
            }

            .sidebar-user:hover {
                background: rgba(124, 104, 238, 0.12);
                border-color: rgba(124, 104, 238, 0.3);
            }

            .user-avatar {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: linear-gradient(135deg, #7c68ee 0%, #a78bfa 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                box-shadow: 0 4px 12px rgba(124, 104, 238, 0.3);
            }

            .user-info {
                flex: 1;
            }

            .user-name {
                font-weight: 700;
                color: #fff;
                font-size: 1rem;
                margin-bottom: 2px;
            }

            .user-role {
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.5);
                font-weight: 500;
            }

            .btn-logout {
                background: transparent;
                color: rgba(255, 255, 255, 0.6);
                border: none;
                padding: 10px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
                display: flex370px;
                padding: 48px 56px;
                background: #1a1625;
            }

            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 48px;
            }

            .dashboard-header-left h1 {
                font-size: 3rem;
                background: linear-gradient(135deg, #00d4ff, #7c68ee);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 900;
                margin-bottom: 8px;
                letter-spacing: -1px;
            }

            .dashboard-greeting {
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.6);
                font-weight: 500;
            }

            .dashboard-header-right {
                display: flex;
                gap: 12px;
            }

            .btn-header {
                padding: 12px 24px;
                border-radius: 12px;
                border: none;
                font-weight: 600;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .btn-notifications {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .btn-notifications:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.15);
            }

            .btn-new-project {
                background: linear-gradient(135deg, #7c68ee 0%, #a78bfa 100%);
                color: #fff;
                box-shadow: 0 4px 12px rgba(124, 104, 238, 0.4);
            }

            .btn-new-project:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 104, 238, 0.5)
            .sidebar-footer-brand {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .sidebar-footer-icon {
                font-size: 2rem;
                filter: drop-shadow(0 0 10px rgba(124, 104, 238, 0.6));
            }

            .sidebar-footer-text h3 {
                font-size: 1rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 2px;
            }

            .sidebar-footer-text p {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.5);
            }

            /* Main Content */
            .dashboard-main {
                flex: 1;
                margin-left: 280px;
                padding: 40px;
            }

            .dashboard-header {
                display: flex;
                justify-content: space-between;80px, 1fr));
                gap: 24px;
                margin-bottom: 48px;
            }

            .stat-card {
                background: #221c35;
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 20px;
                padding: 32px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #7c68ee, #a78bfa);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .stat-card:hover {
                border-color: rgba(124, 104, 238, 0.3);
                transform: translateY(-4px);
                box-shadow: 0 12px 32px rgba(124, 104, 238, 0.15);
            }

            .stat-card:hover::before {
                opacity: 1;
            }
4px;
            }

            .project-card {
                background: #221c35;
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 20px;
                padding: 28px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .project-card:hover {
                transform: translateY(-4px);
                border-color: rgba(124, 104, 238, 0.3);
                box-shadow: 0 12px 32px rgba(124, 104, 238, 0.15
                font-size: 2rem;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }

            .stat-badge {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .stat-badge.up {
                background: rgba(34, 197, 94, 0.15);
                color: #22c55e;
            }

            .stat-badge.neutral {
                background: rgba(59, 130, 246, 0.15);
                color: #3b82f6;
            }

            .stat-number {
                font-size: 2.75rem;
                font-weight: 900;
                color: #fff;
                line-height: 1;
                margin-top: 8px;
            }

            .stat-label {
                font-size: 0.95rem;
                color: rgba(255, 255, 255, 0.5);
                font-weight: 600;
                margin-top: 4pxpx;
            }

            .card-title {
                font-size: 1.3rem;
                color: #fff;
                margin-bottom: 20px;
                font-weight: 600;
            }

            /* Stats Cards */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 25px;
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .stat-icon {
                width: 60px;
                height: 60px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
            }

            .stat-info h3 {
                font-size: 2rem;
                color: #fff;
                font-weight: 700;
            }

            .stat-info p {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.9rem;
            }

            /* Projects */
            .projects-grid {
                display: grid;
                gap: 20px;
            }

            .project-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 25px;
                transition: all 0.3s ease;
            }

            .project-card:hover {
                transform: translateY(-5px);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .project-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }

            .project-icon {
                width: 50px;
                height: 50px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .project-title {
                font-size: 1.2rem;
                color: #fff;
                font-weight: 600;
                margin: 10px 0;
            }

            .project-description {
                color: rgba(255, 255, 255, 0.7);
                font-size: 0.9rem;
                margin-bottom: 15px;
            }

            .project-meta {
                display: flex;
                gap: 15px;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.6);
            }

            .project-status {
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .status-active {
                background: rgba(76, 175, 80, 0.2);
                color: #4caf50;
            }

            .status-inactive {
                background: rgba(158, 158, 158, 0.2);
                color: #9e9e9e;
            }

            .project-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .btn-project {
                padding: 8px 16px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
            }

            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            /* Alerts & Notifications */
            .alert-card {
                background: #221c35;
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-left: 4px solid;
                border-radius: 16px;
                padding: 24px;
                display: flex;
                align-items: flex-start;
                gap: 20px;
                margin-bottom: 24px;
                transition: all 0.3s ease;
            }

            .alert-card.critical {
                border-left-color: #ef4444;
                background: rgba(239, 68, 68, 0.05);
            }

            .alert-card.warning {
                border-left-color: #f59e0b;
                background: rgba(245, 158, 11, 0.05);
            }

            .alert-card:hover {
                transform: translateX(4px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }

            .alert-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                flex-shrink: 0;
            }

            .alert-icon.critical {
                background: rgba(239, 68, 68, 0.15);
            }

            .alert-icon.warning {
                background: rgba(245, 158, 11, 0.15);
            }

            .alert-content {
                flex: 1;
            }

            .alert-content h3 {
                font-size: 1.1rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 6px;
            }

            .alert-content p {
                font-size: 0.95rem;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 8px;
            }

            .alert-time {
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.4);
            }

            .alert-actions {
                display: flex;
                align-items: center;
            }

            .btn-alert {
                padding: 10px 20px;
                border-radius: 10px;
                border: none;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-alert.primary {
                background: linear-gradient(135deg, #7c68ee 0%, #a78bfa 100%);
                color: #fff;
            }

            .btn-alert.primary:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(124, 104, 238, 0.4);
            }

            .mobile-sidebar-toggle {
                display: none;
                position: fixed;
                top: 24px;
                left: 24px;
                z-index: 1001;
                background: #221c35;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 14px;
                border-radius: 12px;
                cursor: pointer;
                font-size: 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            @media (max-width: 1024px) {
                .dashboard-sidebar {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .dashboard-sidebar.open {
                    transform: translateX(0);
                    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.5);
                }

                .dashboard-main {
                    margin-left: 0;
                    padding: 96px 32px 32px;
                }

                .mobile-sidebar-toggle {
                    display: block;
                }

                .stats-grid {
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                }
            }

            @media (max-width: 640px) {
                .dashboard-main {
                    padding: 96px 20px 20px;
                }

                .stats-grid {
                    grid-template-columns: 1fr;
                }

                .team-grid {
                    grid-template-columns: 1fr;
                }

                .dashboard-header {
                    flex-direction: column;
                    gap: 20px;
                }

                .dashboard-header-right {
                    width: 100%;
                }

                .btn-header {
                    flex: 1;
                }
            }

            /* Login Form */
            .login-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 20px;
                background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            }

            .login-card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 40px;
                max-width: 450px;
                width: 100%;
            }

            .login-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .login-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }

            .login-title {
                font-size: 1.8rem;
                color: #fff;
                margin-bottom: 10px;
            }

            .login-subtitle {
                color: rgba(255, 255, 255, 0.6);
            }

            .form-group {
                margin-bottom: 20px;
            }

            .form-label {
                display: block;
                margin-bottom: 8px;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
            }

            .form-input {
                width: 100%;
                padding: 14px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: #fff;
                font-size: 1rem;
            }

            .form-input:focus {
                outline: none;
                border-color: rgba(102, 126, 234, 0.5);
            }

            .error-message {
                display: none;
                padding: 12px;
                background: rgba(245, 87, 108, 0.1);
                border: 1px solid rgba(245, 87, 108, 0.3);
                border-radius: 8px;
                color: #f5576c;
                margin-bottom: 20px;
                font-size: 0.9rem;
            }

            .btn-login {
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
                border: none;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-login:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            }

            .btn-login:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // ESTRUTURA HTML
    // ============================================
    
    createDashboardStructure() {
        document.body.innerHTML = `
            <div class="dashboard-wrapper" id="dashboardWrapper">
                <!-- Será preenchido dinamicamente -->
            </div>
        `;
    }

    // ============================================
    // AUTENTICAÇÃO
    // ============================================
    
    async checkAuthentication() {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            this.showLoginForm();
            return;
        }

        try {
            const response = await fetch(`${this.API_URL}/api/auth/verify`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (data.success) {
                this.currentUser = data.user;
                this.showDashboard();
            } else {
                localStorage.removeItem('authToken');
                this.showLoginForm();
            }
        } catch (error) {
            console.error('Erro na verificação:', error);
            localStorage.removeItem('authToken');
            this.showLoginForm();
        }
    }

    showLoginForm() {
        const wrapper = document.getElementById('dashboardWrapper');
        wrapper.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-icon">⚡</div>
                        <h2 class="login-title">The Abyss Dashboard</h2>
                        <p class="login-subtitle">Acesso exclusivo para membros autorizados</p>
                    </div>
                    
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="loginEmail" class="form-input" placeholder="seu@email.com" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Senha</label>
                            <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required>
                        </div>
                        <div id="loginError" class="error-message"></div>
                        <button type="submit" class="btn-login" id="loginBtn">🔐 Entrar</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const loginBtn = document.getElementById('loginBtn');
        const errorDiv = document.getElementById('loginError');
        
        loginBtn.disabled = true;
        loginBtn.textContent = '⏳ Entrando...';
        errorDiv.style.display = 'none';

        try {
            const response = await fetch(`${this.API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('authToken', data.token);
                this.currentUser = data.user;
                this.showDashboard();
            } else {
                errorDiv.textContent = data.message || 'Erro ao fazer login';
                errorDiv.style.display = 'block';
                loginBtn.disabled = false;
                loginBtn.textContent = '🔐 Entrar';
            }
        } catch (error) {
            console.error('Erro no login:', error);
            errorDiv.textContent = 'Erro ao conectar com o servidor';
            errorDiv.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = '🔐 Entrar';
        }
    }

    // ============================================
    // DASHBOARD PRINCIPAL
    // ============================================
    
    showDashboard() {
        const wrapper = document.getElementById('dashboardWrapper');
        wrapper.innerHTML = `
            <button class="mobile-sidebar-toggle" id="mobileSidebarToggle">☰</button>
            
            <aside class="dashboard-sidebar" id="dashboardSidebar">
                <div class="sidebar-brand">
                    <div class="sidebar-brand-icon">⚡</div>
                    <div class="sidebar-brand-text">
                        <div class="sidebar-brand-name">The Abyss</div>
                        <div class="sidebar-brand-tagline">Development Team</div>
                    </div>
                </div>

                <div class="sidebar-section-title">MENU PRINCIPAL</div>

                <nav class="sidebar-nav">
                    <a class="sidebar-link active" data-tab="overview">
                        <span>📊</span> Visão Geral
                    </a>
                    <a class="sidebar-link" data-tab="projects">
                        <span>🚀</span> Projetos
                    </a>
                    <a class="sidebar-link" data-tab="team">
                        <span>👥</span> Equipe
                    </a>
                </nav>

                <div class="sidebar-section-title">CONFIGURAÇÕES</div>

                <nav class="sidebar-nav">
                    <a class="sidebar-link" data-tab="settings">
                        <span>⚙️</span> Configurações
                    </a>
                </nav>

                <div class="sidebar-user">
                    <div class="user-avatar">👤</div>
                    <div class="user-info">
                        <div class="user-name">${this.currentUser.name}</div>
                        <div class="user-role">${this.currentUser.role === 'admin' ? 'Administrador' : 'Membro'}</div>
                    </div>
                    <button class="btn-logout" id="logoutBtn" title="Sair">🚪</button>
                </div>

                <div class="sidebar-footer">
                    <div class="sidebar-section-title">MENU PRINCIPAL</div>
                    <div class="sidebar-footer-brand">
                        <div class="sidebar-footer-icon">⚡</div>
                        <div class="sidebar-footer-text">
                            <h3>The Abyss</h3>
                            <p>Development Team</p>
                        </div>
                    </div>
                    <a class="sidebar-link" data-tab="dashboard">
                        <span>📊</span> Dashboard
                    </a>
                </div>
            </aside>

            <main class="dashboard-main">
                <div id="overviewTab" class="dashboard-tab-content active">
                    <div class="dashboard-header">
                        <div class="dashboard-header-left">
                            <h1>Dashboard</h1>
                            <p class="dashboard-greeting">Bem-vindo ao painel de controle do The Abyss Dev Team</p>
                        </div>
                        <div class="dashboard-header-right">
                            <button class="btn-header btn-notifications">
                                🔔 Notificações
                            </button>
                            <button class="btn-header btn-new-project">
                                ➕ Novo Projeto
                            </button>
                        </div>
                    </div>

                    <div class="stats-grid" id="statsGrid">
                        <!-- Stats serão carregadas aqui -->
                    </div>

                    <div id="alertsContainer">
                        <!-- Alertas críticos aqui -->
                    </div>

                    <div class="dashboard-card" style="background: #221c35; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 20px; padding: 32px; margin-bottom: 24px;">
                        <h3 style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 24px;">Projetos Recentes</h3>
                        <div class="projects-grid" id="recentProjects">
                            <!-- Projetos recentes aqui -->
                        </div>
                    </div>
                </div>

                <div id="projectsTab" class="dashboard-tab-content">
                    <div class="dashboard-header">
                        <div class="dashboard-header-left">
                            <h1>Projetos</h1>
                            <p class="dashboard-greeting">Gerencie todos os projetos da equipe</p>
                        </div>
                        <div class="dashboard-header-right">
                            <button class="btn-header btn-new-project">
                                ➕ Novo Projeto
                            </button>
                        </div>
                    </div>
                    <div class="projects-grid" id="allProjects">
                        <!-- Todos os projetos aqui -->
                    </div>
                </div>

                <div id="teamTab" class="dashboard-tab-content">
                    <div class="dashboard-header">
                        <div class="dashboard-header-left">
                            <h1>Equipe</h1>
                            <p class="dashboard-greeting">Membros da The Abyss Development Team</p>
                        </div>
                    </div>
                    <div class="team-grid" id="teamMembers">
                        <!-- Membros da equipe aqui -->
                    </div>
                </div>

                <div id="settingsTab" class="dashboard-tab-content">
                    <div class="dashboard-header">
                        <div class="dashboard-header-left">
                            <h1>Configurações</h1>
                            <p class="dashboard-greeting">Personalize sua experiência</p>
                        </div>
                    </div>
                    <div class="dashboard-card" style="background: #221c35; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 20px; padding: 32px;">
                        <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 16px;">Configurações da Conta</h3>
                        <p style="color: rgba(255,255,255,0.6); font-size: 1rem;">Em breve: Personalização de perfil, notificações e preferências</p>
                    </div>
                </div>
            </main>
        `;

        this.initializeDashboard();
    }

    initializeDashboard() {
        // Tab navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Mobile sidebar
        const toggle = document.getElementById('mobileSidebarToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                        sidebar.classList.remove('open');
                    }
                }
            });
        }

        // Carregar dados
        this.loadProjects();
        this.loadTeamMembers();
        this.updateStats();
    }

    switchTab(tabName) {
        // Remover active de todos
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.dashboard-tab-content').forEach(content => content.classList.remove('active'));
        
        // Ativar tab selecionada
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(`${tabName}Tab`)?.classList.add('active');
    }

    // ============================================
    // PROJETOS
    // ============================================
    
    loadProjects() {
        this.projects = [
            { 
                id: 1, 
                name: 'The Abyss Bot', 
                icon: '🎮', 
                active: true, 
                description: 'Bot de RPG para Discord com sistema de batalhas e progressão',
                progress: 75,
                members: 2
            },
            { 
                id: 2, 
                name: 'Luma Bot', 
                icon: '🤖', 
                active: true, 
                description: 'Bot de moderação avançada com IA',
                progress: 60,
                members: 2
            },
            { 
                id: 3, 
                name: 'Dashboard Web', 
                icon: '🌐', 
                active: true, 
                description: 'Sistema de gerenciamento de projetos da equipe',
                progress: 85,
                members: 2
            }
        ];
        
        this.renderProjects();
    }

    renderProjects() {
        const allProjectsContainer = document.getElementById('allProjects');
        const recentProjectsContainer = document.getElementById('recentProjects');
        
        const projectsHTML = this.projects.map(project => `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-icon">${project.icon}</div>
                    <span class="project-status ${project.active ? 'status-active' : 'status-inactive'}">
                        ${project.active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span>📊 ${project.progress}% completo</span>
                    <span>👥 ${project.members} membros</span>
                </div>
                ${this.currentUser.role === 'admin' ? `
                    <div class="project-actions">
                        <button class="btn-project btn-primary" onclick="dashboard.toggleProject(${project.id})">
                            ${project.active ? '⏸️ Pausar' : '▶️ Ativar'}
                        </button>
                        <button class="btn-project btn-secondary">✏️ Editar</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
        
        if (allProjectsContainer) allProjectsContainer.innerHTML = projectsHTML;
        if (recentProjectsContainer) {
            const activeProjects = this.projects.filter(p => p.active).slice(0, 3);
            recentProjectsContainer.innerHTML = activeProjects.map(project => `
                <div class="project-card">
                    <div class="project-header">
                        <div class="project-icon">${project.icon}</div>
                        <span class="project-status status-active">Ativo</span>
                    </div>
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <span>📊 ${project.progress}% completo</span>
                    </div>
                </div>
            `).join('');
        }
    }

    toggleProject(projectId) {
        if (this.currentUser?.role !== 'admin') {
            alert('Apenas administradores podem ativar/desativar projetos');
            return;
        }
        
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.active = !project.active;
            this.renderProjects();
            this.updateStats();
        }
    }

    // ============================================
    // EQUIPE
    // ============================================
    
    loadTeamMembers() {
        this.teamMembers = [
            { id: 1, name: 'Raul Leite', role: 'Founder & Lead Dev', avatar: '👨‍💻', status: 'online' },
            { id: 2, name: 'ImSeleverr', role: 'Co-Founder & Dev', avatar: '👨‍💼', status: 'online' }
        ];
        
        this.renderTeamMembers();
    }

    renderTeamMembers() {
        const container = document.getElementById('teamMembers');
        if (!container) return;
        
        container.innerHTML = this.teamMembers.map(member => `
            <div class="team-card">
                <div class="member-avatar">${member.avatar}</div>
                <h3 class="member-name">${member.name}</h3>
                <p class="member-role">${member.role}</p>
                <span class="member-status">${member.status === 'online' ? '🟢 Online' : '⚫ Offline'}</span>
            </div>
        `).join('');
    }

    // ============================================
    // ESTATÍSTICAS
    // ============================================
    
    updateStats() {
        const activeProjects = this.projects.filter(p => p.active).length;
        const totalMembers = this.teamMembers.length;
        const avgProgress = Math.round(
            this.projects.reduce((sum, p) => sum + p.progress, 0) / this.projects.length
        );

        const statsContainer = document.getElementById('statsGrid');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #7c68ee 0%, #a78bfa 100%);">🚀</div>
                    <div class="stat-badge up">↑12%</div>
                </div>
                <div class="stat-number">${activeProjects}</div>
                <div class="stat-label">Projetos Ativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%);">👥</div>
                    <div class="stat-badge neutral">${totalMembers} Online</div>
                </div>
                <div class="stat-number">${totalMembers}</div>
                <div class="stat-label">Membros do Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);">💻</div>
                    <div class="stat-badge up">↑156</div>
                </div>
                <div class="stat-number">1.2K</div>
                <div class="stat-label">Commits este mês</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);">🏆</div>
                    <div class="stat-badge neutral">RanIDP</div>
                </div>
                <div class="stat-number">
                    <div style="font-size: 2.5rem;">🥇</div>
                </div>
                <div class="stat-label">Dev do Mês</div>
            </div>
        `;

        // Adicionar alertas críticos
        const alertsContainer = document.getElementById('alertsContainer');
        if (alertsContainer) {
            alertsContainer.innerHTML = `
                <div class="alert-card critical">
                    <div class="alert-icon critical">🚨</div>
                    <div class="alert-content">
                        <h3>Bug Crítico Detectado</h3>
                        <p>Falha no sistema de autenticação - API retornando erro 500</p>
                        <div class="alert-time">Há 15 minutos</div>
                    </div>
                    <div class="alert-actions">
                        <button class="btn-alert primary">Resolver</button>
                    </div>
                </div>
                <div class="alert-card warning">
                    <div class="alert-icon warning">⚠️</div>
                    <div class="alert-content">
                        <h3>3 PRs Aguardando Review</h3>
                        <p>Feature/dashboard-update, Fix/auth-bug, Update/dependencies</p>
                        <div class="alert-time">Há 2 horas</div>
                    </div>
                    <div class="alert-actions">
                        <button class="btn-alert primary">Ver PRs</button>
                    </div>
                </div>
            `;
        }
    }

    // ============================================
    // LOGOUT
    // ============================================
    
    logout() {
        if (confirm('Deseja realmente sair?')) {
            localStorage.removeItem('authToken');
            this.currentUser = null;
            this.showLoginForm();
        }
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboard = new CompleteDashboard();
    });
} else {
    window.dashboard = new CompleteDashboard();
}
