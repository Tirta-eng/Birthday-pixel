// =====================================================
// CONFETTI SYSTEM — Pixel-style confetti burst
// =====================================================

const CONFETTI_COLORS = [
  '#ff85b0', '#ffb3ce', '#c878e8', '#e8b0ff',
  '#ffd6e7', '#ffe4a0', '#a0e8ff', '#b0ffd6',
  '#ff5c94', '#d888b8', '#fff0f5', '#f9c0d0',
];

const CONFETTI_SHAPES = ['square', 'rect', 'circle', 'diamond'];

export class ConfettiSystem {
  constructor() {
    this.pieces = [];
    this.running = false;
    this.canvas = null;
    this.ctx = null;
    this.animFrame = null;
    this._init();
  }

  _init() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 997;
    `;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  _createPiece(x, y, isExplosion = false) {
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
    const size  = Math.random() * 8 + 5;

    if (isExplosion) {
      return {
        x, y,
        vx: (Math.random() - 0.5) * 12,
        vy: -(Math.random() * 12 + 5),
        gravity: 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        color, shape, size,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.01 + 0.005,
        isDead: false,
      };
    }

    return {
      x: Math.random() * this.canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1.5,
      gravity: 0.04,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.12,
      color, shape, size,
      opacity: 1,
      life: 1,
      decay: Math.random() * 0.003 + 0.001,
      isDead: false,
    };
  }

  _drawPiece(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;

    switch (p.shape) {
      case 'square':
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        break;
      case 'rect':
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, 0);
        ctx.lineTo(0, p.size / 2);
        ctx.lineTo(-p.size / 2, 0);
        ctx.closePath();
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  // Continuous rain from top
  startRain(duration = 5000, density = 3) {
    this.running = true;
    const spawnInterval = setInterval(() => {
      if (!this.running) { clearInterval(spawnInterval); return; }
      for (let i = 0; i < density; i++) {
        this.pieces.push(this._createPiece(0, 0, false));
      }
    }, 50);

    if (duration > 0) {
      setTimeout(() => {
        this.running = false;
        clearInterval(spawnInterval);
      }, duration);
    }

    if (!this.animFrame) this._animate();
  }

  // Explosion burst from a point
  explode(x, y, count = 80) {
    for (let i = 0; i < count; i++) {
      this.pieces.push(this._createPiece(x, y, true));
    }
    if (!this.animFrame) this._animate();
  }

  // Gentle continuous confetti
  gentleRain(duration = 8000) {
    this.startRain(duration, 2);
  }

  _animate() {
    this.animFrame = requestAnimationFrame(() => this._animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.pieces = this.pieces.filter(p => !p.isDead);

    this.pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      p.opacity = p.life;

      if (p.y > this.canvas.height + 20 || p.life <= 0) {
        p.isDead = true;
      }

      this._drawPiece(p);
    });

    // Stop animation loop if no pieces
    if (this.pieces.length === 0 && !this.running) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }

  stop() {
    this.running = false;
  }

  clear() {
    this.pieces = [];
    this.running = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
