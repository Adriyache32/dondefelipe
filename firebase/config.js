/* ═══════════════════════════════════════════════════════════════
   El Mundo de Felipe · Configuración de Firebase
   ───────────────────────────────────────────────────────────────
   1. En https://console.firebase.google.com crea el proyecto
      "dondefelipe" y registra una app web (ícono </>).
   2. Los valores del bloque "firebase" ya están puestos (proyecto dondefelipe).
   3. Revisa el resto de las opciones.
   Este archivo lo usan todas las páginas a través de firebase/df.js.
   (Estos valores no son secretos: la seguridad está en firestore.rules.)
   ═══════════════════════════════════════════════════════════════ */
window.DF_CONFIG = {
  firebase: {
    apiKey: "AIzaSyCL4W8ZsH-n6imqfm-UUO_6vuQG8GeGkzE",
    authDomain: "dondefelipe.firebaseapp.com",
    projectId: "dondefelipe",
    storageBucket: "dondefelipe.firebasestorage.app",
    messagingSenderId: "776627150771",
    appId: "1:776627150771:web:49286717524247e033b5c6"
  },

  // Dominio de las cuentas Google del colegio, por ejemplo "sanagustin.cl".
  // Vacío = se acepta cualquier cuenta Google. Debe coincidir con firestore.rules.
  dominioColegio: "",

  // Correos con permiso de profe (panel, banco, ver resultados).
  // Deben ser los mismos que pongas en firestore.rules.
  profes: ["fjimenez321@gmail.com"],

  // Datos que se piden al registrarse: nombre y correo vienen de Google;
  // la edad la escribe el estudiante. Bajo esta edad se pide confirmar
  // que el apoderado está de acuerdo.
  edadMinimaSinApoderado: 14,

  // true = además se pide el curso (sirve para filtrar rankings y resultados).
  // Si lo activas, actualiza el aviso de privacidad en df.js y cuenta.html.
  pedirCurso: false,
  cursos: ["6° Básico", "7° Básico", "8° Básico", "1° Medio", "2° Medio", "3° Medio", "4° Medio", "Profe / Otro"],

  // La sesión se cierra sola tras estas horas sin uso.
  // 720 = 30 días sin entrar (en tu celular o PC queda abierta).
  // En computadores compartidos, cada estudiante debe tocar "salir".
  // 0 = no cerrar nunca · 3 = cerrar tras 3 horas sin uso.
  cerrarSesionTrasHoras: 720,

  // Mostrar el aviso de privacidad la primera vez que alguien entra al sitio.
  aviso: true,

  // Contar visitas a las páginas (de forma anónima).
  contarVisitas: true
};
