// ================= 1. LANGUAGE TRANSLATION LOGIC =================
let currentLang = 'EN';

function toggleLanguage() {
  currentLang = currentLang === 'EN' ? 'MN' : 'EN';
  
  // Update all language toggle buttons (desktop & mobile)
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    if (currentLang === 'MN') {
      btn.innerHTML = `<span class="lang-en">EN</span> / <span class="lang-mn active" style="color:var(--ted-red);">MN</span>`;
    } else {
      btn.innerHTML = `<span class="lang-en active" style="color:var(--ted-red);">EN</span> / <span class="lang-mn">MN</span>`;
    }
  });

  // Translate all text elements
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    // Check if it's an input/textarea to translate the placeholder
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.hasAttribute('placeholder')) {
        el.placeholder = el.getAttribute(`data-lang-${currentLang.toLowerCase()}`);
      }
    } else {
      // Translate normal text (allows basic HTML like spans)
      el.innerHTML = el.getAttribute(`data-lang-${currentLang.toLowerCase()}`);
    }
  });
}

// ================= 2. SCHEDULE ACCORDION LOGIC =================
function toggleSchedule(element) {
  // Find the content div right after the header
  const content = element.nextElementSibling;
  const icon = element.querySelector('.toggle-icon');
  
  if (content.style.display === 'block') {
    content.style.display = 'none';
    if (icon) icon.innerText = '+';
    element.classList.remove('active-header');
  } else {
    content.style.display = 'block';
    if (icon) icon.innerText = '−';
    element.classList.add('active-header');
  }
}// 1. DOM CONTENT LOADED INITIALIZER
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('active'));
  }

  // Render Seats & Speakers
  renderSeats();
  renderSpeakersList();
  initTiltCards();

  // Close Modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpeakerModal();
  });
});

// 2. TILT CARD EFFECT (WITH DELEGATION / SAFE INIT)
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

// 3. SEATING GENERATOR
const totalSeats = 100;
// We emptied the set below so 0 seats are taken, making all 100 available!
let takenSeats = new Set([]); 
let selectedSeat = null;

function setSeatSize(val) {
  const size = Math.max(14, Math.min(32, parseInt(val, 10)));
  document.documentElement.style.setProperty('--seat-size', size + 'px');
}

function renderSeats() {
  const gridLeft = document.getElementById('gridLeft');
  const gridCenter = document.getElementById('gridCenter');
  const gridRight = document.getElementById('gridRight');
  const countDisplay = document.getElementById('remainingCount');
  
  if (!gridLeft || !gridCenter || !gridRight) return;

  gridLeft.innerHTML = '';
  gridCenter.innerHTML = '';
  gridRight.innerHTML = '';

  const remaining = totalSeats - takenSeats.size;
  if (countDisplay) countDisplay.innerText = remaining;

  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat');
    seat.innerText = i;

    if (takenSeats.has(i)) {
      seat.classList.add('occupied');
      seat.title = `Seat #${i} is taken`;
    } else if (selectedSeat === i) {
      seat.classList.add('selected');
      seat.title = `Seat #${i} selected`;
    } else {
      seat.title = `Seat #${i} available`;
      seat.onclick = () => selectSeat(i);
    }

    if (i <= 30) {
      gridLeft.appendChild(seat);
    } else if (i <= 70) {
      gridCenter.appendChild(seat);
    } else {
      gridRight.appendChild(seat);
    }
  }
}

function selectSeat(seatNum) {
  if (selectedSeat === seatNum) {
    selectedSeat = null;
  } else {
    selectedSeat = seatNum;
    alert(`You've selected Seat #${seatNum}! Contact us or send a direct message on Instagram to complete your registration.`);
  }
  renderSeats();
}

// 4. SPEAKERS RENDERER
const speakersList = [
  { type: "Local Teacher Speaker", desc: "12-minute talk exploring interactive learning and critical student thinking." },
  { type: "Student Speaker", desc: "6-minute talk on balancing modern digital life with high school growth." },
  { type: "External Speaker", desc: "15-minute talk on community resilience and local youth initiatives." },
  { type: "Student Speaker", desc: "6-minute talk on creative digital storytelling in modern Mongolia." },
  { type: "Local Teacher Speaker", desc: "12-minute talk bridging classroom curiosity with practical life skills." },
  { type: "Student Speaker", desc: "5-minute talk on peer empathy, mental strength, and supporting friends." },
  { type: "External Speaker", desc: "15-minute talk on tech ethics and building responsible AI tools." },
  { type: "Student Speaker", desc: "6-minute talk on youth action for urban sustainability." },
  { type: "Local Teacher Speaker", desc: "12-minute talk on encouraging curiosity over rote memorization." },
  { type: "Student Speaker", desc: "6-minute talk on how high school volunteering transforms communities." },
  { type: "External Speaker", desc: "15-minute talk connecting Mongolian heritage with Gen-Z innovation." },
  { type: "Local Teacher Speaker", desc: "12-minute talk mentoring young researchers for regional impact." },
  { type: "External Speaker", desc: "15-minute talk on taking bold entrepreneurial steps in youth." },
  { type: "Student Speaker", desc: "6-minute talk on why embracing creative risk shapes the future." }
];

