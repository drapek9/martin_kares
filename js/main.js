// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form validation (if contact form exists)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = this.querySelector('input[name="name"]');
            const email = this.querySelector('input[name="email"]');
            const message = this.querySelector('textarea[name="message"]');
            
            let isValid = true;
            
            if (!name || !name.value.trim()) {
                isValid = false;
                showError(name, 'Prosím vyplňte jméno');
            } else {
                clearError(name);
            }
            
            if (!email || !email.value.trim() || !isValidEmail(email.value)) {
                isValid = false;
                showError(email, 'Prosím vyplňte platný email');
            } else {
                clearError(email);
            }
            
            if (!message || !message.value.trim()) {
                isValid = false;
                showError(message, 'Prosím vyplňte zprávu');
            } else {
                clearError(message);
            }
            
            if (isValid) {
                // Here you would normally send the form data to a server
                alert('Děkujeme za vaši zprávu! Brzy se vám ozveme.');
                this.reset();
            }
        });
    }
    
    // Reference text expand/collapse
    initReferenceToggle();
    
    // Scroll animations
    initScrollAnimations();
});

function initReferenceToggle() {
    const referenceCards = document.querySelectorAll('.reference-card');
    const referenceTexts = document.querySelectorAll('.reference-text');
    const maxHeight = 120; // Maximální výška v pixelech pro zkrácený text
    
    // Nejdřív zpracujeme všechny texty a zkrátíme ty dlouhé
    referenceTexts.forEach(function(textElement) {
        // Nejdřív zjistíme skutečnou výšku textu bez omezení
        const originalHeight = textElement.scrollHeight;
        
        // Pokud je text delší než maxHeight, přidáme možnost rozbalit
        if (originalHeight > maxHeight) {
            // Uložíme původní výšku do data atributu
            textElement.setAttribute('data-original-height', originalHeight);
            
            // Přidáme třídu pro zkrácený stav
            textElement.classList.add('collapsed');
            
            // Vytvoříme tlačítko "Více"
            const toggleButton = document.createElement('button');
            toggleButton.className = 'reference-toggle';
            toggleButton.textContent = 'Více';
            toggleButton.setAttribute('aria-label', 'Zobrazit více textu');
            
            // Přidáme tlačítko do reference-content
            const referenceContent = textElement.closest('.reference-content');
            if (referenceContent) {
                referenceContent.appendChild(toggleButton);
            }
            
            // Přidáme event listener
            toggleButton.addEventListener('click', function() {
                const isCollapsed = textElement.classList.contains('collapsed');
                const savedHeight = textElement.getAttribute('data-original-height');
                const referenceCard = textElement.closest('.reference-card');
                const initialHeight = referenceCard.getAttribute('data-initial-height');
                
                if (isCollapsed) {
                    // Rozbalit - nastavíme skutečnou výšku
                    textElement.classList.remove('collapsed');
                    textElement.style.maxHeight = savedHeight + 'px';
                    toggleButton.textContent = 'Méně';
                    // Odstraníme fixní výšku z karty, aby se mohla roztáhnout
                    referenceCard.style.height = 'auto';
                } else {
                    // Zabalit
                    textElement.classList.add('collapsed');
                    textElement.style.maxHeight = maxHeight + 'px';
                    toggleButton.textContent = 'Více';
                    // Vrátíme původní výšku karty
                    referenceCard.style.height = initialHeight + 'px';
                }
            });
        }
    });
    
    // Po zpracování všech textů nastavíme všechny reference na stejnou výšku
    // (teď už jsou všechny texty zkrácené, pokud byly dlouhé)
    let maxCardHeight = 0;
    referenceCards.forEach(function(card) {
        // Resetujeme výšku, abychom zjistili skutečnou výšku po zkrácení
        card.style.height = 'auto';
        const cardHeight = card.offsetHeight;
        if (cardHeight > maxCardHeight) {
            maxCardHeight = cardHeight;
        }
    });
    
    // Nastavíme všem kartám stejnou výšku
    referenceCards.forEach(function(card) {
        card.style.height = maxCardHeight + 'px';
        card.setAttribute('data-initial-height', maxCardHeight);
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    if (!input) return;
    
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#e74c3c';
}

function clearError(input) {
    if (!input) return;
    
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '';
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Odpojit observer po animaci pro lepší výkon
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Pozorovat všechny elementy, které mají být animované
    const animateElements = document.querySelectorAll('.section-header, .service-card, .reference-card, .certificate-item, .about-preview-content, .content-section, .properties-placeholder, .cta-content, .property-card, .animate-on-scroll');
    animateElements.forEach(el => {
        if (el) {
            observer.observe(el);
        }
    });
}
