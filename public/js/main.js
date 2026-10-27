/**
 * ALTRANTRAN BIKE — MAIN INTERACTION & API INTEGRATION SCRIPT
 * Handles mobile navigation, dynamic routes, pre-ride checklist,
 * community gallery lightbox, contact form submission & scroll spy.
 */

(function () {
  'use strict';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // 1. Mobile Menu Drawer
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    mobileNav.addEventListener('click', e => {
      if (e.target.closest('a')) {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // 2. Header Scroll Effect & Back-to-Top Button
  const header = document.querySelector('.site-header');
  const topBtn = document.getElementById('top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 30);
    }
    if (topBtn) {
      topBtn.hidden = scrollY < 500;
    }
  }, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Navigation Scroll Spy
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  const sections = document.querySelectorAll('main section[id]');

  if (sections.length && (navLinks.length || mobileLinks.length)) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
          mobileLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // 4. Próximas Rutas (API Fetch & Dynamic Rendering)
  const rutasList = document.getElementById('rutas-lista');

  function renderRutas(rutas) {
    if (!rutasList) return;
    const now = new Date();
    const futuras = (Array.isArray(rutas) ? rutas : [])
      .filter(r => new Date(r.fecha) >= new Date(now.getTime() - 3 * 3600 * 1000))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (!futuras.length) {
      rutasList.innerHTML = `
        <div class="rutas-empty-box">
          <i class="fa-solid fa-calendar-check rutas-empty-icon"></i>
          <h3 class="rutas-empty-title">Próximas salidas en preparación</h3>
          <p class="rutas-empty-desc">
            Estamos planificando las siguientes salidas oficiales. Puedes consultar las convocatorias en tiempo real en la app <strong>Atlas Bike</strong> o seguir los avisos inmediatos en nuestra cuenta oficial de Instagram.
          </p>
          <a class="btn btn-atlas" href="https://app.atlasbike.es/share-app" target="_blank" rel="noopener">
            <i class="fa-solid fa-mobile-screen-button"></i> VER EN ATLAS BIKE
          </a>
        </div>
      `;
      return;
    }

    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    rutasList.innerHTML = futuras.map(r => {
      const d = new Date(r.fecha);
      const dia = d.getDate();
      const mes = meses[d.getMonth()] || '';
      const horaStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const fechaLarga = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      const atlasUrl = /^https:\/\//.test(r.url || '') ? r.url : 'https://app.atlasbike.es/share-app';

      return `
        <article class="ruta-card">
          <div>
            <div class="ruta-card-header">
              <div class="ruta-date-pill">
                <span class="ruta-day">${dia}</span>
                <span class="ruta-month">${mes}</span>
              </div>
              <span class="ruta-level"><i class="fa-solid fa-gauge-high"></i> ${esc(r.nivel || 'Todos los niveles')}</span>
            </div>
            <h3 class="ruta-title">${esc(r.titulo)}</h3>
            <div class="ruta-meta">
              <div class="ruta-meta-item">
                <i class="fa-regular fa-clock"></i>
                <span>${esc(fechaLarga)} · ${esc(horaStr)} h</span>
              </div>
              <div class="ruta-meta-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>${esc(r.lugar)}</span>
              </div>
            </div>
          </div>
          <a class="ruta-link-btn" href="${esc(atlasUrl)}" target="_blank" rel="noopener">
            <span>Apuntarme en Atlas Bike</span>
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </article>
      `;
    }).join('');
  }

  fetch('/api/rutas')
    .then(res => res.ok ? res.json() : [])
    .then(renderRutas)
    .catch(() => renderRutas([]));

  // 5. Prepara tu Bici — Interactive Checklist
  const checkItems = document.querySelectorAll('.check-item');
  const progressBar = document.getElementById('checklist-progress-bar');
  const progressPercent = document.getElementById('checklist-percent');
  const statusBadge = document.getElementById('checklist-status');
  const STORAGE_KEY = 'altrantran_bike_checklist';

  let checklistState = {};
  try {
    checklistState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    checklistState = {};
  }

  function updateChecklistUI() {
    if (!checkItems.length) return;
    let completedCount = 0;
    const total = checkItems.length;

    checkItems.forEach((item, index) => {
      const isChecked = !!checklistState[index];
      item.classList.toggle('completed', isChecked);
      const icon = item.querySelector('.custom-checkbox i');
      if (icon) {
        icon.className = isChecked ? 'fa-solid fa-check' : '';
      }
      if (isChecked) completedCount++;
    });

    const percent = Math.round((completedCount / total) * 100);
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressPercent) progressPercent.textContent = `${completedCount}/${total} (${percent}%)`;

    if (statusBadge) {
      if (completedCount === total) {
        statusBadge.className = 'check-status-badge show ready';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Bicicleta a punto! Tienes todo listo para disfrutar de la ruta.';
      } else {
        statusBadge.className = 'check-status-badge';
      }
    }
  }

  checkItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      checklistState[index] = !checklistState[index];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistState));
      } catch (e) {}
      updateChecklistUI();
    });
  });

  updateChecklistUI();

  // 6. Galería de la Comunidad & Lightbox Modal
  const galleryGrid = document.querySelector('.gallery-grid');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryItems = [];
  let currentPhotoIndex = 0;

  function refreshGalleryListeners() {
    const items = document.querySelectorAll('.gallery-item');
    currentGalleryItems = Array.from(items).map(item => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-caption');
      return {
        src: img ? (img.dataset.fullSrc || img.src) : '',
        alt: img ? img.alt : '',
        caption: cap ? cap.textContent.trim() : (img ? img.alt : '')
      };
    });

    items.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(idx);
        }
      });
    });
  }

  function openLightbox(index) {
    if (!lightbox || !currentGalleryItems.length) return;
    currentPhotoIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
    const photo = currentGalleryItems[currentPhotoIndex];
    if (lightboxImg) {
      lightboxImg.src = photo.src;
      lightboxImg.alt = photo.alt || 'Foto de Altrantran Bike';
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = photo.caption;
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(currentPhotoIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(currentPhotoIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(currentPhotoIndex + 1);
  });

  fetch('/api/fotos')
    .then(r => r.ok ? r.json() : [])
    .then(fs => {
      if (!fs || !fs.length || !galleryGrid) {
        refreshGalleryListeners();
        return;
      }
      galleryGrid.innerHTML = fs.map(f => `
        <li class="gallery-item" tabindex="0" role="button" aria-label="Ver foto ampliada">
          <img class="gallery-img" src="/api/foto/${f.id}" alt="${esc(f.alt || f.pie || 'Foto de salida Altrantran Bike')}" loading="lazy">
          <div class="gallery-overlay">
            <p class="gallery-caption">${esc(f.pie || '')}</p>
            <div class="gallery-zoom-icon"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
          </div>
        </li>
      `).join('');
      refreshGalleryListeners();
    })
    .catch(() => {
      refreshGalleryListeners();
    });

  // 7. Formulario de Solicitud de Invitación (WhatsApp)
  const invForm = document.getElementById('inv-form');
  const invMsg = document.getElementById('inv-msg');

  if (invForm) {
    invForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!invMsg) return;

      const submitBtn = invForm.querySelector('button[type="submit"]');
      const formData = new FormData(invForm);
      const data = Object.fromEntries(formData);

      const nombre = (data.nombre || '').trim();
      const contacto = (data.contacto || '').trim();
      const consentimiento = formData.get('consentimiento') === 'on' || data.consentimiento === true;

      if (!nombre || !contacto) {
        invMsg.className = 'form-status-msg error';
        invMsg.textContent = 'Por favor, rellena tu nombre y un medio de contacto (teléfono, email o Instagram).';
        return;
      }

      if (!consentimiento) {
        invMsg.className = 'form-status-msg error';
        invMsg.textContent = 'Debes aceptar la política de privacidad para que podamos tramitar tu solicitud.';
        return;
      }

      const payload = {
        nombre: nombre,
        contacto: contacto,
        mensaje: (data.mensaje || '').trim(),
        consentimiento: true,
        web: data.web || ''
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> ENVIANDO...';
      }
      invMsg.className = 'form-status-msg';
      invMsg.style.display = 'none';

      try {
        const res = await fetch('/api/invitacion', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json.error || 'No se pudo enviar la solicitud. Inténtalo de nuevo más tarde.');
        }

        invForm.reset();
        invMsg.className = 'form-status-msg success';
        invMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Solicitud enviada con éxito! Victoria y Arquimary te escribirán pronto para darte la bienvenida al grupo de WhatsApp.';
      } catch (err) {
        invMsg.className = 'form-status-msg error';
        invMsg.textContent = err.message || 'Error de conexión. Puedes escribirnos directamente por Instagram (@altrantranbiker).';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ENVIAR SOLICITUD';
        }
      }
    });
  }

  // 8. Smooth internal link scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
