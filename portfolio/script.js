document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------------------------------------
       1. RETRO TYPING COMMAND LINE ENGINE
       ------------------------------------------------------------- */
    const roles = [
        "Data Engineer & PySpark Lakehouse Specialist.",
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
       2. INTERACTIVE DYNAMIC SKILLS GRAPH ENGINE
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

        // Clear existing bars
        graphContainer.innerHTML = "";

        // Build bars dynamically
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

        // Trigger smooth fill animation
        setTimeout(() => {
            const fills = graphContainer.querySelectorAll(".bar-fill");
            fills.forEach(fill => {
                const targetScore = fill.getAttribute("data-score");
                fill.style.width = `${targetScore}%`;
            });
        }, 50);
    }

    // Tab switcher events
    hudTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            hudTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const domain = tab.getAttribute("data-domain");
            domainTitle.textContent = `${tab.innerText.toUpperCase()} // METRICS`;
            renderDomainGraph(domain);
        });
    });

    // Initial render on data domain
    renderDomainGraph("data");

    /* -------------------------------------------------------------
       3. INTERACTIVE FOLDING PROJECT ACCORDION
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
       4. 1-CLICK TERMINAL COMMAND COPIER
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
       5. CLIENT-SIDE CATEGORY FILTERING
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

    /* -------------------------------------------------------------
       6. HIGH-PERFORMANCE MATRIX CODE STREAM ENGINE
       ------------------------------------------------------------- */
    function initMatrixRain() {
        const canvas = document.getElementById("matrix-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width, height, columns, drops, speeds;
        const characters = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜλπΣΩµ⚡🦤SP";
        const charArray = characters.split("");
        const fontSize = 14;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = [];
            speeds = [];

            for (let i = 0; i < columns; i++) {
                // Staggered initial heights for natural rain flow
                drops[i] = Math.floor(Math.random() * -100);
                speeds[i] = 1 + Math.random() * 0.8;
            }
        }

        resizeCanvas();
        window.addEventListener("resize", debounce(resizeCanvas, 150));

        let isVisible = true;
        document.addEventListener("visibilitychange", () => {
            isVisible = document.visibilityState === "visible";
        });

        // Respect reduced motion settings
        const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        let lastTime = 0;
        const fps = 30; // 30 FPS provides buttery motion with minimal battery/CPU overhead
        const fpsInterval = 1000 / fps;

        function renderMatrix(timestamp) {
            requestAnimationFrame(renderMatrix);

            if (!isVisible) return;

            const elapsed = timestamp - lastTime;
            if (elapsed < fpsInterval) return;
            lastTime = timestamp - (elapsed % fpsInterval);

            // Transparent dark trail fill
            ctx.fillStyle = "rgba(3, 6, 12, 0.12)";
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < columns; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Leading sparkler characters glow brighter
                if (Math.random() > 0.88) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.shadowColor = "#00F2FE";
                    ctx.shadowBlur = 8;
                } else if (i % 3 === 0) {
                    ctx.fillStyle = "#00F2FE"; // Cyber Cyan
                    ctx.shadowColor = "rgba(0, 242, 254, 0.45)";
                    ctx.shadowBlur = 4;
                } else {
                    ctx.fillStyle = "#05FFA1"; // Cyber Emerald
                    ctx.shadowColor = "rgba(5, 255, 161, 0.45)";
                    ctx.shadowBlur = 3;
                }

                ctx.fillText(text, x, y);
                ctx.shadowBlur = 0;

                // Reset drop when exceeding screen bottom
                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i] += speeds[i];
            }
        }

        requestAnimationFrame(renderMatrix);
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    initMatrixRain();

});
