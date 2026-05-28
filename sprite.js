/**
 * SpriteSystem — Animaciones por frames
 * 
 * AoE2 usaba SLP (Shape Library Procedure) con frames y ángulos.
 * Aquí: cada personaje tiene frames de animación (idle, walk, battle).
 * 
 * CREAR SPRITESHEET chars.png (192×128):
 *   Columnas: 0=idle_down, 1=walk1_down, 2=walk2_down,
 *             3=idle_up,   4=walk1_up,   5=walk2_up,
 *             6=battle_1,  7=battle_2
 *   Filas:    0=Felipe, 1=Carol, 2=Antonio, 3=Jorge, 4=generic_student
 * 
 * Tamaño de cada frame: 32×32 px
 */

class SpriteAnimator {
  constructor(sheet, fps = 6) {
    this.sheet = sheet;   // SpriteSheet instance
    this.fps   = fps;
    this.anims = {};      // name → { frames: [[col,row],...], loop: bool }
    this.current = null;
    this.frame = 0;
    this.lastTick = 0;
  }

  // Define una animación: addAnim('walk_down', [[1,0],[2,0]], true)
  addAnim(name, frames, loop = true) {
    this.anims[name] = { frames, loop };
    return this;
  }

  play(name) {
    if (this.current !== name) { this.current = name; this.frame = 0; }
  }

  // tick = game tick (para timing independiente del fps del navegador)
  update(tick) {
    const anim = this.anims[this.current];
    if (!anim) return;
    const frameDuration = Math.ceil(60 / this.fps);
    if (tick - this.lastTick >= frameDuration) {
      this.lastTick = tick;
      this.frame++;
      if (this.frame >= anim.frames.length) {
        this.frame = anim.loop ? 0 : anim.frames.length - 1;
      }
    }
  }

  draw(ctx, dx, dy, tick) {
    const anim = this.anims[this.current];
    if (!anim || !this.sheet?.img) return false;
    this.update(tick);
    const [col, row] = anim.frames[this.frame];
    this.sheet.draw(ctx, col, row, dx, dy);
    return true;
  }
}

// Animaciones estándar para Profe Felipe
function createFelipeAnimator(sheet) {
  return new SpriteAnimator(sheet, 8)
    .addAnim('idle_down',  [[0,0]])
    .addAnim('walk_down',  [[1,0],[0,0],[2,0],[0,0]])
    .addAnim('idle_up',    [[3,0]])
    .addAnim('walk_up',    [[4,0],[3,0],[5,0],[3,0]])
    .addAnim('idle_left',  [[0,0]])
    .addAnim('idle_right', [[0,0]])
    .addAnim('battle',     [[6,0],[7,0]]);
}

if (typeof window !== 'undefined') {
  window.SpriteAnimator = SpriteAnimator;
  window.createFelipeAnimator = createFelipeAnimator;
}
