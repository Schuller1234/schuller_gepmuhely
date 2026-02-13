// ==========================================
// MOBILE MENU FUNCTIONALITY
// ==========================================
function toggleMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMobile.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// ==========================================
// SMOOTH SCROLL NAVIGATION
// ==========================================
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const menuToggle = document.querySelector('.menu-toggle');
        const navMobile = document.querySelector('.nav-mobile');
        if (navMobile.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ==========================================
// HERO CAROUSEL
// ==========================================
let currentImageIndex = 0;
let carouselImages = [];
let carouselInterval;
let scrollLockY = 0;

function initCarousel() {
    carouselImages = document.querySelectorAll('.hero-carousel img');
    
    if (carouselImages.length === 0) return;
    
    // Set first image as active
    carouselImages[0].classList.add('active');
    
    // Start carousel
    startCarousel();
}

function nextImage() {
    if (carouselImages.length === 0) return;
    
    // Remove active class from current image
    carouselImages[currentImageIndex].classList.remove('active');
    
    // Move to next image
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    
    // Add active class to new image
    carouselImages[currentImageIndex].classList.add('active');
}

function startCarousel() {
    // Change image every 5 seconds
    carouselInterval = setInterval(nextImage, 3000);
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Pause carousel when user is not viewing the page
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopCarousel();
    } else {
        startCarousel();
    }
});

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
let lastScrollTop = 0;

function handleScroll() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
}

// Throttle scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            handleScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const emailRecipient = 'info@schuller-gepmuhely.hu';
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage('Kérjük töltse ki az összes kötelező mezőt.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('Kérjük adjon meg érvényes email címet.', 'error');
            return;
        }
        
        // Simulate form submission
        const emailSubject = 'Kapcsolatfelvétel a Schuller Gépműhely oldalról';
        const emailBody = `Név: ${formData.name}\nEmail: ${formData.email}\nTelefon: ${formData.phone || '-'}\n\nÜzenet:\n${formData.message}`;

        // Open default mail client with prefilled email
        const mailtoLink = `mailto:${encodeURIComponent(emailRecipient)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;

        showFormMessage('Megnyitottuk az email klienst a küldéshez.', 'success');
        contactForm.reset();
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ==========================================
// CLOSE MOBILE MENU ON OUTSIDE CLICK
// ==========================================
document.addEventListener('click', function(event) {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    
    // Check if click is outside header and menu is open
    if (!header.contains(event.target) && navMobile.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all service cards and portfolio cards
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==========================================
// PORTFOLIO FULLSCREEN MODAL
// ==========================================
function initPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    const modalImage = modal ? modal.querySelector('.portfolio-modal-image') : null;
    const closeButton = modal ? modal.querySelector('.portfolio-modal-close') : null;
    const cards = document.querySelectorAll('.portfolio-card');

    if (!modal || !modalImage || !closeButton || cards.length === 0) return;

    const getScrollbarWidth = () => {
        return window.innerWidth - document.documentElement.clientWidth;
    };

    const lockBodyScroll = () => {
        scrollLockY = window.scrollY || window.pageYOffset;
        const scrollbarWidth = getScrollbarWidth();

        document.body.style.top = `-${scrollLockY}px`;
        document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
        document.body.classList.add('modal-open');
    };

    const unlockBodyScroll = () => {
        const restoreY = scrollLockY || 0;
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        document.body.style.paddingRight = '';

        const previousScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';

        requestAnimationFrame(() => {
            window.scrollTo({ top: restoreY, left: 0, behavior: 'auto' });

            requestAnimationFrame(() => {
                document.documentElement.style.scrollBehavior = previousScrollBehavior || '';
            });
        });
    };

    const openModal = (image) => {
        modalImage.src = image.src;
        modalImage.alt = image.alt || 'Portfólió kép';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        lockBodyScroll();
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalImage.src = '';
        modalImage.alt = '';

        unlockBodyScroll();

        const navMobile = document.querySelector('.nav-mobile');
        if (navMobile && navMobile.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    cards.forEach(card => {
        const img = card.querySelector('img');
        if (!img) return;

        const handleOpen = () => openModal(img);

        card.addEventListener('click', handleOpen);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpen();
            }
        });

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', img.alt ? `Kép megnyitása: ${img.alt}` : 'Kép megnyitása');
    });

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    let touchStartY = null;
    let isPinching = false;

    modal.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            isPinching = true;
            return;
        }
        isPinching = false;
        touchStartY = event.touches[0].clientY;
    });

    modal.addEventListener('touchmove', (event) => {
        if (isPinching || touchStartY === null) return;
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - touchStartY;

        // Close on a quick downward swipe for mobile comfort
        if (deltaY > 80) {
            closeModal();
            touchStartY = null;
        }
    });

    modal.addEventListener('touchend', () => {
        touchStartY = null;
        isPinching = false;
    });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initCarousel();
    initContactForm();
    initScrollAnimations();
    initLazyLoading();
    initPortfolioModal();
    
    // Initial header state
    handleScroll();
    
    console.log('Schuller Gépműhely - Website Loaded Successfully');
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Preload critical images
window.addEventListener('load', function() {
    const heroImages = document.querySelectorAll('.hero-carousel img');
    heroImages.forEach(img => {
        if (!img.complete) {
            img.loading = 'eager';
        }
    });
});
