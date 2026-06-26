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
async function logVisitor() {
  try {
    const ip = await fetchIP();
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        language: navigator.language,
        screenRes: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Silent fail — don't break the site
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  createBloodDrips();
  createParticles();
  logVisitor();
});
