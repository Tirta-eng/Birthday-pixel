// =====================================================
// PAGE 3 — FINAL MESSAGE
// Emotional birthday message with typed text
// =====================================================

// Message content — easy to customize!
const MESSAGES = {
  wishes: `May today be as bright and beautiful as you are.
May every dream you hold close start to bloom,
and every good thing find its way to you.`,

  heartfelt: `You are someone truly special —
the kind of person who makes the world softer,
warmer, and more magical just by being in it.

On your birthday, I hope you feel just how
deeply you are loved, appreciated, and seen.
Not just today — but every single day.`,

  closing: `Here's to you. Here's to all your wishes.
Here's to this beautiful chapter of your life di umur yang udah kepala 2.
Bahagia selalu brads, Wish you all the besttt. Sekali lagi Selamat Ulang Tahun Nayaa. `,

  signature: `- from ur pren, Tirtaaa !! `
};

export function buildFinalPage() {
  const page = document.createElement('div');
  page.id = 'page-final';
  page.className = 'page';

  page.innerHTML = `
    <!-- Night Sky Canvas -->
    <canvas id="night-canvas" style="
      position:absolute; inset:0; width:100%; height:100%;
      pointer-events:none; z-index:1;
    "></canvas>

    <div class="final-content">

      <!-- Section 1: Happy Birthday -->
      <section class="final-section" id="fs-1" aria-labelledby="hb-heading">
        <div class="hb-emoji-row" aria-hidden="true">
          <span>🎂</span><span>✨</span><span>🎉</span><span>💕</span><span>🌸</span><span>🎊</span>
        </div>
        <h1 class="hb-title" id="hb-heading">
          Happy<br>Birthday<br>to You !!
        </h1>
        <div class="hb-emoji-row" aria-hidden="true">
          <span>🌟</span><span>💝</span><span>🦋</span><span>🌙</span><span>🌈</span><span>🎈</span>
        </div>
      </section>

      <div class="pixel-divider"></div>

      <!-- Section 2: Wishes -->
      <section class="final-section" id="fs-2" aria-labelledby="wishes-label">
        <span class="typed-label" id="wishes-label">✦ birthday wishes ✦</span>
        <p class="typed-text" id="wishes-text" aria-live="polite"></p>
      </section>

      <div class="pixel-divider"></div>

      <!-- Section 3: Heartfelt -->
      <section class="final-section" id="fs-3" aria-labelledby="heartfelt-label">
        <span class="typed-label" id="heartfelt-label">✦ from the heart ✦</span>
        <p class="heartfelt-text" id="heartfelt-text" aria-live="polite"></p>
      </section>

      <div class="pixel-divider"></div>

      <!-- Section 4: Closing -->
      <section class="final-section" id="fs-4" aria-labelledby="closing-label">
        <span class="typed-label" id="closing-label">✦ always & forever ✦</span>
        <p class="closing-text" id="closing-text" aria-live="polite"></p>
        <p class="closing-sig" id="closing-sig" style="opacity:0;transition:opacity 1s"></p>
      </section>

      <!-- Replay button -->
      <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:8px;">
        <button class="pixel-btn" id="replay-btn" style="font-size:0.5rem;">
          🔁 replay from start
        </button>
        <button class="pixel-btn secondary" id="more-confetti-btn" style="font-size:0.5rem;">
          🎊 more confetti!
        </button>
      </div>

    </div>
  `;

  return page;
}

// =====================================================
// NIGHT SKY RENDERER — Twinkling pixel stars
// =====================================================

export class NightSkyRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
    this.meteors = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this._initStars();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._initStars();
  }

  _initStars() {
    const count = Math.min(180, Math.floor(window.innerWidth * window.innerHeight / 4000));
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push(this._createStar());
    }
  }

  _createStar() {
    const colors = [
      'rgba(255,200,220,', 'rgba(255,220,240,', 'rgba(220,200,255,',
      'rgba(255,255,220,', 'rgba(200,220,255,', 'rgba(255,180,200,',
    ];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
      type: Math.random() > 0.7 ? 'cross' : 'dot',
    };
  }

  _drawStar(s) {
    const ctx = this.ctx;
    s.phase += s.speed;
    const brightness = 0.4 + 0.6 * Math.abs(Math.sin(s.phase));

    ctx.save();
    ctx.globalAlpha = brightness;

    if (s.type === 'cross') {
      ctx.fillStyle = `${s.color}1)`;
      ctx.shadowColor = `${s.color}0.8)`;
      ctx.shadowBlur = s.size * 2;
      ctx.fillRect(s.x - s.size / 2, s.y - s.size * 1.5, s.size, s.size * 3);
      ctx.fillRect(s.x - s.size * 1.5, s.y - s.size / 2, s.size * 3, s.size);
      ctx.shadowBlur = 0;
    } else {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `${s.color}1)`;
      ctx.fill();
    }

    ctx.restore();
  }

  _spawnMeteor() {
    if (Math.random() > 0.998) {
      this.meteors.push({
        x: Math.random() * window.innerWidth,
        y: 0,
        vx: 3 + Math.random() * 2,
        vy: 2 + Math.random() * 1.5,
        life: 1,
      });
    }
  }

  _drawMeteors() {
    const ctx = this.ctx;
    this.meteors = this.meteors.filter(m => m.life > 0);
    this.meteors.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.02;
      const len = 40;
      const grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * len / m.vx, m.y - m.vy * len / m.vy);
      grd.addColorStop(0, `rgba(255,220,240,${m.life})`);
      grd.addColorStop(1, 'rgba(255,220,240,0)');
      ctx.beginPath();
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 10, m.y - m.vy * 10);
      ctx.stroke();
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stars.forEach(s => this._drawStar(s));
    this._spawnMeteor();
    this._drawMeteors();
    this._animFrame = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
  }
}

// =====================================================
// TYPEWRITER EFFECT
// =====================================================

export async function typeWriter(element, text, speed = 35) {
  element.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  element.appendChild(cursor);

  for (const char of text) {
    const node = document.createTextNode(char);
    element.insertBefore(node, cursor);
    await new Promise(r => setTimeout(r, speed));
  }

  // Blink cursor for a moment then remove
  return new Promise(r => setTimeout(() => {
    cursor.remove();
    r();
  }, 1500));
}

export { MESSAGES };
