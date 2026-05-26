// =====================================================
// PAGE 1 — INTRO
// "someone give u something..."
// =====================================================

export function buildIntroPage() {
  const page = document.createElement('div');
  page.id = 'page-intro';
  page.className = 'page';

  page.innerHTML = `
    <div class="intro-content">
      <!-- Animated gift icon -->
      <div class="intro-gift-icon" aria-hidden="true">🎁</div>

      <!-- Main title -->
      <h1 class="intro-title">
        someone<br>give u<br>something<span class="typed-cursor"></span>
      </h1>

      <!-- Subtle subtitle -->
      <p class="intro-subtitle">✨ a little something special ✨</p>

      <!-- Loading dots animation -->
      <div class="loading-dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>

      <!-- CTA Button -->
      <button class="pixel-btn" id="intro-btn" aria-label="Open your gift">
        take a look...
      </button>
    </div>

    <!-- Decorative pixel flowers -->
    <div class="intro-decorations" aria-hidden="true">
      <span class="deco deco-1">🌸</span>
      <span class="deco deco-2">💫</span>
      <span class="deco deco-3">🌸</span>
      <span class="deco deco-4">✨</span>
      <span class="deco deco-5">💝</span>
      <span class="deco deco-6">🌟</span>
    </div>
  `;

  // Inject decoration styles (only once, guard against replay duplicates)
  if (!document.getElementById('intro-deco-styles')) {
    const style = document.createElement('style');
    style.id = 'intro-deco-styles';
    style.textContent = `
      .intro-decorations {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .deco {
        position: absolute;
        font-size: 1.5rem;
        opacity: 0.4;
        animation: deco-float var(--dur, 4s) ease-in-out infinite var(--delay, 0s);
      }
      @keyframes deco-float {
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
        50% { transform: translateY(-20px) rotate(15deg) scale(1.1); }
      }
      .deco-1 { top: 10%; left: 8%; --dur: 4.2s; --delay: 0s; }
      .deco-2 { top: 15%; right: 12%; --dur: 3.8s; --delay: 0.5s; }
      .deco-3 { top: 75%; left: 5%; --dur: 5s; --delay: 1s; }
      .deco-4 { top: 80%; right: 8%; --dur: 3.5s; --delay: 0.3s; }
      .deco-5 { top: 50%; left: 3%; --dur: 4.5s; --delay: 0.8s; font-size: 2rem; }
      .deco-6 { top: 45%; right: 4%; --dur: 4s; --delay: 1.2s; font-size: 2rem; }
      @media (max-width: 480px) {
        .deco { font-size: 1rem; }
      }
    `;
    document.head.appendChild(style);
  }

  return page;
}
