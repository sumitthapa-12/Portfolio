/* =============================================
   SUMIT PORTFOLIO — script.js
   Interactions, Animations & Effects
============================================= */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initTyping();
  initCanvas();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initPortfolioFilter();
  initContactForm();
  initSmoothScroll();
  setYear();
});

/* ============================================
   1. CUSTOM CURSOR
============================================= */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followX = 0, followY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followX += (mouseX - followX) * 0.12;
    followY += (mouseY - followY) * 0.12;
    follower.style.left = followX + 'px';
    follower.style.top  = followY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .filter-btn, .portfolio-item, .service-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.background = 'var(--neon2)';
      follower.style.transform = 'translate(-50%,-50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--neon)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ============================================
   2. NAVBAR — Scroll + Hamburger
============================================= */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveSection();
  }, { passive: true });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    let current = 'home';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
}

/* ============================================
   3. TYPING EFFECT
============================================= */
function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const roles = [
    'Digital Marketer',
    'Motion Graphic Designer',
    'Video Editor',
    'Website Developer',
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const typeSpeed   = 90;
  const deleteSpeed = 50;
  const pauseTime   = 1800;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      setTimeout(() => { isDeleting = true; type(); }, pauseTime);
      return;
    }
    if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  setTimeout(type, 600);
}

/* ============================================
   4. CANVAS PARTICLE BACKGROUND
============================================= */
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 70;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle());
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0,229,255' : '123,97,255',
    };
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,255,${0.1 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });

    drawLines();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
}

/* ============================================
   5. SCROLL REVEAL
============================================= */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.skill-category, .service-card, .portfolio-item, .about-card, .about-text, .contact-info, .contact-form, .stat'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* ============================================
   6. SKILL BAR ANIMATION
============================================= */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width');
        setTimeout(() => { target.style.width = width + '%'; }, 200);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================
   7. COUNTER ANIMATION
============================================= */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.getAttribute('data-target');
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================
   8. PORTFOLIO FILTER
============================================= */
function initPortfolioFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-cat');
        const show = filter === 'all' || cat === filter;
        if (show) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease both';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================
   9. CONTACT FORM
============================================= */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const msg  = form.querySelector('#message').value.trim();

    if (!name || !email || !msg) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      shakeForm(form.querySelector('#email'));
      return;
    }

    // Simulate sending
    btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
      btn.disabled = false;
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1800);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }

  // Add shake keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
  `;
  document.head.appendChild(style);
}

/* ============================================
   10. SMOOTH SCROLL
============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================
   11. SET CURRENT YEAR
============================================= */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
