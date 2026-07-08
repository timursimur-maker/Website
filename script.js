const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeButton = document.getElementById('closeLightbox');
const caption = document.getElementById('caption');

function openLightbox(src, alt = '') {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  if (caption) caption.textContent = '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImage.src = '';
}

document.querySelectorAll('.work, .hero-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    if (!image) return;
    openLightbox(button.dataset.full || image.getAttribute('src'), image.getAttribute('alt') || '');
  });
});

if (closeButton) closeButton.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
