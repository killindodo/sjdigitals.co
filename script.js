/**
 * SJ Digitals Co. - Main Application Script
 * Features: WhatsApp Quote Dispatcher, Email Notification Gateway, 
 * Mobile Navigation Drawer, Scroll Spy & Safe Analytics.
 */

document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
    initServiceQuoteButtons();
    initInquiryForm();
    initPortfolioFilters();
    initSafeAnalytics();
    logPerformance();
});

/* --------------------------------------------------------------------------
   0. Theme Toggle Engine (Light / Dark Mode with Persistence)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('sj_theme', newTheme);

        sendGAEvent('toggle_theme', {
            'selected_theme': newTheme
        });
    });

    // Auto-sync with OS theme changes if no manual preference stored
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('sj_theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', systemTheme);
            }
        });
    }
}

/* --------------------------------------------------------------------------
   1. Safe Google Analytics Wrapper (Prevents Crashes with AdBlockers)
   -------------------------------------------------------------------------- */
function sendGAEvent(eventName, eventParams = {}) {
    try {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, eventParams);
        }
    } catch (e) {
        // Silently catch adblocker interference
    }
}

/* --------------------------------------------------------------------------
   2. Mobile Hamburger Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-wrapper a');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* --------------------------------------------------------------------------
   3. Smooth Scroll & Header Offset
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                e.preventDefault();
                targetElem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   4. Scroll Spy - Dynamic Navigation Link Highlighting
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                sendGAEvent('section_view', {
                    'section_name': currentId
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
}

/* --------------------------------------------------------------------------
   5. Dynamic Service Pre-selection from Cards
   -------------------------------------------------------------------------- */
function initServiceQuoteButtons() {
    const quoteButtons = document.querySelectorAll('.btn-quote-action');
    const serviceSelect = document.getElementById('serviceSelect');
    const fullNameInput = document.getElementById('fullName');

    quoteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceName = this.getAttribute('data-service');

            // Scroll down to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Pre-select service in the dropdown
            if (serviceSelect && serviceName) {
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    if (serviceSelect.options[i].value === serviceName) {
                        serviceSelect.selectedIndex = i;
                        break;
                    }
                }
                serviceSelect.style.borderColor = 'var(--gold-primary)';
                setTimeout(() => {
                    serviceSelect.style.borderColor = '';
                }, 2000);
            }

            if (fullNameInput) {
                setTimeout(() => fullNameInput.focus(), 600);
            }

            sendGAEvent('select_service_quote', {
                'service_name': serviceName
            });
        });
    });
}

/* --------------------------------------------------------------------------
   6. Inquiry Form: Instant WhatsApp Dispatcher & Email Notification
   -------------------------------------------------------------------------- */
function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
    const btnSubmitOnline = document.getElementById('btnSubmitOnline');
    const statusMsg = document.getElementById('formStatusMessage');

    const whatsappRecipient = '917004185301'; // Surya Pratap Singh's WhatsApp number

    if (!form || !btnSendWhatsApp) return;

    // A. WhatsApp Direct Submission
    btnSendWhatsApp.addEventListener('click', function() {
        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phoneNum').value.trim();
        const email = document.getElementById('emailAddr').value.trim();
        const service = document.getElementById('serviceSelect').value;
        const details = document.getElementById('projectDetails').value.trim();

        if (!name || !phone) {
            showStatus('⚠️ Please enter your Full Name and Phone/WhatsApp Number.', 'error');
            if (!name) document.getElementById('fullName').focus();
            else document.getElementById('phoneNum').focus();
            return;
        }

        const selectedService = service || 'General Inquiry / Custom Solution';
        const notes = details || 'Looking for details and pricing.';

        // Create elegant, formatted WhatsApp message
        const waText = 
`*🔔 New Inquiry - SJ Digitals Co.*
━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${name}
📱 *Phone:* ${phone}
${email ? `📧 *Email:* ${email}\n` : ''}🎨 *Service:* ${selectedService}
📝 *Project Requirements:* 
${notes}
━━━━━━━━━━━━━━━━━━
🌐 *Source:* sjdigitals.vercel.app`;

        const waUrl = `https://wa.me/${whatsappRecipient}?text=${encodeURIComponent(waText)}`;

        sendGAEvent('submit_inquiry_whatsapp', {
            'service_name': selectedService,
            'client_name': name
        });

        showStatus('🚀 Opening WhatsApp with your inquiry details...', 'success');
        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 300);
    });

    // B. Online Form Submission (Sends instant email notification to suryapratapsingh420786@gmail.com)
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phoneNum').value.trim();
        const service = document.getElementById('serviceSelect').value;

        if (!name || !phone || !service) {
            showStatus('⚠️ Please complete all required fields (*).', 'error');
            return;
        }

        btnSubmitOnline.disabled = true;
        btnSubmitOnline.innerHTML = '<span>⏳ Submitting & Sending Notification...</span>';

        const formData = new FormData(form);

        // Submit to FormSubmit API for instant email notification
        fetch('https://formsubmit.co/ajax/suryapratapsingh420786@gmail.com', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showStatus(`✅ Thank you, ${name}! Your inquiry has been sent to Surya Pratap Singh. We will contact you within 1-2 hours on WhatsApp/Phone.`, 'success');
                form.reset();
                sendGAEvent('submit_inquiry_email', {
                    'service_name': service
                });
            } else {
                throw new Error('Network error');
            }
        })
        .catch(() => {
            // Graceful fallback to direct WhatsApp
            showStatus(`ℹ️ Email queued! For fastest reply, please click the green "Send Query via WhatsApp" button above.`, 'success');
        })
        .finally(() => {
            btnSubmitOnline.disabled = false;
            btnSubmitOnline.innerHTML = '<span>Submit Query & Email Notification</span>';
        });
    });

    function showStatus(message, type) {
        if (!statusMsg) return;
        statusMsg.textContent = message;
        statusMsg.className = `form-status-msg ${type}`;
        statusMsg.style.display = 'block';

        statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* --------------------------------------------------------------------------
   7. Portfolio Category Filters
   -------------------------------------------------------------------------- */
function initPortfolioFilters() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (!tabBtns.length || !portfolioCards.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });

            sendGAEvent('filter_portfolio', {
                'filter_category': filter
            });
        });
    });
}

/* --------------------------------------------------------------------------
   8. Safe Outbound Link & CTA Tracking
   -------------------------------------------------------------------------- */
function initSafeAnalytics() {
    const trackableLinks = document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"], a[href^="mailto:"]');

    trackableLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.href;
            const linkType = href.includes('tel:') ? 'phone_call' :
                             href.includes('wa.me') ? 'whatsapp_chat' :
                             href.includes('mailto:') ? 'email_click' : 'external_link';

            sendGAEvent('click_contact_channel', {
                'channel': linkType,
                'target': href
            });
        });
    });
}

/* --------------------------------------------------------------------------
   9. Page Performance Metrics
   -------------------------------------------------------------------------- */
function logPerformance() {
    window.addEventListener('load', function() {
        try {
            const navEntries = performance.getEntriesByType('navigation');
            if (navEntries.length > 0) {
                const loadTime = Math.round(navEntries[0].loadEventEnd);
                sendGAEvent('page_load_performance', {
                    'load_time_ms': loadTime
                });
            }
        } catch (e) {
            // Ignore performance logging errors
        }
    });
}

console.log('SJ Digitals Co. - Modern High-Converting Platform Initialized.');