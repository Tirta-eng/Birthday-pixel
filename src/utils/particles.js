// =====================================================
// PARTICLE SYSTEM — Background floating stars, sparkles, hearts
// =====================================================

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animFrame = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Create initial particles
  init(count = 80) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
    this.animate();
  }

  createParticle(randomY = false) {
    const types = ['star', 'heart', 'sparkle', 'circle'];
    const colors = [
      'rgba(255,133,176,', // pink
      'rgba(200,120,232,', // lavender
      'rgba(255,179,206,', // baby pink
      'rgba(255,228,160,', // soft gold
      'rgba(255,193,210,', // peach
      'rgba(232,213,255,', // lavender2
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = Math.random() * 6 + 2;

    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 10,
      size,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.005,
      type: types[Math.floor(Math.random() * types.length)],
      color,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      twinkle: Math.random() > 0.5,
      twinkleSpeed: Math.random() * 0.05 + 0.01,
      phase: Math.random() * Math.PI * 2,
    };
  }

  drawParticle(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const opacity = p.twinkle
      ? p.opacity * (0.5 + 0.5 * Math.sin(p.phase))
      : p.opacity;

    ctx.globalAlpha = opacity;

    switch (p.type) {
      case 'star':
        this.drawStar(ctx, 0, 0, p.size, p.color);
        break;
      case 'heart':
        this.drawHeart(ctx, 0, 0, p.size, p.color);
        break;
      case 'sparkle':
        this.drawSparkle(ctx, 0, 0, p.size, p.color);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${opacity})`;
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  drawStar(ctx, x, y, size, color) {
    // Pixel-style star (cross)
    ctx.fillStyle = `${color}1)`;
    // Center pixel
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    // Glow
    ctx.shadowColor = `${color}0.8)`;
    ctx.shadowBlur = size * 2;
    ctx.fillRect(x - size * 1.5, y - size / 4, size * 3, size / 2);
    ctx.fillRect(x - size / 4, y - size * 1.5, size / 2, size * 3);
    ctx.shadowBlur = 0;
  }

  drawHeart(ctx, x, y, size, color) {
    ctx.fillStyle = `${color}0.9)`;
    ctx.shadowColor = `${color}0.5)`;
    ctx.shadowBlur = size;
    ctx.beginPath();
    const s = size * 0.4;
    ctx.moveTo(x, y + s);
    ctx.bezierCurveTo(x - s * 1.5, y - s, x - s * 3, y + s * 0.5, x, y + s * 2.5);
    ctx.bezierCurveTo(x + s * 3, y + s * 0.5, x + s * 1.5, y - s, x, y + s);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawSparkle(ctx, x, y, size, color) {
    ctx.strokeStyle = `${color}1)`;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = `${color}0.8)`;
    ctx.shadowBlur = size * 1.5;
    const len = size * 1.5;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  animate() {
    this.animFrame = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      p.phase += p.twinkleSpeed;

      // Fade in/out opacity
      p.opacity += p.opacityDir;
      if (p.opacity >= 0.9 || p.opacity <= 0.1) p.opacityDir *= -1;

      // Reset when off screen
      if (p.y < -20) {
        this.particles[i] = this.createParticle(false);
      }

      this.drawParticle(p);
    });
  }

  // Burst of hearts/confetti at a point (for celebrations)
  burst(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
      const p = this.createParticle(true);
      p.x = x;
      p.y = y;
      p.speedX = (Math.random() - 0.5) * 4;
      p.speedY = -(Math.random() * 3 + 1);
      p.opacity = 1;
      p.size = Math.random() * 8 + 4;
      this.particles.push(p);
    }
    // Remove extras after a moment
    setTimeout(() => {
      this.particles.splice(0, count);
    }, 3000);
  }

  destroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}
