// ===================== Mobile Nav Toggle =====================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  if (window.innerWidth <= 640 && navLinks) navLinks.classList.remove('open');
}, { passive: true });
