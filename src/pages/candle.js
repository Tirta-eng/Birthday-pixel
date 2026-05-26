// =====================================================
// PAGE 2 — BLOW THE CANDLE
// Interactive pixel art birthday cake
// =====================================================

export function buildCandlePage() {
  const page = document.createElement('div');
  page.id = 'page-candle';
  page.className = 'page';

  page.innerHTML = `
    <div class="candle-content">
      <!-- Title -->
      <h2 class="candle-title">make a wish<br>and blow<br>the candle...</h2>

      <!-- Cake Scene -->
      <div class="cake-scene">
        <svg viewBox="0 0 320 60" style="width: 320px; height: 60px; margin-bottom: -15px; overflow: visible;">
          <path id="curve" d="M 20,50 Q 160,5 300,50" fill="transparent" />
          <text font-family="'Press Start 2P', monospace" font-size="11" fill="#ff5c94">
            <textPath href="#curve" startOffset="50%" text-anchor="middle">
              ✦ HAPPY BIRTHDAY ✦
            </textPath>
          </text>
        </svg>
        <canvas id="cake-canvas" width="320" height="260"
          aria-label="Pixel art birthday cake with a lit candle — click to blow"
          style="cursor:pointer;"
        ></canvas>
      </div>

      <!-- Click hint -->
      <p class="blow-instructions" id="blow-instructions">✨ tap the candle to make a wish! ✨</p>
    </div>
  `;

  return page;
}

// =====================================================
// PIXEL ART CAKE RENDERER
// Draws a cute pixel cake on canvas
// =====================================================

