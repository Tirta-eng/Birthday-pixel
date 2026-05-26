# 🎂 Birthday Pixel

Website ucapan ulang tahun pixel art interaktif. Ada kue, tiup lilin, confetti, langit malam — lengkap deh pokoknya.

## Fitur

- 🎁 Halaman intro → tiup lilin → pesan ucapan
- 🎨 Kue pixel art yang digambar pake Canvas
- 🌬️ Deteksi tiupan lewat mic (atau klik aja juga bisa)
- ⭐ Langit malam + bintang jatuh
- 🎊 Confetti pixel style
- 🎵 Background music player
- ✨ Efek transisi pixel wipe antar halaman

## Cara Pake

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## Musik

Taruh file musik di `public/assets/music/bgm.mp3`, nanti otomatis kepake.

## Kustomisasi

- Ganti pesan ucapan → edit `src/pages/final.js` bagian `MESSAGES`
- Ganti warna → edit CSS variables di `src/style.css`

## Tech Stack

Vanilla JS + Vite + Canvas API + Web Audio API
