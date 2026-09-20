/**
 * SJ Digitals Co. - Edge Remote Gatekeeper
 * Controls Live / Maintenance / Offline states dynamically via GitHub Remote Config
 */
(function() {
    const SITE_KEY = 'sjdigitals';
    const GIST_ID = '20ebeae35f6ac354a606ec7bb22161f6';
    const CONFIG_URL = `https://gist.githubusercontent.com/killindodo/${GIST_ID}/raw/sites_status.json?_t=${Date.now()}`;
    const STORAGE_KEY = 'sjdigitals_bypass_active';

    // Check URL parameters for instant bypass or preview
    const params = new URLSearchParams(window.location.search);
    const bypassParam = params.get('bypass');
    const forceTestParam = params.get('test_offline');

    // 1. Fetch Remote Config
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    fetch(CONFIG_URL, { signal: controller.signal, cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
            clearTimeout(timeoutId);
            const siteConfig = (data && data[SITE_KEY]) ? data[SITE_KEY] : { status: 'online' };
            handleSiteStatus(siteConfig);
        })
        .catch(err => {
            // Fail-open strategy: if connection fails, allow normal website to load
            console.warn("[Gatekeeper] Remote edge check skipped:", err.message);
        });

    function handleSiteStatus(cfg) {
        const bypassKey = cfg.bypassKey || 'sjmaster2026';
        const isBypassed = localStorage.getItem(STORAGE_KEY) === bypassKey;

        // Check if bypass param supplied in URL
        if (bypassParam && bypassParam === bypassKey) {
            localStorage.setItem(STORAGE_KEY, bypassKey);
            // Clean URL without reloading
            params.delete('bypass');
            const cleanUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
            window.history.replaceState({}, document.title, cleanUrl);
            renderBypassBadge(bypassKey);
            return;
        }

        // If user is already verified owner
        if (isBypassed && !forceTestParam) {
            renderBypassBadge(bypassKey);
            return;
        }

        // If offline or maintenance mode active
        if (cfg.status !== 'online' || forceTestParam) {
            renderMaintenanceScreen(cfg);
        }
    }

    function renderMaintenanceScreen(cfg) {
        // Prevent body from showing original page
        const style = document.createElement('style');
        style.id = 'sj-gatekeeper-style';
        style.innerHTML = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
                overflow: hidden !important;
                background-color: #0b0f17 !important;
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
            }
            body > *:not(#sj-maintenance-root) {
                display: none !important;
            }
            #sj-maintenance-root {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: radial-gradient(circle at 50% 20%, rgba(197, 155, 39, 0.12), transparent 60%), #0b0f17 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 20px !important;
                box-sizing: border-box !important;
                z-index: 999999999 !important;
                color: #ffffff !important;
                text-align: center !important;
            }
            .sj-maint-card {
                background: rgba(22, 31, 48, 0.7) !important;
                border: 1px solid rgba(197, 155, 39, 0.3) !important;
                box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(197, 155, 39, 0.15) !important;
                backdrop-filter: blur(16px) !important;
                -webkit-backdrop-filter: blur(16px) !important;
                border-radius: 24px !important;
                padding: 36px 28px !important;
                max-width: 480px !important;
                width: 100% !important;
                animation: sjFadeIn 0.5s ease-out forwards !important;
            }
            @keyframes sjFadeIn {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .sj-logo-img {
                height: 52px !important;
                margin-bottom: 20px !important;
                filter: drop-shadow(0 4px 12px rgba(197, 155, 39, 0.3)) !important;
            }
            .sj-badge {
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                background: rgba(245, 158, 11, 0.15) !important;
                color: #fbbf24 !important;
                border: 1px solid rgba(245, 158, 11, 0.35) !important;
                padding: 6px 14px !important;
                border-radius: 20px !important;
                font-size: 11px !important;
                font-weight: 700 !important;
                letter-spacing: 1px !important;
                text-transform: uppercase !important;
                margin-bottom: 18px !important;
            }
            .sj-badge-dot {
                width: 8px !important;
                height: 8px !important;
                border-radius: 50% !important;
                background: #fbbf24 !important;
                box-shadow: 0 0 8px #fbbf24 !important;
                animation: sjPulse 1.5s infinite ease-in-out !important;
            }
            @keyframes sjPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            .sj-title {
                font-size: 22px !important;
                font-weight: 800 !important;
                color: #ffffff !important;
                margin: 0 0 10px 0 !important;
                line-height: 1.3 !important;
            }
            .sj-desc {
                font-size: 14px !important;
                color: #94a3b8 !important;
                line-height: 1.6 !important;
                margin-bottom: 26px !important;
            }
            .sj-contact-box {
                display: flex !important;
                flex-direction: column !important;
                gap: 12px !important;
            }
            .sj-btn {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 10px !important;
                padding: 14px 20px !important;
                border-radius: 12px !important;
                font-size: 14px !important;
                font-weight: 700 !important;
                text-decoration: none !important;
                transition: all 0.2s ease !important;
            }
            .sj-btn-wa {
                background: #25D366 !important;
                color: #063c1a !important;
                box-shadow: 0 4px 16px rgba(37, 211, 102, 0.3) !important;
            }
            .sj-btn-phone {
                background: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                color: #ffffff !important;
            }
            .sj-unlock-link {
                margin-top: 24px !important;
                font-size: 11px !important;
                color: #64748b !important;
                cursor: pointer !important;
                text-decoration: underline !important;
                display: inline-block !important;
            }
            .sj-unlock-link:hover {
                color: #94a3b8 !important;
            }
        `;
        document.head.appendChild(style);

        const headline = cfg.headline || "Scheduled Maintenance in Progress";
        const message = cfg.message || "We are currently optimizing our systems. We will be back online shortly!";
        const whatsapp = cfg.whatsapp || "+917004185301";
        const phone = cfg.phone || "+917004185301";
        const showContact = cfg.showContact !== false;

        const root = document.createElement('div');
        root.id = 'sj-maintenance-root';

        let contactHtml = '';
        if (showContact) {
            contactHtml = `
                <div class="sj-contact-box">
                    <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hi%20SJ%20Digitals%2C%20I%20visited%20your%20website%20and%20need%20assistance." target="_blank" class="sj-btn sj-btn-wa">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
                        Instant WhatsApp Chat
                    </a>
                    <a href="tel:${phone}" class="sj-btn sj-btn-phone">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Call Us Directly: ${phone}
                    </a>
                </div>
            `;
        }

        root.innerHTML = `
            <div class="sj-maint-card">
                <img src="fulllogo-with-bg.webp" alt="SJ Digitals" class="sj-logo-img" onerror="this.src='sjlogo.webp'">
                <div class="sj-badge">
                    <span class="sj-badge-dot"></span>
                    Maintenance Mode
                </div>
                <h1 class="sj-title">${headline}</h1>
                <p class="sj-desc">${message}</p>
                ${contactHtml}
                <div class="sj-unlock-link" id="sjAdminUnlockBtn">🔐 Owner Bypass</div>
            </div>
        `;

        // Attach once DOM is ready
        if (document.body) {
            document.body.appendChild(root);
            attachAdminUnlock(cfg.bypassKey || 'sjmaster2026');
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(root);
                attachAdminUnlock(cfg.bypassKey || 'sjmaster2026');
            });
        }
    }

    function attachAdminUnlock(expectedKey) {
        const btn = document.getElementById('sjAdminUnlockBtn');
        if (btn) {
            btn.onclick = function() {
                const key = prompt("Enter Owner Bypass Key:");
                if (key && key.trim() === expectedKey) {
                    localStorage.setItem(STORAGE_KEY, expectedKey);
                    alert("Owner verified! Unlocking site...");
                    location.reload();
                } else if (key) {
                    alert("Invalid key.");
                }
            };
        }
    }

    function renderBypassBadge(expectedKey) {
        window.addEventListener('DOMContentLoaded', () => {
            const badge = document.createElement('div');
            badge.style.cssText = `
                position: fixed;
                bottom: 16px;
                right: 16px;
                background: #111827;
                color: #10b981;
                border: 1px solid rgba(16, 185, 129, 0.4);
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                box-shadow: 0 4px 20px rgba(0,0,0,0.6);
                z-index: 999999;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: sans-serif;
            `;
            badge.innerHTML = `
                <span>🛡️ Owner Bypass Active</span>
                <span style="color: #ef4444; cursor: pointer; text-decoration: underline;" id="sjLockBtn">Exit</span>
            `;
            document.body.appendChild(badge);

            document.getElementById('sjLockBtn').onclick = () => {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            };
        });
    }
})();
