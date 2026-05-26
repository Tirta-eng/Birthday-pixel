// =====================================================
// SOUND SYSTEM — Web Audio API for sound effects
// =====================================================

export class SoundSystem {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.enabled = true;
    this._init();
  }

  _init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  }

  // Resume on user gesture (required by browsers)
  async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  // Synth tone: frequency (Hz), duration (s), type, volume
  _playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
    if (!this.initialized || !this.enabled) return;
    try {
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {}
  }

  // Happy birthday-ish jingle
  playCelebration() {
    if (!this.initialized || !this.enabled) return;
    const notes = [
      { f: 523, d: 0.15, t: 0 },    // C5
      { f: 523, d: 0.10, t: 0.18 }, // C5
      { f: 587, d: 0.30, t: 0.30 }, // D5
      { f: 523, d: 0.30, t: 0.65 }, // C5
      { f: 698, d: 0.30, t: 1.00 }, // F5
      { f: 659, d: 0.60, t: 1.35 }, // E5
      { f: 523, d: 0.15, t: 2.10 }, // C5
      { f: 523, d: 0.10, t: 2.28 }, // C5
      { f: 587, d: 0.30, t: 2.40 }, // D5
      { f: 523, d: 0.30, t: 2.75 }, // C5
      { f: 784, d: 0.30, t: 3.10 }, // G5
      { f: 698, d: 0.60, t: 3.45 }, // F5
    ];
    notes.forEach(n => this._playTone(n.f, n.d, 'triangle', 0.02, n.t));
  }

  // Candle blow success sound
  playCandleOut() {
    if (!this.initialized || !this.enabled) return;
    // Wind-like whoosh
    const bufLen = this.ctx.sampleRate * 0.3;
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.1;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start();

    // Followed by magic chime
    setTimeout(() => {
      [523, 659, 784, 1047].forEach((f, i) => {
        this._playTone(f, 0.5, 'sine', 0.05, i * 0.08);
      });
    }, 200);
  }

  // Sparkle pop
  playSparkle() {
    if (!this.initialized || !this.enabled) return;
    const freqs = [880, 1108, 1318, 1568];
    freqs.forEach((f, i) => this._playTone(f, 0.15, 'sine', 0.03, i * 0.05));
  }

  // Button hover tick
  playTick() {
    if (!this.initialized || !this.enabled) return;
    this._playTone(1200, 0.05, 'square', 0.015);
  }
}
