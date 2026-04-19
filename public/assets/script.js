const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const user = tg.initDataUnsafe?.user;
const theme = tg.themeParams;

if (theme) {
  document.documentElement.style.setProperty('--bg', theme.bg_color || '#1a1a2e');
  document.documentElement.style.setProperty('--text', theme.text_color || '#f0f0f0');
  document.documentElement.style.setProperty('--accent', theme.button_color || '#e6b800');
}

if (user) {
  document.getElementById('user-name').textContent = user.first_name || 'PLAYER';
  document.getElementById('user-id').textContent = 'ID: ' + user.id;
  
  const avatarEl = document.getElementById('avatar');
  const initial = (user.first_name || 'P')[0].toUpperCase();
  avatarEl.textContent = initial;
  avatarEl.style.background = `hsl(${(user.id % 360)}, 60%, 40%)`;
  
  console.log("User:", user.first_name, user.last_name);
} else {
  document.getElementById('user-name').textContent = 'GUEST';
  document.getElementById('user-id').textContent = 'ID: --';
  document.getElementById('avatar').textContent = 'G';
}

document.querySelector('.status-value').textContent = tg.isExpanded ? 'READY' : 'STANDING BY';