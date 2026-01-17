// Dashboard JavaScript - Gerencia lógica do dashboard pós-login

// Verificar se usuário está logado
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('abyssUser') || 'null');
  if (!user) {
    // Redirecionar para login
    document.querySelector('[data-tab="home"]')?.click();
    return false;
  }
  return user;
}

// Carregar dados do dashboard
async function loadDashboard() {
  const user = checkAuth();
  if (!user) return;
  
  // Saudação personalizada
  const hour = new Date().getHours();
  let greeting = 'Boa noite';
  if (hour < 12) greeting = 'Bom dia';
  else if (hour < 18) greeting = 'Boa tarde';
  
  document.getElementById('dashboardGreeting').textContent = `${greeting}, ${user.username}! 👋`;
  document.getElementById('dashboardUserName').textContent = user.username;
  document.getElementById('dashboardUserEmail').textContent = user.email || '';
  document.getElementById('userAvatar').textContent = user.avatar || '🤖';
  
  // Role badge
  const roleBadge = document.getElementById('userRoleBadge');
  const roleNames = { viewer: 'Visualizador', editor: 'Editor', admin: 'Admin' };
  roleBadge.textContent = roleNames[user.role] || user.role;
  roleBadge.className = `badge badge-role badge-${user.role}`;
  
  // Verificar permissões para criar post
  const createPostBtn = document.getElementById('createPostBtn');
  const permissionNotice = document.getElementById('permissionNotice');
  
  if (user.role === 'editor' || user.role === 'admin') {
    createPostBtn.disabled = false;
    permissionNotice.style.display = 'none';
  } else {
    createPostBtn.disabled = true;
    permissionNotice.style.display = 'block';
  }
  
  // Carregar estatísticas
  try {
    const response = await fetch(`/api/users?id=${user.id}`);
    const data = await response.json();
    
    if (data.stats) {
      document.getElementById('userPostsCount').textContent = data.stats.posts || 0;
      document.getElementById('userStreakDays').textContent = data.stats.streak || 0;
      document.getElementById('userXP').textContent = data.stats.xp || 0;
      document.getElementById('userLevel').textContent = data.stats.level || 1;
      document.getElementById('userLevelBadge').textContent = `Nível ${data.stats.level || 1}`;
      
      // Atualizar missão
      const posts = data.stats.posts || 0;
      if (posts === 0) {
        document.getElementById('missionProgress').style.width = '0%';
        document.getElementById('missionProgressText').textContent = '0/1';
      } else {
        document.getElementById('missionProgress').style.width = '100%';
        document.getElementById('missionProgressText').textContent = '1/1';
        document.getElementById('missionTitle').textContent = 'Missão Completa! ✅';
        document.getElementById('missionDescription').textContent = 'Parabéns! Continue criando conteúdo.';
      }
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
  
  // Preencher formulário de contato
  document.getElementById('contactName').value = user.username;
  document.getElementById('contactEmail').value = user.email || '';
}

// Formulário de contato
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btnText = document.getElementById('contactBtnText');
  const btnLoading = document.getElementById('contactBtnLoading');
  const feedback = document.getElementById('contactFeedback');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  
  if (!name || !email || !message) {
    feedback.textContent = '❌ Todos os campos são obrigatórios';
    feedback.className = 'form-feedback error';
    feedback.style.display = 'block';
    return;
  }
  
  // Mostrar loading
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled = true;
  feedback.style.display = 'none';
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      feedback.textContent = '✅ ' + data.message;
      feedback.className = 'form-feedback success';
      feedback.style.display = 'block';
      
      // Limpar formulário
      document.getElementById('contactMessage').value = '';
      
      // Adicionar à atividade
      addActivity('💬 Mensagem de contato enviada', 'Agora');
      
      // Mostrar notificação
      showNotification('Mensagem enviada com sucesso!', 'success');
    } else {
      throw new Error(data.error || 'Erro ao enviar mensagem');
    }
  } catch (error) {
    feedback.textContent = '❌ ' + error.message;
    feedback.className = 'form-feedback error';
    feedback.style.display = 'block';
  } finally {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  }
});

// Adicionar atividade à lista
function addActivity(text, time) {
  const activityList = document.getElementById('activityList');
  const activity = document.createElement('div');
  activity.className = 'activity-item';
  activity.innerHTML = `
    <span class="activity-icon">✨</span>
    <div class="activity-details">
      <p>${text}</p>
      <span class="activity-time">${time}</span>
    </div>
  `;
  activityList.insertBefore(activity, activityList.firstChild);
  
  // Limitar a 5 atividades
  while (activityList.children.length > 5) {
    activityList.removeChild(activityList.lastChild);
  }
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  const container = document.getElementById('systemNotifications');
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
    <span class="notification-message">${message}</span>
  `;
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('notification-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Event listeners
document.getElementById('explorePosts')?.addEventListener('click', () => {
  document.querySelector('[data-tab="home"]')?.click();
});

document.getElementById('changeAvatarBtn')?.addEventListener('click', () => {
  const avatars = ['🤖', '👾', '🎮', '💀', '🔥', '⚡', '🌙', '🌟', '👻', '🦄'];
  const currentUser = JSON.parse(localStorage.getItem('abyssUser'));
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
  currentUser.avatar = randomAvatar;
  localStorage.setItem('abyssUser', JSON.stringify(currentUser));
  document.getElementById('userAvatar').textContent = randomAvatar;
  showNotification('Avatar atualizado!', 'success');
});

// Carregar dashboard ao abrir a aba
document.querySelector('[data-tab="dashboard"]')?.addEventListener('click', loadDashboard);

// Carregar ao iniciar se já estiver na aba
if (document.getElementById('dashboard')?.style.display !== 'none') {
  loadDashboard();
}
