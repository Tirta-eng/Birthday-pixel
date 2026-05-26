// =====================================================
// MUSIC PLAYER COMPONENT
// Floating pixel art music player with BGM control
// Music file: /assets/music/bgm.mp3
// =====================================================

export class MusicPlayer {
  constructor() {
    this.audio = null;
    this.playing = false;
    this.initialized = false;
    this.playRequested = false;
    this.container = null;
    this._build();
    this._loadAudio();
  }

  _build() {
    this.container = document.createElement('div');
    this.container.id = 'music-player';
    this.container.innerHTML = `
      <div class="music-label pulse-highlight" id="music-label" aria-live="polite">Every Breath You Take 👈 play me! ✨</div>
      <button
        class="music-toggle-btn"
        id="music-btn"
        aria-label="Play background music"
        title="Play/Pause Music"
      >
        <div class="vinyl-record" id="vinyl-disc">
          <div class="vinyl-grooves"></div>
          <div class="vinyl-center"></div>
          <div class="vinyl-hole"></div>
        </div>
        <div class="vinyl-arm" id="vinyl-arm"></div>
      </button>
    `;
    document.body.appendChild(this.container);

    // Click event
    document.getElementById('music-btn').addEventListener('click', () => {
      this.toggle();
    });
  }

  _loadAudio() {
    // Try to load the BGM file
    // File goes in: public/assets/music/bgm.mp3
    // Vite serves public/ at root, so it's accessible at /assets/music/bgm.mp3
    this.audio = new Audio('/assets/music/bgm.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.5;

    this.audio.addEventListener('canplaythrough', () => {
      this.initialized = true;
      this._updateUI();
      if (this.playRequested) {
        this.play();
      }
    });

    this.audio.addEventListener('error', () => {
      // BGM file not found — show placeholder label
      document.getElementById('music-label').textContent = 'Every Breath You Take ✖';
      document.getElementById('music-btn').disabled = true;
      document.getElementById('music-btn').style.opacity = '0.5';
    });
  }

  toggle() {
    if (!this.initialized) return;

    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.playing) return;
    if (!this.initialized) {
      this.playRequested = true;
      return;
    }
    this.audio.play().then(() => {
      this.playing = true;
      this.playRequested = false;
      this._updateUI();
    }).catch(e => {
      console.warn('Autoplay blocked:', e);
    });
  }

  pause() {
    if (!this.playing) return;
    this.audio.pause();
    this.playing = false;
    this._updateUI();
  }

  // Fade volume in/out for smooth transitions
  fadeIn(duration = 1000) {
    if (!this.initialized) return;
    if (this.playing) return; // Keep playing continuously if already turned on
    this.audio.volume = 0;
    this.play();
    const step = 0.05 / (duration / 100);
    const fade = setInterval(() => {
      if (this.audio.volume < 0.5) {
        this.audio.volume = Math.min(0.5, this.audio.volume + step);
      } else {
        clearInterval(fade);
      }
    }, 100);
  }

  fadeOut(duration = 1000) {
    if (!this.initialized || !this.playing) return;
    const step = this.audio.volume / (duration / 100);
    const fade = setInterval(() => {
      if (this.audio.volume > 0.01) {
        this.audio.volume = Math.max(0, this.audio.volume - step);
      } else {
        this.audio.volume = 0;
        this.pause();
        clearInterval(fade);
      }
    }, 100);
  }

  _updateUI() {
    const btn   = document.getElementById('music-btn');
    const label = document.getElementById('music-label');

    if (this.playing) {
      btn.classList.add('playing');
      btn.setAttribute('aria-label', 'Pause background music');
      label.textContent = 'Every Breath You Take 🎵';
      label.classList.remove('pulse-highlight');
    } else {
      btn.classList.remove('playing');
      btn.setAttribute('aria-label', 'Play background music');
      label.textContent = 'Every Breath You Take 👈 play me! ✨';
      label.classList.add('pulse-highlight');
    }
  }
}
