/**
 * Utility Functions: Sanitization, Clipboard, Toast Notifications
 */

const WeddingUtils = {
    /**
     * Strictly sanitize text to avoid XSS injections
     * @param {string} str - Raw input string
     * @returns {string} Sanitized string
     */
    sanitizeText(str) {
        if (!str) return "";
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Parse guest name from URL query (?to=NamaTamu) safely
     * @returns {string}
     */
    getGuestName() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const rawName = urlParams.get("to") || urlParams.get("u") || urlParams.get("guest");
            if (rawName && rawName.trim()) {
                // Decode URI component safely and strip suspicious chars
                const decoded = decodeURIComponent(rawName.trim());
                // Replace characters that could break layout or formatting
                return decoded.replace(/[<>]/g, "");
            }
        } catch (e) {
            console.warn("Could not parse guest parameter", e);
        }
        return "Tamu Undangan";
    },

    /**
     * Copy text to clipboard using modern Clipboard API with fallback
     * @param {string} text 
     * @param {string} successMessage 
     */
    async copyToClipboard(text, successMessage = "Berhasil disalin ke clipboard!") {
        if (!text) return;

        let copied = false;
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                copied = true;
            } catch (err) {
                console.warn("Modern clipboard API failed, trying fallback...", err);
            }
        }

        // Fallback for older browsers or non-https
        if (!copied) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                copied = document.execCommand("copy");
                document.body.removeChild(textArea);
            } catch (fallbackErr) {
                console.error("Fallback clipboard failed:", fallbackErr);
            }
        }

        if (copied) {
            this.showToast(successMessage, "success");
        } else {
            this.showToast("Gagal menyalin otomatis. Silakan salin manual.", "error");
        }
    },

    /**
     * Display a sleek, elegant toast notification
     * @param {string} message 
     * @param {string} type - 'success' | 'info' | 'error'
     */
    showToast(message, type = "success") {
        let toastContainer = document.getElementById("toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            toastContainer.className = "toast-container";
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement("div");
        toast.className = `toast-item toast-${type} animate-slide-up`;
        
        const iconSvg = type === "success" 
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

        toast.innerHTML = `
            <span class="toast-icon">${iconSvg}</span>
            <span class="toast-text">${this.sanitizeText(message)}</span>
        `;

        toastContainer.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add("toast-fade-out");
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, 3200);
    }
};

window.WeddingUtils = WeddingUtils;
