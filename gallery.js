const galleryImages = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeBtn = document.getElementById('closeLightbox');

galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        lightboxImage.src = image.src
        lightbox.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImage) {
        lightbox.classList.remove('active');
    }
});