import { convertGenreIdsToNames, getGenres } from './api.js';
import { reportError } from './logger.js';
import {
  LIBRARY_ADD_EVENT,
  LIBRARY_REMOVE_EVENT,
  readSavedMovies,
} from './library-storage.js';
import { showMovieSpotlight } from './movie-spotlight.js';
import { generateStarIconsMarkup } from './star-icons.js';
import { hideGlobalLoader, showGlobalLoader } from './ui.js';

// 1. ADIM: MOCK DATA (Görsellerin gelmesi için TMDB yollarını ekledim)
const mockLibrary = readSavedMovies();

let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const perPage = 9;

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('libraryGallery');
  const loadMoreBtn = document.getElementById('loadMore');
  const genreSelect = document.getElementById('genreFilter');
  if (!container) return;

  showGlobalLoader();

  try {
    allMovies = mockLibrary;
    filteredMovies = [...allMovies];

    if (allMovies.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p class="empty-text">OOPS... <br> We are very sorry! <br> You don't have any movies <br> 
          at your library.</p>
          <a href="catalog.html" class="btn-search-more">Search Movie</a>
        </div>
      `;
      if (loadMoreBtn) loadMoreBtn.classList.add('is-hidden');
      if (genreSelect) genreSelect.classList.add('is-hidden');
      return;
    }

    const genreMap = await getGenres();
    const availableGenreIds = new Set();
    allMovies.forEach(m =>
      m.genre_ids?.forEach(id => availableGenreIds.add(id))
    );

    // Populate native <select> OR custom dropdown depending on markup
    if (genreSelect && genreSelect.tagName === 'SELECT') {
      genreSelect.innerHTML = '<option value="all">Genre</option>';
      availableGenreIds.forEach(id => {
        const name = genreMap.get(id);
        if (name) {
          const option = document.createElement('option');
          option.value = id;
          option.textContent = name;
          genreSelect.appendChild(option);
        }
      });
    } else if (genreSelect && genreSelect.classList.contains('custom-select')) {
      const list = genreSelect.querySelector('.custom-select__list');
      const button = genreSelect.querySelector('.custom-select__button');
      const label = genreSelect.querySelector('.custom-select__label');

      // add default 'all' option first
      const allItem = document.createElement('li');
      allItem.dataset.value = 'all';
      allItem.textContent = 'Genre';
      allItem.classList.add('selected');
      list.appendChild(allItem);

      availableGenreIds.forEach(id => {
        const name = genreMap.get(id);
        if (name) {
          const li = document.createElement('li');
          li.dataset.value = id;
          li.textContent = name;
          list.appendChild(li);
        }
      });

      // Toggle open/close
      const toggleList = open => {
        if (open) {
          list.classList.remove('hide');
          button.setAttribute('aria-expanded', 'true');
        } else {
          list.classList.add('hide');
          button.setAttribute('aria-expanded', 'false');
        }
      };

      toggleList(false);

      button.addEventListener('click', e => {
        const isOpen = !list.classList.contains('hide');
        toggleList(!isOpen);
      });

      // click outside to close
      document.addEventListener('click', e => {
        if (!genreSelect.contains(e.target)) toggleList(false);
      });

      // option click
      list.addEventListener('click', e => {
        const li = e.target.closest('li');
        if (!li) return;

        // update selected visual
        list
          .querySelectorAll('li')
          .forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');

        // update label
        label.textContent = li.textContent;

        // close
        toggleList(false);

        // perform filtering (same logic as change event)
        const selectedId = li.dataset.value;
        currentPage = 1;
        container.innerHTML = '';

        filteredMovies =
          selectedId === 'all'
            ? allMovies
            : allMovies.filter(m => m.genre_ids.includes(Number(selectedId)));

        renderLibrarySlice();
      });
    }

    // 2. ADIM: İLK GÖSTERİM
    renderLibrarySlice();

    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderLibrarySlice();
    });

    // If there is still a native <select> on the page, attach change handler
    if (genreSelect && genreSelect.tagName === 'SELECT') {
      genreSelect.addEventListener('change', e => {
        const selectedId = e.target.value;
        currentPage = 1;
        container.innerHTML = '';

        filteredMovies =
          selectedId === 'all'
            ? allMovies
            : allMovies.filter(m => m.genre_ids.includes(Number(selectedId)));

        renderLibrarySlice();
      });
    }

    // TIKLAMA DİNLEYİCİSİ (Popup için)
    addCardListeners(container);
    document.addEventListener(LIBRARY_ADD_EVENT, refreshLibraryFromStorage);
    document.addEventListener(LIBRARY_REMOVE_EVENT, refreshLibraryFromStorage);
  } catch (error) {
    reportError('Kütüphane yüklenirken hata:', error);
  } finally {
    hideGlobalLoader();
  }
});

function refreshLibraryFromStorage() {
  const container = document.getElementById('libraryGallery');
  const loadMoreBtn = document.getElementById('loadMore');

  if (!container) return;

  allMovies = readSavedMovies();
  filteredMovies = [...allMovies];
  currentPage = 1;
  container.innerHTML = '';

  if (allMovies.length === 0) {
    loadMoreBtn?.classList.add('is-hidden');
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-text">OOPS... <br> We are very sorry! <br> You don't have any movies <br> 
        at your library.</p>
        <a href="catalog.html" class="btn-search-more">Search Movie</a>
      </div>
    `;
    return;
  }

  renderLibrarySlice();
}

async function renderLibrarySlice() {
  const container = document.getElementById('libraryGallery');
  const loadMoreBtn = document.getElementById('loadMore');

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const slice = filteredMovies.slice(start, end);

  if (end >= filteredMovies.length) {
    loadMoreBtn.classList.add('is-hidden');
  } else {
    loadMoreBtn.classList.remove('is-hidden');
  }

  // Filmleri bas (Üstüne ekle - clear: false)
  await renderMovies(slice, container, false);
}

// 3. ADIM: WEEKLY TREND USULÜ RENDER MOTORU
async function renderMovies(moviesList, container, clear = true) {
  if (clear) container.innerHTML = '';

  const markup = await Promise.all(
    moviesList.map(async movie => {
      const genres =
        movie.genre_names?.length > 0
          ? movie.genre_names
          : await convertGenreIdsToNames(movie.genre_ids || []);
      const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : './img/oops-logo.png';

      // Yıldızları oluştur (Weekly Trend'deki gibi)
      const starsHtml = `<div class="movie-rating">${generateStarIconsMarkup(movie.vote_average, 'movie-rating__star')}</div>`;

      // Weekly Trend HTML Yapısı
      return `
        <div class="movie-card" data-id="${movie.id}">
          <img class="movie-img" src="${poster}" alt="${movie.title}" loading="lazy" />
          <div class="movie-info">
              <h3 class="movie-title">${movie.title}</h3>
              <div class="movie-info__meta">
                <p>${genres.slice(0, 2).join(', ')} | ${year}</p>
                ${starsHtml}
              </div>
          </div>
        </div>`;
    })
  );

  container.innerHTML += markup.join('');
}

// 4. ADIM: KART TIKLAMA OLAYI (Popup açılması için)
function addCardListeners(container) {
  if (container.dataset.listenerAttached === 'true') return;

  container.addEventListener('click', e => {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    const movieId = card.dataset.id;
    showMovieSpotlight(movieId);
  });

  container.dataset.listenerAttached = 'true';
}





