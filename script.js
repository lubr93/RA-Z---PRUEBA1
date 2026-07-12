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

  if (words.length || bgs.length || finale) {
    runHeroAnimation();
  }

  const chairViews = [
    {
      id: "front",
      src: "assets/chair-front.png",
      thumb: "assets/chair-front.png",
      label: "Vista frontal"
    },
    {
      id: "right",
      src: "assets/chair-right.png",
      thumb: "assets/chair-right.png",
      label: "Perfil derecho"
    },
    {
      id: "left",
      src: "assets/chair-left.png",
      thumb: "assets/chair-left.png",
      label: "Perfil izquierdo"
    }
  ];

  const raizHeroChair = document.querySelector('.raiz-hero__chair--active');
  const raizHeroChairNext = document.querySelector('.raiz-hero__chair--next');
  const raizHeroThumbs = document.querySelector('.raiz-hero__thumbs');
  let vistaActiva = 'front';
  let cambioEnCurso = false;

  function precargarVistasHero() {
    chairViews.forEach((view) => {
      const imagen = new Image();
      imagen.src = view.src;
    });
  }

  function actualizarMiniaturasHero() {
    if (!raizHeroThumbs) return;

    raizHeroThumbs.querySelectorAll('.raiz-hero__thumb').forEach((button) => {
      const activo = button.dataset.view === vistaActiva;
      button.classList.toggle('is-active', activo);
      button.setAttribute('aria-pressed', String(activo));
    });
  }

  function cambiarVistaHero(view) {
    if (!raizHeroChair || !raizHeroChairNext || cambioEnCurso || view.id === vistaActiva) return;

    cambioEnCurso = true;
    raizHeroChairNext.src = view.src;
    raizHeroChairNext.classList.remove('is-entering');
    raizHeroChair.classList.remove('is-exiting');

    requestAnimationFrame(() => {
      raizHeroChair.classList.add('is-exiting');
      raizHeroChairNext.classList.add('is-entering');
    });

    window.setTimeout(() => {
      raizHeroChair.src = view.src;
      raizHeroChair.alt = view.label;
      raizHeroChair.setAttribute('aria-label', view.label);
      raizHeroChair.classList.remove('is-exiting');
      raizHeroChairNext.classList.remove('is-entering');
      raizHeroChairNext.src = view.src;
      vistaActiva = view.id;
      actualizarMiniaturasHero();
      cambioEnCurso = false;
    }, 350);
  }

  function renderizarMiniaturasHero() {
    if (!raizHeroThumbs) return;

    chairViews.forEach((view) => {
      const button = document.createElement('button');
      const img = document.createElement('img');

      button.type = 'button';
      button.className = 'raiz-hero__thumb';
      button.dataset.view = view.id;
      button.setAttribute('aria-label', view.label);

      img.src = view.thumb;
      img.alt = '';
      img.loading = 'eager';
      img.decoding = 'async';

      button.appendChild(img);
      button.addEventListener('click', () => cambiarVistaHero(view));
      button.addEventListener('mouseenter', () => cambiarVistaHero(view));
      raizHeroThumbs.appendChild(button);
    });

    actualizarMiniaturasHero();
  }

  if (raizHeroChair && raizHeroChairNext && raizHeroThumbs) {
    precargarVistasHero();
    renderizarMiniaturasHero();
  }

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
          const offset = destinoId === '#contacto' ? 0 : 80; // alto aproximado del header fijo
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
  const footerPrincipal = document.querySelector('.footer');

  function actualizarBotonVolverArriba(scrollActual) {
    if (!volverArriba) return;
    if (scrollActual > window.innerHeight * 0.8) {
      volverArriba.classList.add('visible');
    } else {
      volverArriba.classList.remove('visible');
    }
  }

  function actualizarContrasteVolverArriba() {
    if (!volverArriba || !footerPrincipal) return;
    const footerTop = footerPrincipal.getBoundingClientRect().top;
    const boton = volverArriba.getBoundingClientRect();
    const botonCentro = boton.top + boton.height / 2;
    volverArriba.classList.toggle('volver-arriba--footer', footerTop <= botonCentro);
  }

  function irArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (volverArriba) volverArriba.addEventListener('click', irArriba);
  actualizarContrasteVolverArriba();
  window.addEventListener('scroll', actualizarContrasteVolverArriba, { passive: true });
  window.addEventListener('resize', actualizarContrasteVolverArriba);

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

  /* ---------- 9. MATERIALES: selector técnico de maderas ---------- */
  const materials = [
    {
      id: 'roble-americano',
      number: '01',
      name: 'Roble americano',
      image: '/assets/images/textures/roble-americano.png',
      placeholderClass: 'material-placeholder--oak',
      hardness: 'Alta',
      origin: 'EE. UU.',
      tone: 'Marrón dorado',
      grain: 'Recta y marcada',
      recommendedUse: 'Estructuras y mobiliario de uso diario',
      description: 'Madera estable y resistente, ideal para estructuras que deben soportar peso y uso frecuente. Su veta definida aporta carácter sin perder sobriedad.'
    },
    {
      id: 'nogal',
      number: '02',
      name: 'Nogal',
      image: '/assets/images/textures/nogal.png',
      placeholderClass: 'material-placeholder--walnut',
      hardness: 'Media-alta',
      origin: 'Europa y América',
      tone: 'Marrón profundo',
      grain: 'Ondulada y elegante',
      recommendedUse: 'Muebles finos y detalles visibles',
      description: 'Su tonalidad profunda y su dibujo natural la convierten en una madera especialmente valorada para piezas de presencia refinada.'
    },
    {
      id: 'cedro',
      number: '03',
      name: 'Cedro',
      image: '/assets/images/textures/cedro.png',
      placeholderClass: 'material-placeholder--cedar',
      hardness: 'Media',
      origin: 'América',
      tone: 'Rojizo cálido',
      grain: 'Suave y uniforme',
      recommendedUse: 'Interiores, respaldos y componentes livianos',
      description: 'Ligero, aromático y estable. Se utiliza en sectores protegidos de la pieza y en trabajos donde se busca calidez visual.'
    },
    {
      id: 'pino',
      number: '04',
      name: 'Pino',
      image: '/assets/images/textures/pino.png',
      placeholderClass: 'material-placeholder--pine',
      hardness: 'Baja-media',
      origin: 'Variable',
      tone: 'Claro y amarillento',
      grain: 'Visible y expresiva',
      recommendedUse: 'Estructuras secundarias y refuerzos',
      description: 'Una madera versátil y liviana, adecuada para componentes internos, refuerzos y restauraciones que requieren facilidad de trabajo.'
    },
    {
      id: 'lapacho',
      number: '05',
      name: 'Lapacho',
      image: '/assets/images/textures/lapacho.png',
      placeholderClass: 'material-placeholder--lapacho',
      hardness: 'Muy alta',
      origin: 'Sudamérica',
      tone: 'Marrón oscuro',
      grain: 'Compacta',
      recommendedUse: 'Refuerzos y componentes de alta exigencia',
      description: 'Extremadamente resistente y denso. Se reserva para sectores que necesitan gran estabilidad, firmeza y durabilidad.'
    }
  ];

  const materialVisual = document.getElementById('materialVisual');
  const materialImage = document.getElementById('materialImage');
  const materialVisualName = document.getElementById('materialVisualName');
  const materialTabs = document.getElementById('materialTabs');
  const materialPanel = document.getElementById('materialPanel');
  const materialSpecs = document.getElementById('materialSpecs');
  const materialDescription = document.getElementById('materialDescription');
  let materialActivo = -1;

  function crearSpecsMaterial(material) {
    return [
      ['Dureza', material.hardness],
      ['Origen', material.origin],
      ['Tono', material.tone],
      ['Veta', material.grain],
      ['Uso recomendado', material.recommendedUse]
    ].map(([label, value]) => `
      <div class="materiales__spec">
        <dt>${label}</dt>
        <dd>${value}</dd>
      </div>
    `).join('');
  }

  function cargarImagenMaterial(material) {
    if (!materialImage) return;

    materialImage.classList.remove('is-loaded');
    materialImage.hidden = true;
    materialImage.alt = `${material.name}, textura de madera`;
    materialImage.onload = () => {
      materialImage.hidden = false;
      materialImage.classList.add('is-loaded');
      if (materialVisual) materialVisual.classList.add('has-image');
    };
    materialImage.onerror = () => {
      materialImage.classList.remove('is-loaded');
      materialImage.hidden = true;
      materialImage.removeAttribute('src');
      if (materialVisual) materialVisual.classList.remove('has-image');
    };
    materialImage.src = material.image;
  }

  function actualizarMaterial(indice) {
    const material = materials[indice];
    if (!material || !materialVisual || !materialVisualName || !materialTabs || !materialSpecs || !materialDescription) return;
    if (indice === materialActivo) return;

    materialActivo = indice;
    materialVisual.classList.add('is-changing');
    if (materialPanel) materialPanel.classList.add('is-changing');

    window.setTimeout(() => {
      materialVisual.className = `materiales__visual ${material.placeholderClass}`;
      materialVisualName.textContent = material.name;
      materialSpecs.innerHTML = crearSpecsMaterial(material);
      materialDescription.textContent = material.description;
      cargarImagenMaterial(material);

      materialTabs.querySelectorAll('[role="tab"]').forEach((tab, tabIndice) => {
        const activo = tabIndice === materialActivo;
        tab.setAttribute('aria-selected', activo ? 'true' : 'false');
        tab.setAttribute('tabindex', activo ? '0' : '-1');
      });
      if (materialPanel) materialPanel.setAttribute('aria-labelledby', `material-tab-${material.id}`);

      window.requestAnimationFrame(() => {
        materialVisual.classList.remove('is-changing');
        if (materialPanel) materialPanel.classList.remove('is-changing');
      });
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120);
  }

  if (materialTabs && materialVisual && materialSpecs && materialDescription) {
    materialTabs.innerHTML = materials.map((material, indice) => `
      <button class="materiales__tab" type="button" role="tab" id="material-tab-${material.id}" aria-controls="materialPanel" aria-selected="${indice === 0 ? 'true' : 'false'}" tabindex="${indice === 0 ? '0' : '-1'}">
        <span class="materiales__number">${material.number}</span>
        <span class="materiales__tab-name">${material.name}</span>
      </button>
    `).join('');

    const materialTabButtons = Array.from(materialTabs.querySelectorAll('[role="tab"]'));
    materialTabButtons.forEach((button, indice) => {
      button.addEventListener('click', () => actualizarMaterial(indice));
      button.addEventListener('mouseenter', () => actualizarMaterial(indice));
      button.addEventListener('focus', () => actualizarMaterial(indice));
      button.addEventListener('keydown', (evento) => {
        const ultimo = materials.length - 1;
        let siguiente = null;

        if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') siguiente = indice === ultimo ? 0 : indice + 1;
        if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') siguiente = indice === 0 ? ultimo : indice - 1;
        if (evento.key === 'Home') siguiente = 0;
        if (evento.key === 'End') siguiente = ultimo;

        if (siguiente === null) return;
        evento.preventDefault();
        actualizarMaterial(siguiente);
        materialTabButtons[siguiente].focus();
      });
    });

    actualizarMaterial(0);
  }

  /* ---------- 9B. MATERIALES: capas de tapizado ---------- */
  const tapizadoSection = document.querySelector('.materiales__tapizado');
  const tapizadoLayers = {
    tapizado: {
      title: 'Tapizado',
      text: 'Tela terracota, la decisión estética final. Se cambia sin tocar lo que hay debajo.'
    },
    'relleno-asiento': {
      title: 'Relleno de asiento',
      text: 'Espuma acanalada de alta densidad. Sostiene el peso sin perder forma con el tiempo.'
    },
    'estructura-lateral': {
      title: 'Estructura lateral',
      text: 'Panel de madera maciza. Se ve la veta: es la misma madera que sostiene todo el mueble.'
    },
    suspension: {
      title: 'Suspensión',
      text: 'Flejes de madera y resortes. Le dan al asiento su elasticidad, sin sacrificar firmeza.'
    },
    'relleno-respaldo': {
      title: 'Relleno de respaldo',
      text: 'Guata y fibra suelta. Da cuerpo al cojín superior, más blando que el del asiento.'
    }
  };

  if (tapizadoSection) {
    const tapizadoPanelTitle = tapizadoSection.querySelector('#tapizadoPanelTitle');
    const tapizadoPanelText = tapizadoSection.querySelector('#tapizadoPanelText');
    const tapizadoMobileList = tapizadoSection.querySelector('.tapizado__mobile-list');

    if (tapizadoMobileList) {
      tapizadoMobileList.innerHTML = Object.entries(tapizadoLayers).map(([id, layer], index) => `
        <button class="tapizado__mobile-button" type="button" data-layer="${id}" aria-pressed="${index === 0 ? 'true' : 'false'}">
          <span>${layer.title}</span>
        </button>
      `).join('');
    }

    const tapizadoButtons = Array.from(tapizadoSection.querySelectorAll('[data-layer]'));

    function activarTapizado(layerId) {
      const layer = tapizadoLayers[layerId];
      if (!layer || !tapizadoPanelTitle || !tapizadoPanelText) return;

      tapizadoPanelTitle.textContent = layer.title;
      tapizadoPanelText.textContent = layer.text;

      tapizadoButtons.forEach((button) => {
        const activo = button.dataset.layer === layerId;
        button.classList.toggle('is-active', activo);
        button.setAttribute('aria-pressed', activo ? 'true' : 'false');
      });
    }

    tapizadoButtons.forEach((button) => {
      button.addEventListener('click', () => activarTapizado(button.dataset.layer));
    });

    activarTapizado('tapizado');
  }

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

  /* ---------- 11. PREGUNTAS FRECUENTES ---------- */
  document.querySelectorAll('.faq__item').forEach((item) => {
    const button = item.querySelector('.faq__question');
    const wrap = item.querySelector('.faq__answer-wrap');

    if (!button || !wrap) return;

    button.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      document.querySelectorAll('.faq__item').forEach((other) => {
        const otherButton = other.querySelector('.faq__question');
        const otherWrap = other.querySelector('.faq__answer-wrap');

        other.setAttribute('data-open', 'false');
        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        if (otherWrap) otherWrap.style.maxHeight = null;
      });

      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        button.setAttribute('aria-expanded', 'true');
        wrap.style.maxHeight = `${wrap.scrollHeight}px`;
      }
    });
  });

  /* ---------- 12. FORMULARIO DE CONTACTO (footer) ---------- */
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

  /* ---------- 13. FORMULARIO CTA CONTACTO ---------- */
  const formContacto = document.getElementById('form-contacto');
  const ctaContactoMsg = document.getElementById('ctaContactoMsg');

  if (formContacto) {
    formContacto.addEventListener('submit', (evento) => {
      evento.preventDefault();

      if (!formContacto.checkValidity()) {
        formContacto.reportValidity();
        return;
      }

      const boton = formContacto.querySelector('button[type="submit"]');
      const textoOriginal = boton.textContent;

      boton.disabled = true;
      boton.textContent = 'Enviando...';

      // Aquí se conectaría con un backend o servicio de email real.
      setTimeout(() => {
        formContacto.reset();
        formContacto.hidden = true;
        boton.disabled = false;
        boton.textContent = textoOriginal;
        if (ctaContactoMsg) {
          ctaContactoMsg.textContent = 'Recibimos tu mensaje, te contactamos pronto.';
        }
      }, 900);
    });
  }

});
