/* ============================================================
   RAÍZ — script.js
   Menú off-canvas, scroll suave, header oculto/visible,
   reveal on scroll, botón volver arriba, carrusel de oficios
   en mobile, microinteracción del formulario de contacto.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. HERO ANIMADO ---------- */
  const words = document.querySelectorAll('.hero .word-slide');
  const bgs = document.querySelectorAll('.hero .bg-float');
  const finale = document.querySelector('.hero .finale');
  const hero = document.querySelector('.hero');
  let hasShownHeroCta = false;

  const HOLD = 1100;
  const GAP = 250;
  const LOOP_PAUSE = 2600;

  function showWord(el, delay) {
    setTimeout(() => {
      el.classList.add('in');
      setTimeout(() => {
        el.classList.remove('in');
        el.classList.add('out');
      }, HOLD);
    }, delay);
  }

  function runHeroAnimation() {
    words.forEach((w) => w.classList.remove('in', 'out'));
    bgs.forEach((b) => b.classList.remove('in'));
    if (finale) finale.classList.remove('in');

    bgs.forEach((b, i) => {
      setTimeout(() => { b.classList.add('in'); }, 200 + i * 150);
    });

    let t = 150;
    words.forEach((w) => {
      showWord(w, t);
      t += HOLD + GAP;
    });

    if (finale) {
      setTimeout(() => {
        finale.classList.add('in');
        if (!hasShownHeroCta && hero) {
          hero.classList.add('hero--cta-locked');
          hasShownHeroCta = true;
        }
      }, t);
    }

    setTimeout(runHeroAnimation, t + LOOP_PAUSE);
  }

  runHeroAnimation();

  /* ---------- 1. MENÚ OFF-CANVAS ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.getElementById('siteMenu');
  const menuOverlay = document.querySelector('.site-menu-overlay');
  const menuCloseTriggers = document.querySelectorAll('[data-menu-close]');
  let focoAntesDelMenu = null;

  function abrirMenu() {
    if (!menuToggle || !siteMenu || !menuOverlay) return;
    focoAntesDelMenu = document.activeElement;
    menuToggle.setAttribute('aria-expanded', 'true');
    siteMenu.setAttribute('aria-hidden', 'false');
    menuOverlay.hidden = false;
    requestAnimationFrame(() => {
      siteMenu.classList.add('is-active');
      menuOverlay.classList.add('is-active');
      document.body.classList.add('menu-abierto');
      const primerFoco = siteMenu.querySelector('button, a');
      if (primerFoco) primerFoco.focus();
    });
  }

  function cerrarMenu() {
    if (!menuToggle || !siteMenu || !menuOverlay) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    siteMenu.setAttribute('aria-hidden', 'true');
    siteMenu.classList.remove('is-active');
    menuOverlay.classList.remove('is-active');
    document.body.classList.remove('menu-abierto');
    window.setTimeout(() => {
      if (!siteMenu.classList.contains('is-active')) menuOverlay.hidden = true;
    }, 580);
    if (focoAntesDelMenu && typeof focoAntesDelMenu.focus === 'function') focoAntesDelMenu.focus();
  }

  if (menuToggle && siteMenu && menuOverlay) {
    menuToggle.addEventListener('click', abrirMenu);
    menuCloseTriggers.forEach((trigger) => trigger.addEventListener('click', cerrarMenu));
    siteMenu.querySelectorAll('a').forEach((enlace) => {
      enlace.addEventListener('click', cerrarMenu);
    });
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && siteMenu.classList.contains('is-active')) cerrarMenu();
      if (evento.key !== 'Tab' || !siteMenu.classList.contains('is-active')) return;

      const focuseables = Array.from(siteMenu.querySelectorAll('a, button')).filter((el) => !el.disabled);
      if (!focuseables.length) return;
      const primero = focuseables[0];
      const ultimo = focuseables[focuseables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    });
  }

  /* ---------- 2. SCROLL SUAVE PARA ENLACES INTERNOS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener('click', (evento) => {
      const destinoId = enlace.getAttribute('href');
      if (destinoId.length > 1) {
        const destino = document.querySelector(destinoId);
        if (destino) {
          evento.preventDefault();
          const offset = 80; // alto aproximado del header fijo
          const posicion = destino.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: posicion, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- 3. HEADER FIJO ---------- */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const scrollActual = window.scrollY;

    if (header) header.classList.remove('header--oculto');

    actualizarBotonVolverArriba(scrollActual);
  }, { passive: true });

  /* ---------- 4. BOTÓN VOLVER ARRIBA (flotante) ---------- */
  const volverArriba = document.getElementById('volverArriba');

  function actualizarBotonVolverArriba(scrollActual) {
    if (!volverArriba) return;
    if (scrollActual > window.innerHeight * 0.8) {
      volverArriba.classList.add('visible');
    } else {
      volverArriba.classList.remove('visible');
    }
  }

  function irArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (volverArriba) volverArriba.addEventListener('click', irArriba);

  const footerArriba = document.getElementById('footerArriba');
  if (footerArriba) footerArriba.addEventListener('click', irArriba);

  /* ---------- 5. ANIMACIONES AL HACER SCROLL (Intersection Observer) ---------- */
  const elementosReveal = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elementosReveal.forEach((el) => observador.observe(el));
  } else {
    // Sin soporte: mostrar todo directamente
    elementosReveal.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- 6. VIDEO CARD ---------- */
  const videoCard = document.querySelector('.video-card');
  const videoCardMedia = document.querySelector('.video-card__media');
  const videoCardPlay = document.querySelector('.video-card__play');

  if (videoCard && videoCardMedia && videoCardPlay) {
    videoCardPlay.addEventListener('click', () => {
      videoCardMedia.play();
    });

    videoCardMedia.addEventListener('play', () => {
      videoCard.classList.add('video-card--playing');
    });

    videoCardMedia.addEventListener('pause', () => {
      videoCard.classList.remove('video-card--playing');
    });

    videoCardMedia.addEventListener('ended', () => {
      videoCard.classList.remove('video-card--playing');
    });
  }

  /* ---------- 8. CARRUSEL DE OFICIOS EN MOBILE (dots) ---------- */
  const oficiosGrid = document.getElementById('oficiosGrid');
  const oficiosDots = document.getElementById('oficiosDots');

  if (oficiosGrid && oficiosDots) {
    const cards = oficiosGrid.querySelectorAll('.card-oficio');
    const dots = oficiosDots.querySelectorAll('button');
    const esOficiosVertical = () => window.matchMedia('(max-width: 720px)').matches;

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const indice = Number(dot.dataset.indice);
        const card = cards[indice];
        if (card) {
          if (esOficiosVertical()) {
            oficiosGrid.scrollTo({
              top: card.offsetTop - oficiosGrid.offsetTop,
              behavior: 'smooth'
            });
          } else {
            oficiosGrid.scrollTo({
              left: card.offsetLeft - oficiosGrid.offsetLeft,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Actualiza el dot activo según el scroll del carrusel en mobile.
    let timeoutScroll;
    oficiosGrid.addEventListener('scroll', () => {
      clearTimeout(timeoutScroll);
      timeoutScroll = setTimeout(() => {
        let indiceCercano = 0;
        let distanciaMinima = Infinity;
        cards.forEach((card, indice) => {
          const distancia = esOficiosVertical()
            ? Math.abs((card.offsetTop - oficiosGrid.offsetTop) - oficiosGrid.scrollTop)
            : Math.abs(card.offsetLeft - oficiosGrid.scrollLeft);
          if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            indiceCercano = indice;
          }
        });
        dots.forEach((dot, indice) => dot.classList.toggle('activo', indice === indiceCercano));
      }, 100);
    }, { passive: true });
  }

  /* ---------- 8. CARRUSEL VERTICAL DE HISTORIA ---------- */
  const historiaArriba    = document.getElementById('historiaArriba');
  const historiaAbajo     = document.getElementById('historiaAbajo');
  const historiaSlidesTxt = document.querySelectorAll('.historia-slide');
  const historiaSlidesImg = document.querySelectorAll('.historia-imagen-slide');
  const historiaDots      = document.getElementById('historiaDots');
  const historiaDotBtns   = historiaDots ? Array.from(historiaDots.querySelectorAll('button')) : [];

  let historiaIndice = 0;
  const historiaTotalSlides = historiaSlidesTxt.length;

  function actualizarControles() {
    if (historiaArriba) historiaArriba.disabled = (historiaIndice === 0);
    if (historiaAbajo)  historiaAbajo.disabled  = (historiaIndice === historiaTotalSlides - 1);
    historiaDotBtns.forEach((dot, indice) => {
      dot.classList.toggle('activo', indice === historiaIndice);
      dot.setAttribute('aria-current', indice === historiaIndice ? 'true' : 'false');
    });
  }

  function irASlideHistoria(nuevoIndice) {
    if (!historiaTotalSlides) return;
    if (nuevoIndice < 0 || nuevoIndice >= historiaTotalSlides) return;

    historiaSlidesTxt[historiaIndice].classList.remove('activo');
    historiaSlidesImg[historiaIndice].classList.remove('activo');

    historiaIndice = nuevoIndice;

    historiaSlidesTxt[historiaIndice].classList.add('activo');
    historiaSlidesImg[historiaIndice].classList.add('activo');

    actualizarControles();
  }

  actualizarControles(); // estado inicial: arriba deshabilitado

  if (historiaArriba) historiaArriba.addEventListener('click', () => irASlideHistoria(historiaIndice - 1));
  if (historiaAbajo)  historiaAbajo.addEventListener('click',  () => irASlideHistoria(historiaIndice + 1));
  historiaDotBtns.forEach((dot, indice) => {
    dot.addEventListener('click', () => irASlideHistoria(indice));
  });

  /* ---------- 9. CARRUSEL MUEBLES CÁPSULA ---------- */
  const capsulaCards = Array.from(document.querySelectorAll('[data-capsula-card]'));
  const capsulaPrev = document.getElementById('capsulaPrev');
  const capsulaNext = document.getElementById('capsulaNext');
  const capsulaDots = document.getElementById('capsulaDots');
  const capsulaDotButtons = capsulaDots ? Array.from(capsulaDots.querySelectorAll('button')) : [];
  let capsulaIndice = 0;

  function actualizarCapsulaCarousel() {
    const total = capsulaCards.length;
    if (!total) return;

    const indicePrevio = (capsulaIndice - 1 + total) % total;
    const indiceSiguiente = (capsulaIndice + 1) % total;

    capsulaCards.forEach((card, indice) => {
      card.classList.toggle('is-active', indice === capsulaIndice);
      card.classList.toggle('is-prev', indice === indicePrevio);
      card.classList.toggle('is-next', indice === indiceSiguiente);
      card.setAttribute('aria-hidden', indice === capsulaIndice ? 'false' : 'true');
    });

    capsulaDotButtons.forEach((dot, indice) => {
      dot.classList.toggle('activo', indice === capsulaIndice);
      dot.setAttribute('aria-current', indice === capsulaIndice ? 'true' : 'false');
    });
  }

  function irACapsula(nuevoIndice) {
    const total = capsulaCards.length;
    if (!total) return;
    capsulaIndice = (nuevoIndice + total) % total;
    actualizarCapsulaCarousel();
  }

  if (capsulaCards.length) {
    actualizarCapsulaCarousel();
    if (capsulaPrev) capsulaPrev.addEventListener('click', () => irACapsula(capsulaIndice - 1));
    if (capsulaNext) capsulaNext.addEventListener('click', () => irACapsula(capsulaIndice + 1));

    capsulaDotButtons.forEach((dot, indice) => {
      dot.addEventListener('click', () => irACapsula(indice));
    });

    document.addEventListener('keydown', (evento) => {
      const capsula = document.getElementById('capsula');
      if (!capsula) return;
      const rect = capsula.getBoundingClientRect();
      const estaEnVista = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      if (!estaEnVista) return;
      if (evento.key === 'ArrowLeft') irACapsula(capsulaIndice - 1);
      if (evento.key === 'ArrowRight') irACapsula(capsulaIndice + 1);
    });
  }
  /* ---------- 9. MICROINTERACCIÓN ORGÁNICA: hover en cards con leve "respiración" ---------- */
  document.querySelectorAll('.card-oficio[data-organic-hover]').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--rot', `${(Math.random() * 1.2 - 0.6).toFixed(2)}deg`);
      card.style.transform = `translateY(-8px) rotate(var(--rot))`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 10. VIDEO FOOTER: pausa antes de reiniciar ---------- */
  const footerMarcaVideo = document.querySelector('.footer-marca-video');

  if (footerMarcaVideo) {
    footerMarcaVideo.addEventListener('ended', () => {
      window.setTimeout(() => {
        footerMarcaVideo.currentTime = 0;
        footerMarcaVideo.play();
      }, 1000);
    });
  }

  /* ---------- 10b. COMPARACIÓN ANTES/DESPUÉS ---------- */
  document.querySelectorAll('[data-before-after]').forEach((slider) => {
    const handle = slider.querySelector('.caso-slider-handle');
    if (!handle) return;

    function actualizarComparacion(clientX) {
      const rect = slider.getBoundingClientRect();
      const porcentaje = ((clientX - rect.left) / rect.width) * 100;
      const limitado = Math.max(8, Math.min(92, porcentaje));
      slider.style.setProperty('--pos', `${limitado}%`);
    }

    function iniciarArrastre(evento) {
      evento.preventDefault();
      const pointerId = evento.pointerId;
      handle.setPointerCapture(pointerId);
      actualizarComparacion(evento.clientX);

      function mover(puntero) {
        actualizarComparacion(puntero.clientX);
      }

      function soltar() {
        handle.releasePointerCapture(pointerId);
        handle.removeEventListener('pointermove', mover);
        handle.removeEventListener('pointerup', soltar);
        handle.removeEventListener('pointercancel', soltar);
      }

      handle.addEventListener('pointermove', mover);
      handle.addEventListener('pointerup', soltar);
      handle.addEventListener('pointercancel', soltar);
    }

    handle.addEventListener('pointerdown', iniciarArrastre);
    slider.addEventListener('pointerdown', (evento) => {
      if (evento.target === handle || handle.contains(evento.target)) return;
      actualizarComparacion(evento.clientX);
    });
  });

  /* ---------- 10c. TESTIMONIOS ALUMNOS: modal del marquee ---------- */
  const alumnosSection = document.querySelector('.alumnos');
  const alumnoModal = document.getElementById('alumnoModal');

  if (alumnosSection && alumnoModal) {
    const alumnoModalTexto = document.getElementById('alumnoModalTexto');
    const alumnoModalNombre = document.getElementById('alumnoModalNombre');
    const alumnoModalRol = document.getElementById('alumnoModalRol');
    const alumnoModalCerrar = alumnoModal.querySelector('.alumno-modal__cerrar');
    let alumnoCardActiva = null;

    function abrirAlumnoModal(card) {
      alumnoCardActiva = card;
      if (alumnoModalTexto) alumnoModalTexto.textContent = card.dataset.texto || '';
      if (alumnoModalNombre) alumnoModalNombre.textContent = card.dataset.nombre || '';
      if (alumnoModalRol) alumnoModalRol.textContent = card.dataset.rol || '';
      alumnosSection.classList.add('alumnos--modal-abierto');
      alumnoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (alumnoModalCerrar) alumnoModalCerrar.focus();
    }

    function cerrarAlumnoModal() {
      if (alumnoModal.getAttribute('aria-hidden') === 'true') return;
      alumnoModal.setAttribute('aria-hidden', 'true');
      alumnosSection.classList.remove('alumnos--modal-abierto');
      document.body.style.overflow = '';
      if (alumnoCardActiva) alumnoCardActiva.focus();
      alumnoCardActiva = null;
    }

    alumnosSection.addEventListener('click', (evento) => {
      const card = evento.target.closest('.alumno-card');
      if (!card || !alumnosSection.contains(card)) return;
      abrirAlumnoModal(card);
    });

    alumnoModal.addEventListener('click', (evento) => {
      if (evento.target === alumnoModal || evento.target.closest('.alumno-modal__cerrar')) {
        cerrarAlumnoModal();
      }
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') cerrarAlumnoModal();
    });
  }

  /* ---------- 11. FORMULARIO DE CONTACTO (footer) ---------- */
  const formularioProyecto = document.getElementById('formularioProyecto');
  const footerMsg = document.getElementById('footerMsg');

  if (formularioProyecto) {
    formularioProyecto.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const input = document.getElementById('inputProyecto');
      const valor = input ? input.value.trim() : '';

      if (valor.length === 0) {
        if (footerMsg) footerMsg.textContent = 'Contanos un poco sobre tu pieza antes de enviar.';
        return;
      }

      // Aquí se conectaría con un backend o servicio de email real.
      if (footerMsg) {
        footerMsg.textContent = `Gracias, recibimos tu mensaje sobre "${valor}". Te escribimos pronto.`;
      }
      formularioProyecto.reset();
    });
  }

});

