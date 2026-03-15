/* ============================================
   FloraVita — cursor.js
   Custom magnetic cursor + nav scroll behavior
   ============================================ */
(function () {
  'use strict';

  /* ---------- CURSOR ---------- */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'fv-cursor';
  ring.className = 'fv-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  function addHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }
  addHover('a, button, .fv-product, .fv-gallery__item, [data-hover]');

  // Hide when leaving viewport
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  /* ---------- NAV SCROLL ---------- */
  const nav = document.getElementById('fv-nav');
  if (nav) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      // Hide nav on scroll down, show on scroll up
      if (y > lastY + 5 && y > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else if (y < lastY - 5) {
        nav.style.transform = 'translateY(0)';
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const toggle  = document.getElementById('fv-nav-toggle');
  const mobileNav = document.getElementById('fv-nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      })
    );
  }
})();
