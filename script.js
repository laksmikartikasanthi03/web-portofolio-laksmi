/**
 * Ni Komang Laksmi Kartika Santhi — Portfolio Interactive Engine
 * Pure Vanilla JavaScript (Zero Bloat, High-Performance ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live WITA Clock (UTC+8 / Bali)
  initLiveClock();

  // 2. Card Spotlight Cursor Tracking
  initCardSpotlights();

  // 3. Command Palette (Ctrl+K / Cmd+K)
  initCommandPalette();

  // 4. Interactive Terminal REPL
  initInteractiveTerminal();

  // 5. Project Category Filtering
  initProjectFilters();

  // 6. Project In-Depth Modal
  initProjectModals();

  // 7. Image Lightbox Zoom (Certificates & Profile Photo)
  initImageLightbox();

  // 8. Clipboard Copy Handlers & Toast System
  initCopyEmail();

  // 9. Navbar Scroll Spy & Sticky State
  initNavbarScrollSpy();

  // 10. Mobile Menu Navigation
  initMobileMenu();

  // 11. Interactive Contact Form
  initContactForm();
});

/* ==========================================================================
   1. LIVE WITA CLOCK (UTC+8 - Bali / Makassar)
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Makassar',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    clockEl.textContent = new Intl.DateTimeFormat('id-ID', options).format(now) + ' WITA';
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. CARD SPOTLIGHT CURSOR TRACKING
   ========================================================================== */
function initCardSpotlights() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. COMMAND PALETTE (Ctrl+K / Cmd+K)
   ========================================================================== */
