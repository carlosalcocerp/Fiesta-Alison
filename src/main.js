// ─────────────────────────────────────────────────────────
// 🎯 Main Orchestrator — Events, Listeners & Initialization
// Fiesta de Cumpleaños de Alisson 🎸🎂
// ─────────────────────────────────────────────────────────

import {
  submitMessage,
  submitPhoto,
  submitVideo,
  listenToVerified,
  MESSAGES_COL,
  PHOTOS_COL,
  VIDEOS_COL,
  MAX_PHOTO_SIZE_MB,
  MAX_VIDEO_SIZE_MB
} from './messages.js';

import {
  createMessageCard,
  createPhotoCard,
  createVideoCard,
  createEmptyState,
  openLightbox,
  closeLightbox,
  startParticles,
  startCountdown,
  createRockMusic
} from './ui.js';

import './style.css';

// ─── DOM Ready ───
document.addEventListener('DOMContentLoaded', () => {
  // ─── Initialize Rock Music (Activated by default) ───
  const music = createRockMusic();
  const musicBtn = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  let musicEnabled = true; // Default: ON

  function updateMusicUI(playing) {
    if (musicBtn) musicBtn.classList.toggle('playing', playing);
    if (musicIcon) musicIcon.textContent = playing ? '🎵' : '🔇';
  }

  // Attempt autoplay immediately
  music.start().then((playing) => {
    if (playing) {
      updateMusicUI(true);
    }
  });

  // Browser Autoplay Fallback: Start immediately upon first user gesture anywhere
  const userGestureEvents = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
  function onFirstUserGesture() {
    if (musicEnabled && !music.isPlaying) {
      music.start().then((playing) => {
        if (playing) updateMusicUI(true);
      });
    }
    userGestureEvents.forEach((evt) => {
      window.removeEventListener(evt, onFirstUserGesture, { capture: true });
    });
  }

  userGestureEvents.forEach((evt) => {
    window.addEventListener(evt, onFirstUserGesture, { capture: true, passive: true });
  });

  // Music toggle button interaction
  if (musicBtn) {
    musicBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (music.isPlaying) {
        music.stop();
        musicEnabled = false;
        updateMusicUI(false);
      } else {
        musicEnabled = true;
        const playing = await music.start();
        updateMusicUI(playing);
      }
    });
  }

  // ─── Countdown to Oct 3, 2026 ───
  startCountdown('2026-10-03T20:00:00');

  // ─── Particles ───
  startParticles();

  // ─── Lightbox ───
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ─── Form Tab Switching ───
  const formTabs = document.querySelectorAll('.form-tab');
  const formPanels = document.querySelectorAll('.form-panel');

  formTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      formTabs.forEach(t => t.classList.remove('active'));
      formPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(`form-${tab.dataset.form}`);
      if (target) target.classList.add('active');
    });
  });

  // ─── Wall Tab Switching ───
  const wallTabs = document.querySelectorAll('.wall-tab');
  const wallGrids = document.querySelectorAll('.wall-grid');

  wallTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      wallTabs.forEach(t => t.classList.remove('active'));
      wallGrids.forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(`grid-${tab.dataset.wall}`);
      if (target) target.classList.add('active');
    });
  });

  // ─── Photo Preview & Size Validation ───
  const photoInput = document.getElementById('photo-file');
  const photoPreview = document.getElementById('photo-preview');
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file) {
        if (photoPreview) {
          photoPreview.innerHTML = '';
          photoPreview.classList.remove('has-preview');
        }
        return;
      }

      // Check max photo size (10 MB)
      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        showBanner('error', `⚠️ La foto pesa ${sizeMB} MB y supera el límite de ${MAX_PHOTO_SIZE_MB} MB. Por favor elige una más liviana.`);
        photoInput.value = '';
        if (photoPreview) {
          photoPreview.innerHTML = '';
          photoPreview.classList.remove('has-preview');
        }
        return;
      }

      if (photoPreview) {
        photoPreview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Preview" />`;
        photoPreview.classList.add('has-preview');
      }
    });
  }

  // ─── Video Preview & Size Validation ───
  const videoInput = document.getElementById('video-file');
  const videoPreview = document.getElementById('video-preview');
  if (videoInput) {
    videoInput.addEventListener('change', () => {
      const file = videoInput.files[0];
      if (!file) {
        if (videoPreview) {
          videoPreview.innerHTML = '';
          videoPreview.classList.remove('has-preview');
        }
        return;
      }

      // Check max video size (50 MB)
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        showBanner('error', `⚠️ El video pesa ${sizeMB} MB y supera el límite de ${MAX_VIDEO_SIZE_MB} MB. Por favor elige un video más corto o comprimido.`);
        videoInput.value = '';
        if (videoPreview) {
          videoPreview.innerHTML = '';
          videoPreview.classList.remove('has-preview');
        }
        return;
      }

      if (videoPreview) {
        videoPreview.innerHTML = `<video src="${URL.createObjectURL(file)}" controls></video>`;
        videoPreview.classList.add('has-preview');
      }
    });
  }

  // ─── Submit Message Form ───
  const msgForm = document.getElementById('message-form');
  if (msgForm) {
    msgForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('msg-name').value.trim();
      const message = document.getElementById('msg-text').value.trim();
      if (!name || !message) return;

      const submitBtn = msgForm.querySelector('button[type="submit"]');
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Enviando...';
        await submitMessage(name, message);
        msgForm.reset();
        showBanner('success', '🎸 ¡Mensaje enviado! ¡Rock on!');
      } catch (err) {
        console.error(err);
        showBanner('error', '❌ Error al enviar el mensaje');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '🤘 Enviar Mensaje';
      }
    });
  }

  // ─── Submit Photo Form ───
  const photoForm = document.getElementById('photo-form');
  if (photoForm) {
    photoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('photo-name').value.trim();
      const file = document.getElementById('photo-file').files[0];
      if (!name || !file) return;

      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        showBanner('error', `⚠️ La foto supera el límite de ${MAX_PHOTO_SIZE_MB} MB.`);
        return;
      }

      const submitBtn = photoForm.querySelector('button[type="submit"]');
      const progressBar = document.getElementById('photo-progress');
      const progressFill = document.getElementById('photo-progress-fill');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Subiendo...';
        if (progressBar) progressBar.classList.add('visible');

        await submitPhoto(name, file, (progress) => {
          if (progressFill) progressFill.style.width = progress + '%';
        });

        photoForm.reset();
        if (photoPreview) {
          photoPreview.innerHTML = '';
          photoPreview.classList.remove('has-preview');
        }
        if (progressBar) progressBar.classList.remove('visible');
        showBanner('success', '📷 ¡Foto subida! ¡Genial!');
      } catch (err) {
        console.error(err);
        showBanner('error', err.message || '❌ Error al subir la foto');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '📷 Subir Foto';
      }
    });
  }

  // ─── Submit Video Form ───
  const videoForm = document.getElementById('video-form');
  if (videoForm) {
    videoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('video-name').value.trim();
      const file = document.getElementById('video-file').files[0];
      if (!name || !file) return;

      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        showBanner('error', `⚠️ El video supera el límite de ${MAX_VIDEO_SIZE_MB} MB.`);
        return;
      }

      const submitBtn = videoForm.querySelector('button[type="submit"]');
      const progressBar = document.getElementById('video-progress');
      const progressFill = document.getElementById('video-progress-fill');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Subiendo...';
        if (progressBar) progressBar.classList.add('visible');

        await submitVideo(name, file, (progress) => {
          if (progressFill) progressFill.style.width = progress + '%';
        });

        videoForm.reset();
        if (videoPreview) {
          videoPreview.innerHTML = '';
          videoPreview.classList.remove('has-preview');
        }
        if (progressBar) progressBar.classList.remove('visible');
        showBanner('success', '🎥 ¡Video subido! ¡Increíble!');
      } catch (err) {
        console.error(err);
        showBanner('error', err.message || '❌ Error al subir el video');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '🎥 Subir Video';
      }
    });
  }

  // ─── Real-time Listeners ───
  const gridMessages = document.getElementById('grid-messages');
  const gridPhotos = document.getElementById('grid-photos');
  const gridVideos = document.getElementById('grid-videos');

  // Messages
  listenToVerified(MESSAGES_COL, (docs) => {
    if (!gridMessages) return;
    gridMessages.innerHTML = '';
    if (docs.length === 0) {
      gridMessages.appendChild(createEmptyState('messages'));
      return;
    }
    docs.forEach(doc => {
      gridMessages.appendChild(createMessageCard(doc));
    });
  });

  // Photos
  listenToVerified(PHOTOS_COL, (docs) => {
    if (!gridPhotos) return;
    gridPhotos.innerHTML = '';
    if (docs.length === 0) {
      gridPhotos.appendChild(createEmptyState('photos'));
      return;
    }
    docs.forEach(doc => {
      gridPhotos.appendChild(createPhotoCard(doc, openLightbox));
    });
  });

  // Videos
  listenToVerified(VIDEOS_COL, (docs) => {
    if (!gridVideos) return;
    gridVideos.innerHTML = '';
    if (docs.length === 0) {
      gridVideos.appendChild(createEmptyState('videos'));
      return;
    }
    docs.forEach(doc => {
      gridVideos.appendChild(createVideoCard(doc));
    });
  });

  // ─── Smooth Scroll for CTA ───
  const ctaBtn = document.getElementById('cta-scroll');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const target = document.getElementById('countdown-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ─── Scroll indicator ───
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const target = document.getElementById('countdown-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// ─── Banner Notification ───
function showBanner(type, message) {
  // Remove existing banners
  document.querySelectorAll('.notification-banner').forEach(b => b.remove());

  const banner = document.createElement('div');
  banner.className = `notification-banner ${type}-banner`;
  banner.innerHTML = `
    <span>${message}</span>
    <button class="banner-close" aria-label="Cerrar">✕</button>
  `;
  document.body.appendChild(banner);

  // Animate in
  requestAnimationFrame(() => banner.classList.add('show'));

  // Auto dismiss
  const timeout = setTimeout(() => banner.remove(), 5000);
  banner.querySelector('.banner-close').addEventListener('click', () => {
    clearTimeout(timeout);
    banner.remove();
  });
}
