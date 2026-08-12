/**
 * SJ Digitals Co. - Main JavaScript
 * Smooth navigation, form tracking, and analytics
 */

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initGAEvents();
    initFormTracking();
});

// ==========================================
// Navigation & Smooth Scrolling
// ==========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a, .cta-btn, .card-cta');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for hash links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active nav state
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

// ==========================================
// Google Analytics 4 Event Tracking
// ==========================================
function initGAEvents() {
    // Track CTA button clicks
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

    // Track section views (when scrolled into view)
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'section_view', {
                    'event_category': 'engagement',
                    'section_name': entry.target.id,
                    'timestamp': new Date().toISOString()
                });
                // Stop observing this section after first view
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Track external link clicks
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

// ==========================================
// Form Tracking
// ==========================================
function initFormTracking() {
    // Get the embedded Google Form iframe
    const googleFormIframe = document.querySelector('.contact-form-area iframe');
    
    if (googleFormIframe) {
        // Track when user focuses on form (engagement indicator)
        googleFormIframe.addEventListener('focus', function() {
            gtag('event', 'form_focus', {
                'event_category': 'engagement',
                'event_label': 'inquiry_form'
            });
        });

        // Note: Google Forms within iframes have limited tracking ability
        // Manual submission tracking would need to be done via form's own submission handler
        // or by monitoring form completion via Google Forms' built-in tracking
    }

    // Track "Get Quote" button clicks specifically
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

// ==========================================
// Scroll Effects (Optional - Subtle Animations)
// ==========================================
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

// ==========================================
// Initialize Scroll Effects on Page Load
// ==========================================
window.addEventListener('load', function() {
    initScrollEffects();
});

// ==========================================
// Mobile Menu Toggle (Future Enhancement)
// ==========================================
function initMobileMenu() {
    // Add mobile menu functionality if needed in future
    // This is a placeholder for mobile navigation enhancement
}

// ==========================================
// Utility: Log Page Performance (Optional)
// ==========================================
function logPagePerformance() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        gtag('event', 'page_load_time', {
            'event_category': 'performance',
            'load_time_ms': pageLoadTime,
            'value': Math.round(pageLoadTime / 1000) // Convert to seconds for easier reading
        });
    }
}

// Log page performance on load
window.addEventListener('load', logPagePerformance);

// ==========================================
// Contact Button Analytics
// ==========================================
window.addEventListener('scroll', function() {
    const contactSection = document.getElementById('contact');
    const rect = contactSection.getBoundingClientRect();
    
    // Track when user reaches contact section
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        gtag('event', 'reached_contact_section', {
            'event_category': 'engagement',
            'value': 1
        });
    }
});

console.log('SJ Digitals Co. - Website Loaded Successfully');
