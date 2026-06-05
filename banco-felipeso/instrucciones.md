# Instrucciones: Conectar Google Sheets al Dashboard Banco Felipeso

## Paso 1 — Copiar el Excel a Google Sheets

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea una hoja nueva → **Archivo → Importar**
3. Sube el archivo `Banco_Felipeso.xlsx`
4. Selecciona "Reemplazar hoja de cálculo"

---

## Paso 2 — Verificar el orden de las hojas

El dashboard espera las hojas en este orden (puedes ver los números en la URL):

| Posición | Nombre de la hoja       | GID (número en la URL) |
|----------|-------------------------|------------------------|
| 1ª       | Cuentas Corrientes      | gid=0 (por defecto)    |
| 2ª       | Movimientos             | gid=...                |
| 3ª       | Emisión de Billetes     | gid=...                |
| 4ª       | Inventario de Billetes  | gid=...                |

> Si el orden es distinto, actualiza los valores `SHEET_IDS` al inicio del script en `index.html`.

---

## Paso 3 — Publicar la hoja en la web

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**
2. Selecciona: **Toda la hoja de cálculo** / **Valores separados por comas (.csv)**
3. Clic en **Publicar** → confirmar
4. Copia el link que aparece (será algo como):
   `https://docs.google.com/spreadsheets/d/XXXXXXX/pub?output=csv`

---

## Paso 4 — Obtener el URL base para el dashboard

Del link anterior, necesitas la parte base (sin el `?output=csv`):

```
https://docs.google.com/spreadsheets/d/TU_ID_AQUI
```

Ese es el URL que pegas en el dashboard cuando te pide conectar.

---

## Paso 5 — Subir el dashboard a Netlify

1. Sube la carpeta `banco-felipeso/` a tu repositorio de GitHub
2. Netlify detectará el `index.html` automáticamente
3. Abre la URL pública → ingresa tu URL de Google Sheets → listo

---

## Paso 6 — Uso diario

- Editas el Google Sheet desde tu PC o celular
- El dashboard se actualiza solo cada 30 segundos
- Los estudiantes abren la URL desde su celular y ven el banco en vivo

---

## Notas sobre los GIDs de las hojas

Para saber el GID exacto de cada hoja:
1. En Google Sheets, haz clic en la pestaña de la hoja
2. Mira la URL del navegador: `...edit#gid=XXXXXXX`
3. Ese número es el GID

Actualiza el bloque al inicio del `index.html`:
```javascript
const SHEET_IDS = {
  cuentas:      0,       // reemplaza con el gid real
  movimientos:  123456,  // reemplaza con el gid real
  billetes:     789012,  // reemplaza con el gid real
  inventario:   345678,  // reemplaza con el gid real
};
```
