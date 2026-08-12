document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initGAEvents();
    initFormTracking();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a, .cta-btn, .card-cta');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    updateActiveNav(targetId);
                }
            }
        });
    });
}

function updateActiveNav(currentId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
            link.style.color = 'var(--gold)';
        } else {
            link.style.color = '';
        }
    });
}

function initGAEvents() {
    const ctaBtns = document.querySelectorAll('.cta-btn, .card-cta');
    ctaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            gtag('event', 'click_cta', {
                'event_category': 'engagement',
                'event_label': this.textContent,
                'value': 1
            });
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'section_view', {
                    'event_category': 'engagement',
                    'section_name': entry.target.id,
                    'timestamp': new Date().toISOString()
                });
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkType = this.href.includes('tel:') ? 'phone' : 
                           this.href.includes('mailto:') ? 'email' :
                           this.href.includes('wa.me') ? 'whatsapp' : 'external';
            
            gtag('event', 'click_link', {
                'event_category': 'engagement',
                'link_type': linkType,
                'link_text': this.textContent,
                'link_url': this.href
            });
        });
    });
}

function initFormTracking() {
    const quoteButtons = document.querySelectorAll('.card-cta');
    quoteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            gtag('event', 'get_quote_click', {
                'event_category': 'conversion',
                'service': this.closest('.service-card').querySelector('h3').textContent,
                'value': 1
            });
        });
    });
}

function initScrollEffects() {
    const cards = document.querySelectorAll('.service-card, .portfolio-item, .feature');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        scrollObserver.observe(card);
    });
}

window.addEventListener('load', function() {
    initScrollEffects();
});

function logPagePerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        gtag('event', 'page_load_time', {
            'event_category': 'performance',
            'load_time_ms': pageLoadTime,
            'value': Math.round(pageLoadTime / 1000)
        });
    }
}

window.addEventListener('load', logPagePerformance);

console.log('SJ Digitals Co. - Website Loaded Successfully');