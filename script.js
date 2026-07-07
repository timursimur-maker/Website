const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const caption = document.getElementById('caption');
const closeButton = document.getElementById('closeLightbox');

if (lightbox && lightboxImage && caption && closeButton) {


function openLightbox(button) {
  const image = button.querySelector('img');
  const title = button.dataset.title || '';
  const year = button.dataset.year || '';
  const note = button.dataset.note || '';

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  const parts = [title, year, note].filter(Boolean);
  caption.innerHTML = parts.length ? parts.join('<br>') : '';

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
  button.addEventListener('click', () => openLightbox(button));
});

closeButton.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

}