function renderSpeakersList() {
  const container = document.getElementById('speakerContainer');
  if (!container) return;

  container.innerHTML = speakersList.map((sp, idx) => {
    const num = idx + 1 < 10 ? '0' + (idx + 1) : (idx + 1);
    const safeDesc = sp.desc.replace(/'/g, "\\'");
    return `
      <div class="speaker-card tilt-card" onclick="openSpeakerModal('${num}', '${sp.type}', '${safeDesc}')">
        <div class="speaker-avatar">?</div>
        <div class="speaker-tag-label">${sp.type}</div>
        <div class="speaker-name">Speaker #${num}</div>
        <div class="speaker-card-cta">Tap for talk overview →</div>
      </div>
    `
  }).join('')

  initTiltCards()
}

// 5. Countdown Timer Logic
const eventTargetDate = new Date("October 24, 2026 08:00:00").getTime();

function updateCountdown() {
  const container = document.getElementById('eventCountdown');
  if (!container) return;

  const now = new Date().getTime();
  const timeDiff = eventTargetDate - now;

  if (timeDiff <= 0) {
    container.innerHTML = "<div style='color:var(--ted-red); font-weight:800; font-size:18px;'>EVENT IS LIVE TODAY!</div>";
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const elDays = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMins = document.getElementById('mins');
  const elSecs = document.getElementById('secs');

  if (elDays) elDays.innerText = days < 10 ? '0' + days : days;
  if (elHours) elHours.innerText = hours < 10 ? '0' + hours : hours;
  if (elMins) elMins.innerText = mins < 10 ? '0' + mins : mins;
  if (elSecs) elSecs.innerText = secs < 10 ? '0' + secs : secs;
}

setInterval(updateCountdown, 1000);

// 6. mobqile menu toggle logic
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mLinks = document.querySelectorAll('.m-link');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mLinks.forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// 7. CAROUSEL SCROLL
function scrollSpeakers(offset) {
  const container = document.getElementById('speakerContainer');
  if (container) {
    container.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

// 8. SPEAKER MODAL
const speakerModal = document.getElementById('speakerModal');
const modalNum = document.getElementById('modalNum');
const modalTag = document.getElementById('modalTag');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');

function openSpeakerModal(num, type, desc) {
  if (modalNum) modalNum.innerText = 'Speaker #' + num;
  if (modalTag) modalTag.innerText = type;
  if (modalName) modalName.innerText = 'Featured Speaker ' + num;
  if (desc && modalDesc) modalDesc.innerText = desc;
  if (speakerModal) speakerModal.classList.add('active');
}

function closeSpeakerModal() {
  if (speakerModal) speakerModal.classList.remove('active');
}

function handleModalOverlayClick(e) {
  if (e.target === speakerModal) closeSpeakerModal();
}

// 9. FORM SUBMISSION
function handleFormSubmit(e) {
  e.preventDefault();
  const successMsg = document.getElementById('formSuccess');
  if (successMsg) successMsg.style.display = 'block';
  const form = document.getElementById('contactForm');
  if (form) form.reset();
  setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 4000);
}
/* Scroll Reveal Animation Engine */
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  // Create an observer that triggers when elements enter the screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        
        // Optional: Stop observing once revealed so it doesn't animate again if they scroll back up
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.15 // Triggers when 15% of the element is visible
  });

  // Attach the observer to every element with the "reveal" class
  reveals.forEach((reveal) => {
    observer.observe(reveal);
  });
});
// JavaScript: Add to index.js to handle responsive 100-seat generation
document.addEventListener("DOMContentLoaded", () => {
  const seatGrid = document.getElementById("seatGrid");
  if (!seatGrid) return;

  const totalSeats = 100;
  // Example predefined reserved seat indexes
  const reservedSeats = [4, 5, 12, 13, 14, 25, 26, 44, 45, 46, 77, 78, 89];

  seatGrid.innerHTML = "";

  for (let i = 1; i <= totalSeats; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.setAttribute("title", `Seat #${i}`);

    if (reservedSeats.includes(i)) {
      seat.classList.add("reserved");
    } else {
      seat.addEventListener("click", () => {
        seat.classList.toggle("selected");
      });
    }

    seatGrid.appendChild(seat);
  }
});
// Add or append this logic into your script tags / index.js

document.addEventListener('DOMContentLoaded', () => {
  const seatZoomContainer = document.getElementById('seatZoomContainer');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');
  
  let currentZoom = 1;
  const minZoom = 0.75;
  const maxZoom = 1.75;
  const zoomStep = 0.2;

  function updateZoom(newZoom) {
    currentZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
    if (seatZoomContainer) {
      seatZoomContainer.style.transform = `scale(${currentZoom})`;
    }
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => updateZoom(currentZoom + zoomStep));
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => updateZoom(currentZoom - zoomStep));
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => updateZoom(1));
  }

  // Touch Pinch-to-Zoom handling for Mobile Screens
  const viewport = document.getElementById('seatViewport');
  let initialDistance = 0;

  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialDistance > 0) {
        const currentDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const factor = currentDistance / initialDistance;
        updateZoom(currentZoom * (factor > 1 ? 1.03 : 0.97));
        initialDistance = currentDistance;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      initialDistance = 0;
    });
  }
});