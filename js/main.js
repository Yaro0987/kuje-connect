// ===== Hero Slider =====
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
let currentSlide = 0;
let slideInterval;
const SLIDE_DURATION = 5000;

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startAutoplay() {
    if (slides.length === 0) return;
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        goToSlide(index);
        resetAutoplay();
    });
});

let touchStartX = 0;
let touchEndX = 0;
const sliderEl = document.querySelector('.hero-slider');

if (sliderEl) {
    sliderEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            nextSlide();
            resetAutoplay();
        } else if (touchEndX - touchStartX > 50) {
            prevSlide();
            resetAutoplay();
        }
    }, { passive: true });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay();
    }
});

if (sliderEl) {
    sliderEl.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderEl.addEventListener('mouseleave', startAutoplay);
}

startAutoplay();

// ===== Navbar scroll effect =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
    }
});

// ===== Hero Search =====
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box .btn');

function getSearchBase() {
    return 'businesses';
}

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = getSearchBase() + '?q=' + encodeURIComponent(query);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// ===== Businesses page search =====
const bizSearchInput = document.querySelector('.search-filters input[type="text"]');
const bizSearchBtn = document.querySelector('.search-filters .btn');

if (bizSearchBtn && bizSearchInput) {
    bizSearchBtn.addEventListener('click', () => {
        filterBusinesses();
    });
    bizSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterBusinesses();
    });
}

// ===== Filter sidebar (businesses page) =====
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

function filterBusinesses() {
    var cards = document.querySelectorAll('.business-card');
    var searchVal = '';
    var searchEl = document.querySelector('.search-filters input[type="text"]');
    if (searchEl) searchVal = searchEl.value.toLowerCase();

    var selectedCategories = [];
    var selectedRatings = [];
    filterCheckboxes.forEach(function(cb) {
        if (cb.checked) {
            var label = cb.closest('label') || cb.parentElement;
            var text = label ? label.textContent.toLowerCase() : '';
            if (text.includes('star') || text.includes('rating')) {
                selectedRatings.push(text);
            } else {
                selectedCategories.push(text);
            }
        }
    });

    cards.forEach(function(card) {
        var cardText = card.textContent.toLowerCase();
        var show = true;
        if (searchVal && cardText.indexOf(searchVal) === -1) show = false;
        card.style.display = show ? '' : 'none';
    });
}

filterCheckboxes.forEach(function(cb) {
    cb.addEventListener('change', filterBusinesses);
});

// ===== Favorite / Wishlist buttons =====
document.querySelectorAll('.wishlist-btn, .favorite-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('active');
        var icon = btn.querySelector('i');
        if (icon) {
            if (btn.classList.contains('active')) {
                icon.className = icon.className.replace('far', 'fas');
                showToast('Added to favorites!');
            } else {
                icon.className = icon.className.replace('fas', 'far');
                showToast('Removed from favorites');
            }
        }
    });
});

function showToast(message) {
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#1e3a5f;color:#fff;padding:14px 24px;border-radius:12px;z-index:10000;font-size:0.9rem;box-shadow:0 4px 20px rgba(0,0,0,0.25);animation:slideInRight 0.3s ease;';
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-item').forEach(function(item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    question.style.cursor = 'pointer';
    question.addEventListener('click', function() {
        var answer = item.querySelector('.faq-answer');
        if (!answer) return;
        var isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item.active').forEach(function(openItem) {
            openItem.classList.remove('active');
            var openAnswer = openItem.querySelector('.faq-answer');
            if (openAnswer) {
                openAnswer.style.maxHeight = null;
                openAnswer.style.display = 'none';
                var openIcon = openItem.querySelector('.faq-question i:last-child, .faq-question .faq-toggle');
                if (openIcon) openIcon.className = openIcon.className.replace('fa-minus', 'fa-plus');
            }
        });
        if (!isOpen) {
            item.classList.add('active');
            answer.style.display = 'block';
            answer.style.maxHeight = answer.scrollHeight + 'px';
            var icon = question.querySelector('.faq-question i:last-child, .faq-question .faq-toggle');
            if (icon) icon.className = icon.className.replace('fa-plus', 'fa-minus');
        }
    });
});

// ===== Newsletter form =====
document.querySelectorAll('.newsletter-form, .newsletter-form-inline').forEach(function(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
            showToast('Thanks for subscribing!');
            input.value = '';
        }
    });
});

// ===== Contact form validation =====
const contactForm = document.querySelector('.contact-form form, form.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var name = contactForm.querySelector('input[name="name"], input[placeholder*="name" i]');
        var email = contactForm.querySelector('input[type="email"]');
        var message = contactForm.querySelector('textarea');
        var valid = true;

        contactForm.querySelectorAll('input, textarea').forEach(function(el) {
            el.style.borderColor = '';
        });

        if (name && !name.value.trim()) { name.style.borderColor = '#e74c3c'; valid = false; }
        if (email && !email.value.trim()) { email.style.borderColor = '#e74c3c'; valid = false; }
        if (message && !message.value.trim()) { message.style.borderColor = '#e74c3c'; valid = false; }

        if (!valid) {
            showToast('Please fill in all required fields');
            return;
        }
        showToast('Message sent successfully!');
        contactForm.reset();
    });
}

// ===== Smooth reveal on scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .category-card, .testimonial-card, .step, .business-card, .product-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
