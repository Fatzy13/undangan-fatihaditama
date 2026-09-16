/**
 * Main Application Orchestrator
 * Connects configuration, opening screen, navigation, animations, and interactive modules
 */

function initApp() {
    // 0. Initialize Dark Mode (before rendering to prevent flash)
    try {
        initDarkMode();
    } catch (e) {
        console.warn("Dark mode init error:", e);
    }

    // 1. Initialize Configuration & Guest Personalization
    try {
        initGuestPersonalization();
    } catch (e) {
        console.warn("Guest personalization init error:", e);
    }

    // 2. Initialize Audio, Countdown, & Wishes
    try {
        if (window.MusicPlayer) {
            window.MusicPlayer.init();
        }
    } catch (e) {
        console.warn("MusicPlayer init error:", e);
    }

    try {
        if (window.CountdownTimer) {
            window.CountdownTimer.init(window.weddingData ? window.weddingData.eventTargetIso : null);
        }
    } catch (e) {
        console.warn("CountdownTimer init error:", e);
    }

    // 3. Setup Opening Cover & Transition
    try {
        initOpeningScreen();
    } catch (e) {
        console.warn("OpeningScreen init error:", e);
    }

    // 4. Setup Navigation & Smooth Scrolling
    try {
        initNavigation();
    } catch (e) {
        console.warn("Navigation init error:", e);
    }


    // 6. Setup Digital Gift & Clipboard Triggers
    try {
        initDigitalGift();
    } catch (e) {
        console.warn("DigitalGift init error:", e);
    }

    // 7. Setup Scroll Animations
    try {
        initScrollAnimations();
    } catch (e) {
        console.warn("ScrollAnimations init error:", e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

/**
 * Handle Dark / Light Mode Toggle with Persistence
 */
function initDarkMode() {
    const themeToggle = document.getElementById("theme-toggle-btn");
    const savedTheme = localStorage.getItem("wedding_theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            if (currentTheme === "dark") {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("wedding_theme", "light");
                if (window.WeddingUtils) {
                    window.WeddingUtils.showToast("Mode terang diaktifkan", "info");
                }
            } else {
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("wedding_theme", "dark");
                if (window.WeddingUtils) {
                    window.WeddingUtils.showToast("Mode gelap diaktifkan", "info");
                }
            }
        });
    }
}

/**
 * Universal Open Invitation Handler
 * Accessible via inline onclick and event listeners
 */
window.handleOpenInvitation = function () {
    const openingCover = document.getElementById("opening-cover");
    const floatingMusic = document.getElementById("music-toggle-btn");
    const themeToggle = document.getElementById("theme-toggle-btn");
    const navbar = document.getElementById("main-navbar");
    const mobileNav = document.getElementById("mobile-navbar");

    if (!openingCover) return;

    // Play music safely if supported
    if (window.MusicPlayer) {
        try {
            window.MusicPlayer.play();
        } catch (err) {
            console.warn("Auto audio playback deferred:", err);
        }
    }

    // Animate cover out
    openingCover.classList.add("cover-exit");

    // Allow body scroll
    document.body.classList.remove("overflow-hidden");
    document.body.classList.add("invitation-opened");

    // Show floating elements smoothly
    if (floatingMusic) {
        floatingMusic.classList.remove("opacity-0", "pointer-events-none");
        floatingMusic.classList.add("opacity-100");
    }
    if (themeToggle) {
        themeToggle.classList.remove("opacity-0", "pointer-events-none");
        themeToggle.classList.add("opacity-100");
    }
    if (navbar) {
        navbar.classList.remove("opacity-0", "pointer-events-none");
        navbar.classList.add("opacity-100");
    }
    if (mobileNav) {
        mobileNav.classList.remove("opacity-0", "pointer-events-none");
        mobileNav.classList.add("opacity-100");
    }

    // Smoothly scroll into Hero
    setTimeout(() => {
        openingCover.style.display = "none";
        const heroSection = document.getElementById("hero");
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: "smooth" });
        }
    }, 700);
};

/**
 * Handle URL Parameter `?to=NamaTamu`
 */
function initGuestPersonalization() {
    const guestName = window.WeddingUtils ? window.WeddingUtils.getGuestName() : "Tamu Undangan";
    
    // Inject strictly into textContent to ensure zero XSS risk
    const guestDisplays = document.querySelectorAll(".guest-name-placeholder");
    guestDisplays.forEach(el => {
        el.textContent = guestName;
    });
}

/**
 * Handle Opening Screen and Transition into Main Content
 */
function initOpeningScreen() {
    const openBtn = document.getElementById("btn-open-invitation");
    if (!openBtn) return;

    openBtn.addEventListener("click", window.handleOpenInvitation);
}

/**
 * Navigation Active State & Smooth Anchor Scrolling
 */
function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // Highlight active section on scroll
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }, { passive: true });
}


/**
 * Digital Gift Copy to Clipboard Handlers
 */
function initDigitalGift() {
    // Bank Copy
    const copyBankBtn = document.getElementById("btn-copy-bank");
    if (copyBankBtn) {
        copyBankBtn.addEventListener("click", () => {
            const accNum = (window.weddingData && window.weddingData.gift && window.weddingData.gift.bank.accountNumber) || "8120938472";
            if (window.WeddingUtils) {
                window.WeddingUtils.copyToClipboard(accNum, "Nomor rekening BCA berhasil disalin!");
            }
        });
    }

    // E-Wallet Copy
    const copyWalletBtn = document.getElementById("btn-copy-wallet");
    if (copyWalletBtn) {
        copyWalletBtn.addEventListener("click", () => {
            const walletNum = (window.weddingData && window.weddingData.gift && window.weddingData.gift.ewallet.number) || "081234567890";
            if (window.WeddingUtils) {
                window.WeddingUtils.copyToClipboard(walletNum, "Nomor E-Wallet berhasil disalin!");
            }
        });
    }

    // Address Copy
    const copyAddressBtn = document.getElementById("btn-copy-address");
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener("click", () => {
            const address = (window.weddingData && window.weddingData.gift && window.weddingData.gift.delivery.address) || "Kompleks Graha Kediri Asri No. 12, Mojoroto, Kota Kediri, Jawa Timur";
            if (window.WeddingUtils) {
                window.WeddingUtils.copyToClipboard(address, "Alamat pengiriman kado berhasil disalin!");
            }
        });
    }
}

/**
 * Light IntersectionObserver Animation System
 * Respects `prefers-reduced-motion`
 */
function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const animatedElements = document.querySelectorAll(".reveal-on-scroll");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    animatedElements.forEach(el => observer.observe(el));
}
