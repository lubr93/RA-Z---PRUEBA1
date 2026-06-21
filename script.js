/* ============================================================
   RAÍZ — script.js
   Menú hamburguesa, scroll suave, header oculto/visible,
   reveal on scroll, botón volver arriba, carrusel de oficios
   en mobile, microinteracción del formulario de contacto.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 0. HERO EDITORIAL: palabra activa + fallback de imagen ---------- */
  const heroPalabras = Array.from(document.querySelectorAll('.hero-palabra'));
  const heroObjetos = Array.from(document.querySelectorAll('.hero-objeto'));
  const hero = document.querySelector('.hero');
  let heroEstadoIndice = 0;

  heroObjetos.forEach((objeto) => {
    const imagen = objeto.querySelector('img');
    if (!imagen) return;
    imagen.addEventListener('error', () => {
      const fallbackSrc = imagen.dataset.fallbackSrc;
      if (!fallbackSrc || imagen.src.includes(fallbackSrc)) return;
      imagen.src = fallbackSrc;
      imagen.classList.add('hero-mueble--fallback');
    });
  });

  if (heroPalabras.length > 1) {
    window.setInterval(() => {
      const palabraActual = heroPalabras[heroEstadoIndice];
      const objetoActual = heroObjetos[heroEstadoIndice];
      const proximoIndice = (heroEstadoIndice + 1) % heroPalabras.length;
      const palabraProxima = heroPalabras[proximoIndice];
      const objetoProximo = heroObjetos[proximoIndice];

      palabraActual.classList.remove('activa');
      palabraActual.classList.add('saliente');
      palabraProxima.classList.add('activa');

      if (objetoActual && objetoProximo) {
        objetoActual.classList.remove('activa');
        objetoActual.classList.add('saliente');
        objetoProximo.classList.add('activa');
      }

      if (hero && proximoIndice === heroPalabras.length - 1) hero.classList.add('hero--final');

      window.setTimeout(() => {
        palabraActual.classList.remove('saliente');
        if (objetoActual) objetoActual.classList.remove('saliente');
      }, 760);

      heroEstadoIndice = proximoIndice;
    }, 2400);
  }

  /* ---------- 1. MENÚ HAMBURGUESA ---------- */
  const hamburguesa = document.getElementById('hamburguesa');
  const menuMovil = document.getElementById('menuMovil');

  if (hamburguesa && menuMovil) {
    hamburguesa.addEventListener('click', () => {
      const abierto = menuMovil.classList.toggle('activo');
      hamburguesa.classList.toggle('activo');
      hamburguesa.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      hamburguesa.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = abierto ? 'hidden' : '';
    });

    // Cerrar el menú al elegir un link
    menuMovil.querySelectorAll('a').forEach((enlace) => {
      enlace.addEventListener('click', () => {
        menuMovil.classList.remove('activo');
        hamburguesa.classList.remove('activo');
        hamburguesa.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
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

  /* ---------- 3. HEADER: SE OCULTA AL BAJAR, APARECE AL SUBIR ---------- */
  const header = document.getElementById('header');
  let ultimoScroll = window.scrollY;

  window.addEventListener('scroll', () => {
    const scrollActual = window.scrollY;

    if (header) {
      if (scrollActual > ultimoScroll && scrollActual > 140) {
        header.classList.add('header--oculto');
      } else {
        header.classList.remove('header--oculto');
      }
    }
    ultimoScroll = scrollActual;

    actualizarBotonVolverArriba(scrollActual);
    actualizarHero();
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

  /* ---------- 6. HERO: transformación narrativa por scroll ---------- */
  const heroScrollContenedor = document.querySelector('.hero-scroll-contenedor');
  const capaAntes    = document.querySelector('.hero-capa--antes');
  const capaProceso  = document.querySelector('.hero-capa--proceso');
  const capaDespues  = document.querySelector('.hero-capa--despues');
  const heroCta      = document.getElementById('heroCta');
  const heroCtaBoton = document.getElementById('heroCtaBoton');
  const heroEtiqueta = document.getElementById('heroEtiqueta');

  // Usuarios con prefers-reduced-motion: mostrar estado final sin scroll extra
  const motionReducida = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionReducida && heroScrollContenedor) {
    heroScrollContenedor.style.height = '100vh';
    if (capaAntes)    capaAntes.style.opacity  = '0';
    if (capaDespues)  capaDespues.style.opacity = '1';
    if (heroCta)      { heroCta.classList.add('hero-cta--visible'); heroCta.setAttribute('aria-hidden', 'false'); }
    if (heroCtaBoton) heroCtaBoton.removeAttribute('tabindex');
    if (heroEtiqueta) heroEtiqueta.classList.add('hero-etiqueta--visible');
  }

  function actualizarHero() {
    if (!heroScrollContenedor || motionReducida) return;

    const rect       = heroScrollContenedor.getBoundingClientRect();
    const disponible = heroScrollContenedor.offsetHeight - window.innerHeight;
    const scrolled   = Math.max(0, -rect.top);
    const p          = Math.min(1, scrolled / disponible); // progreso 0 → 1

    /* Ventanas de opacidad por capa:
       antes:   visible 0.00—0.30 | fade-out 0.30—0.45
       proceso: fade-in 0.35—0.50 | visible 0.50—0.55 | fade-out 0.55—0.70
       después: fade-in 0.60—0.75 | visible 0.75—1.00              */
    const oAntes   = p < 0.30 ? 1 : p > 0.45 ? 0 : 1 - (p - 0.30) / 0.15;
    const oProceso = p < 0.35 ? 0 : p < 0.50 ? (p - 0.35) / 0.15
                   : p < 0.55 ? 1 : p > 0.70 ? 0 : 1 - (p - 0.55) / 0.15;
    const oDespues = p < 0.60 ? 0 : p > 0.75 ? 1 : (p - 0.60) / 0.15;

    if (capaAntes)   capaAntes.style.opacity   = oAntes;
    if (capaProceso) capaProceso.style.opacity = oProceso;
    if (capaDespues) capaDespues.style.opacity = oDespues;

    // CTA: aparece cuando la transformación está prácticamente completa
    if (heroCta) {
      const ctaVisible = p >= 0.85;
      heroCta.classList.toggle('hero-cta--visible', ctaVisible);
      heroCta.setAttribute('aria-hidden', ctaVisible ? 'false' : 'true');
      if (heroCtaBoton) {
        if (ctaVisible) heroCtaBoton.removeAttribute('tabindex');
        else            heroCtaBoton.setAttribute('tabindex', '-1');
      }
    }

    // Etiqueta: aparece junto con la imagen restaurada
    if (heroEtiqueta) {
      heroEtiqueta.classList.toggle('hero-etiqueta--visible', oDespues > 0.6);
    }
  }

  actualizarHero(); // inicializar si la página ya tiene scroll al cargar

  /* ---------- 7. VIDEO CARD ---------- */
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
  document.querySelectorAll('.card-oficio').forEach((card) => {
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




