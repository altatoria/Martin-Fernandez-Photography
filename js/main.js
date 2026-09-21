/* ===== NAV SCROLL — only on hero/home page ===== */
const nav = document.getElementById('nav');
if (nav && nav.classList.contains('nav--hero')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ===== NAV TOGGLE (mobile) ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

/* ===== HERO IMAGE PARALLAX & LOAD ===== */
const heroBgImg = document.querySelector('.hero-bg img');
if (heroBgImg) {
  const onLoad = () => heroBgImg.classList.add('loaded');
  heroBgImg.complete ? onLoad() : heroBgImg.addEventListener('load', onLoad);
}

/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => ro.observe(el));
}

/* ===== ACTIVE NAV LINK ===== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length && galleryItems.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
}

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');

if (lightbox && lbImg) {
  let currentIdx = 0;
  let visible = [];

  function getVisible() {
    return [...galleryItems].filter(el => !el.classList.contains('hidden'));
  }

  function showImage(idx) {
    visible = getVisible();
    currentIdx = (idx + visible.length) % visible.length;
    const src = visible[currentIdx].querySelector('img').src;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = src;
      lbImg.onload = () => { lbImg.style.opacity = '1'; };
    }, 120);
    if (lbCounter) lbCounter.textContent = `${currentIdx + 1} / ${visible.length}`;
  }

  function openLightbox(idx) {
    showImage(idx);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const vis = getVisible();
      openLightbox(vis.indexOf(item));
    });
  });

  document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')?.addEventListener('click', () => showImage(currentIdx - 1));
  document.getElementById('lbNext')?.addEventListener('click', () => showImage(currentIdx + 1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
    if (e.key === 'ArrowRight') showImage(currentIdx + 1);
  });

  // Swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) showImage(dx < 0 ? currentIdx + 1 : currentIdx - 1);
  }, { passive: true });
}

/* ===== CONTACT FORM (Formspree) ===== */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.textContent = 'Message sent ✓';
        form.reset();
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Error — try again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  });
}
