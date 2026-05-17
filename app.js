// ══════════════════════════
// NAVIGATION UTILITIES
// ══════════════════════════
function showLanding() {
  document.getElementById('landing').style.display = 'block';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('login-page').classList.remove('active');
  animateCounters();
}

function showApp() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('login-page').classList.remove('active');
  
  // Render internal layouts and feeds
  renderBarChart();
  renderAnalyticsChart();
  renderUserTable();
  initThreatFeed();
}

function showLogin() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('login-page').classList.add('active');
  resetLoginView();
}

function resetLoginView() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('otpForm').classList.remove('show');
  document.getElementById('otpForm').style.display = 'none';
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function switchTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.getElementById('tab-' + name).style.display = 'block';
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  
  if (el) el.classList.add('active');
  
  const titles = {
    dashboard: 'Dashboard Utama',
    security: 'Monitoring Keamanan SOC',
    threatmap: 'Peta Ancaman Global Live',
    users: 'Manajemen Pengguna',
    integration: 'Integrasi Eksternal API',
    analytics: 'Analitik & Tren Laporan',
    audit: 'Audit Compliance Trail',
    support: 'Support & Dokumentasi'
  };
  
  document.getElementById('topTitle').textContent = titles[name] || name;
  if (name === 'threatmap') initThreatFeed();
  if (name === 'analytics') renderAnalyticsChart();
}

// ══════════════════════════
// AUTHENTICATION FLOW
// ══════════════════════════
function doLogin() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  
  if (!email || !pass) {
    showToast('Validasi Gagal', 'Masukkan email dan password akses.', '⚠️');
    return;
  }
  
  showToast('Autentikasi Berhasil', 'Selamat datang kembali, Muhammad Maulana Yusuf 👋', '✅');
  setTimeout(() => {
    showApp();
    switchTab('dashboard', document.querySelector('.nav-item'));
  }, 600);
}

function goTo2FAFallback() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('otpForm').style.display = 'block';
  document.getElementById('otpForm').classList.add('show');
  
  // Set up auto-focus flow for 2FA individually structured boxes
  setupOTPBoxesFlow();
}

function setupOTPBoxesFlow() {
  const boxes = document.querySelectorAll('.otp-box');
  if (boxes.length === 0) return;
  
  // Clean values and focus on first index
  boxes.forEach(box => box.value = '');
  boxes[0].focus();
  
  boxes.forEach((box, idx) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      // Filter numeric input
      e.target.value = val.replace(/[^0-9]/g, '');
      
      if (e.target.value.length === 1 && idx < boxes.length - 1) {
        boxes[idx + 1].focus();
      }
    });
    
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && idx > 0) {
        boxes[idx - 1].focus();
      }
    });
  });
}

function doOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  const code = Array.from(boxes).map(b => b.value).join('');
  
  if (code.length < 6) {
    showToast('Token Tidak Valid', 'Masukkan lengkap 6 digit kode token.', '⚠️');
    return;
  }
  
  showToast('Token Diverifikasi', 'Akses token sesuai, memuat database...', '🔐');
  setTimeout(() => {
    showApp();
    switchTab('dashboard', document.querySelector('.nav-item'));
  }, 800);
}

// ══════════════════════════
// RENDERING CHART GRAPHICS
// ══════════════════════════
function renderBarChart() {
  const data = [320, 480, 290, 650, 520, 380, 620];
  const max = Math.max(...data);
  const el = document.getElementById('barChart');
  if (!el) return;
  
  el.innerHTML = data.map((v, i) => {
    const h = Math.round((v / max) * 160);
    const colors = ['#00d4ff', '#1a6aff', '#00d4ff', '#ff1744', '#1a6aff', '#00d4ff', '#00e676'];
    return `<div class="chart-bar" style="height:${h}px;background:${colors[i]};opacity:.75" title="${v} ancaman"></div>`;
  }).join('');
}

function renderAnalyticsChart() {
  const data = [980, 1120, 890, 1340, 1100, 1247];
  const max = Math.max(...data);
  const el = document.getElementById('analyticsChart');
  if (!el) return;
  
  el.innerHTML = data.map((v) => {
    const h = Math.round((v / max) * 160);
    return `
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
        <div style="font-size:11px;font-family:var(--mono);color:var(--text-muted)">${v}</div>
        <div style="width:100%;height:${h}px;background:linear-gradient(to top,rgba(0,100,255,.6),rgba(0,212,255,.4));border-radius:4px 4px 0 0;opacity:.8;transition:.3s"></div>
      </div>
    `;
  }).join('');
}

// ══════════════════════════
// LOGIC TABLES AND COMPONENT FEEDS
// ══════════════════════════
const usersList = [
  {
    name: 'Muhammad Maulana Yusuf',
    email: 'maulana@ciphercore.id',
    role: 'Super Admin',
    dept: 'Engineering',
    status: 'Aktif',
    last: 'Hari ini, 14:32',
    color: 'linear-gradient(135deg,#1a6aff,#00d4ff)',
    initials: 'MMY'
  },
  {
    name: 'Muhammad Akbar Firdaus',
    email: 'akbar@ciphercore.id',
    role: 'Admin',
    dept: 'Security Ops',
    status: 'Aktif',
    last: 'Hari ini, 13:15',
    color: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    initials: 'MAF'
  },
  {
    name: 'Ilham Dwi Cahya',
    email: 'ilham@ciphercore.id',
    role: 'Operator',
    dept: 'Infrastructure',
    status: 'Aktif',
    last: 'Hari ini, 12:48',
    color: 'linear-gradient(135deg,#059669,#10b981)',
    initials: 'IDC'
  }
];

