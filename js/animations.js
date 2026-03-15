/* ============================================
   FloraVita — animations.js
   Scroll reveal + testimonial slider + gallery
   ============================================ */
(function () {
  'use strict';

  /* ---------- SCROLL REVEAL ---------- */
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right'];
  const allReveal = document.querySelectorAll(revealClasses.join(','));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay * 1000);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  allReveal.forEach((el, i) => revealObserver.observe(el));

  // Auto-stagger siblings with data-stagger parent
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    const base = parseFloat(parent.dataset.stagger || 0.12);
    Array.from(children).forEach((child, i) => {
      child.dataset.delay = i * base;
    });
  });

  /* ---------- TESTIMONIALS SLIDER ---------- */
  const slides   = document.querySelectorAll('.fv-testimonial');
  const pips     = document.querySelectorAll('.fv-testimonials__pip');
  const btnPrev  = document.getElementById('fv-test-prev');
  const btnNext  = document.getElementById('fv-test-next');
  let current    = 0;
  let autoTimer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    pips[current] && pips[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    pips[current] && pips[current].classList.add('active');
  }

  if (slides.length > 1) {
    // Init
    slides[0].classList.add('active');
    pips[0] && pips[0].classList.add('active');

    btnPrev && btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    btnNext && btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    pips.forEach((pip, i) => pip.addEventListener('click', () => { goTo(i); resetAuto(); }));

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }
    startAuto();

    // Swipe support
    let touchStartX = 0;
    const slider = document.querySelector('.fv-testimonials__slider');
    if (slider) {
      slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
      }, { passive: true });
    }
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
    pips[0] && pips[0].classList.add('active');
  }

  /* ---------- GALLERY DRAG-SCROLL ---------- */
  const galleryInner = document.querySelector('.fv-gallery__inner');
  const galleryDots  = document.querySelectorAll('.fv-gallery__dot');

  if (galleryInner) {
    let isDragging = false, startX = 0, scrollLeft = 0;

    galleryInner.addEventListener('mousedown', e => {
      isDragging = true;
      galleryInner.style.cursor = 'grabbing';
      startX     = e.pageX - galleryInner.offsetLeft;
      scrollLeft = galleryInner.scrollLeft;
    });
    galleryInner.addEventListener('mouseleave', () => { isDragging = false; galleryInner.style.cursor = ''; });
    galleryInner.addEventListener('mouseup',    () => { isDragging = false; galleryInner.style.cursor = ''; });
    galleryInner.addEventListener('mousemove',  e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - galleryInner.offsetLeft;
      galleryInner.scrollLeft = scrollLeft - (x - startX) * 1.2;
    });

    // Dots
    if (galleryDots.length) {
      const items   = galleryInner.querySelectorAll('.fv-gallery__item');
      const itemW   = items[0] ? items[0].offsetWidth + 16 : 0;

      galleryDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          galleryInner.scrollTo({ left: i * itemW, behavior: 'smooth' });
        });
      });

      galleryInner.addEventListener('scroll', () => {
        const idx = Math.round(galleryInner.scrollLeft / (itemW || 1));
        galleryDots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }, { passive: true });

      galleryDots[0] && galleryDots[0].classList.add('active');
    }
  }

  /* ---------- PRODUCT CARD TILT ---------- */
  document.querySelectorAll('.fv-product').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  /* ---------- SMOOTH ANCHOR SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
