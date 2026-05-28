/**
 * AssetLoader — Profe RPG Engine
 * Inspirado en el sistema DRS de Age of Empires II.
 * Carga assets externos con fallback a renderizado procedural.
 * 
 * USO:
 *   const loader = new AssetLoader('./assets');
 *   await loader.load();
 *   const tileImg = loader.get('sprites/tiles-school.png');
 *   if (tileImg) ctx.drawImage(tileImg, sx, sy, 32, 32, dx, dy, 32, 32);
 *   else drawProceduralTile(ctx, sx, sy, tileType); // fallback
 */

class AssetLoader {
  constructor(basePath = './assets') {
    this.base = basePath;
    this.cache = new Map();     // path → HTMLImageElement | object
    this.failed = new Set();    // paths que fallaron (usar fallback)
    this.total = 0;
    this.loaded = 0;
  }

  // Carga un PNG. Retorna Promise<HTMLImageElement|null>
  loadImage(path) {
    if (this.cache.has(path)) return Promise.resolve(this.cache.get(path));
    if (this.failed.has(path)) return Promise.resolve(null);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { this.cache.set(path, img); this.loaded++; resolve(img); };
      img.onerror = () => { this.failed.add(path); this.loaded++; resolve(null); };
      img.src = `${this.base}/${path}`;
    });
  }

  // Carga un JSON. Retorna Promise<object|null>
  loadJSON(path) {
    if (this.cache.has(path)) return Promise.resolve(this.cache.get(path));
    return fetch(`${this.base}/${path}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) this.cache.set(path, data); return data; })
      .catch(() => null);
  }

  // Carga todos los assets registrados en manifesto
  async loadManifest(manifest) {
    const tasks = [];
    for (const path of (manifest.images || [])) tasks.push(this.loadImage(path));
    for (const path of (manifest.data   || [])) tasks.push(this.loadJSON(path));
    this.total = tasks.length;
    this.loaded = 0;
    await Promise.all(tasks);
    return this;
  }

  get(path) { return this.cache.get(path) ?? null; }
  isLoaded(path) { return this.cache.has(path); }
  hasFailed(path) { return this.failed.has(path); }
  get progress() { return this.total > 0 ? this.loaded / this.total : 1; }
}

// ── SpriteSheet ──────────────────────────────────────────────
// Referencia una región dentro de un PNG (igual que AoE2 SLP frames)
class SpriteSheet {
  constructor(image, tileW = 32, tileH = 32) {
    this.img = image;
    this.tw = tileW;
    this.th = tileH;
    this.cols = Math.floor(image.width  / tileW);
    this.rows = Math.floor(image.height / tileH);
  }

  // Dibuja el tile en (col, row) del spritesheet en (dx, dy) del canvas
  draw(ctx, col, row, dx, dy, w = this.tw, h = this.th) {
    ctx.drawImage(this.img, col * this.tw, row * this.th, this.tw, this.th, dx, dy, w, h);
  }
}

// ── Exportar para uso en el HTML principal ───────────────────
if (typeof window !== 'undefined') {
  window.AssetLoader = AssetLoader;
  window.SpriteSheet = SpriteSheet;
}
