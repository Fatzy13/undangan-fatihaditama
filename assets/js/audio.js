/**
 * Music Player Controller
 * Audio state management (ON/OFF), floating button, spinning vinyl animation,
 * and resilient autoplay handling with Web Audio API fallback.
 */

const MusicPlayer = {
    audio: null,
    isPlaying: false,
    audioUrl: "assets/music/wedding-song.mp3",
    synthContext: null,
    synthInterval: null,
    isSynthPlaying: false,

    init() {
        this.audioUrl = (window.weddingData && window.weddingData.musicUrl) || this.audioUrl;
        this.audio = new Audio();
        this.audio.src = this.audioUrl;
        this.audio.loop = true;
        this.audio.preload = "none";

        // Listen for errors (e.g. 404 or unsupported format)
        this.audio.addEventListener("error", (e) => {
            console.info("Audio file not found or blocked. Using ambient romantic audio synthesizer fallback.");
        });

        // Floating music button trigger
        const musicBtn = document.getElementById("music-toggle-btn");
        if (musicBtn) {
            musicBtn.addEventListener("click", () => {
                this.toggle();
            });
        }
    },

    /**
     * Start playback (called when user clicks "Buka Undangan" or toggle)
     */
    play() {
        if (!this.audio) this.init();

        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.isPlaying = true;
                    this.updateUI();
                })
                .catch((err) => {
                    console.warn("Native audio play deferred/blocked:", err);
                    // Fallback to soft ambient harmonic chime with Web Audio API
                    this.startAmbientSynth();
                    this.isPlaying = true;
                    this.updateUI();
                });
        }
    },

    /**
     * Pause playback
     */
    pause() {
        if (this.audio) {
            this.audio.pause();
        }
        this.stopAmbientSynth();
        this.isPlaying = false;
        this.updateUI();
    },

    /**
     * Toggle play/pause
     */
    toggle() {
        if (this.isPlaying) {
            this.pause();
            if (window.WeddingUtils) {
                window.WeddingUtils.showToast("Musik dimatikan", "info");
            }
        } else {
            this.play();
            if (window.WeddingUtils) {
                window.WeddingUtils.showToast("Musik diputar", "success");
            }
        }
    },

    /**
     * Update Floating Button appearance and animations
     */
    updateUI() {
        const musicBtn = document.getElementById("music-toggle-btn");
        const musicIcon = document.getElementById("music-icon");
        const musicStatus = document.getElementById("music-status-text");

        if (musicBtn) {
            if (this.isPlaying) {
                musicBtn.classList.add("playing");
                musicBtn.setAttribute("aria-label", "Matikan Musik");
                if (musicStatus) musicStatus.textContent = "Music ON";
            } else {
                musicBtn.classList.remove("playing");
                musicBtn.setAttribute("aria-label", "Putar Musik");
                if (musicStatus) musicStatus.textContent = "Music OFF";
            }
        }
    },

    /**
     * Elegant Web Audio API romantic piano/harp progression fallback
     * Ensures music plays immediately even if offline / mp3 file missing
     */
    startAmbientSynth() {
        if (this.isSynthPlaying) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            if (!this.synthContext) {
                this.synthContext = new AudioContext();
            }
            if (this.synthContext.state === "suspended") {
                this.synthContext.resume();
            }

            // Romantic chord notes (Canon in D / Romantic Pentatonic in Hz)
            const chords = [
                [261.63, 329.63, 392.00, 523.25], // C Major
                [220.00, 261.63, 329.63, 440.00], // A Minor
                [174.61, 220.00, 261.63, 349.23], // F Major
                [196.00, 246.94, 293.66, 392.00]  // G Major
            ];

            let chordIndex = 0;
            let noteStep = 0;

            const playNote = (freq, duration, gainVal = 0.04) => {
                if (!this.synthContext || !this.isSynthPlaying) return;
                const osc = this.synthContext.createOscillator();
                const gain = this.synthContext.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, this.synthContext.currentTime);

                // Gentle envelope
                gain.gain.setValueAtTime(0.001, this.synthContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(gainVal, this.synthContext.currentTime + 0.15);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.synthContext.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.synthContext.destination);

                osc.start();
                osc.stop(this.synthContext.currentTime + duration);
            };

            this.isSynthPlaying = true;
            this.synthInterval = setInterval(() => {
                if (!this.isSynthPlaying) return;
                const currentChord = chords[chordIndex];
                const note = currentChord[noteStep % currentChord.length];
                playNote(note, 2.2, 0.035);

                noteStep++;
                if (noteStep % currentChord.length === 0) {
                    chordIndex = (chordIndex + 1) % chords.length;
                }
            }, 600);

        } catch (e) {
            console.warn("Synthesizer error:", e);
        }
    },

    stopAmbientSynth() {
        this.isSynthPlaying = false;
        if (this.synthInterval) {
            clearInterval(this.synthInterval);
            this.synthInterval = null;
        }
    }
};

window.MusicPlayer = MusicPlayer;
