import { initHeader } from './header.js';
import { initHero } from './hero.js';
import {
  getTrendingPaged,
  searchMovies,
  convertGenreIdsToNames,
} from './api.js';
import { reportError } from './logger.js';
import { renderMovies } from './card_creator.js';
import { initGlobalUi } from './ui.js';
import './footer.js';

var movieGrid,
  oopsMessage,
  pagination,
  searchForm,
  searchInput,
  clearBtn,
  yearSelect;
var yearSelectCustom, yearSelectButton, yearSelectLabel, yearSelectList;

var currentPage = 1;
var totalPages = 1;
var searchQuery = '';
var searchYear = '';
var isSearching = false;

// Loader
function showLoader() {
  movieGrid.innerHTML =
    '<li class="loader"><div class="loader__spinner"></div></li>';
  oopsMessage.classList.add('hidden');
}

// Oops message
function showOops(show) {
  if (show) {
    oopsMessage.classList.remove('hidden');
    movieGrid.innerHTML = '';
  } else {
    oopsMessage.classList.add('hidden');
  }
}

function buildPagination(current, total) {
  pagination.innerHTML = '';

  if (total <= 1) return;

  var maxPage = Math.min(total, 20);

  var prev = document.createElement('button');
  prev.className = 'pagination__btn';
  prev.textContent = '←';
  prev.disabled = current === 1;
  prev.addEventListener('click', function () {
    changePage(current - 1);
  });
  pagination.appendChild(prev);

  var pages = getPageRange(current, maxPage);
  pages.forEach(function (p) {
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
    btn.addEventListener('click', function () {
      changePage(p);
    });
    pagination.appendChild(btn);
  });

  var next = document.createElement('button');
  next.className = 'pagination__btn';
  next.textContent = '→';
  next.disabled = current === maxPage;
  next.addEventListener('click', function () {
    changePage(current + 1);
  });
  pagination.appendChild(next);
}

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

function toggleYearSelect(open) {
  if (!yearSelectList || !yearSelectButton) return;
  yearSelectList.classList.toggle('hide', !open);
  yearSelectButton.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function syncYearSelect(value, label) {
  if (yearSelect) yearSelect.value = value;
  if (yearSelectLabel) yearSelectLabel.textContent = label;
  if (yearSelectList) {
    yearSelectList.querySelectorAll('li').forEach(function (item) {
      item.classList.toggle('selected', item.dataset.value === String(value));
    });
  }
}

function initYearCustomSelect() {
  yearSelectCustom = document.getElementById('yearSelectCustom');
  if (!yearSelectCustom || !yearSelect) return;

  yearSelectButton = yearSelectCustom.querySelector('.custom-select__button');
  yearSelectLabel = yearSelectCustom.querySelector('.custom-select__label');
  yearSelectList = yearSelectCustom.querySelector('.custom-select__list');

  if (!yearSelectButton || !yearSelectLabel || !yearSelectList) return;

  yearSelectList.innerHTML = '';

  Array.from(yearSelect.options).forEach(function (option) {
    var item = document.createElement('li');
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    if (option.value === yearSelect.value) item.classList.add('selected');
    yearSelectList.appendChild(item);
  });

  syncYearSelect(
    yearSelect.value,
    yearSelect.options[yearSelect.selectedIndex].textContent
  );
  toggleYearSelect(false);

  yearSelectButton.addEventListener('click', function () {
    var isOpen = !yearSelectList.classList.contains('hide');
    toggleYearSelect(!isOpen);
  });

  yearSelectList.addEventListener('click', function (e) {
    var item = e.target.closest('li');
    if (!item) return;
    syncYearSelect(item.dataset.value, item.textContent);
    toggleYearSelect(false);
  });

  document.addEventListener('click', function (e) {
    if (!yearSelectCustom.contains(e.target)) {
      toggleYearSelect(false);
    }
  });
}

function changePage(page) {
  if (page < 1 || page > Math.min(totalPages, 20)) return;

  if (isSearching) {
    loadSearch(searchQuery, page, searchYear);
  } else {
    loadTrending(page);
  }
}

function scrollToCatalog() {
  var section = document.querySelector('.catalog-section');
  if (section) {
    var header = document.querySelector('.header');
    var headerHeight = header ? header.offsetHeight : 0;
    var heroOffset =
      window.innerWidth >= 1280 ? 180 : window.innerWidth >= 768 ? 140 : 96;
    var targetTop = Math.max(section.offsetTop - headerHeight - heroOffset, 0);

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
}

async function loadTrending(page) {
  showLoader();

  try {
    var data = await getTrendingPaged(page);
    currentPage = page;
    totalPages = data.total_pages;

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
    reportError('Trend filmler yüklenemedi:', err);
    showOops(true);
  }
}

async function loadSearch(query, page, year = '') {
  showLoader();

  try {
    var data = await searchMovies(query, page, year);
    currentPage = page;
    totalPages = data.total_pages;

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
    reportError('Arama başarısız:', err);
    showOops(true);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initGlobalUi();
  initHeader();
  initHero();

  movieGrid = document.getElementById('movieGrid');
  oopsMessage = document.getElementById('oopsMessage');
  pagination = document.getElementById('pagination');
  searchForm = document.getElementById('searchForm');
  searchInput = document.getElementById('searchInput');
  clearBtn = document.getElementById('clearBtn');
  yearSelect = document.getElementById('yearSelect');

  var currentYear = new Date().getFullYear();
  for (var y = currentYear; y >= 1900; y--) {
    var option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }

  initYearCustomSelect();

  searchInput.addEventListener('input', function () {
    clearBtn.hidden = searchInput.value.trim() === '';
  });

  clearBtn.addEventListener('click', function () {
    searchInput.value = '';
    syncYearSelect('', 'Year');
    clearBtn.hidden = true;
    searchInput.focus();
    isSearching = false;
    searchQuery = '';
    searchYear = '';
    loadTrending(1);
  });

  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var query = searchInput.value.trim();
    var year = yearSelect.value;
    if (!query) return;

    isSearching = true;
    searchQuery = query;
    searchYear = year;
    loadSearch(query, 1, year);
  });

  loadTrending(1);
});
