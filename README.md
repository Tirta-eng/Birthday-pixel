# 🎂 Birthday Pixel Art — Interactive Experience

A magical, dreamy, and emotional pixel art birthday website with interactive features.

## ✨ Features

- **3-Page Story Flow**: Intro → Blow the Candle → Final Message
- **Pixel Art Birthday Cake**: Hand-drawn in Canvas with animated flame
- **Blow Detection**: Uses Web Audio API to detect when you blow into your mic
- **Typed Text Effect**: Emotional messages appear letter by letter
- **Night Sky**: Twinkling pixel stars with occasional shooting stars
- **Confetti System**: Pixel-style confetti rain and explosions
- **Particle Background**: Floating stars, hearts, and sparkles
- **Cinematic Transitions**: Pixel wipe effect between pages
- **Synthesized Sound Effects**: No audio file dependencies for SFX
- **Background Music Player**: Floating aesthetic music control

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🎵 Adding Background Music

1. Place your music file at: `public/assets/music/bgm.mp3`
2. The music player will automatically detect and enable it
3. Supports any format your browser supports (mp3, ogg, wav)

## 📁 Project Structure

```
Birthday-pixel/
├── index.html
├── public/
│   └── favicon.svg
├── assets/
│   └── music/
│       └── bgm.mp3          ← Place your music here!
├── src/
│   ├── main.js              ← App orchestrator
│   ├── style.css            ← Global styles & design tokens
│   ├── pages/
│   │   ├── intro.js         ← Page 1: Gift intro
│   │   ├── candle.js        ← Page 2: Blow the candle + cake renderer
│   │   └── final.js         ← Page 3: Birthday messages
│   ├── components/
│   │   └── musicPlayer.js   ← Floating music player
│   └── utils/
│       ├── particles.js     ← Background floating particles
│       ├── confetti.js      ← Confetti system
│       ├── transition.js    ← Pixel wipe transition
│       └── sound.js         ← Web Audio API sound effects
```

## 🎨 Customization

### Change Birthday Messages
Edit `src/pages/final.js` → `MESSAGES` object at the top.

### Change Colors
Edit CSS variables in `src/style.css` → `:root` block.

### Change Person's Name
Add to the `MESSAGES` in `final.js`.

## 🛠️ Built With

- Vite (build tool)
- Vanilla JavaScript (ES Modules)
- Web Audio API (mic detection + synth sounds)
- Canvas API (cake drawing, particles, confetti, night sky)
- Google Fonts (Press Start 2P, VT323, Nunito)

## 📱 Responsive

Works on mobile and desktop. Microphone permission required for blow detection — tap button fallback provided.