function initCommandPalette() {
  const backdrop = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdPaletteInput');
  const list = document.getElementById('cmdPaletteList');
  const triggerBtn = document.getElementById('cmdTriggerBtn');

  if (!backdrop || !input || !list) return;

  const commands = [
    { id: 'projects', title: 'Lihat Portofolio Karya (Projects & Casebase)', shortcut: '#projects', action: () => scrollToSection('projects') },
    { id: 'certificates', title: 'Lihat Sertifikasi & Lisensi Profesional', shortcut: '#certificates', action: () => scrollToSection('certificates') },
    { id: 'about', title: 'Tentang & Filosofi Desain Laksmi', shortcut: '#about', action: () => scrollToSection('about') },
    { id: 'skills', title: 'Keahlian Utama (Data, Desain & Logika)', shortcut: '#skills', action: () => scrollToSection('skills') },
    { id: 'terminal', title: 'Buka Console Terminal Interaktif', shortcut: '#terminal', action: () => { scrollToSection('terminal-section'); focusTerminal(); } },
    { id: 'contact', title: 'Hubungi / Mulai Kolaborasi', shortcut: '#contact', action: () => scrollToSection('contact') },
    { id: 'copy-email', title: 'Salin Email Resmi (laksmi230040159@gmail.com)', shortcut: 'Email', action: () => copyEmailText() },
    { id: 'linkedin', title: 'Kunjungi LinkedIn Laksmi Santhi', shortcut: 'External', action: () => window.open('https://www.linkedin.com/in/laksmi-santhi-a91b53398', '_blank') },
    { id: 'instagram', title: 'Kunjungi Instagram @laksmikartikaa', shortcut: 'External', action: () => window.open('https://www.instagram.com/laksmikartikaa', '_blank') },
    { id: 'clear-term', title: 'Bersihkan Output Terminal', shortcut: 'Bash', action: () => clearTerminal() }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...commands];

  function renderList() {
    list.innerHTML = '';
    if (filteredCommands.length === 0) {
      list.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.88rem; text-align: center;">Tidak ada aksi yang cocok</div>`;
      return;
    }

    filteredCommands.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = `cmd-item ${idx === selectedIndex ? 'selected' : ''}`;
      item.innerHTML = `
        <div class="cmd-item-left">
          <svg class="cmd-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <span class="cmd-item-title">${cmd.title}</span>
        </div>
        <span class="cmd-item-shortcut">${cmd.shortcut}</span>
      `;

      item.addEventListener('click', () => {
        executeCommand(cmd);
      });

      list.appendChild(item);
    });
  }

  function openPalette() {
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    input.value = '';
    filteredCommands = [...commands];
    selectedIndex = 0;
    renderList();
    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  function executeCommand(cmd) {
    closePalette();
    cmd.action();
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openPalette);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closePalette();
    }
  });

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    filteredCommands = commands.filter(c => c.title.toLowerCase().includes(query) || c.shortcut.toLowerCase().includes(query));
    selectedIndex = 0;
    renderList();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderList();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderList();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closePalette();
    }
  });
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   4. INTERACTIVE TERMINAL REPL
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const clearBtn = document.getElementById('terminalClearBtn');
  const chipButtons = document.querySelectorAll('.chip-btn');

  if (!terminalInput || !terminalOutput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const commandResponses = {
    help: `Perintah yang tersedia:
  • help       : Menampilkan panduan bantuan ini
  • whoami     : Profil singkat Ni Komang Laksmi Kartika Santhi
  • about      : Filosofi desain antarmuka berbasis data & logika
  • skills     : Keahlian Data Analytics, UI/UX, dan Pemrograman
  • projects   : Ringkasan proyek aplikasi web & basis data
  • certs      : Sertifikasi profesional & rekam jejak kepemimpinan
  • contact    : Email resmi & saluran jejaring profesional
  • clear      : Membersihkan layar console
  • sudo       : Menjalankan hak istimewa superuser`,

    whoami: `Ni Komang Laksmi Kartika Santhi
Status: Mahasiswi IT @ STIKOM Jimbaran (Bali, Indonesia)
Fokus: UI/UX Research, Data Analytics & Web Logic
Filosofi: Memadukan analisis matematis data dengan antarmuka yang intuitif dan terukur.`,

    about: `[FILOSOFI DESAIN & ANALISIS]
Bagi saya, desain bukanlah sekadar estetika visual, melainkan bentuk penyelesaian masalah logis.
Latar belakang di bidang Ilmu Komputer dan kecintaan pada Matematika membantu saya melihat pola di balik perilaku pengguna melalui validasi riset data empiris.`,

    skills: `[KOMPETENSI MULTIDISIPLIN]
1. Data: Data Visualization, Statistical Modeling, Tableau, Relational Schema (MySQL)
2. Desain: UI/UX Research, User Journey, Wireframing, Figma Prototyping
3. Logika: Logical Problem Solving, Python Programming, PHP Web Development`,

    projects: `[DAFTAR KARYA UTAMA]
• [Project Base] Sistem Pemesanan Terintegrasi Badung Cafe (Fullstack PHP & MySQL)
• [Project Base] Tugas Praktikum Database Data Kampus (MySQL & phpMyAdmin Schema)
• [Case Based] Strategi Mitigasi Malware Social Engineering (Systematic Literature Review)
• [Case Based] Sistem Informasi CRM Bali Lash Studio (Waterfall SDLC Web System)`,

    certs: `[SERTIFIKASI & ORGANISASI]
1. Python Programming Associate (Logical Operations)
2. Network Administrator (BISMA Informatika)
3. Bendahara III — FESTIKA #7 (HIMAS Jimbaran)
4. Bendahara — Kuliah Umum & Ramah Tamah Mahasiswa Baru 2024 (HIMAS STIKOM Jimbaran)`,

    contact: `Email: laksmi230040159@gmail.com
LinkedIn: https://www.linkedin.com/in/laksmi-santhi-a91b53398
Instagram: https://www.instagram.com/laksmikartikaa
Domisili: Bali, Indonesia (WITA / UTC+8)`,

    sudo: `[SECURITY NOTICE]
Akses superuser ditolak. Izin administrator secara aman dikelola oleh Laksmi Kartika.`
  };

  function executeTerminalCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    const entry = document.createElement('div');
    entry.className = 'terminal-log-entry';

    const echo = document.createElement('div');
    echo.className = 'term-cmd-echo';
    echo.textContent = `laksmi@sandbox:~$ ${cmd}`;
    entry.appendChild(echo);

    const response = document.createElement('div');
    response.className = 'term-response';

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    } else if (commandResponses[cmd]) {
      response.textContent = commandResponses[cmd];
    } else {
      response.textContent = `zsh: command not found: ${cmd}. Ketik 'help' untuk daftar instruksi yang tersedia.`;
    }

    entry.appendChild(response);
    terminalOutput.appendChild(entry);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      executeTerminalCommand(val);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearTerminal();
    });
  }

  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        executeTerminalCommand(cmd);
      }
    });
  });
}

function clearTerminal() {
  const terminalOutput = document.getElementById('terminalOutput');
  if (terminalOutput) {
    terminalOutput.innerHTML = '<div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 8px;">Terminal dibersihkan. Ketik "help" untuk bantuan.</div>';
  }
}

function focusTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  if (terminalInput) {
    setTimeout(() => terminalInput.focus(), 350);
  }
}

/* ==========================================================================
   5. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filterValue = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PROJECT IN-DEPTH MODAL
   ========================================================================== */
