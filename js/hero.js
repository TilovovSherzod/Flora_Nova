/* ============================================
   FloraVita — hero.js
   Hero animations: petals, parallax, flower SVG
   ============================================ */
(function () {
  'use strict';

  /* ---------- FLOATING PETALS ---------- */
  const petalContainer = document.querySelector('.fv-hero__petals');
  if (petalContainer) {
    const colors = ['#f2d5c4','#e8b4a0','#c87d6e','#d4927e','#9b4f42','#faeae0','#7d9b7a'];
    const sizes  = [10, 14, 16, 18, 20, 22, 24];

    function spawnPetal() {
      const el = document.createElement('div');
      el.className = 'fv-petal';
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const dur  = 7 + Math.random() * 8;
      const delay = Math.random() * 6;
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        top: -30px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
        transform: rotate(${Math.random() * 60}deg);
        opacity: 0;
      `;
      petalContainer.appendChild(el);
      // Remove after animation
      setTimeout(() => el.remove(), (dur + delay) * 1000 + 500);
    }

    // Spawn continuously
    for (let i = 0; i < 8; i++) spawnPetal();
    setInterval(() => spawnPetal(), 1200);
  }

  /* ---------- PARALLAX HERO FLOWER ---------- */
  const flower = document.querySelector('.fv-hero__flower');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (flower) {
          const y = window.scrollY;
          flower.style.transform = `translateY(${y * 0.12}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- ANIMATED COUNTER ---------- */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start    = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.fv-hero__stat-num[data-target]');
  if (statNums.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el     = e.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => io.observe(el));
  }

  /* ---------- HERO FLOWER SVG PULSE ---------- */
  // Gentle pulsing scale on innermost circles
  const innerCircles = document.querySelectorAll('.fv-hero-center-pulse');
  innerCircles.forEach((c, i) => {
    c.style.animation = `floatIcon ${3 + i * 0.5}s ease-in-out infinite`;
    c.style.transformOrigin = 'center';
  });

})();
