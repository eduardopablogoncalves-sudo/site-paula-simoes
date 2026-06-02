// ── Navbar scroll ──────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu ────────────────────────────────
const toggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => nav.classList.toggle('mobile-open'));
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', () => nav.classList.remove('mobile-open'));
});

// ── Min date ───────────────────────────────────
const dateField = document.getElementById('dataField');
if (dateField) {
  const today = new Date();
  // skip Sunday
  if (today.getDay() === 0) today.setDate(today.getDate() + 1);
  dateField.min = today.toISOString().split('T')[0];
  dateField.addEventListener('change', () => {
    const d = new Date(dateField.value + 'T12:00:00');
    if (d.getDay() === 0) {
      dateField.setCustomValidity('Fechado ao domingo — escolha outro dia.');
      dateField.reportValidity();
    } else {
      dateField.setCustomValidity('');
    }
  });
}

// ── Service chips ──────────────────────────────
document.querySelectorAll('.service-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.service-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('servicoHidden').value = chip.dataset.service;
  });
});

// ── Form submit ────────────────────────────────
document.getElementById('bookingForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  form.style.opacity = '0';
  form.style.transform = 'scale(0.97)';
  form.style.transition = 'all .3s';
  setTimeout(() => {
    form.style.display = 'none';
    const success = document.getElementById('bookingSuccess');
    success.style.display = 'block';
    success.style.opacity = '0';
    setTimeout(() => { success.style.opacity = '1'; success.style.transition = 'opacity .4s'; }, 10);
  }, 300);
});

// ── Scroll reveal ──────────────────────────────
const revealEls = document.querySelectorAll(
  '.servico, .review, .galeria-item, .loc-item, .sobre-text, .sobre-media, .marcacao-left, .marcacao-right'
);
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });

revealEls.forEach(el => observer.observe(el));
