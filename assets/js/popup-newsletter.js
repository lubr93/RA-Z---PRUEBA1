document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popupNewsletter');
  if (!popup) return;

  const cerrar = document.getElementById('popupNewsletterCerrar');
  const descartar = document.getElementById('popupNewsletterDescartar');
  const form = document.getElementById('popupNewsletterForm');
  const mensaje = document.getElementById('popupNewsletterMsg');
  const RETRASO_MS = 4000;

  let resuelto = false;
  let disparado = false;
  let temporizador = null;

  function abrirPopup() {
    if (resuelto) return;
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-newsletter-abierto');
  }

  function cerrarPopup() {
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('popup-newsletter-abierto');
  }

  if (cerrar) {
    cerrar.addEventListener('click', () => {
      resuelto = true;
      cerrarPopup();
    });
  }

  if (descartar) {
    descartar.addEventListener('click', () => {
      resuelto = true;
      cerrarPopup();
    });
  }

  popup.addEventListener('click', (evento) => {
    if (evento.target === popup) {
      resuelto = true;
      cerrarPopup();
    }
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && popup.getAttribute('aria-hidden') === 'false') {
      resuelto = true;
      cerrarPopup();
    }
  });

  if (form) {
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const boton = form.querySelector('button[type="submit"]');
      const textoOriginal = boton.textContent;

      boton.disabled = true;
      boton.textContent = 'Enviando...';

      // TODO: conectar con el mismo servicio de envío que use #form-contacto
      // cuando ese formulario tenga un backend real. Por ahora simula el
      // envío igual que la sección de contacto (sin backend conectado).
      setTimeout(() => {
        form.reset();
        form.hidden = true;
        boton.disabled = false;
        boton.textContent = textoOriginal;
        if (mensaje) {
          mensaje.textContent = '¡Listo! Ya sos parte del club.';
        }
        resuelto = true;
        setTimeout(cerrarPopup, 1600);
      }, 900);
    });
  }

  // Dispara la cuenta regresiva apenas el usuario hace el primer scroll,
  // en vez de arrancar el timer con la carga de la página.
  window.addEventListener('scroll', () => {
    if (disparado) return;
    disparado = true;
    temporizador = window.setTimeout(abrirPopup, RETRASO_MS);
  }, { passive: true, once: true });
});
