

// modal katmanlari - arka plan full screen div olcak , acma kapama 
var overlay = document.getElementById('teamModalOverlay');
var openBtn = document.getElementById('openTeamModal');
var closeBtn = document.getElementById('closeTeamModal');
// 
if (overlay && openBtn && closeBtn) { // element adidegisirse patlamasin
// butonla modal kapama -- buralar modaldan alinsa daha iyi olcak ama mecbur lazim su an 
  openBtn.addEventListener('click', function () {
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', function () {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });



// 
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

}
