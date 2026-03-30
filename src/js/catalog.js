import { initHeader } from './header.js';
import { initHero } from './hero.js';
import { getTrendingPaged, searchMovies, convertGenreIdsToNames } from './API.js';
import { renderMovies } from './card_creator.js';
import './footer.js';

// D0m elementleri
var movieGrid, oopsMessage, pagination, searchForm, searchInput, clearBtn, yearSelect;

// Durum değiskenleri
var currentPage = 1;
var totalPages  = 1;
var searchQuery = '';
var searchYear  = '';
var isSearching = false;

// Loader göster
function showLoader() {
  movieGrid.innerHTML = '<li class="loader"><div class="loader__spinner"></div></li>';
  oopsMessage.classList.add('hidden');
}

// Oops mesajını göster/gizle
function showOops(show) {
  if (show) {
    oopsMessage.classList.remove('hidden');
    movieGrid.innerHTML = '';
  } else {
    oopsMessage.classList.add('hidden');
  }
}

// Sayfalama butonlarını oluştur
function buildPagination(current, total) {
  pagination.innerHTML = '';

  if (total <= 1) return;

  // Tmdm max 20 sf goster 
  var maxPage = Math.min(total, 20);

  // Önceki ok
  var prev = document.createElement('button');
  prev.className = 'pagination__btn';
  prev.textContent = '←';
  prev.disabled = current === 1;
  prev.addEventListener('click', function() { changePage(current - 1); });
  pagination.appendChild(prev);

  // Sayfa numaraları
  var pages = getPageRange(current, maxPage);
  pages.forEach(function(p) {
    if (p === '...') {
      var dots = document.createElement('span');
      dots.className = 'pagination__dots';
      dots.textContent = '...';
      pagination.appendChild(dots);
      return;
    }

    var btn = document.createElement('button');
    btn.className = 'pagination__btn';
    btn.textContent = p;
    if (p === current) btn.classList.add('active');
    btn.addEventListener('click', function() { changePage(p); });
    pagination.appendChild(btn);
  });

  // Sonraki ok
  var next = document.createElement('button');
  next.className = 'pagination__btn';
  next.textContent = '→';
  next.disabled = current === maxPage;
  next.addEventListener('click', function() { changePage(current + 1); });
  pagination.appendChild(next);
}

// Hangi sayfa numaraları gösterilecek
// ya da bunu button lst mi alsaydim bakilcak 

function getPageRange(current, total) {
  if (total <= 7) {
    var all = [];
    for (var i = 1; i <= total; i++) all.push(i);
    return all;
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }

  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, '...', current - 1, current, current + 1, '...', total];
}

// Sayfa değiştir
function changePage(page) {
  if (page < 1 || page > Math.min(totalPages, 20)) return;

  if (isSearching) {
    loadSearch(searchQuery, page, searchYear);
  } else {
    loadTrending(page);
  }
}

// Catalog bölümüne scroll
function scrollToCatalog() {
  var section = document.querySelector('.catalog-section');
  if (section) {
    var header = document.querySelector('.header');
    var headerHeight = header ? header.offsetHeight : 0;
    // Catalog acildiginda arama alani gorunsun diye ustte bir miktar hero alani birakiyoruz.
    var heroOffset = window.innerWidth >= 1280 ? 180 : window.innerWidth >= 768 ? 140 : 96;
    var targetTop = Math.max(section.offsetTop - headerHeight - heroOffset, 0);

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
}

// trend filmleri yükle ama urlde yoksa napacaksin ona bi bak 
async function loadTrending(page) {
  showLoader();

  try {
    var data = await getTrendingPaged(page);
    currentPage = page;
    totalPages  = data.total_pages;

    if (!data.results || data.results.length === 0) {
      showOops(true);
      pagination.innerHTML = '';
      return;
    }

    showOops(false);
    await renderMovies(data.results, movieGrid, convertGenreIdsToNames);
    buildPagination(currentPage, totalPages);
    scrollToCatalog();
  } catch (err) {
    console.error('Trend filmler yüklenemedi:', err);
    showOops(true);
  }
}

// arama sonuçlarını yükle kart stilini koruuuu dikkat 
async function loadSearch(query, page, year = '') {
  showLoader();

  try {
    var data = await searchMovies(query, page, year);
    currentPage = page;
    totalPages  = data.total_pages;

    if (!data.results || data.results.length === 0) {
      showOops(true);
      pagination.innerHTML = '';
      return;
    }

    showOops(false);
    await renderMovies(data.results, movieGrid, convertGenreIdsToNames);
    buildPagination(currentPage, totalPages);
    scrollToCatalog();
  } catch (err) {
    console.error('Arama başarısız:', err);
    showOops(true);
  }
}

// listenerlar burada 

document.addEventListener('DOMContentLoaded', function () {
  initHeader();
  initHero();

  // DOM elementlerini ata
  movieGrid   = document.getElementById('movieGrid');
  oopsMessage = document.getElementById('oopsMessage');
  pagination  = document.getElementById('pagination');
  searchForm  = document.getElementById('searchForm');
  searchInput = document.getElementById('searchInput');
  clearBtn    = document.getElementById('clearBtn');
  yearSelect  = document.getElementById('yearSelect');

  var currentYear = new Date().getFullYear();
  for (var y = currentYear; y >= 1900; y--) {
    var option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }

  // inputu izle x butonunu hide ya da show yap
  searchInput.addEventListener('input', function() {
    clearBtn.hidden = searchInput.value.trim() === '';
  });

  // temizle ve trend filmlere dön
  clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    yearSelect.value = '';
    clearBtn.hidden = true;
    searchInput.focus();
    isSearching = false;
    searchQuery = '';
    searchYear = '';
    loadTrending(1);
  });

  // Arama formu gönderilince listeleme yapacakk 
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var query = searchInput.value.trim();
    var year = yearSelect.value;
    if (!query) return;

    isSearching = true;
    searchQuery = query;
    searchYear = year;
    loadSearch(query, 1, year);
  });

  // bismillah 
  loadTrending(1);
});
