/* script.js: lógica de navegación, temporizador, guardado local y enlace a Google Form */
const NAV = document.querySelectorAll('.nav-btn');
const PAGES = document.querySelectorAll('.page');
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
openQrBtn.addEventListener('click', () => {
const url = encodeURIComponent(location.href);
const qr = https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${url};
window.open(qr, '_blank');
});

// Abrir formulario de Google (para configurar o enviar)
openFormBtn.addEventListener('click', () => {
window.open(GOOGLE_FORM_URL, '_blank');
});

// Navegación
NAV.forEach(btn=>{
btn.addEventListener('click', ()=> {

const tgt = btn.dataset.target;
PAGES.forEach(p => p.classList.remove('active'));
const page = document.getElementById(tgt);
if (page) page.classList.add('active');
showToast("Sección: " + tgt);
});
});

// Temporizador básico
let timerInterval = null;
function formatTime(s){
const mm = String(Math.floor(s/60)).padStart(2,'0');
const ss = String(s%60).padStart(2,'0');
return ${mm}:${ss};
}
document.querySelectorAll('.timer-btn').forEach(b => {
b.addEventListener('click', () => {

const seconds = parseInt(b.dataset.seconds) || 30;
startTimer(seconds);
});
});
function startTimer(seconds){
clearInterval(timerInterval);
let remaining = seconds;
timerDisplay.textContent = formatTime(remaining);
timerInterval = setInterval(()=> {

remaining--;
timerDisplay.textContent = formatTime(Math.max(remaining,0));
if(remaining <= 0){ clearInterval(timerInterval); showToast("Temporizador terminado"); }
}, 1000);
}
resetTimerBtn.addEventListener('click', ()=>{ clearInterval(timerInterval); timerDisplay.textContent = "00:00"; });

// Guardado de progreso en localStorage
saveProgressBtn.addEventListener('click', ()=> {
const data = {};
document.querySelectorAll('.page').forEach(page=>{

const id = page.id;
const checks = Array.from(page.querySelectorAll('.done-chk')).map(c => c.checked);
data[id] = checks;
});
localStorage.setItem('rehabProgress', JSON.stringify(datos));
showToast("Progreso guardado localmente");
});

// Cargar progreso si existe
function loadProgress(){
const raw = localStorage.getItem('rehabProgress');
if(!raw) return;
try{

const data = JSON.parse(raw);
Object.keys(data).forEach(id=>{
  const checks = data[id];
  const page = document.getElementById(id);
  if(!page) return;
  page.querySelectorAll('.done-chk').forEach((chk,i)=> chk.checked = !!checks[i]);
});
}catch(e){

console.error('Error al cargar progreso:', e);
}
}
loadProgress();

// Enviar finalización: abre Google Form con nueva pestaña
sendCompleteBtn.addEventListener('click', ()=>{
window.open(GOOGLE_FORM_URL, '_blank');
showToast("Formulario abierto: marca que completaste la rehabilitación");
});

// Mensajes pequeños
function showToast(msg, dur=1800){
toast.textContent = msg;
toast.style.display = 'block';
toast.setAttribute('aria-hidden','false');
setTimeout(()=> {

toast.style.display = 'none';
toast.setAttribute('aria-hidden','true');
}, dur);
}

Notas importantes antes de guardar:

No traduzcas las palabras claves (const, function, document, window, addEventListener, etc.). Deben quedar en inglés.
Asegúrese de que en index.html al final esté: <script src="script.js"></script> (para que cargar).
Comprueba que los data-target de los botones coinciden exactamente con los id de las secciones (p. ej. data-target="dorsal" debe tener <section id="dorsal">).
