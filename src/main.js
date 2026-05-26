// =====================================================
// MAIN.JS — App Orchestrator
// Birthday Pixel Art Interactive Experience
// =====================================================

import './style.css';
import { ParticleSystem }  from './utils/particles.js';
import { ConfettiSystem }  from './utils/confetti.js';
import { PixelTransition } from './utils/transition.js';
import { SoundSystem }     from './utils/sound.js';
import { MusicPlayer }     from './components/musicPlayer.js';
import { buildIntroPage }  from './pages/intro.js';
import { buildCandlePage, CakeRenderer } from './pages/candle.js';
import { buildFinalPage, NightSkyRenderer, typeWriter, MESSAGES } from './pages/final.js';

// =====================================================
// APP STATE
// =====================================================
const state = {
  currentPage: 0,   // 0=intro, 1=candle, 2=final
  candleBlown: false,
  cakeRenderer: null,
  nightSky: null,
  particles: null,
  confetti: null,
  transition: null,
  sound: null,
  music: null,
};

// =====================================================
// LOADING SCREEN
// =====================================================
function buildLoadingScreen() {
  const el = document.createElement('div');
  el.id = 'loading-screen';
  el.innerHTML = `
    <div style="font-size:3rem;animation:gift-float 2s ease-in-out infinite">🎁</div>
    <div class="loading-title">loading your<br>surprise...</div>
    <div class="loading-bar-container">
      <div class="loading-bar-fill" id="loading-bar"></div>
    </div>
    <div class="loading-percent" id="loading-pct">0%</div>
  `;
  return el;
}

async function runLoadingScreen(loadingEl) {
  const bar = document.getElementById('loading-bar');
  const pct = document.getElementById('loading-pct');
  let progress = 0;

  return new Promise(resolve => {
    const steps = [
      { target: 30, delay: 120 },
      { target: 60, delay: 80 },
      { target: 85, delay: 140 },
      { target: 100, delay: 60 },
    ];

    const runStep = (stepIndex) => {
      if (stepIndex >= steps.length) {
        setTimeout(() => {
          loadingEl.classList.add('hidden');
          setTimeout(() => { loadingEl.remove(); resolve(); }, 650);
        }, 300);
        return;
      }

      const { target, delay } = steps[stepIndex];
      const inc = () => {
        if (progress < target) {
          progress++;
          bar.style.width = `${progress}%`;
          pct.textContent = `${progress}%`;
          setTimeout(inc, delay);
        } else {
          runStep(stepIndex + 1);
        }
      };
      inc();
    };

    runStep(0);
  });
}

// =====================================================
// PAGE SYSTEM
// =====================================================
function showPage(pageEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  pageEl.classList.add('active');
}

