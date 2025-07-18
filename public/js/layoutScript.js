const popup = document.getElementById('popup');
const openBtn = document.getElementById('openPopup');

// open alert-popup
openBtn.addEventListener('click', () => {
  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

// close alert-popup
window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});
