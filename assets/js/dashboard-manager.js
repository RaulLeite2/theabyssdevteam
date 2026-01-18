// ============================================
// DASHBOARD MANAGER - THE ABYSS DEV TEAM
// ============================================

class DashboardManager {
    constructor() {
        this.API_URL = window.location.origin;
        this.currentUser = null;
        this.projects = [];
        this.tasks = [];
        this.teamMembers = [];
        
        this.init();
    }

    async init() {
        await this.checkAuthentication();
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
                this.updateUserInterface();
                this.initializeDashboard();
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
        document.querySelector('.dashboard-wrapper').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);">
                <div class="dashboard-card" style="max-width: 450px; width: 100%;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 3rem; margin-bottom: 15px;">⚡</div>
                        <h2 style="margin-bottom: 10px;">The Abyss Dashboard</h2>
                        <p style="color: rgba(255,255,255,0.6);">Acesso exclusivo para membros autorizados</p>
                    </div>
                    
                    <form id="loginForm">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: rgba(255,255,255,0.8); font-weight: 500;">Email</label>
                            <input type="email" id="loginEmail" required 
                                style="width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 1rem;"
                                placeholder="seu@email.com">
                        </div>
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; margin-bottom: 8px; color: rgba(255,255,255,0.8); font-weight: 500;">Senha</label>
                            <input type="password" id="loginPassword" required 
                                style="width: 100%; padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 1rem;"
                                placeholder="••••••••">
                        </div>
                        <div id="loginError" style="display: none; padding: 12px; background: rgba(245, 87, 108, 0.1); border: 1px solid rgba(245, 87, 108, 0.3); border-radius: 8px; color: #f5576c; margin-bottom: 20px; font-size: 0.9rem;"></div>
                        <button type="submit" class="dashboard-btn primary" style="width: 100%; padding: 14px; font-size: 1rem;" id="loginBtn">
                            🔐 Entrar
                        </button>
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
                localStorage.setItem('userEmail', data.user.email);
                location.reload();
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

    updateUserInterface() {
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        const greeting = document.getElementById('dashboardGreeting');
        
        if (userName) userName.textContent = this.currentUser.name;
        if (userRole) userRole.textContent = this.currentUser.role === 'admin' ? 'Administrador' : 'Membro';
        if (greeting) greeting.textContent = `Bem-vindo, ${this.currentUser.name}! 👋`;
        
        // Mostrar opções de admin
        if (this.currentUser.role === 'admin') {
            const addProjectBtn = document.getElementById('addProjectBtn');
            if (addProjectBtn) addProjectBtn.style.display = 'block';
        }
    }

    // ============================================
    // INICIALIZAÇÃO DO DASHBOARD
    // ============================================
    
    initializeDashboard() {
        // Tab navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Carregar dados
        this.loadProjects();
        this.loadTasks();
        this.loadTeamMembers();
        this.updateMetrics();
    }

    switchTab(tabName) {
        // Remover active de todos
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.dashboard-tab-content').forEach(content => content.classList.remove('active'));
        
        // Ativar tab selecionada
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(`${tabName}-tab`)?.classList.add('active');
    }

