/* script.js: lógica de navegación, temporizador, guardado local y enlace a Google Form */
const NAV = document.querySelectorAll('.nav-btn') || [];
const PAGES = document.querySelectorAll('.page') || [];
const timerDisplay = document.getElementById('timer-display');
const resetTimerBtn = document.getElementById('reset-timer');
const saveProgressBtn = document.getElementById('save-progress');
const sendCompleteBtn = document.getElementById('send-complete');
const openFormBtn = document.getElementById('open-form');
const openQrBtn = document.getElementById('open-qr');
const toast = document.getElementById('toast');

// Pegue aquí el enlace de su Google Form (copiar desde "Enviar" -> link)
// Ejemplo: const GOOGLE_FORM_URL = "https://forms.gle/abcd1234";
const GOOGLE_FORM_URL = "https://forms.gle/REEMPLAZA_POR_TU_FORM";

// Mostrar código QR usando la API de Google Charts
if (openQrBtn) {
openQrBtn.addEventListener('click', () => {

const url = encodeURIComponent(location.href);
const qr = `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${url}`;
window.open(qr, '_blank');
});
}

// Abrir formulario de Google (para configurar o enviar)
if (openFormBtn) {
openFormBtn.addEventListener('click', () => {

if (!GOOGLE_FORM_URL || GOOGLE_FORM_URL.includes('REEMPLAZA_POR_TU_FORM')) {
  showToast('Configura primero el enlace del formulario (GOOGLE_FORM_URL).');
  return;
}
window.open(GOOGLE_FORM_URL, '_blank');
});
}

// Navegación entre secciones
NAV.forEach(btn => {
btn.addEventListener('click', () => {

const tgt = btn.dataset.target;
PAGES.forEach(p => p.classList.remove('active'));
const page = document.getElementById(tgt);
if (page) page.classList.add('active');
showToast('Sección: ' + tgt);
});
});

// Temporizador
let timerInterval = null;

function formatTime(s) {
const mm = String(Math.floor(s / 60)).padStart(2, '0');
const ss = String(s % 60).padStart(2, '0');
return ${mm}:${ss};
}

function startTimer(seconds) {
clearInterval(timerInterval);
let remaining = Number(seconds) || 0;
if (timerDisplay) timerDisplay.textContent = formatTime(remaining);
timerInterval = setInterval(() => {

remaining--;
if (timerDisplay) timerDisplay.textContent = formatTime(Math.max(remaining, 0));
if (remaining <= 0) {
  clearInterval(timerInterval);
  timerInterval = null;
  showToast('Temporizador terminado');
}
}, 1000);
}

const timerBtns = document.querySelectorAll('.timer-btn') || [];
timerBtns.forEach(b => {
b.addEventListener('click', () => {

const seconds = parseInt(b.dataset.seconds) || 30;
startTimer(seconds);
});
});

if (resetTimerBtn) {
resetTimerBtn.addEventListener('click', () => {

clearInterval(timerInterval);
timerInterval = null;
if (timerDisplay) timerDisplay.textContent = '00:00';
showToast('Temporizador detenido');
});
}

// Guardado de progreso en localStorage
if (saveProgressBtn) {
saveProgressBtn.addEventListener('click', () => {

try {
  const data = {};
  document.querySelectorAll('.page').forEach(page => {
    const id = page.id || 'page';
    const checks = Array.from(page.querySelectorAll('.done-chk')).map(c => c.checked);
    data[id] = checks;
  });
  localStorage.setItem('rehabProgress', JSON.stringify(data));
  showToast('Progreso guardado localmente');
} catch (err) {
  console.error(err);
  showToast('Error al guardar progreso');
}
});
}

// Cargar progreso si existe
function loadProgress() {
const raw = localStorage.getItem('rehabProgress');
if (!raw) return;
try {

const data = JSON.parse(raw);
Object.keys(data).forEach(id => {
  const checks = data[id];
  const page = document.getElementById(id);
  if (!page) return;
  page.querySelectorAll('.done-chk').forEach((chk, i) => (chk.checked = !!checks[i]));
});
} catch (e) {

console.error('Error al cargar progreso:', e);
}
}
loadProgress();

// Enviar finalización: abre Google Form en nueva pestaña
if (sendCompleteBtn) {
sendCompleteBtn.addEventListener('click', () => {

if (!GOOGLE_FORM_URL || GOOGLE_FORM_URL.includes('REEMPLAZA_POR_TU_FORM')) {
  showToast('Configura primero el enlace del formulario (GOOGLE_FORM_URL).');
  return;
}
window.open(GOOGLE_FORM_URL, '_blank');
showToast('Formulario abierto: marca que completaste la rehabilitación');
});
}

// Helper para toasts
function showToast(msg, dur = 1800) {
if (!toast) {

console.log('Toast:', msg);
return;
}
toast.textContent = msg;
toast.style.display = 'block';
toast.setAttribute('aria-hidden', 'false');
setTimeout(() => {

toast.style.display = 'none';
toast.setAttribute('aria-hidden', 'true');
}, dur);
}

// Inicialización visual
if (timerDisplay) timerDisplay.textContent = '00:00';
