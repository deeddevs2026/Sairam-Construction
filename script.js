/* ══════════════════════════════════════════════
   SAIRAM PROMOTERS — Premium JS
   ══════════════════════════════════════════════ */

'use strict';

/* ─── Utility ─────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ─── Loader ──────────────────────────────────── */
(function initLoader() {
  const loader = $('#loader');
  const fill   = $('#loaderFill');
  const numEl  = $('#loaderNum');
  document.body.classList.add('loading');

  let progress = 0;
  const target = { val: 0 };
  const interval = setInterval(() => {
    target.val = Math.min(target.val + Math.random() * 18, 100);
    progress = lerp(progress, target.val, 0.12);
    const p = Math.floor(progress);
    fill.style.width = p + '%';
    numEl.textContent = p + '%';
    if (p >= 99) {
      clearInterval(interval);
      fill.style.width = '100%';
      numEl.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('loading');
        // trigger hero word animations
        $$('.hero-word').forEach((w, i) => {
          setTimeout(() => w.classList.add('visible'), 200 + i * 160);
        });
        // trigger hero stat counter
        startCounters('.stat-num');
      }, 550);
    }
  }, 45);
})();

/* ─── Custom Cursor ───────────────────────────── */
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || window.innerWidth < 768) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx = lerp(fx, mx, 0.12);
    fy = lerp(fy, my, 0.12);
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  const hoverEls = $$('a, button, .project-card, .service-card, .btn');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
})();

/* ─── Navbar ──────────────────────────────────── */
(function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileLinks = $$('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── Hero Parallax ───────────────────────────── */
(function initHeroParallax() {
  const heroImg = $('#heroImg');
  if (!heroImg) return;

  // Trigger scale-in on load
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        heroImg.style.transform = `scale(1.08) translateY(${sy * 0.22}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ─── Particles ───────────────────────────────── */
(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 8 : 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
})();

/* ─── Scroll Reveal ───────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      if (el.classList.contains('reveal-up')) {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
      }

      if (el.classList.contains('reveal-fade')) {
        el.classList.add('visible');
      }

      if (el.classList.contains('reveal-text')) {
        animateText(el);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal-up, .reveal-fade, .reveal-text').forEach(el => observer.observe(el));

  // Counter observer
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      startCounters('.count-num', section.closest('section') || document);
      // Also handle badge counter
      $$('.badge-num', section.closest('section') || document).forEach(animateCount);
      counterObserver.unobserve(section);
    });
  }, { threshold: 0.3 });

  $$('.numbers-grid, .architect-frame').forEach(el => counterObserver.observe(el));
})();

/* ─── Text Reveal Animation ───────────────────── */
function animateText(el) {
  const text = el.textContent;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length > 1 || text.length > 40) {
    // Split into characters with stagger
    const words = text.trim().split(/\s+/);
    el.innerHTML = words.map((word, i) =>
      `<span class="word-inner" style="display:inline-block;overflow:hidden;margin-right:0.25em">
        <span style="display:inline-block;transform:translateY(110%);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1);transition-delay:${i * 60}ms">${word}</span>
       </span>`
    ).join('');
    requestAnimationFrame(() => {
      $$('span > span', el).forEach(s => s.style.transform = 'translateY(0)');
    });
  } else {
    el.style.opacity = '1';
  }
}

/* ─── Counter Animation ───────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

function startCounters(selector, ctx = document) {
  $$(selector, ctx).forEach(animateCount);
}

/* ─── Testimonials Slider ─────────────────────── */
(function initTestimonials() {
  const cards = $$('.testimonial-card');
  const dots  = $$('.dot');
  if (!cards.length) return;

  let current = 0;
  let autoInterval;

  function goTo(idx) {
    cards[current].style.display = 'none';
    dots[current].classList.remove('active');
    current = (idx + cards.length) % cards.length;
    cards[current].style.display = 'block';
    dots[current].classList.add('active');
    
    // Animate in
    cards[current].style.opacity = '0';
    cards[current].style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      cards[current].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      cards[current].style.opacity = '1';
      cards[current].style.transform = 'translateY(0)';
    });
  }

  // Init: hide all except first
  cards.forEach((c, i) => { if (i !== 0) c.style.display = 'none'; });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoInterval);
      goTo(i);
      startAuto();
    });
  });

  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }
  startAuto();
})();

/* ─── Contact Form ────────────────────────────── */
(function initForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbwW0m4IwoKLoCp-KIcN-_4Th0pow-swBNXpzISlPlNrKZ5PFV7i8NpPXgjKnp5383g/exec';
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#formSubmit');
    const btnText = btn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    btn.disabled = true;
    btnText.textContent = 'Sending…';

    const payload = {
      name: $('#fname')?.value.trim() || '',
      phone: $('#fphone')?.value.trim() || '',
      email: $('#femail')?.value.trim() || '',
      interestedIn: $('#fproperty')?.value || '',
      projectStage: $('#fbudget')?.value || '',
      message: $('#fmsg')?.value.trim() || '',
    };

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      form.style.display = 'none';
      success.classList.add('show');
    } catch (err) {
      btn.disabled = false;
      btnText.textContent = originalText;
      alert('Sorry, the enquiry could not be sent. Please try again.');
    }
  });
})();

/* ─── Back to Top ─────────────────────────────── */
(function initBackTop() {
  const btn = $('#backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── Smooth Scroll for anchor links ─────────── */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const id = anchor.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  const offset = 80;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ─── Section Active Nav Links ────────────────── */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = navLinks.find(l => l.getAttribute('href') === `#${entry.target.id}`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ─── Tilt effect on project cards ───────────── */
(function initTilt() {
  if (window.innerWidth < 768) return;
  $$('.project-card:not(.project-teaser)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── Horizontal scroll hint on projects ─────── */
(function initProjectsReveal() {
  const grid = $('.projects-grid');
  if (!grid) return;
  const cards = $$('.project-card', grid);
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 150);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });
  observer.observe(grid);
})();

console.log('%c SAIRAM PROMOTERS ', 'background:#C9A84C;color:#0A1628;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:3px;');
console.log('%c Building the Unreal since 2006 ', 'color:#C9A84C;font-size:12px;');
