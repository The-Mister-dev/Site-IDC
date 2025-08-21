// Lightbox functionality for gallery page

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription || !lightboxClose) {
        console.log('Lightbox elements not found');
        return;
    }

    // Open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.gallery-info h3').textContent;
            const description = this.querySelector('.gallery-info p').textContent;

            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;

            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Focus management
            lightboxClose.focus();
        });
    });

    // Close lightbox functions
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Close lightbox events
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });

    // Navigate between images
    function navigateLightbox(direction) {
        const currentSrc = lightboxImage.src;
        const currentIndex = Array.from(galleryItems).findIndex(item => {
            const img = item.querySelector('img');
            return img.src === currentSrc;
        });

        let nextIndex = currentIndex + direction;
        
        if (nextIndex < 0) {
            nextIndex = galleryItems.length - 1;
        } else if (nextIndex >= galleryItems.length) {
            nextIndex = 0;
        }

        const nextItem = galleryItems[nextIndex];
        const nextImg = nextItem.querySelector('img');
        const nextTitle = nextItem.querySelector('.gallery-info h3').textContent;
        const nextDescription = nextItem.querySelector('.gallery-info p').textContent;

        lightboxImage.src = nextImg.src;
        lightboxImage.alt = nextImg.alt;
        lightboxTitle.textContent = nextTitle;
        lightboxDescription.textContent = nextDescription;
    }

    // Add navigation arrows to lightbox
    const leftArrow = document.createElement('button');
    leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftArrow.className = 'lightbox-nav lightbox-nav-left';
    leftArrow.setAttribute('aria-label', 'Image précédente');
    leftArrow.addEventListener('click', () => navigateLightbox(-1));

    const rightArrow = document.createElement('button');
    rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightArrow.className = 'lightbox-nav lightbox-nav-right';
    rightArrow.setAttribute('aria-label', 'Image suivante');
    rightArrow.addEventListener('click', () => navigateLightbox(1));

    lightbox.appendChild(leftArrow);
    lightbox.appendChild(rightArrow);

    // Add CSS for navigation arrows
    const style = document.createElement('style');
    style.textContent = `
        .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            padding: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-nav:hover {
            background: rgba(255, 215, 0, 0.8);
            color: black;
            transform: translateY(-50%) scale(1.1);
        }
        
        .lightbox-nav-left {
            left: 2rem;
        }
        
        .lightbox-nav-right {
            right: 2rem;
        }
        
        @media (max-width: 768px) {
            .lightbox-nav {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
                padding: 0.75rem;
            }
            
            .lightbox-nav-left {
                left: 1rem;
            }
            
            .lightbox-nav-right {
                right: 1rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Touch/swipe support for mobile
    let startX = 0;
    let startY = 0;

    lightbox.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = startX - endX;
        const deltaY = startY - endY;

        // Minimum swipe distance
        const minSwipeDistance = 50;

        // Check if horizontal swipe is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swiped left, show next image
                    navigateLightbox(1);
                } else {
                    // Swiped right, show previous image
                    navigateLightbox(-1);
                }
            }
        }

        startX = 0;
        startY = 0;
    }, { passive: true });

    console.log('Lightbox functionality loaded');
});