/* ============================================================
   Jonathan Putra — Portfolio interaction engine
   Vanilla JS · single rAF loop · no dependencies
   ============================================================ */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(hover:none),(pointer:coarse)').matches;

/* -----------------------------------------------------------
   Year
----------------------------------------------------------- */
const yEl = $('#year'); if (yEl) yEl.textContent = new Date().getFullYear();

/* -----------------------------------------------------------
   Loading state — lock scroll for first paint, then release
----------------------------------------------------------- */
requestAnimationFrame(() => {
  document.body.classList.remove('is-loading');
  triggerTitleReveal();
});

/* -----------------------------------------------------------
   Smooth scroll (lerp) — wrapper-driven, keeps anchor links native-feeling
----------------------------------------------------------- */
(function smoothScroll() {
  if (prefersReduced || isTouch) return;
  const wrap = $('#scroll-wrap') || document.documentElement;
  let target = window.scrollY;
  let current = target;

  window.addEventListener('wheel', (e) => {
    target = clamp(target + e.deltaY, 0, document.body.scrollHeight - window.innerHeight);
  }, { passive: true });

  function tick() {
    current = lerp(current, target, 0.12);
    if (Math.abs(target - current) < 0.1) current = target;
    window.scrollTo(0, current);
    requestAnimationFrame(tick);
  }
  tick();

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      target = el.getBoundingClientRect().top + window.scrollY - 0;
    });
  });

  window.addEventListener('keydown', (e) => {
    if (['PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' '].includes(e.key)) {
      setTimeout(() => { target = window.scrollY; }, 0);
    }
  });
})();

/* -----------------------------------------------------------
   Magnetic elements
----------------------------------------------------------- */
(function magnetic() {
  if (isTouch || prefersReduced) return;
  const STR = 0.25;
  $$('[data-magnetic]').forEach(el => {
    let raf;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * STR}px, ${y * STR}px)`;
      });
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

/* -----------------------------------------------------------
   3D tilt cards — subtle, ink-shadow lift
----------------------------------------------------------- */
(function tilt() {
  if (isTouch || prefersReduced) return;
  $$('.tilt').forEach(card => {
    let raf;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 3.5;
      const ry = (px - 0.5) * 5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* -----------------------------------------------------------
   Parallax — mouse + scroll, driven by [data-depth] (images + frames)
----------------------------------------------------------- */
(function parallax() {
  if (prefersReduced) return;
  const items = $$('[data-depth]');
  if (!items.length) return;

  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function tick() {
    cx = lerp(cx, mx, 0.05);
    cy = lerp(cy, my, 0.05);
    for (const el of items) {
      const d = parseFloat(el.dataset.depth) || 0;
      const moveX = cx * d * 80;
      const moveY = cy * d * 80;
      const r = el.getBoundingClientRect();
      const rel = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const sy = -rel * d * 140;
      el.style.transform = `translate3d(${moveX}px, ${moveY + sy}px, 0)`;
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* -----------------------------------------------------------
   Reveal on scroll + title splits
----------------------------------------------------------- */
function triggerTitleReveal() {
  $$('.hero__title, .contact__title').forEach(t => {
    if (isInView(t)) t.classList.add('in');
  });
}
function isInView(el, ratio = 0.15) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * (1 - ratio) && r.bottom > 0;
}

const revealIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
$$('.reveal, [data-stagger], .hero__title, .contact__title').forEach(el => revealIO.observe(el));

/* -----------------------------------------------------------
   Counters
----------------------------------------------------------- */
(function counters() {
  const nums = $$('.stat__num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      const target = parseFloat(el.dataset.count || '0');
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1500;
      const t0 = performance.now();
      function step(now) {
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
})();

/* -----------------------------------------------------------
   Skill bars
----------------------------------------------------------- */
(function bars() {
  const bars = $$('.bar__track i');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      const lvl = parseFloat(el.dataset.level || '0.8');
      requestAnimationFrame(() => { el.style.width = (lvl * 100) + '%'; });
    });
  }, { threshold: 0.5 });
  bars.forEach(b => io.observe(b));
})();

/* -----------------------------------------------------------
   Timeline fill + active nodes
----------------------------------------------------------- */
(function timeline() {
  const wrap = $('.timeline');
  const fill = $('#timeline-fill');
  const items = $$('.tl-item');
  if (!wrap || !fill) return;

  function update() {
    const r = wrap.getBoundingClientRect();
    const total = r.height;
    const passed = clamp(window.innerHeight / 2 - r.top, 0, total);
    const pct = (passed / total) * 100;
    fill.style.height = pct + '%';
    items.forEach(it => {
      const ir = it.getBoundingClientRect();
      it.classList.toggle('is-active', ir.top < window.innerHeight * 0.6);
    });
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

/* -----------------------------------------------------------
   Scroll progress bar + dot nav active section
----------------------------------------------------------- */
(function scrollMeta() {
  const bar = $('#scroll-bar');
  const dots = $$('.dot-nav__item');
  const sections = $$('[data-section]');

  function update() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (clamp(window.scrollY / h, 0, 1) * 100) + '%';

    const mid = window.innerHeight / 2;
    let active = sections[0];
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) { active = s; break; }
      if (r.top < mid) active = s;
    }
    if (active) {
      const id = active.id;
      dots.forEach(d => d.classList.toggle('is-active', d.getAttribute('href') === '#' + id));
    }
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

/* -----------------------------------------------------------
   Console signature
----------------------------------------------------------- */
// eslint-disable-next-line no-console
console.log('%c Jonathan Putra ', 'background:#1A1814;color:#F4F1EA;font-weight:700;padding:4px 8px;border-radius:2px', '— built with vanilla JS. Say hi: jonathanputra23@gmail.com');
