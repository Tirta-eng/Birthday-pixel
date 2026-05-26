// =====================================================
// PIXEL TRANSITION — Cinematic pixel wipe between pages
// =====================================================

export class PixelTransition {
  constructor() {
    this.overlay = document.getElementById('pixel-transition');
    this.cells = [];
    this._buildGrid();
  }

  _buildGrid() {
    this.overlay.innerHTML = '';
    const cols = 20;
    const rows = 20;
    for (let i = 0; i < cols * rows; i++) {
      const cell = document.createElement('div');
      cell.className = 'pixel-cell';
      // Randomize color slightly
      const hue  = Math.random() * 30 + 320; // pink range
      const sat  = Math.random() * 20 + 70;
      const lite = Math.random() * 20 + 70;
      cell.style.background = `hsl(${hue},${sat}%,${lite}%)`;
      this.overlay.appendChild(cell);
      this.cells.push(cell);
    }
  }

  // Cover screen (pixels fill in)
  async coverIn(duration = 600) {
    return new Promise(resolve => {
      this.overlay.style.opacity = '1';
      this.overlay.style.pointerEvents = 'all';
      // Shuffle cells for random fill order
      const shuffled = [...this.cells].sort(() => Math.random() - 0.5);
      const delay = duration / this.cells.length;

      shuffled.forEach((cell, i) => {
        setTimeout(() => {
          cell.style.transform = 'scale(1.05)';
          cell.style.transition = `transform ${Math.random() * 80 + 60}ms ease-in`;
        }, i * delay * 0.4);
      });

      setTimeout(resolve, duration);
    });
  }

  // Uncover screen (pixels clear out)
  async coverOut(duration = 600) {
    return new Promise(resolve => {
      const shuffled = [...this.cells].sort(() => Math.random() - 0.5);
      const delay = duration / this.cells.length;

      shuffled.forEach((cell, i) => {
        setTimeout(() => {
          cell.style.transform = 'scale(0)';
          cell.style.transition = `transform ${Math.random() * 80 + 60}ms ease-out`;
        }, i * delay * 0.4);
      });

      setTimeout(() => {
        this.overlay.style.opacity = '0';
        this.overlay.style.pointerEvents = 'none';
        resolve();
      }, duration);
    });
  }

  // Full transition: cover -> callback -> uncover
  async transition(callback, inDuration = 500, outDuration = 500) {
    await this.coverIn(inDuration);
    if (callback) callback();
    await new Promise(r => setTimeout(r, 100));
    await this.coverOut(outDuration);
  }
}
