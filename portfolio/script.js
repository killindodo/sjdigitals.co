/**
 * Surya Pratap // Retro Cyber Console v2.6
 * Matrix Rain Engine, Skills Telemetry HUD & Folding Console Drawers
 */

document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------------------------------------
       1. AUTHENTIC MATRIX DIGITAL RAIN ENGINE (CANVAS 60FPS)
       ------------------------------------------------------------- */
    function initMatrixRain() {
        const canvas = document.getElementById("matrix-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width, height, columns, drops, speeds, dropLengths;
        
        // Authentic Matrix glyph set: Half-width Katakana, Hexadecimal, Binary, Math & Cyber symbols
        const matrixChars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜλπΣΩµ⚡🦤SP01";
        const charArray = matrixChars.split("");
        const fontSize = 16;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.width = window.innerWidth * dpr;
            height = canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.scale(dpr, dpr);

            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;
            columns = Math.ceil(displayWidth / fontSize);
            drops = [];
            speeds = [];

            for (let i = 0; i < columns; i++) {
                // Initialize across the ENTIRE viewport height so rain is immediately active everywhere
                drops[i] = Math.floor(Math.random() * (displayHeight / fontSize));
                speeds[i] = 1 + Math.random() * 0.8;
            }

            // Fill solid black on init/resize
            ctx.fillStyle = "#03060c";
            ctx.fillRect(0, 0, displayWidth, displayHeight);
        }

        resize();
        window.addEventListener("resize", debounce(resize, 100));

        let isVisible = true;
        document.addEventListener("visibilitychange", () => {
            isVisible = document.visibilityState === "visible";
        });

        // Respect system accessibility setting
        const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) {
            ctx.fillStyle = "#03060c";
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            return;
        }

        let lastTime = 0;
        const fps = 33; // 30-33 FPS provides smooth flow with low CPU consumption
        const fpsInterval = 1000 / fps;

        function renderStream(timestamp) {
            requestAnimationFrame(renderStream);

            if (!isVisible) return;

            const elapsed = timestamp - lastTime;
            if (elapsed < fpsInterval) return;
            lastTime = timestamp - (elapsed % fpsInterval);

            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;

            // Trailing darkness fade layer
            ctx.fillStyle = "rgba(3, 6, 12, 0.15)";
            ctx.fillRect(0, 0, displayWidth, displayHeight);

            ctx.font = `bold ${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < columns; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // 1. Leading sparkler head (bright glowing white/lime)
                if (Math.random() > 0.85) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.shadowColor = "#00FF66";
                    ctx.shadowBlur = 10;
                } else if (i % 4 === 0) {
                    // Cyber Cyan accent column
                    ctx.fillStyle = "#00F2FE";
                    ctx.shadowColor = "rgba(0, 242, 254, 0.6)";
                    ctx.shadowBlur = 6;
                } else {
                    // Classic Matrix Phosphor Green
                    ctx.fillStyle = "#00FF41";
                    ctx.shadowColor = "rgba(0, 255, 65, 0.5)";
                    ctx.shadowBlur = 4;
                }

                ctx.fillText(char, x, y);
                ctx.shadowBlur = 0;

                // Reset drop when past bottom
                if (y > displayHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                    speeds[i] = 1 + Math.random() * 0.8;
                }

                drops[i] += speeds[i];
            }
        }

        requestAnimationFrame(renderStream);
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    initMatrixRain();

    /* -------------------------------------------------------------
       2. RETRO TYPING COMMAND LINE ENGINE
       ------------------------------------------------------------- */
    const roles = [
        "Data Engineer & PySpark Lakehouse Specialist.",
        "Founder & Tech Lead @ SJ Digitals Co.",
        "ESP32 & CC1101 Sub-GHz RF Transceiver Builder.",
        "Linux Kernel 4.x/6.x & Android GKI v4 Developer."
    ];

    const targetElement = document.getElementById("typing-text");
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    function runTypingLoop() {
        if (!targetElement) return;

        const currentText = roles[roleIdx];

        if (isDeleting) {
            targetElement.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 25;
        } else {
            targetElement.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIdx === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 300;
        }

        setTimeout(runTypingLoop, typingSpeed);
    }

    runTypingLoop();

    /* -------------------------------------------------------------
       3. INTERACTIVE DYNAMIC SKILLS GRAPH ENGINE
       ------------------------------------------------------------- */
    const skillsData = {
        data: [
            { name: "Databricks & PySpark Transformations", score: 92 },
            { name: "Medallion Lakehouse (Bronze -> Silver -> Gold)", score: 90 },
            { name: "SQL Query Optimization & Data Warehousing", score: 88 },
            { name: "ETL Orchestration & Databricks Workflows", score: 85 }
        ],
        embedded: [
            { name: "ESP32 Firmware & Embedded C++", score: 90 },
            { name: "TI CC1101 Sub-GHz Demodulation (315/433/868/915 MHz)", score: 88 },
            { name: "Zero-CDN Embedded WebServers (PROGMEM)", score: 85 },
            { name: "Hardware SPI / I2C Bus & Pinout Design", score: 82 }
        ],
        kernel: [
            { name: "Android GKI v4 & vendor_boot Integration", score: 88 },
            { name: "Linux 4.14 / 6.x Kernel Driver Compilation", score: 85 },
            { name: "TWRP / OrangeFox Custom Recovery Bringup", score: 85 },
            { name: "Dynamic EROFS / F2FS Partition Super Structures", score: 80 }
        ],
        languages: [
            { name: "Python (Data Pipelines & Scripts)", score: 92 },
            { name: "C / Embedded C++", score: 88 },
            { name: "SQL (DDL / DML Queries)", score: 88 },
            { name: "Bash & Linux Shell Scripting", score: 84 },
            { name: "JavaScript & HTML5 APIs", score: 80 }
        ]
    };

    const graphContainer = document.getElementById("skills-graph-container");
    const domainTitle = document.getElementById("graph-domain-title");
    const hudTabs = document.querySelectorAll(".hud-tab");

    function renderDomainGraph(domainKey) {
        const dataset = skillsData[domainKey];
        if (!dataset || !graphContainer) return;

        graphContainer.innerHTML = "";

        dataset.forEach(item => {
            const itemRow = document.createElement("div");
            itemRow.className = "graph-item";
            itemRow.innerHTML = `
                <div class="graph-label-row">
                    <span>${item.name}</span>
                    <strong>${item.score}%</strong>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" data-score="${item.score}"></div>
                </div>
            `;
            graphContainer.appendChild(itemRow);
        });

        setTimeout(() => {
            const fills = graphContainer.querySelectorAll(".bar-fill");
            fills.forEach(fill => {
                const targetScore = fill.getAttribute("data-score");
                fill.style.width = `${targetScore}%`;
            });
        }, 50);
    }

    hudTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            hudTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const domain = tab.getAttribute("data-domain");
            domainTitle.textContent = `${tab.innerText.toUpperCase()} // METRICS`;
            renderDomainGraph(domain);
        });
    });

    renderDomainGraph("data");

    /* -------------------------------------------------------------
       4. INTERACTIVE FOLDING PROJECT ACCORDION
       ------------------------------------------------------------- */
    const drawers = document.querySelectorAll(".project-console-drawer");

    drawers.forEach(drawer => {
        const trigger = drawer.querySelector(".drawer-trigger");

        trigger.addEventListener("click", () => {
            const isOpen = drawer.classList.contains("is-open");
            if (!isOpen) {
                drawer.classList.add("is-open");
            } else {
                drawer.classList.remove("is-open");
            }
        });

        trigger.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                trigger.click();
            }
        });
    });

    /* -------------------------------------------------------------
       5. 1-CLICK TERMINAL COMMAND COPIER
       ------------------------------------------------------------- */
    const copyButtons = document.querySelectorAll(".copy-cmd-btn");

    copyButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const cmdBox = btn.closest(".cmd-run-bar");
            const codeText = cmdBox.querySelector("code").innerText;

            navigator.clipboard.writeText(codeText).then(() => {
                const icon = btn.querySelector("i");
                icon.className = "fas fa-check";
                icon.style.color = "var(--cyber-emerald)";

                setTimeout(() => {
                    icon.className = "far fa-copy";
                    icon.style.color = "";
                }, 1800);
            });
        });
    });

    /* -------------------------------------------------------------
       6. CLIENT-SIDE CATEGORY FILTERING
       ------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedFilter = btn.getAttribute("data-filter");

            drawers.forEach(drawer => {
                const category = drawer.getAttribute("data-category");
                if (selectedFilter === "all" || category === selectedFilter) {
                    drawer.style.display = "block";
                } else {
                    drawer.style.display = "none";
                }
            });
        });
    });

});
