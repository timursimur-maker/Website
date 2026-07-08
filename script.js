const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeButton = document.getElementById('closeLightbox');
const caption = document.getElementById('caption');

let lightboxItems = [];
let currentIndex = -1;
let touchStartX = 0;
let touchStartY = 0;
let controlsTimer = null;

const isTouchDevice = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

function ensureLightboxControls() {
  if (!lightbox) return;
  if (isTouchDevice()) {
    lightbox.classList.add('touch-lightbox');
    return;
  }

  if (!document.getElementById('prevLightbox')) {
    const prev = document.createElement('button');
    prev.id = 'prevLightbox';
    prev.className = 'lightbox-nav lightbox-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Vorheriges Bild');
    prev.textContent = '‹';
    lightbox.appendChild(prev);
  }

  if (!document.getElementById('nextLightbox')) {
    const next = document.createElement('button');
    next.id = 'nextLightbox';
    next.className = 'lightbox-nav lightbox-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Nächstes Bild');
    next.textContent = '›';
    lightbox.appendChild(next);
  }
}

function collectLightboxItems() {
  lightboxItems = Array.from(document.querySelectorAll('.hero-trigger, .work')).map((button) => {
    const image = button.querySelector('img');
    return {
      button,
      src: button.dataset.full || image?.getAttribute('src') || '',
      alt: image?.getAttribute('alt') || ''
    };
  }).filter((item) => item.src);
}

function updateNavVisibility() {
  const prev = document.getElementById('prevLightbox');
  const next = document.getElementById('nextLightbox');
  const show = lightboxItems.length > 1;
  if (prev) prev.hidden = !show;
  if (next) next.hidden = !show;
}

function showControls(autoHide = true) {
  if (!lightbox) return;
  lightbox.classList.add('controls-visible');
  if (controlsTimer) window.clearTimeout(controlsTimer);
  if (autoHide) {
    controlsTimer = window.setTimeout(() => {
      lightbox.classList.remove('controls-visible');
    }, 2300);
  }
}

function hideControls() {
  if (!lightbox) return;
  if (controlsTimer) window.clearTimeout(controlsTimer);
  lightbox.classList.remove('controls-visible');
}

function toggleControls() {
  if (!lightbox) return;
  if (lightbox.classList.contains('controls-visible')) {
    hideControls();
  } else {
    showControls(true);
  }
}

function showLightboxItem(index) {
  if (!lightbox || !lightboxImage || !lightboxItems.length) return;
  currentIndex = (index + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[currentIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  if (caption) caption.textContent = '';
  updateNavVisibility();
}

function openLightbox(indexOrSrc, alt = '') {
  if (!lightbox || !lightboxImage) return;

  if (typeof indexOrSrc === 'number') {
    showLightboxItem(indexOrSrc);
  } else {
    currentIndex = lightboxItems.findIndex((item) => item.src === indexOrSrc);
    if (currentIndex >= 0) {
      showLightboxItem(currentIndex);
    } else {
      lightboxImage.src = indexOrSrc;
      lightboxImage.alt = alt;
      if (caption) caption.textContent = '';
      updateNavVisibility();
    }
  }

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  hideControls();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  hideControls();
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImage.src = '';
  currentIndex = -1;
}

function nextLightboxImage() {
  if (!lightbox?.classList.contains('open') || lightboxItems.length < 2) return;
  showLightboxItem(currentIndex + 1);
  if (!isTouchDevice()) showControls(true);
}

function previousLightboxImage() {
  if (!lightbox?.classList.contains('open') || lightboxItems.length < 2) return;
  showLightboxItem(currentIndex - 1);
  if (!isTouchDevice()) showControls(true);
}

ensureLightboxControls();
collectLightboxItems();

document.querySelectorAll('.work, .hero-trigger').forEach((button, index) => {
  button.addEventListener('click', () => openLightbox(index));
});

if (closeButton) {
  closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    closeLightbox();
  });
}

document.getElementById('nextLightbox')?.addEventListener('click', (event) => {
  event.stopPropagation();
  nextLightboxImage();
});
document.getElementById('prevLightbox')?.addEventListener('click', (event) => {
  event.stopPropagation();
  previousLightboxImage();
});

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener('mousemove', () => {
    if (!isTouchDevice() && lightbox.classList.contains('open')) showControls(true);
  });

  lightbox.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    const diffX = touch.clientX - touchStartX;
    const diffY = touch.clientY - touchStartY;
    const isSwipe = Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY);

    if (isSwipe) {
      diffX < 0 ? nextLightboxImage() : previousLightboxImage();
      return;
    }

    toggleControls();
  }, { passive: true });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') nextLightboxImage();
  if (event.key === 'ArrowLeft') previousLightboxImage();
});