    logout() {
        if (confirm('Deseja realmente sair?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            location.reload();
        }
    }

    // ============================================
    // PROJETOS
    // ============================================
    
    loadProjects() {
        // Projetos mockados (substituir por chamada à API)
        this.projects = [
            { 
                id: 1, 
                name: 'The Abyss Bot', 
                icon: '🎮', 
                active: true, 
                description: 'Bot de RPG para Discord',
                status: 'Em Desenvolvimento',
                progress: 75,
                team: ['Raul Leite'],
                lastUpdate: '2 horas atrás'
            },
            { 
                id: 2, 
                name: 'Luma Bot', 
                icon: '🤖', 
                active: true, 
                description: 'Bot de moderação para Discord',
                status: 'Ativo',
                progress: 90,
                team: ['Raul Leite'],
                lastUpdate: '1 dia atrás'
            },
            { 
                id: 3, 
                name: 'Dashboard Web', 
                icon: '🌐', 
                active: true, 
                description: 'Sistema de gerenciamento da equipe',
                status: 'Em Desenvolvimento',
                progress: 60,
                team: ['Raul Leite'],
                lastUpdate: 'Agora mesmo'
            },
            { 
                id: 4, 
                name: 'API Custom', 
                icon: '⚙️', 
                active: false, 
                description: 'API RESTful para integração',
                status: 'Pausado',
                progress: 30,
                team: [],
                lastUpdate: '1 semana atrás'
            }
        ];
        
        this.renderProjects();
        this.updateProjectsMetrics();
    }

    renderProjects() {
        const container = document.getElementById('allProjects');
        const recentContainer = document.getElementById('recentProjects');
        
        if (!container) return;

        const projectsHTML = this.projects.map(project => `
            <div class="project-item" style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 15px; transition: all 0.3s ease;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div class="project-icon-small" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">
                        ${project.icon}
                    </div>
                    
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                            <h3 style="font-size: 1.2rem; margin: 0; color: #fff;">${project.name}</h3>
                            <span class="project-status" style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; ${project.active ? 'background: rgba(67, 233, 123, 0.2); color: #43e97b;' : 'background: rgba(128, 128, 128, 0.2); color: #aaa;'}">
                                ${project.active ? '● Ativo' : '○ Inativo'}
                            </span>
                        </div>
                        
                        <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem; margin: 0 0 12px 0;">${project.description}</p>
                        
                        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 0.85rem;">
                                <span>📊</span>
                                <span>${project.status}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 0.85rem;">
                                <span>⏰</span>
                                <span>${project.lastUpdate}</span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 8px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span style="font-size: 0.85rem; color: rgba(255,255,255,0.7);">Progresso</span>
                                <span style="font-size: 0.85rem; font-weight: 600; color: #fff;">${project.progress}%</span>
                            </div>
                            <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">
                                <div style="width: ${project.progress}%; height: 100%; background: linear-gradient(90deg, #43e97b, #38f9d7); border-radius: 10px; transition: width 0.5s ease;"></div>
                            </div>
                        </div>
                    </div>
                    
                    ${this.currentUser?.role === 'admin' ? `
                        <div class="project-actions" style="display: flex; flex-direction: column; gap: 8px;">
                            <button onclick="dashboard.toggleProject(${project.id})" class="dashboard-btn" style="padding: 8px 16px; font-size: 0.85rem;">
                                ${project.active ? '⏸️ Pausar' : '▶️ Ativar'}
                            </button>
                            <button onclick="dashboard.editProject(${project.id})" class="dashboard-btn" style="padding: 8px 16px; font-size: 0.85rem;">
                                ✏️ Editar
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = projectsHTML || '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 40px;">Nenhum projeto encontrado</p>';
        
        // Preview na visão geral
        if (recentContainer) {
            const activeProjects = this.projects.filter(p => p.active).slice(0, 3);
            recentContainer.innerHTML = activeProjects.length > 0 ? 
                activeProjects.map(p => `
                    <div class="project-item" style="padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: 1.5rem;">${p.icon}</div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 4px 0; font-size: 1rem;">${p.name}</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.6);">${p.status}</p>
                            </div>
                            <div style="font-size: 0.9rem; font-weight: 600; color: #43e97b;">${p.progress}%</div>
                        </div>
                    </div>
                `).join('') : 
                '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 20px;">Nenhum projeto ativo</p>';
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
            this.updateProjectsMetrics();
            
            // Salvar no servidor (implementar depois)
            console.log(`Projeto ${project.name} ${project.active ? 'ativado' : 'desativado'}`);
        }
    }

    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;
        
        alert(`Editar projeto: ${project.name}\n(Funcionalidade em desenvolvimento)`);
    }

    updateProjectsMetrics() {
        const activeCount = this.projects.filter(p => p.active).length;
        const element = document.getElementById('activeProjects');
        if (element) element.textContent = activeCount;
    }

    // ============================================
    // TAREFAS
    // ============================================
    
    loadTasks() {
        this.tasks = [
            { id: 1, title: 'Implementar sistema de autenticação', status: 'done', priority: 'high', assignee: 'Raul' },
            { id: 2, title: 'Criar dashboard de projetos', status: 'inprogress', priority: 'high', assignee: 'Raul' },
            { id: 3, title: 'Otimizar performance do bot', status: 'todo', priority: 'medium', assignee: 'Raul' },
            { id: 4, title: 'Documentar APIs', status: 'todo', priority: 'low', assignee: 'Equipe' }
        ];
        
        this.updateTasksMetrics();
    }

    updateTasksMetrics() {
        const completed = this.tasks.filter(t => t.status === 'done').length;
        const newTasks = this.tasks.filter(t => t.status === 'todo').length;
        const inProgress = this.tasks.filter(t => t.status === 'inprogress').length;
        
        const completedEl = document.getElementById('completedTasks');
        const newEl = document.getElementById('newTasks');
        const inProgressEl = document.getElementById('inProgressTasks');
        
        if (completedEl) completedEl.textContent = completed;
        if (newEl) newEl.textContent = newTasks;
        if (inProgressEl) inProgressEl.textContent = inProgress;
    }

    // ============================================
    // EQUIPE
    // ============================================
    
    loadTeamMembers() {
        this.teamMembers = [
            { 
                id: 1, 
                name: 'Raul Leite', 
                role: 'Founder & Lead Developer', 
                avatar: '👨‍💻', 
                status: 'online',
                email: 'raul@theabyss.dev'
            }
        ];
    }

    // ============================================
    // MÉTRICAS GERAIS
    // ============================================
    
    updateMetrics() {
        this.updateProjectsMetrics();
        this.updateTasksMetrics();
    }
}

// Inicializar dashboard
let dashboard;
window.addEventListener('DOMContentLoaded', () => {
    dashboard = new DashboardManager();
});
