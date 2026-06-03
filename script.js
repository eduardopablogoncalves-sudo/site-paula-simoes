// ── Navbar scroll ───────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu ─────────────────────────────────────
const toggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => nav.classList.toggle('mobile-open'));
document.querySelectorAll('.nav a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('mobile-open'))
);

// ── Service chips ────────────────────────────────────
let selectedService = '';
document.querySelectorAll('.service-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.service-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    selectedService = chip.dataset.service;
  });
});

// ══════════════════════════════════════════════════════
//  BOOKING SYSTEM — slots stored in localStorage
// ══════════════════════════════════════════════════════

const STORAGE_KEY = 'ps_booked_slots'; // "paula_simoes_booked"

// All slots for a regular weekday
const SLOTS_WEEKDAY = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'
];
// Saturday closes earlier
const SLOTS_SATURDAY = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30'
];

function getBookedSlots() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveBookedSlot(date, time) {
  const booked = getBookedSlots();
  if (!booked[date]) booked[date] = [];
  if (!booked[date].includes(time)) booked[date].push(time);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(booked));
}

function isBooked(date, time) {
  const booked = getBookedSlots();
  return (booked[date] || []).includes(time);
}

// ── Date field ───────────────────────────────────────
let selectedDate = '';
let selectedTime = '';

const dataField = document.getElementById('dataField');
if (dataField) {
  // Set min = today (skip Sunday)
  const today = new Date();
  if (today.getDay() === 0) today.setDate(today.getDate() + 1);
  dataField.min = today.toISOString().split('T')[0];

  dataField.addEventListener('change', () => {
    const val = dataField.value;
    if (!val) return;

    const d = new Date(val + 'T12:00:00');
    const day = d.getDay();

    if (day === 0) {
      dataField.setCustomValidity('Fechado ao domingo — escolha outro dia.');
      dataField.reportValidity();
      document.getElementById('slotsSection').style.display = 'none';
      return;
    }
    dataField.setCustomValidity('');

    selectedDate = val;
    selectedTime = '';
    document.getElementById('btnStep2').disabled = true;
    renderSlots(val, day === 6 ? SLOTS_SATURDAY : SLOTS_WEEKDAY);
  });
}

function renderSlots(date, slots) {
  const grid = document.getElementById('slotsGrid');
  const section = document.getElementById('slotsSection');
  grid.innerHTML = '';

  slots.forEach(time => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot-btn';
    btn.textContent = time;

    if (isBooked(date, time)) {
      btn.classList.add('slot--busy');
      btn.disabled = true;
      btn.title = 'Horário ocupado';
    } else {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('slot--selected'));
        btn.classList.add('slot--selected');
        selectedTime = time;
        document.getElementById('btnStep2').disabled = false;
      });
    }
    grid.appendChild(btn);
  });

  section.style.display = 'block';
}

// ── Step navigation ──────────────────────────────────
function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

document.getElementById('btnStep1')?.addEventListener('click', () => {
  const nome = document.getElementById('inputNome').value.trim();
  const tel  = document.getElementById('inputTel').value.trim();
  if (!nome) { alert('Por favor insira o seu nome.'); return; }
  if (!tel)  { alert('Por favor insira o seu telefone.'); return; }
  if (!selectedService) { alert('Por favor escolha um serviço.'); return; }
  showStep('step2');
});

document.getElementById('btnBack1')?.addEventListener('click', () => showStep('step1'));

document.getElementById('btnStep2')?.addEventListener('click', () => {
  if (!selectedDate || !selectedTime) return;

  // Save to localStorage
  saveBookedSlot(selectedDate, selectedTime);

  // Build summary
  const nome = document.getElementById('inputNome').value.trim();
  const d = new Date(selectedDate + 'T12:00:00');
  const dateStr = d.toLocaleDateString('pt-PT', { weekday:'long', day:'numeric', month:'long' });

  document.getElementById('bookingSummary').innerHTML = `
    <div class="summary-row"><span>👤</span><span>${nome}</span></div>
    <div class="summary-row"><span>✂️</span><span>${selectedService}</span></div>
    <div class="summary-row"><span>📅</span><span>${dateStr}</span></div>
    <div class="summary-row"><span>🕐</span><span>${selectedTime}</span></div>
  `;

  showStep('step3');
});

document.getElementById('btnNovasMarcacoes')?.addEventListener('click', () => {
  selectedDate = '';
  selectedTime = '';
  selectedService = '';
  document.querySelectorAll('.service-chip').forEach(c => c.classList.remove('active'));
  if (dataField) dataField.value = '';
  document.getElementById('slotsSection').style.display = 'none';
  document.getElementById('btnStep2').disabled = true;
  showStep('step1');
});

// ── Scroll reveal ────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.servico, .review, .galeria-item, .loc-item, .sobre-text, .sobre-media, .marcacao-left, .marcacao-right'
);
revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
revealEls.forEach(el => observer.observe(el));