// =====================================================
// FLOATING HEARTS SPAWNER (for final page)
// =====================================================
function spawnFloatingElement(emoji, x, y) {
  const el = document.createElement('div');
  el.className = 'float-element';
  el.textContent = emoji;
  el.style.cssText = `
    left: ${x}px;
    top: ${y}px;
    font-size: ${Math.random() * 16 + 12}px;
    animation-duration: ${Math.random() * 1.5 + 1}s;
    animation-delay: 0s;
  `;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

// =====================================================
// SETUP INTRO PAGE
// =====================================================
function setupIntroPage(pageEl) {
  const btn = pageEl.querySelector('#intro-btn');

  btn.addEventListener('mouseenter', () => state.sound?.playTick());

  btn.addEventListener('click', async () => {
    await state.sound?.resume();
    state.sound?.playSparkle();

    // Burst particles at button position
    const rect = btn.getBoundingClientRect();
    state.particles?.burst(rect.left + rect.width/2, rect.top + rect.height/2, 20);

    // Pixel transition to page 2
    await state.transition.transition(() => {
      showPage(document.getElementById('page-candle'));
      state.currentPage = 1;
      setupCandlePageActive();
    }, 550, 550);
  });
}

// =====================================================
// SETUP CANDLE PAGE (called when page becomes active)
// =====================================================
function setupCandlePageActive() {
  const canvas = document.getElementById('cake-canvas');
  if (!canvas || state.cakeRenderer) return;

  // Start cake animation
  state.cakeRenderer = new CakeRenderer(canvas);
  state.cakeRenderer.start();

  const blowHint = document.getElementById('blow-instructions');

  const triggerCandleBlow = async () => {
    if (state.candleBlown) return;
    state.candleBlown = true;

    // Visual feedback
    blowHint && (blowHint.textContent = '✨ wish granted!');

    // Blow out the cake
    state.cakeRenderer?.blowOut();
    state.sound?.playCandleOut();

    // Screen glow effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;
      background:rgba(255,220,240,0.4);
      pointer-events:none;z-index:100;
      animation:glow-flash 0.8s ease-out forwards;
    `;
    document.body.appendChild(overlay);

    const glowStyle = document.createElement('style');
    glowStyle.textContent = `
      @keyframes glow-flash {
        0% { opacity:0; }
        30% { opacity:1; }
        100% { opacity:0; }
      }
    `;
    document.head.appendChild(glowStyle);
    overlay.addEventListener('animationend', () => { overlay.remove(); glowStyle.remove(); });

    // Confetti burst
    state.confetti.explode(window.innerWidth / 2, window.innerHeight / 2, 100);
    setTimeout(() => state.confetti.gentleRain(4000), 300);

    // Celebration sound
    setTimeout(() => state.sound?.playCelebration(), 400);

    // Transition to final page after delay
    await new Promise(r => setTimeout(r, 2200));

    await state.transition.transition(() => {
      showPage(document.getElementById('page-final'));
      state.currentPage = 2;
      setupFinalPageActive();
    }, 550, 550);
  };

  // Click on canvas to blow the candle
  canvas.addEventListener('click', async () => {
    await state.sound?.resume();
    state.sound?.playSparkle();
    triggerCandleBlow();
  });
}

// =====================================================
// SETUP FINAL PAGE (called when page becomes active)
// =====================================================
async function setupFinalPageActive() {
  // Start night sky
  const nightCanvas = document.getElementById('night-canvas');
  if (nightCanvas) {
    state.nightSky = new NightSkyRenderer(nightCanvas);
    state.nightSky.animate();
  }

  // Gentle confetti on final page
  state.confetti.gentleRain(6000);

  // Music fade in
  state.music?.fadeIn(2000);

  // Animate sections in with stagger
  const sections = document.querySelectorAll('.final-section');
  sections.forEach((s, i) => {
    setTimeout(() => s.classList.add('visible'), i * 300);
  });

  // Wait then start typed text animations
  await new Promise(r => setTimeout(r, 800));

  // Typed: wishes
  const wishesEl = document.getElementById('wishes-text');
  if (wishesEl) {
    await typeWriter(wishesEl, MESSAGES.wishes, 28);
  }

  await new Promise(r => setTimeout(r, 500));

  // Heartfelt (typed typewriter effect)
  const heartfeltEl = document.getElementById('heartfelt-text');
  if (heartfeltEl) {
    await typeWriter(heartfeltEl, MESSAGES.heartfelt, 24);
  }

  await new Promise(r => setTimeout(r, 800));

  // Closing
  const closingEl = document.getElementById('closing-text');
  if (closingEl) {
    await typeWriter(closingEl, MESSAGES.closing, 22);
  }

  // Signature fade in
  const sigEl = document.getElementById('closing-sig');
  if (sigEl) {
    sigEl.textContent = MESSAGES.signature;
    sigEl.style.opacity = '1';
  }

  // After all text done, do a big celebration
  await new Promise(r => setTimeout(r, 600));
  state.sound?.playCelebration();
  state.confetti.explode(window.innerWidth / 2, window.innerHeight / 3, 80);
  state.confetti.gentleRain(8000);

  // Setup floating hearts on click/touch for final page
  const finalPage = document.getElementById('page-final');
  finalPage?.addEventListener('click', (e) => {
    const emojis = ['💕', '✨', '🌸', '💖', '⭐', '🦋', '💫', '🌟'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    spawnFloatingElement(emoji, e.clientX - 10, e.clientY - 10);
    state.sound?.playSparkle();
  });

  // Replay button
  document.getElementById('replay-btn')?.addEventListener('click', () => {
    replayFromStart();
  });

  // More confetti button
  document.getElementById('more-confetti-btn')?.addEventListener('click', () => {
    state.confetti.explode(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * 0.5,
      60
    );
    state.confetti.gentleRain(3000);
    state.sound?.playSparkle();
  });
}

// =====================================================
// REPLAY
// =====================================================
async function replayFromStart() {
  state.candleBlown = false;
  state.cakeRenderer?.stop();
  state.cakeRenderer = null;
  state.nightSky?.stop();
  state.nightSky = null;
  state.confetti?.clear();
  state.music?.pause();

  const app = document.getElementById('app');

  // Rebuild candle page in its original DOM position (between intro and final)
  const candlePage = document.getElementById('page-candle');
  const finalPage = document.getElementById('page-final');
  if (candlePage) {
    candlePage.remove();
    const newCandle = buildCandlePage();
    // Insert before final page to maintain order: intro → candle → final
    app.insertBefore(newCandle, finalPage);
  }

  // Reset final page content so it replays properly
  const wishesEl = document.getElementById('wishes-text');
  const heartfeltEl = document.getElementById('heartfelt-text');
  const closingEl = document.getElementById('closing-text');
  const sigEl = document.getElementById('closing-sig');
  if (wishesEl) wishesEl.textContent = '';
  if (heartfeltEl) { heartfeltEl.textContent = ''; heartfeltEl.style.opacity = ''; }
  if (closingEl) closingEl.textContent = '';
  if (sigEl) { sigEl.textContent = ''; sigEl.style.opacity = '0'; }

  // Reset section visibility
  document.querySelectorAll('.final-section').forEach(s => s.classList.remove('visible'));

  await state.transition.transition(() => {
    showPage(document.getElementById('page-intro'));
    state.currentPage = 0;
  }, 500, 500);
}

// =====================================================
// INIT — Main entry point
// =====================================================
async function init() {
  const app = document.getElementById('app');

  // Loading screen
  const loadingEl = buildLoadingScreen();
  document.body.appendChild(loadingEl);

  // Pixel transition overlay
  const transitionEl = document.createElement('div');
  transitionEl.id = 'pixel-transition';
  document.body.appendChild(transitionEl);

  // Background particle canvas
  const bgCanvas = document.createElement('canvas');
  bgCanvas.id = 'bg-canvas';
  document.body.appendChild(bgCanvas);

  // Build pages
  const introPage  = buildIntroPage();
  const candlePage = buildCandlePage();
  const finalPage  = buildFinalPage();
  app.appendChild(introPage);
  app.appendChild(candlePage);
  app.appendChild(finalPage);

  // Init systems
  state.transition = new PixelTransition();
  state.sound      = new SoundSystem();
  state.particles  = new ParticleSystem(bgCanvas);
  state.confetti   = new ConfettiSystem();
  state.music      = new MusicPlayer();

  // Start particles
  state.particles.init(70);

  // Setup pages
  setupIntroPage(introPage);

  // Show intro after loading
  await runLoadingScreen(loadingEl);
  showPage(introPage);
  state.currentPage = 0;

  // Auto-play BGM as soon as Page 1 opens (with one-time user gesture unlock)
  const autoPlayBGM = () => {
    state.music?.play();
    document.removeEventListener('click', autoPlayBGM);
    document.removeEventListener('touchstart', autoPlayBGM);
  };
  document.addEventListener('click', autoPlayBGM);
  document.addEventListener('touchstart', autoPlayBGM);

  // Attempt direct play (some browsers allow immediate play if user interacted prior)
  state.music?.play();
}

// Start the app
init();
