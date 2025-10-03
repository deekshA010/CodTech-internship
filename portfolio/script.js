// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

function closeNav() {
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Close nav when clicking a link (mobile)
siteNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => closeNav());
});

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
