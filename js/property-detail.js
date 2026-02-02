// Property Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initScrollAnimations();
    initPropertyDescriptionToggle();
});

// Gallery Lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (!galleryItems.length || !lightbox || !lightboxImage) {
        return;
    }
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentImageIndex = index;
            showLightbox();
        });
    });
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Previous image
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        });
    }
    
    // Next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightboxImage();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightboxImage();
        }
    });
    
    function showLightbox() {
        if (lightbox && lightboxImage) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateLightboxImage();
        }
    }
    
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function updateLightboxImage() {
        if (lightboxImage && images[currentImageIndex]) {
            lightboxImage.src = images[currentImageIndex].src;
            lightboxImage.alt = images[currentImageIndex].alt;
        }
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.gallery-item, .detail-item, .content-section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Property Description Toggle
function initPropertyDescriptionToggle() {
    const descriptionText = document.querySelector('.property-description-text');
    const toggleButton = document.querySelector('.property-description-toggle');
    
    if (!descriptionText || !toggleButton) {
        return;
    }
    
    // Zjistíme skutečnou výšku textu
    const originalHeight = descriptionText.scrollHeight;
    const maxHeight = 200; // Maximální výška pro zkrácený text
    
    // Pokud je text delší než maxHeight, přidáme možnost rozbalit
    if (originalHeight > maxHeight) {
        // Uložíme původní výšku
        descriptionText.setAttribute('data-original-height', originalHeight);
        
        // Přidáme třídu pro zkrácený stav
        descriptionText.classList.add('collapsed');
        
        // Nastavíme max-height pro plynulou animaci
        descriptionText.style.maxHeight = maxHeight + 'px';
        
        // Funkce pro přepínání
        toggleButton.addEventListener('click', function() {
            if (descriptionText.classList.contains('collapsed')) {
                // Rozbalit
                const fullHeight = descriptionText.getAttribute('data-original-height');
                descriptionText.style.maxHeight = fullHeight + 'px';
                descriptionText.classList.remove('collapsed');
                toggleButton.textContent = 'Zobrazit méně';
            } else {
                // Sbalit
                descriptionText.style.maxHeight = maxHeight + 'px';
                descriptionText.classList.add('collapsed');
                toggleButton.textContent = 'Zobrazit více';
            }
        });
    } else {
        // Pokud je text krátký, skryjeme tlačítko
        toggleButton.style.display = 'none';
    }
}

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .gallery-item.animate-in,
    .detail-item.animate-in,
    .content-section.animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .gallery-item:nth-child(1).animate-in { transition-delay: 0.1s; }
    .gallery-item:nth-child(2).animate-in { transition-delay: 0.2s; }
    .gallery-item:nth-child(3).animate-in { transition-delay: 0.3s; }
    .gallery-item:nth-child(4).animate-in { transition-delay: 0.4s; }
    .gallery-item:nth-child(5).animate-in { transition-delay: 0.5s; }
    .gallery-item:nth-child(6).animate-in { transition-delay: 0.6s; }
`;
document.head.appendChild(style);
