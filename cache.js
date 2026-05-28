/**
 * TileCache — OffscreenCanvas por mapa
 * 
 * El patrón de AoE2: los terrenos se pre-renderizaban en buffers.
 * Aquí renderizamos cada mapa a un OffscreenCanvas UNA VEZ.
 * El loop solo llama ctx.drawImage(cached, -camX, -camY) en la capa estática.
 * 
 * USO:
 *   TileCache.prerender('pasillo', MAPS.pasillo, drawPasilloTile);
 *   // En drawMap():
 *   const cached = TileCache.get('pasillo');
 *   if (cached) ctx.drawImage(cached, -camera.x*TS, -camera.y*TS);
 *   // Luego solo dibujar NPCs/player/efectos encima
 */

const TileCache = (() => {
  const store = new Map();      // mapname → OffscreenCanvas
  const dirty = new Set();      // mapas que necesitan re-render

  const TS = 32; // tile size

  return {
    // Pre-renderiza todos los tiles estáticos de un mapa
    prerender(mapname, mapData, drawFn) {
      const rows = mapData.length, cols = mapData[0].length;
      const oc = new OffscreenCanvas(cols * TS, rows * TS);
      const octx = oc.getContext('2d');
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const t = mapData[r][c];
          if (TileCache.isStatic(t)) {
            drawFn(t, c * TS, r * TS, r, c, octx);
          }
        }
      }
      store.set(mapname, oc);
      dirty.delete(mapname);
    },

    get(mapname) { return store.get(mapname) ?? null; },
    invalidate(mapname) { dirty.add(mapname); store.delete(mapname); },
    isDirty(mapname) { return dirty.has(mapname); },

    // Tiles que NO necesitan redibujarse cada frame (sin animación)
    isStatic(t) {
      const ANIMATED = new Set(['E','S','8','Z','V','N','^','>','*','@','%','C','r','$','!','~','?','L']);
      return !ANIMATED.has(t);
    },

    // Dibuja en el canvas principal usando el cache
    blitToCanvas(ctx, mapname, camera) {
      const oc = store.get(mapname);
      if (!oc) return false;
      ctx.drawImage(oc, -camera.x * TS, -camera.y * TS);
      return true;
    }
  };
})();

if (typeof window !== 'undefined') window.TileCache = TileCache;
