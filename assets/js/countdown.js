/**
 * Countdown Timer Component
 * Target: 10 September 2026 08:00:00 Asia/Jakarta (+07:00)
 * Memory-safe with interval clearing on unload
 */

const CountdownTimer = {
    timerInterval: null,
    targetDate: null,

    init(targetIso) {
        // Parse target date from ISO string (e.g. "2026-09-10T08:00:00+07:00")
        this.targetDate = new Date(targetIso || (window.weddingData && window.weddingData.eventTargetIso) || "2026-09-10T08:00:00+07:00").getTime();
        
        // Initial render immediately
        this.update();

        // Clear existing interval if any
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Start interval
        this.timerInterval = setInterval(() => {
            this.update();
        }, 1000);

        // Memory leak cleanup on window unload
        window.addEventListener("beforeunload", () => {
            this.destroy();
        });
    },

    update() {
        const now = new Date().getTime();
        const difference = this.targetDate - now;

        const daysEl = document.getElementById("count-days");
        const hoursEl = document.getElementById("count-hours");
        const minutesEl = document.getElementById("count-minutes");
        const secondsEl = document.getElementById("count-seconds");
        const messageEl = document.getElementById("countdown-message");
        const gridEl = document.getElementById("countdown-grid");

        if (difference <= 0) {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            if (gridEl) gridEl.style.display = "none";
            if (messageEl) {
                messageEl.textContent = "The day has arrived.";
                messageEl.classList.remove("hidden");
                messageEl.classList.add("countdown-arrived");
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    },

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};

window.CountdownTimer = CountdownTimer;
