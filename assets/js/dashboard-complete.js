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
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            
            /* Dashboard Wrapper */
            .dashboard-wrapper {
                display: flex;
                min-height: 100vh;
                background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
            }

            /* Sidebar */
            .dashboard-sidebar {
                width: 280px;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 30px 20px;
                display: flex;
                flex-direction: column;
                gap: 30px;
                position: fixed;
                height: 100vh;
                overflow-y: auto;
                z-index: 1000;
            }

            .sidebar-brand {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .sidebar-brand-icon { font-size: 2rem; }
            
            .sidebar-brand-text {
                display: flex;
                flex-direction: column;
            }

            .sidebar-brand-name {
                font-size: 1.2rem;
                font-weight: 700;
                color: #fff;
            }

            .sidebar-brand-tagline {
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.6);
            }

            .sidebar-nav {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .sidebar-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 15px;
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                border-radius: 10px;
                transition: all 0.3s ease;
                font-size: 0.95rem;
                cursor: pointer;
            }

            .sidebar-link:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .sidebar-link.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff;
            }

            .sidebar-user {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                margin-top: auto;
            }

            .user-avatar {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }

            .user-info {
                flex: 1;
            }

            .user-name {
                font-weight: 600;
                color: #fff;
                font-size: 0.95rem;
            }

            .user-role {
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.6);
            }

            .btn-logout {
                background: rgba(245, 87, 108, 0.2);
                color: #f5576c;
                border: none;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .btn-logout:hover {
                background: rgba(245, 87, 108, 0.3);
                transform: scale(1.05);
            }

            /* Main Content */
            .dashboard-main {
                flex: 1;
                margin-left: 280px;
                padding: 40px;
            }

            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }

            .dashboard-title {
                font-size: 2rem;
                color: #fff;
                font-weight: 700;
            }

            .dashboard-greeting {
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.8);
                margin-top: 5px;
            }

            /* Tabs */
            .dashboard-tab-content {
                display: none;
            }

            .dashboard-tab-content.active {
                display: block;
            }

            /* Cards */
            .dashboard-card {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 30px;
                margin-bottom: 20px;
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
            }

            .btn-project:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            /* Team Members */
            .team-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }

            .team-card {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 25px;
                text-align: center;
            }

            .member-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin: 0 auto 15px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }

            .member-name {
                font-size: 1.1rem;
                color: #fff;
                font-weight: 600;
                margin-bottom: 5px;
            }

            .member-role {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.9rem;
                margin-bottom: 10px;
            }

            .member-status {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                background: rgba(76, 175, 80, 0.2);
                color: #4caf50;
            }

            /* Mobile */
            .mobile-sidebar-toggle {
                display: none;
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1001;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
                font-size: 1.5rem;
            }

            @media (max-width: 768px) {
                .dashboard-sidebar {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .dashboard-sidebar.open {
                    transform: translateX(0);
                }

                .dashboard-main {
                    margin-left: 0;
                    padding: 80px 20px 20px;
                }

                .mobile-sidebar-toggle {
                    display: block;
                }

                .stats-grid {
                    grid-template-columns: 1fr;
                }

                .team-grid {
                    grid-template-columns: 1fr;
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
                        <div class="sidebar-brand-tagline">Dev Team</div>
                    </div>
                </div>

                <nav class="sidebar-nav">
                    <a class="sidebar-link active" data-tab="overview">
                        <span>📊</span> Overview
                    </a>
                    <a class="sidebar-link" data-tab="projects">
                        <span>🚀</span> Projetos
                    </a>
                    <a class="sidebar-link" data-tab="team">
                        <span>👥</span> Equipe
                    </a>
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
                    <button class="btn-logout" id="logoutBtn">🚪</button>
                </div>
            </aside>

            <main class="dashboard-main">
                <div id="overviewTab" class="dashboard-tab-content active">
                    <div class="dashboard-header">
                        <div>
                            <h1 class="dashboard-title">Dashboard</h1>
                            <p class="dashboard-greeting">Bem-vindo, ${this.currentUser.name}! 👋</p>
                        </div>
                    </div>

                    <div class="stats-grid" id="statsGrid">
                        <!-- Stats serão carregadas aqui -->
                    </div>

                    <div class="dashboard-card">
                        <h3 class="card-title">Projetos Recentes</h3>
                        <div class="projects-grid" id="recentProjects">
                            <!-- Projetos recentes aqui -->
                        </div>
                    </div>
                </div>

                <div id="projectsTab" class="dashboard-tab-content">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">Projetos</h1>
                    </div>
                    <div class="projects-grid" id="allProjects">
                        <!-- Todos os projetos aqui -->
                    </div>
                </div>

                <div id="teamTab" class="dashboard-tab-content">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">Equipe</h1>
                    </div>
                    <div class="team-grid" id="teamMembers">
                        <!-- Membros da equipe aqui -->
                    </div>
                </div>

                <div id="settingsTab" class="dashboard-tab-content">
                    <div class="dashboard-header">
                        <h1 class="dashboard-title">Configurações</h1>
                    </div>
                    <div class="dashboard-card">
                        <h3 class="card-title">Configurações da Conta</h3>
                        <p style="color: rgba(255,255,255,0.7);">Em breve: Personalização de perfil, notificações e preferências</p>
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
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">🚀</div>
                <div class="stat-info">
                    <h3>${activeProjects}</h3>
                    <p>Projetos Ativos</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">👥</div>
                <div class="stat-info">
                    <h3>${totalMembers}</h3>
                    <p>Membros da Equipe</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">📊</div>
                <div class="stat-info">
                    <h3>${avgProgress}%</h3>
                    <p>Progresso Médio</p>
                </div>
            </div>
        `;
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
