// ===================== Mobile Nav Toggle =====================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Close nav on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
  if (window.innerWidth <= 640) {
    navLinks.classList.remove('open');
  }
}, { passive: true });

// ===================== Avatar Upload =====================
const avatarFrame = document.getElementById('avatarFrame');
const avatarInput = document.getElementById('avatarInput');
const avatarImg = document.getElementById('avatarImg');

avatarFrame.addEventListener('click', () => {
  avatarInput.click();
});

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarImg.innerHTML = `<img src="${ev.target.result}" alt="头像">`;
    // save to localStorage for persistence
    localStorage.setItem('avatarData', ev.target.result);
  };
  reader.readAsDataURL(file);
});

// Load saved avatar
const savedAvatar = localStorage.getItem('avatarData');
if (savedAvatar) {
  avatarImg.innerHTML = `<img src="${savedAvatar}" alt="头像">`;
}

// ===================== Photo Gallery =====================
const photoGrid = document.getElementById('photoGrid');
const addPhotoBtn = document.getElementById('addPhotoBtn');
const photoInput = document.getElementById('photoInput');

let photos = [];

// Load saved photos
const savedPhotos = localStorage.getItem('photosData');
if (savedPhotos) {
  photos = JSON.parse(savedPhotos);
}

function renderPhotos() {
  photoGrid.innerHTML = '';

  // Add card button
  const addCard = document.createElement('div');
  addCard.className = 'photo-card';
  addCard.style.cssText = 'display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;background:var(--bg-alt);border:2px dashed var(--border);cursor:pointer;';
  addCard.innerHTML = '<span style="font-size:2.5rem;color:var(--primary);">+</span><span style="font-size:0.85rem;color:var(--text-light);">添加照片</span>';
  addCard.addEventListener('click', () => photoInput.click());
  photoGrid.appendChild(addCard);

  // Existing photos
  photos.forEach((dataUrl, index) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <img src="${dataUrl}" alt="照片 ${index + 1}">
      <button class="photo-delete" data-index="${index}">&times;</button>
    `;
    card.querySelector('.photo-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      photos.splice(index, 1);
      localStorage.setItem('photosData', JSON.stringify(photos));
      renderPhotos();
    });
    card.addEventListener('click', () => openModal(dataUrl));
    photoGrid.appendChild(card);
  });
}

addPhotoBtn.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      photos.push(ev.target.result);
      loaded++;
      if (loaded === files.length) {
        localStorage.setItem('photosData', JSON.stringify(photos));
        renderPhotos();
      }
    };
    reader.readAsDataURL(file);
  });
});

renderPhotos();

// ===================== Lightbox Modal =====================
let modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
modalOverlay.innerHTML = `
  <div class="modal">
    <button class="modal-close">&times;</button>
    <img src="" alt="照片预览">
  </div>
`;
document.body.appendChild(modalOverlay);

const modalImg = modalOverlay.querySelector('img');
const modalClose = modalOverlay.querySelector('.modal-close');

function openModal(src) {
  modalImg.src = src;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===================== Gallery Image Upload =====================
document.querySelectorAll('.gallery-placeholder').forEach(placeholder => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.hidden = true;

  placeholder.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      placeholder.innerHTML = `<img src="${ev.target.result}" alt="作品图片" style="width:100%;height:100%;object-fit:cover;display:block;">`;
      placeholder.style.background = 'none';
    };
    reader.readAsDataURL(file);
  });

  placeholder.parentNode.appendChild(input);
});

// ===================== City Photo Upload =====================
document.querySelectorAll('.city-photo-input').forEach(input => {
  input.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const city = this.dataset.city;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const placeholder = document.querySelector(`.about-img-placeholder[data-city="${city}"]`);
      if (placeholder) {
        placeholder.innerHTML = `<img src="${ev.target.result}" alt="${city}">`;
        placeholder.style.border = 'none';
        placeholder.style.background = 'none';
      }
      const allCityPhotos = {};
      document.querySelectorAll('.about-img-placeholder img').forEach(img => {
        const cityName = img.closest('.about-img-placeholder')?.dataset.city;
        if (cityName) allCityPhotos[cityName] = img.src;
      });
      localStorage.setItem('cityPhotos', JSON.stringify(allCityPhotos));
    };
    reader.readAsDataURL(file);
  });
});

// Load saved city photos
const savedCityPhotos = localStorage.getItem('cityPhotos');
if (savedCityPhotos) {
  const photos = JSON.parse(savedCityPhotos);
  Object.keys(photos).forEach(city => {
    const placeholder = document.querySelector(`.about-img-placeholder[data-city="${city}"]`);
    if (placeholder) {
      placeholder.innerHTML = `<img src="${photos[city]}" alt="${city}">`;
      placeholder.style.border = 'none';
      placeholder.style.background = 'none';
    }
  });
}

// Click placeholder to upload
document.querySelectorAll('.about-img-placeholder').forEach(el => {
  el.addEventListener('click', function() {
    const city = this.dataset.city;
    const input = document.querySelector(`.city-photo-input[data-city="${city}"]`);
    if (input) input.click();
  });
});
