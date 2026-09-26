/*
 * StkAufnahme landing — behaviour.
 * Platform detection and the store switch run inline in <head> (before first
 * paint); this file only adds motion and wires the store links.
 */
(() => {
  const root = document.documentElement;
  const reduceMotion = root.classList.contains('reduce-motion');
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Store links: window.STK in <head> is the single source of truth ──────
  const { APP_STORE_URL, PLAY_URL } = window.STK || {};
  if (APP_STORE_URL) $$('[data-store="ios"]').forEach((a) => { a.href = APP_STORE_URL; });
  if (PLAY_URL) $$('[data-store="android"]').forEach((a) => { a.href = PLAY_URL; });

  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // ── Reveal on scroll ──────────────────────────────────────────────────────
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $$('.reveal').forEach((el) => revealIO.observe(el));

  // ── Count-up stats ────────────────────────────────────────────────────────
  const easeOutCubic = (t) => 1 - (1 - t) ** 3;
  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion || !Number.isFinite(target)) { el.textContent = String(target); return; }
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = String(Math.round(target * easeOutCubic(t)));
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      countIO.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  // ── Scroll-linked: glass nav, hero phone tilt, floating cards ────────────
  const nav = document.querySelector('[data-nav]');
  const heroPhone = document.querySelector('[data-hero-phone]');
  const floaters = $$('[data-parallax]');
  let ticking = false;

  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 8);
    if (reduceMotion || !heroPhone) return;

    // The phone rises and grows to full size over the first ~55% of a screen
    // of scrolling — the product "arrives" as the reader commits to the page.
    const p = Math.min(1, Math.max(0, y / (window.innerHeight * 0.55)));
    const e = easeOutCubic(p);
    heroPhone.style.setProperty('--scale', (0.9 + 0.1 * e).toFixed(4));
    heroPhone.style.setProperty('--lift', `${(48 * (1 - e)).toFixed(1)}px`);

    if (y < window.innerHeight * 1.5) {
      floaters.forEach((f) => {
        f.style.setProperty('--py', `${(y * Number(f.dataset.parallax)).toFixed(1)}px`);
      });
    }
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  // ── Story: the step crossing the middle of the viewport drives the phone ──
  const steps = $$('.step');
  const screens = $$('[data-screen]');
  const dots = $$('.story__dots span');
  const stack = document.querySelector('.stack');

  const setStep = (i) => {
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    screens.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    const img = screens[i];
    if (img && stack) {
      stack.style.setProperty('--bg', img.style.getPropertyValue('--bg') || '#fff');
      stack.classList.toggle('is-cut', img.hasAttribute('data-cut'));
    }
  };
  const storyIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setStep(Number(e.target.dataset.step)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach((s) => storyIO.observe(s));
  setStep(0);

  // ── FAQ: one answer open at a time ────────────────────────────────────────
  const faqItems = $$('.faq__item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });
})();