const projectDetailsData = {
  'badung-cafe': {
    badge: 'PROJECT BASE — WEB FULLSTACK',
    title: 'Sistem Pemesanan Terintegrasi Badung Cafe',
    docUrl: null,
    docLabel: null,
    content: `
      <h4>LATAR BELAKANG PROYEK</h4>
      <p>Mengatasi hambatan antrean manual dan ketidakefisienan pencatatan pesanan di Badung Cafe dengan menghadirkan portal digital berbasis web yang menghubungkan pelanggan secara langsung dengan dapur dan staf kasir.</p>

      <h4>FITUR UTAMA & ARSITEKTUR</h4>
      <ul>
        <li><strong>Portal Pelanggan:</strong> Menampilkan katalog menu dinamis, pemilihan varian pesanan, dan ringkasan keranjang belanja secara interaktif.</li>
        <li><strong>Panel Manajemen Admin:</strong> Halaman kontrol terpusat untuk memantau status pesanan masuk secara real-time, mengubah ketersediaan menu, dan rekapitulasi data penjualan.</li>
        <li><strong>Struktur Data Relasional:</strong> Pengelolaan relasi data kategori, menu, pesanan, dan detail transaksi menggunakan MySQL.</li>
      </ul>

      <h4>DAMPAK & HASIL</h4>
      <ul>
        <li>Mengurangi waktu tunggu pemesanan pelanggan dan meminimalisasi potensi human error dalam pencatatan nota pesanan.</li>
        <li>Antarmuka ramah pengguna (UI responsif) yang dapat diakses dengan lancar melalui perangkat smartphone maupun desktop.</li>
      </ul>
    `
  },
  'db-kampus': {
    badge: 'PROJECT BASE — DATABASE MANAGEMENT',
    title: 'Tugas Praktikum Database Data Kampus',
    docUrl: 'project/Tugas Praktikum Database Data Kampus.pdf',
    docLabel: 'Buka Dokumen Praktikum (PDF)',
    content: `
      <h4>LATAR BELAKANG & FOKUS PRAKTIKUM</h4>
      <p>Merancang dan mengimplementasikan arsitektur basis data relasional untuk sistem informasi akademik kampus dari awal, berfokus pada normalisasi skema, integritas data, dan efisiensi kueri.</p>

      <h4>STRUKTUR & TAHAPAN REKAYASA BASIS DATA</h4>
      <ul>
        <li><strong>Perancangan Skema:</strong> Pembuatan entitas tabel data mahasiswa, dosen, mata kuliah, dan relasi akademik dengan penerapan Primary Key dan Foreign Key constraints.</li>
        <li><strong>Implementasi phpMyAdmin & SQL:</strong> Eksekusi Data Definition Language (DDL) untuk konstruksi tabel serta Data Manipulation Language (DML) untuk pengujian simulasi transaksi data.</li>
        <li><strong>Integritas Relasional:</strong> Pengaturan relasi one-to-many dan penjaminan konsistensi referensial antar entitas akademik.</li>
      </ul>

      <h4>DOKUMENTASI TEKNIS</h4>
      <p>Laporan teknis lengkap berformat PDF tersedia dengan mencakup seluruh diagram skema, screenshot eksekusi kueri, dan evaluasi hasil praktikum.</p>
    `
  },
  'keamanan-siber': {
    badge: 'CASE BASED LEARNING — JURNAL RISET',
    title: 'Strategi Mitigasi Malware Social Engineering',
    docUrl: 'project/Jurnal Penelitian Teknologi Keamanan Siber.pdf',
    docLabel: 'Buka Jurnal Penelitian (PDF)',
    content: `
      <h4>RINGKASAN KAJIAN ILMIAH</h4>
      <p>Kajian literatur sistematis mengenai kerentanan siber di mana manipulasi psikologis (social engineering) menjadi vektor utama masuknya malware ke dalam sistem organisasi.</p>

      <h4>METODOLOGI & PENDEKATAN</h4>
      <ul>
        <li><strong>Systematic Literature Review (SLR):</strong> Menelaah dan memetakan pola-pola taktik rekayasa sosial mutakhir serta efektivitas lapisan pertahanan konvensional.</li>
        <li><strong>Integrasi Perilaku & Teknologi:</strong> Menggabungkan solusi pertahanan teknis (firewall, filtering, enkripsi) dengan intervensi perilaku berupa <em>real-time security nudging</em>.</li>
        <li><strong>Security Nudging:</strong> Pemberian dorongan visual adaptif pada antarmuka pengguna saat mendeteksi indikasi tindakan berisiko tinggi (misal: membuka tautan phishing atau lampiran mencurigakan).</li>
      </ul>

      <h4>KONTRIBUSI RISET</h4>
      <p>Menyajikan kerangka kerja mitigasi terintegrasi yang menyeimbangkan antara proteksi komputasi dengan peningkatan kesadaran keamanan berbasis empati psikologi pengguna.</p>
    `
  },
  'crm-bali-lash': {
    badge: 'CASE BASED LEARNING — SISTEM CRM',
    title: 'Sistem Informasi CRM Bali Lash Studio',
    docUrl: 'project/Rancangan Bangun Sistem Informasi Customer Relationship Management (CRM) Berbasis Web pada Bali Lash Studio (2).pdf',
    docLabel: 'Buka Laporan Rancang Bangun CRM (PDF)',
    content: `
      <h4>LATAR BELAKANG PROYEK</h4>
      <p>Mendigitalisasi tata kelola operasional dan hubungan pelanggan pada studio kecantikan Bali Lash Studio yang sebelumnya masih mengandalkan pencatatan reservasi manual.</p>

      <h4>METODE PENGEMBANGAN SISTEM (WATERFALL SDLC)</h4>
      <ul>
        <li><strong>Analisis Kebutuhan:</strong> Identifikasi pain-points pemilik studio dan pola reservasi treatment pelanggan.</li>
        <li><strong>Perancangan Sistem:</strong> Pemodelan proses bisnis (DFD/Flowchart) dan desain relasi basis data (ERD) untuk histori perawatan dan data pelanggan.</li>
        <li><strong>Implementasi Koding:</strong> Pembangunan aplikasi berbasis web menggunakan PHP dan MySQL untuk mendukung reservasi online terstruktur.</li>
        <li><strong>Pengujian & Evaluasi:</strong> Pengujian fungsionalitas modul reservasi, pengingat jadwal, dan pencatatan riwayat transaksi.</li>
      </ul>

      <h4>DOKUMENTASI RISET</h4>
      <p>Laporan lengkap mencakup analisis metodologi Waterfall, skema tabel, diagram alir, dan pengujian sistem terdokumentasi dalam berkas PDF.</p>
    `
  }
};

