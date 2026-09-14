document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', filterTalks);
  }
});

function toggleMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.toggle('open');
  }
}

let activeCategory = 'all';

function filterCategory(category, btnElement) {
  activeCategory = category;
  
  document.querySelectorAll('.pill').forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }
  
  filterTalks();
}

function filterTalks() {
  const searchInput = document.getElementById('searchInput');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cards = document.querySelectorAll('.talk-card');

  cards.forEach(card => {
    const cat = card.getAttribute('data-category') || '';
    const title = (card.getAttribute('data-title') || '').toLowerCase();
    const speaker = (card.getAttribute('data-speaker') || '').toLowerCase();

    const matchesCat = (activeCategory === 'all' || cat === activeCategory);
    const matchesSearch = !searchVal || title.includes(searchVal) || speaker.includes(searchVal);

    if (matchesCat && matchesSearch) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}