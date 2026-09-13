// ─────────────────────────────────────────────────────────
// 🎨 UI Components — DOM Generators, Lightbox & Particles
// Fiesta de Cumpleaños de Alison 🎸🎂
// ─────────────────────────────────────────────────────────

// ─── Create Message Card ───
export function createMessageCard(data) {
  const card = document.createElement('div');
  card.className = 'wall-card message-card fade-in';

  // Avatar with initials
  const initials = data.name
    ? data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '🎸';

  const dateStr = data.timestamp
    ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('es-PE', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : 'Reciente';

  card.innerHTML = `
    <div class="card-header">
      <div class="card-avatar">${initials}</div>
      <div class="card-info">
        <span class="card-name">${escapeHtml(data.name)}</span>
        <span class="card-date">${dateStr}</span>
      </div>
    </div>
    <div class="card-body">
      <p class="card-message">${escapeHtml(data.message)}</p>
    </div>
  `;

  return card;
}

// ─── Create Photo Card ───
export function createPhotoCard(data, onImageClick) {
  const card = document.createElement('div');
  card.className = 'wall-card photo-card fade-in';

  const dateStr = data.timestamp
    ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('es-PE', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : 'Reciente';

  const initials = data.name
    ? data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '📷';

  card.innerHTML = `
    <div class="card-header">
      <div class="card-avatar">${initials}</div>
      <div class="card-info">
        <span class="card-name">${escapeHtml(data.name || 'Anónimo')}</span>
        <span class="card-date">${dateStr}</span>
      </div>
    </div>
    <div class="card-photo-container">
      ${data.photoUrl
        ? `<img src="${data.photoUrl}" alt="Foto de ${escapeHtml(data.name || 'invitado')}" class="card-photo" loading="lazy" />`
        : `<div class="card-photo-placeholder">📷 Cargando foto...</div>`
      }
    </div>
  `;

  // Lightbox interaction
  if (data.photoUrl) {
    const img = card.querySelector('.card-photo');
    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        if (onImageClick) onImageClick(data.photoUrl);
      });
    }
  }

  return card;
}

// ─── Create Video Card ───
export function createVideoCard(data) {
  const card = document.createElement('div');
  card.className = 'wall-card video-card fade-in';

  const dateStr = data.timestamp
    ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('es-PE', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : 'Reciente';

  const initials = data.name
    ? data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '🎥';

  card.innerHTML = `
    <div class="card-header">
      <div class="card-avatar">${initials}</div>
      <div class="card-info">
        <span class="card-name">${escapeHtml(data.name || 'Anónimo')}</span>
        <span class="card-date">${dateStr}</span>
      </div>
    </div>
    <div class="card-video-container">
      ${data.videoUrl
        ? `<video src="${data.videoUrl}" controls preload="metadata" class="card-video"></video>`
        : `<div class="card-video-placeholder">🎥 Cargando video...</div>`
      }
    </div>
  `;

  return card;
}

// ─── Empty State ───
export function createEmptyState(type) {
  const emojis = { messages: '💌', photos: '📷', videos: '🎥' };
  const labels = {
    messages: '¡Sé el primero en dejar un mensaje para Alison!',
    photos: '¡Comparte una foto para Alison!',
    videos: '¡Sube un video para Alison!'
  };

  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <span class="empty-emoji">${emojis[type] || '🎸'}</span>
    <p>${labels[type] || 'No hay contenido aún'}</p>
  `;
  return div;
}

// ─── Lightbox ───
export function openLightbox(imageUrl) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageUrl;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ─── Floating Particles ───
const ROCK_EMOJIS = ['🎸', '🤘', '⚡', '🎵', '🔥', '🎶', '💀', '🖤', '⭐', '🎤'];

export function spawnParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.textContent = ROCK_EMOJIS[Math.floor(Math.random() * ROCK_EMOJIS.length)];
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDuration = (6 + Math.random() * 8) + 's';
  particle.style.opacity = 0.15 + Math.random() * 0.35;
  particle.style.fontSize = (16 + Math.random() * 20) + 'px';
  document.body.appendChild(particle);

  particle.addEventListener('animationend', () => particle.remove());
}

export function startParticles() {
  // Spawn initial batch
  for (let i = 0; i < 8; i++) {
    setTimeout(() => spawnParticle(), i * 400);
  }
  // Continue spawning
  setInterval(spawnParticle, 2000);
}

// ─── Countdown Timer ───
export function startCountdown(targetDate) {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-mins');
  const secsEl = document.getElementById('countdown-secs');

  function update() {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '🎉';
      if (hoursEl) hoursEl.textContent = '¡HOY!';
      if (minsEl) minsEl.textContent = '🎉';
      if (secsEl) secsEl.textContent = '';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ─── Rock Music Controller (Audio File Player) ───
import musicUrl from './assets/music.mp3?url';

export function createRockMusic() {
  const audio = new Audio(musicUrl);
  audio.loop = true;
  audio.volume = 0.5;
  let isPlaying = false;

  function start() {
    audio.play().then(() => {
      isPlaying = true;
    }).catch(() => {
      // Browser blocked autoplay, user needs to click
      isPlaying = false;
    });
  }

  function stop() {
    audio.pause();
    isPlaying = false;
  }

  function toggle() {
    if (isPlaying) {
      stop();
    } else {
      audio.play().then(() => {
        isPlaying = true;
      }).catch(() => {
        isPlaying = false;
      });
    }
    return isPlaying;
  }

  function setVolume(vol) {
    audio.volume = vol;
  }

  return { start, stop, toggle, setVolume, get isPlaying() { return isPlaying; } };
}

// ─── Helper: Escape HTML ───
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