function initProjectModals() {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalContent = document.getElementById('modalContent');
  const modalActionBtn = document.getElementById('modalActionBtn');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal || !modalTitle || !modalContent) return;

  function openModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalContent.innerHTML = data.content;

    if (data.docUrl && modalActionBtn) {
      modalActionBtn.href = data.docUrl;
      modalActionBtn.textContent = data.docLabel || 'Buka Dokumen PDF';
      modalActionBtn.style.display = 'inline-flex';
    } else if (modalActionBtn) {
      modalActionBtn.style.display = 'none';
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. IMAGE LIGHTBOX ZOOM (PHOTO & CERTIFICATES)
   ========================================================================== */
function initImageLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const targetImg = document.getElementById('lightboxTargetImg');
  const captionEl = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const photoTrigger = document.getElementById('heroPhotoTrigger');

  if (!lightbox || !targetImg) return;

  function openLightbox(src, caption) {
    targetImg.src = src;
    if (captionEl) {
      captionEl.textContent = caption || '';
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    targetImg.src = '';
    document.body.style.overflow = '';
  }

  if (photoTrigger) {
    photoTrigger.addEventListener('click', () => {
      openLightbox('foto profesional ami 1.jpeg', 'Ni Komang Laksmi Kartika Santhi — Foto Profil Profesional');
    });
  }

  // Certificate frames and image triggers
  const certFrames = document.querySelectorAll('.cert-image-frame, .lightbox-img-btn');
  certFrames.forEach(frame => {
    frame.addEventListener('click', (e) => {
      const img = frame.tagName === 'IMG' ? frame : frame.querySelector('img');
      if (img) {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || 'Tampilan Dokumen Portofolio';
        openLightbox(src, alt);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   8. CLIPBOARD COPY HANDLERS & TOAST SYSTEM
   ========================================================================== */
function copyEmailText() {
  const email = 'laksmi230040159@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast('Alamat email berhasil disalin: ' + email);
  }).catch(() => {
    showToast('Gagal menyalin email otomatis.');
  });
}

function initCopyEmail() {
  const heroCopyBtn = document.getElementById('copyEmailHeroBtn');
  const contactCopyBtn = document.getElementById('copyEmailContactBtn');

  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', copyEmailText);
  }

  if (contactCopyBtn) {
    contactCopyBtn.addEventListener('click', () => {
      copyEmailText();
      const btnText = document.getElementById('copyBtnText');
      if (btnText) {
        const originalText = btnText.textContent;
        btnText.textContent = 'Tersalin!';
        setTimeout(() => {
          btnText.textContent = originalText;
        }, 2000);
      }
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) {
        container.removeChild(toast);
      }
    }, 250);
  }, 3500);
}

/* ==========================================================================
   9. NAVBAR SCROLL SPY & STICKY STATE
   ========================================================================== */
function initNavbarScrollSpy() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   10. MOBILE MENU NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   11. INTERACTIVE CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('nameInput').value.trim();
    const originalContent = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span>Mengirim pesan...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast(`Terima kasih, ${name}! Pesan Anda telah terkirim kepada Laksmi Kartika.`);
      form.reset();
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
    }, 1100);
  });
}
