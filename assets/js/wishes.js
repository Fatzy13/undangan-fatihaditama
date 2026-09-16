/**
 * Wedding Wishes Component
 * Displays dummy wishes, supports new wish submissions with localStorage persistence,
 * and is structured for direct backend API integration in the future.
 */

const WeddingWishes = {
    storageKey: "wedding_wishes_wira_neera",
    
    // No dummy wishes; only real wishes from visitors
    defaultWishes: [],

    init() {
        // Clean out any legacy dummy / test wishes from localStorage if present
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    const filtered = parsed.filter(w => !w.isDummy && ![1, 2, 3, 4].includes(w.id) && w.name !== "Budi & Keluarga");
                    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
                }
            }
        } catch (e) {
            // ignore
        }

        this.renderWishes();
        this.bindEvents();
    },

    getWishes() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed.filter(w => !w.isDummy && ![1, 2, 3, 4].includes(w.id));
                }
            }
        } catch (e) {
            console.warn("Could not read wishes from localStorage", e);
        }
        return [];
    },

    saveWishes(wishes) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(wishes));
        } catch (e) {
            console.warn("Could not save wishes to localStorage", e);
        }
    },

    renderWishes() {
        const listContainer = document.getElementById("wishes-list");
        if (!listContainer) return;

        const wishes = this.getWishes();
        listContainer.innerHTML = "";

        if (wishes.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; color: var(--color-text-muted); font-size: 0.95rem; padding: 32px 16px; font-style: italic; border: 1px dashed var(--color-border); border-radius: var(--radius-md);">
                    Belum ada ucapan. Jadilah yang pertama memberikan doa restu untuk kedua mempelai!
                </div>
            `;
            return;
        }

        wishes.forEach((wish) => {
            const card = document.createElement("div");
            card.className = "wish-card";

            const safeName = window.WeddingUtils ? window.WeddingUtils.sanitizeText(wish.name) : wish.name;
            const safeMsg = window.WeddingUtils ? window.WeddingUtils.sanitizeText(wish.message) : wish.message;
            const safeTime = window.WeddingUtils ? window.WeddingUtils.sanitizeText(wish.timestamp) : wish.timestamp;
            const initial = safeName.trim().charAt(0).toUpperCase() || "W";

            card.innerHTML = `
                <div class="wish-header">
                    <div class="wish-avatar">${initial}</div>
                    <div class="wish-meta">
                        <h4 class="wish-author">${safeName}</h4>
                        <span class="wish-time">${safeTime}</span>
                    </div>
                </div>
                <p class="wish-content">${safeMsg}</p>
            `;
            listContainer.appendChild(card);
        });
    },

    bindEvents() {
        const form = document.getElementById("wish-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("wish-name");
            const msgInput = document.getElementById("wish-message");

            const name = nameInput ? nameInput.value.trim() : "";
            const message = msgInput ? msgInput.value.trim() : "";

            if (!name || !message) {
                if (window.WeddingUtils) {
                    window.WeddingUtils.showToast("Mohon isi nama dan doa restu Anda.", "error");
                }
                return;
            }

            const newWish = {
                id: Date.now(),
                name: name,
                message: message,
                timestamp: "Baru saja"
            };

            const wishes = this.getWishes();
            wishes.unshift(newWish);
            this.saveWishes(wishes);
            this.renderWishes();

            if (form.reset) form.reset();

            if (window.WeddingUtils) {
                window.WeddingUtils.showToast("Terima kasih atas doa dan ucapan hangat Anda!", "success");
            }
        });
    }
};

window.WeddingWishes = WeddingWishes;
