// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// Set min date to today
const dataInput = document.getElementById('dataInput');
if (dataInput) {
  const today = new Date().toISOString().split('T')[0];
  dataInput.min = today;
  dataInput.value = today;
}

// Disable Sundays
dataInput?.addEventListener('input', () => {
  const d = new Date(dataInput.value);
  if (d.getUTCDay() === 0) {
    dataInput.setCustomValidity('Estamos fechados ao domingo. Por favor escolha outro dia.');
    dataInput.reportValidity();
  } else {
    dataInput.setCustomValidity('');
  }
});

// Form submit
document.getElementById('formMarcacao')?.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('formMarcacao').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
});

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });

document.querySelectorAll('.servico-card, .review-card, .galeria-item, .loc-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Add visible class via CSS injection
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);