export class CakeRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.candleLit = true;
    this.flamePhase = 0;
    this.animFrame = null;
    this.smokeParticles = [];
    this.glowIntensity = 0;
    this.glowDir = 1;

    // Pre-compute random drip heights so they don't flicker each frame
    this._dripHeights1 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 8 + 6));
    this._dripHeights2 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6 + 5));
    this._dripHeights3 = Array.from({ length: 4 }, () => Math.floor(Math.random() * 5 + 4));
  }

  // Draw a pixel-art rectangle (each "pixel" is a block)
  _px(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
  }

  // Draw the static cake layers
  _drawCake() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const cakeX = 60;
    const cakeY = 170;
    const cakeW = W - 120;

    // === Bottom layer (largest) ===
    // Shadow
    this._px(cakeX + 4, cakeY + 4, cakeW, 60, 'rgba(180,80,140,0.3)');
    // Body
    this._px(cakeX, cakeY, cakeW, 60, '#ff85b0');
    // Top shine
    this._px(cakeX + 4, cakeY + 4, cakeW - 8, 8, 'rgba(255,255,255,0.4)');
    // Bottom shadow line
    this._px(cakeX, cakeY + 52, cakeW, 8, '#d060a0');

    // Polka dots on bottom layer
    const dots = [
      [cakeX + 20, cakeY + 25], [cakeX + 60, cakeY + 30], [cakeX + 100, cakeY + 22],
      [cakeX + 140, cakeY + 30], [cakeX + 175, cakeY + 25], [cakeX + 40, cakeY + 40],
      [cakeX + 125, cakeY + 42],
    ];
    dots.forEach(([dx, dy]) => {
      this._px(dx, dy, 8, 8, 'rgba(255,240,245,0.6)');
    });

    // Icing drips on bottom (using cached heights)
    const drips = [cakeX + 15, cakeX + 50, cakeX + 90, cakeX + 130, cakeX + 165];
    drips.forEach((dx, i) => {
      this._px(dx, cakeY, 12, this._dripHeights1[i], '#fff5f8');
    });

    // === Middle layer ===
    const m2X = cakeX + 25;
    const m2Y = cakeY - 52;
    const m2W = cakeW - 50;
    // Shadow
    this._px(m2X + 4, m2Y + 4, m2W, 48, 'rgba(180,80,140,0.3)');
    // Body
    this._px(m2X, m2Y, m2W, 48, '#ffb3ce');
    // Top shine
    this._px(m2X + 4, m2Y + 4, m2W - 8, 6, 'rgba(255,255,255,0.4)');
    // Bottom shadow
    this._px(m2X, m2Y + 40, m2W, 8, '#e090b8');

    // Stars pattern on middle layer
    const stars = [[m2X + 20, m2Y + 18], [m2X + 65, m2Y + 20], [m2X + 105, m2Y + 16], [m2X + 145, m2Y + 20]];
    stars.forEach(([sx, sy]) => {
      this._px(sx + 4, sy, 4, 12, 'rgba(255,220,230,0.7)');
      this._px(sx, sy + 4, 12, 4, 'rgba(255,220,230,0.7)');
    });

    // Icing drips on middle (using cached heights)
    const drips2 = [m2X + 10, m2X + 45, m2X + 80, m2X + 110, m2X + 140];
    drips2.forEach((dx, i) => {
      this._px(dx, m2Y, 10, this._dripHeights2[i], '#fff0f5');
    });

    // === Top layer (smallest) ===
    const t3X = cakeX + 55;
    const t3Y = cakeY - 92;
    const t3W = cakeW - 110;
    // Shadow
    this._px(t3X + 4, t3Y + 4, t3W, 36, 'rgba(180,80,140,0.3)');
    // Body
    this._px(t3X, t3Y, t3W, 36, '#ffd6e7');
    // Top shine
    this._px(t3X + 4, t3Y + 4, t3W - 8, 5, 'rgba(255,255,255,0.5)');
    // Bottom shadow
    this._px(t3X, t3Y + 28, t3W, 8, '#e8a0c8');
    // Heart
    this._px(t3X + 40, t3Y + 14, 6, 6, 'rgba(255,100,150,0.6)');
    this._px(t3X + 30, t3Y + 10, 6, 6, 'rgba(255,100,150,0.6)');
    this._px(t3X + 50, t3Y + 10, 6, 6, 'rgba(255,100,150,0.6)');
    this._px(t3X + 36, t3Y + 20, 14, 6, 'rgba(255,100,150,0.6)');

    // Icing drips on top (using cached heights)
    const drips3 = [t3X + 8, t3X + 30, t3X + 52, t3X + 72];
    drips3.forEach((dx, i) => {
      this._px(dx, t3Y, 9, this._dripHeights3[i], '#fff5fa');
    });

    // === Plate ===
    this._px(cakeX - 10, cakeY + 60, cakeW + 20, 10, '#ffe0f0');
    this._px(cakeX - 20, cakeY + 66, cakeW + 40, 8, '#ffd0e8');

    // === Candle (on top layer) ===
    this.candleBaseX = t3X + (t3W / 2) - 8;
    this.candleBaseY = t3Y;
    this.candleH = 36;
    this.candleW = 16;
    this._drawCandle();
  }

  _drawCandle() {
    const cx = this.candleBaseX;
    const cy = this.candleBaseY - this.candleH;
    const cw = this.candleW;
    const ch = this.candleH;

    // Candle body (gradient effect)
    this._px(cx,      cy, cw,   ch,   '#e8b0ff'); // lavender
    this._px(cx + 2,  cy, cw - 4, ch, '#d898f8'); // slightly darker
    // Highlight stripe
    this._px(cx + 2, cy + 4, 3, ch - 8, 'rgba(255,255,255,0.5)');
    // Stripes
    for (let i = 0; i < 3; i++) {
      this._px(cx, cy + 8 + i * 10, cw, 3, 'rgba(255,255,255,0.3)');
    }
    // Wick
    this._px(cx + (cw >> 1) - 1, cy - 8, 2, 10, '#555');
  }

  _drawFlame() {
    if (!this.candleLit) return;

    const ctx = this.ctx;
    const fx = this.candleBaseX + (this.candleW >> 1);
    const fy = this.candleBaseY - this.candleH - 8;

    // Update phase
    this.flamePhase += 0.12;
    const flicker = Math.sin(this.flamePhase) * 3;
    const flicker2 = Math.cos(this.flamePhase * 1.3) * 2;

    // Glow halo
    const grd = ctx.createRadialGradient(fx, fy, 2, fx, fy, 30 + flicker);
    grd.addColorStop(0, 'rgba(255,220,80,0.5)');
    grd.addColorStop(0.5, 'rgba(255,140,60,0.2)');
    grd.addColorStop(1, 'rgba(255,80,30,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(fx, fy, 30 + flicker, 0, Math.PI * 2);
    ctx.fill();

    // Outer flame
    ctx.fillStyle = `rgba(255,160,30,0.9)`;
    ctx.beginPath();
    ctx.moveTo(fx, fy - 18 - flicker);
    ctx.bezierCurveTo(
      fx + 8 + flicker2, fy - 10,
      fx + 6,            fy + 6,
      fx,                fy + 8
    );
    ctx.bezierCurveTo(
      fx - 6,            fy + 6,
      fx - 8 - flicker2, fy - 10,
      fx,                fy - 18 - flicker
    );
    ctx.fill();

    // Inner flame core
    ctx.fillStyle = `rgba(255,240,100,0.95)`;
    ctx.beginPath();
    ctx.moveTo(fx, fy - 12 - flicker * 0.7);
    ctx.bezierCurveTo(fx + 4, fy - 5, fx + 3, fy + 4, fx, fy + 6);
    ctx.bezierCurveTo(fx - 3, fy + 4, fx - 4, fy - 5, fx, fy - 12 - flicker * 0.7);
    ctx.fill();

    // White tip
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(fx, fy - 10 - flicker * 0.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Cast light on top of cake
    this.glowIntensity += 0.03 * this.glowDir;
    if (this.glowIntensity > 1) this.glowDir = -1;
    if (this.glowIntensity < 0) this.glowDir = 1;
    ctx.fillStyle = `rgba(255,220,100,${0.05 + this.glowIntensity * 0.06})`;
    ctx.beginPath();
    ctx.ellipse(fx, this.candleBaseY - this.candleH - 10, 60, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawSmoke() {
    const ctx = this.ctx;
    this.smokeParticles = this.smokeParticles.filter(p => p.life > 0);
    this.smokeParticles.forEach(p => {
      p.y -= 1.2;
      p.x += Math.sin(p.life * 0.1) * 0.5;
      p.life -= 2;
      p.size += 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,200,220,${p.life / 100 * 0.5})`;
      ctx.fill();
    });

    // Spawn new smoke
    if (!this.candleLit) {
      const fx = this.candleBaseX + (this.candleW >> 1);
      const fy = this.candleBaseY - this.candleH - 8;
      if (Math.random() > 0.4) {
        this.smokeParticles.push({ x: fx + (Math.random()-0.5)*4, y: fy, size: 3, life: 100 });
      }
    }
  }

  start() {
    const draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this._drawCake();
      this._drawFlame();
      this._drawSmoke();
      this.animFrame = requestAnimationFrame(draw);
    };
    draw();
  }

  blowOut() {
    this.candleLit = false;
    // Spawn initial puff of smoke
    const fx = this.candleBaseX + (this.candleW >> 1);
    const fy = this.candleBaseY - this.candleH - 8;
    for (let i = 0; i < 8; i++) {
      this.smokeParticles.push({
        x: fx + (Math.random()-0.5)*8,
        y: fy - i*2,
        size: 4 + i,
        life: 80 - i*5
      });
    }
  }

  stop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}