function renderUserTable() {
  const tb = document.getElementById('userTable');
  if (!tb) return;
  const roleColors = { 'Super Admin': 'badge-danger', 'Admin': 'badge-warning', 'Operator': 'badge-info' };
  
  tb.innerHTML = usersList.map(u => `
    <tr>
      <td style="padding-left:20px">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="avatar-sm" style="background:${u.color};color:#fff">${u.initials}</div>
          <div><div style="font-size:13px;font-weight:600">${u.name}</div><div style="font-size:11px;color:var(--text-muted)">${u.email}</div></div>
        </div>
      </td>
      <td><span class="badge ${roleColors[u.role] || 'badge-muted'}">${u.role}</span></td>
      <td style="color:var(--text-secondary);font-size:13px">${u.dept}</td>
      <td><span class="badge badge-success">${u.status}</span></td>
      <td><button class="btn btn-ghost" style="padding:4px 10px;font-size:11px" onclick="showToast('Edit mode', 'Akses konfigurasi user.', '✏️')">Menej</button></td>
    </tr>
  `).join('');
}

const threatTypesList = [
  {type:'Brute Force SSH',ip:'185.234.218.44',target:'prod-api-02',sev:'danger',country:'🇷🇺 Russia'},
  {type:'SQL Injection',ip:'91.108.4.82',target:'api.ciphercore.id',sev:'warning',country:'🇨🇳 China'}
];

function initThreatFeed() {
  const el = document.getElementById('threatFeed');
  if (!el) return;
  el.innerHTML = '';
  
  let i = 0;
  function addThreat() {
    const t = threatTypesList[i % threatTypesList.length];
    const now = new Date();
    const ts = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    const div = document.createElement('div');
    div.className = `alert-item ${t.sev === 'danger' ? 'critical' : 'warning'}`;
    div.innerHTML = `
      <span class="alert-dot"></span>
      <span style="font-size:11px;font-family:var(--mono);color:var(--text-muted)">${ts}</span>
      <span style="font-size:13px;flex:1">${t.country} <strong>${t.type}</strong> → ${t.target}</span>
      <span class="badge badge-danger">Blocked</span>
    `;
    el.insertBefore(div, el.firstChild);
    if (el.children.length > 5) el.lastChild.remove();
    i++;
  }
  addThreat();
  if (window._threatInterval) clearInterval(window._threatInterval);
  window._threatInterval = setInterval(addThreat, 4000);
}

// ══════════════════════════
// AUXILIARY UTILITIES
// ══════════════════════════
function showToast(title, msg, icon) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="toast-icon">${icon || '💡'}</span><div><div style="font-size:13px;font-weight:600;margin-bottom:2px">${title}</div><div style="font-size:12px;color:var(--text-secondary)">${msg}</div></div>`;
  container.appendChild(t);
  setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 300); }, 3500);
}

function toggleFaq(el) { el.classList.toggle('open'); }

function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isFloat = target % 1 !== 0;
    const duration = 1200;
    const start = performance.now();
    
    function step(now) {
      const prog = Math.min((now - start) / duration, 1);
      const val = target * (1 - Math.pow(1 - prog, 3));
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString();
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// CMD PLATFORM SHORTCUT
const cmdItemsList = [
  {icon:'📊',label:'Dashboard',sub:'Halaman utama',action:()=>{showApp();switchTab('dashboard',document.querySelector('.nav-item'))}},
  {icon:'🏠',label:'Landing Page',sub:'Beranda publik',action:showLanding}
];

function openCmd() { document.getElementById('cmdPalette').classList.add('open'); renderCmd(''); document.getElementById('cmdInput').focus(); }
function closeCmd() { document.getElementById('cmdPalette').classList.remove('open'); }
function renderCmd(q) {
  const res = document.getElementById('cmdResults');
  if (!res) return;
  const filtered = cmdItemsList.filter(item => item.label.toLowerCase().includes(q.toLowerCase()));
  res.innerHTML = filtered.map((item, idx) => `
    <div class="cmd-item" onclick="runCmd(${cmdItemsList.indexOf(item)})">
      <div class="cmd-item-icon">${item.icon}</div>
      <div><div style="font-size:14px;font-weight:500">${item.label}</div><div style="font-size:12px;color:var(--text-muted)">${item.sub}</div></div>
    </div>
  `).join('');
}
function runCmd(idx) { closeCmd(); setTimeout(() => cmdItemsList[idx].action(), 50); }

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmd(); }
  if (e.key === 'Escape') closeCmd();
});

if (document.getElementById('cmdInput')) {
  document.getElementById('cmdInput').addEventListener('input', e => renderCmd(e.target.value));
}

window.onload = () => {
  animateCounters();
  showToast('Sistem Operasional Siap', 'Gunakan kustomisasi ⌘K untuk navigasi.', '🔐');
};