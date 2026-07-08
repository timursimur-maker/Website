const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const caption = document.getElementById('caption');
const closeButton = document.getElementById('closeLightbox');

if (lightbox && lightboxImage && closeButton) {
  function openLightboxFromImage(image, fullSrc = null) {
    lightboxImage.src = fullSrc || image.src;
    lightboxImage.alt = image.alt || '';
    if (caption) caption.innerHTML = '';

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  }

  document.querySelectorAll('.work').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (image) openLightboxFromImage(image);
    });
  });

  document.querySelectorAll('.hero-trigger').forEach((button) => {
    button.addEventListener('click', () => {
      const image = button.querySelector('img');
      if (image) openLightboxFromImage(image, button.dataset.full || null);
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}
