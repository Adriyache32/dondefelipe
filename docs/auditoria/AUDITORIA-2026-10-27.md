# Auditoría de seguridad y código - Donde Felipe (PR para repo original)

## Resumen ejecutivo
Revisión profunda del sandbox aislado (`~/dondefelipe-localtest/`) servido en `http://localhost:8000/` con acceso total profe forzado (`esProfe()=true`, `profes=["*"]`). No se tocó el repo original.

---

## ✅ 3 Cosas COMPLETAS / SEGURAS / BALANCEADAS

| # | Componente | Por qué está bien |
|---|------------|-------------------|
| 1 | **Contador `ops` atómico** (banco/movimientos/mercado/gatitos/ruleta/bolsa) | Casi toda acción económica fuerza `opsDespues == opsAntes + 1` con movimiento correspondiente en `banco_movs`. Es la defensa más fuerte: dificulta inventar saldo desde cliente. |
| 2 | **Mercado "retenido/congelado"** (`mercado_pedidos` → autorizar/rechazar) | Flujo `pedido → pago retenido → autorizar/rechazar` bien implementado. Al autorizar reparte, al rechazar crea `devolucion`. Evita doble gasto y da control al profe. |
| 3 | **Cruce de documentos en reglas** | Reglas validan integridad entre `banco_cuentas`, `banco_movs`, `mercado_pedidos`, `gatitos_ofertas`, `gatitos_ventas`, `ruleta`, `bolsa`. No son permisos simples, es contabilidad cruzada. |
| 4 | **Gatitos acotados** | `gatitos_ofertas` solo profe publica/edita; alumno solo descuenta stock+ventas en compra válida. `gatitos_ventas` forzado a mismo `id` que movimiento `op-<cuenta>-<n>`. Poderes/premios únicos por cuenta/día/gatita. |
| 5 | **Ruleta suspendida con criterio** | `ruletaActiva() = false` en reglas + botón suspendido en UI. Hash determinista (`sal` pública) = resultado calculable ANTES de girar. Decisión correcta: no reactivar sin azar secreto servidor. |

---

## ⚠️ 2 Cosas que FUNCIONAN pero NECESITAN REVISIÓN/CAMBIO

| # | Archivo/Área | Problema | Impacto |
|---|--------------|----------|---------|
| 1 | **`panel-profe.html` monolítico** (3000+ líneas) | Todo el panel (banco/juegos/sims/trabajos/alumnos/visitas/mercado/bolsa/rankings/ruleta) en un solo HTML/JS. Cambio en una pestaña rompe otra. Imposible testear aisladamente. | Riesgo alto de regresiones; mantenimiento difícil. **Cambiar a módulos ES6** (`panel/banco.js`, `panel/mercado.js`, etc). |
| 2 | **Dependencia total del profe para liquidar mercado entre alumnos** | `mercado_pedidos` **no se liquida solo**. Todo queda "retenido/congelado" hasta autorizar/rechazar desde panel. Si hay muchos pedidos o `ops` se desincroniza → se atascan y hay que usar "arreglar contador de operaciones". | Cuello de botella operativo. **Añadir**: filtro "pedidos > X h sin resolver", healthcheck `ops` vs nº movs, botón reparar más visible. |

---

## 🔴 3 Cosas DAÑADAS / AFECTANDO ECONOMÍA / SEGURIDAD

| # | Archivo/Área | Problema | Evidencia |
|---|--------------|----------|-----------|
| 1 | **XSS vía `innerHTML` + concatenación en 72 archivos** | Uso extensivo de `innerHTML = ... ${variable} ...` con datos de usuario (nombres, correos, motivos, chat). Archivos afectados: `cuenta.html`, `gatitos.html`, `panel-profe.html`, `profe-rpg-v4.html`, `juegos/*`, `banco-felipesos.html`, y 60+ más. | Búsqueda estática: 72 archivos con patrón `innerHTML\s*=.*\+` o template strings con variables. Cualquier campo editable inyectable = XSS persistente. |
| 2 | **Minecraft Bridge: sin validación de origen + lista `ALLOWED` hardcodeada** | `bridge/agent.py` (compilado) expone HTTP en `127.0.0.1` con endpoint `/` que ejecuta comandos RCON si `action == "command"` y `value in ALLOWED`. **No verifica `Origin` header ni CSRF token**. Cualquier página web visitada por el profe en el mismo navegador puede hacer `fetch('http://127.0.0.1:8090', {method:'POST', body:JSON.stringify({action:'command', value:'say hacked'})})` si el bridge está corriendo. | Strings en bytecode: `ALLOWED`, `rcon`, `command`, `error: comando no permitido`. Puerto probable 8090 (visto en config localStorage). |
| 3 | **`localStorage` guarda claves sensibles sin cifrar** | `mc.key` (RCON key), `mc.bridge` (URL bridge), nombres de usuario guardados en `localStorage` plano. Si hay XSS en cualquier página del sitio → robo de credenciales Minecraft + control del servidor. | Grep: 83 ocurrencias `localStorage` en código. Claves vistas en bytecode bridge: `~/.config/mc-test1-rcon.key`, `~/.config/mc-test1-api.key`. |
| 4 | **Reglas Firestore: 900+ líneas, funciones cruzadas, duplicación de precios** | `precioGatito` duplicado en `firestore.rules` Y `gatitos/catalogo.js`. Cualquier desajuste = reglas rechazan escrituras válidas o aceptan inválidas. Funciones `ops`, `mov`, `costoRuleta`, `salRuleta`, `precioGatito`, `dineroRuleta`, `yaTieneGatito` entrelazadas. Cambio mínimo = test completo de regresión. | Diff `fc96ba4`: cambios en `puntajeCreible`, `nombreDeCuenta`, `ruletaActiva`, validaciones cruzadas. |

---

## 📋 Issues concretos para PR (prioridad alta → baja)

### Seguridad crítica
- [ ] **Minecraft Bridge**: Añadir verificación `Origin` header + CSRF token en `agent.py` antes de ejecutar RCON. O mover a WebSocket con auth.
- [ ] **Sanitización centralizada**: Crear `esc()` en `firebase/df.js` y usarla **siempre** antes de `innerHTML`/`textContent` con datos de usuario. Reemplazar concatenaciones por `createElement` + `textContent` en `panel-profe.html`, `cuenta.html`, `gatitos.html` primero.
- [ ] **localStorage**: No guardar `mc.key` / `mc.bridge` en localStorage. Usar `sessionStorage` o pedir al usuario cada sesión. Borrar claves al logout.

### Arquitectura / Mantenibilidad
- [ ] **Modularizar `panel-profe.html`**: Extraer cada pestaña a `panel/<tab>.js` cargado dinámicamente. Mantener HTML como shell vacío.
- [ ] **Eliminar duplicación `precioGatito`**: Single source of truth. O reglas leen de un doc `config/precios` o cliente importa de reglas (build step). Hoy está en 2 sitios.
- [ ] **Healthcheck `ops` en panel**: Comparar `banco_cuentas[c].ops` vs `count(banco_movs where cuenta==c)` + botón "Reparar ops" que haga `ops = count` (solo profe).

### Economía / Reglas
- [ ] **Ruleta: NO reactivar**. Si algún día se reactiva: simular 10k tiros offline (script) verificando TODOS los rangos hash (`^0-2`, `^3-4`, `^5`, `^6-8`, `^9a`, `^b`, `^c-d`, `^e-f`) contra UI y reglas ANTES de merge.
- [ ] **Poderes gatitos (`decimasPoder`, `sumativasPoder`, `ava`/`calha`)**: Auditar tope 3/día y premios únicos. Si se suben sin control → inflación décimas. Documentar fórmula exacta en `banco-felipeso/bases.html`.
- [ ] **Bolsa (`bolsa_pos`, `bolsa_ingresos`)**: Validar que `ganancia` no supere límite razonable por operación. Hoy reglas validan cruce pero no tope absoluto.

### Calidad de código
- [ ] **Eliminar `eval`/`Function` constructor**: Búsqueda dio 0 en repo actual, pero vigilar en PRs futuros.
- [ ] **`postMessage` sin `origin`**: Revisar `profe-rpg-v4.html` y otros iframes/juegos que usen `window.postMessage`.
- [ ] **TypeScript / lint**: Migrar JS crítico (`df.js`, `panel-profe.html` scripts, `gatitos/*.js`) a TS + `eslint` + `no-inner-html` rule.

---

## 🔧 Cambios recomendados para ESTE PR (mínimos, alto impacto)

```diff
# 1. firebase/df.js - Añadir escapador único
+function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":'''}[c])); }
# Usar: el.textContent = esc(userInput)  // NUNCA innerHTML con datos

# 2. panel-profe.html - Sanitizar TODOS los innerHTML con datos usuario
# Ej: aviso(esc(motivo)), renderAlumnos usa textContent, etc.

# 3. minecraft-test1/bridge/agent.py (fuente) - Añadir verificación Origin
# if request.headers.get('Origin') not in ALLOWED_ORIGINS: return 403
# + CSRF token en header X-CSRF-Token validado contra sesión

# 4. firebase/firestore.rules - Añadir comentario WARNING en precioGatito
# // WARNING: Duplicado en gatitos/catalogo.js. Cambiar EN AMBOS a la vez.
```

---

## 🧪 Cómo testear en sandbox ANTES de merge

```bash
# 1. Servidor local
cd ~/dondefelipe-localtest && python3 -m http.server 8000

# 2. Panel profe (acceso total forzado)
open http://localhost:8000/panel-profe.html
# → Login Google → Ver [SANDBOX] banner → Probar TODAS las pestañas SIN ejecutar transacciones reales

# 3. Simular ruleta (10k dry runs) - script offline
# python3 scripts/simulate-roulette.py  # crear si no existe

# 4. Test pedidos atascados
# En panel → pestaña Mercado → filtro "pendientes > 2h" → verificar healthcheck ops

# 5. XSS test: inyectar <img src=x onerror=alert(1)> en nombre/motivo/chat
# Verificar que se escapa (no ejecuta)
```

---

## ⚠️ NO TOCAR EN ESTE PR (riesgo economía)

| Archivo | Motivo |
|---------|--------|
| `firebase/firestore.rules` | Sagrado. Cambio mínimo = test transacciones reales. |
| `firebase/df.js` (lógica `ops`, `mov`, transferencias) | Entrelazado con reglas. Rompe `opsDespues == opsAntes + 1`. |
| `gatitos.html` (flujo publicar/retirar/comprar) | Custodia de gatitos entre estados. Tocar = gatitos "perdidos". |
| `ruleta.html` + bloques `ruleta` en reglas | Mantener suspendida. Reactivar solo tras simulación 10k. |
| `panel-profe.html` (autorizaciones/rechazos/devoluciones) | Generan devoluciones correctas. Bug = dinero fantasma o bloqueo. |

---

## 📎 Referencias
- Sandbox permanente: `~/dondefelipe-localtest/` (sync automático con `inotifywait` + `rsync --delete` desde `~/dondefelipe/`)
- Server local: `http://localhost:8000/`
- PR original ruleta seguridad: #59 (`fc96ba4`) - ruleta suspendida + rankings anti-trampa
- PR ruleta v3: #71 (`ba9d82a`) - nuevos premios/castigos sobre cosas del jugador
