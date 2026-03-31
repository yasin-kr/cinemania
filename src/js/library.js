import { convertGenreIdsToNames, getGenres } from './api.js';
import { showMovieSpotlight } from './movie-spotlight.js';
import { generateStarIconsMarkup } from './star-icons.js';

// 1. ADIM: MOCK DATA (Görsellerin gelmesi için TMDB yollarını ekledim)
const mockLibrary = [
  {
    id: 1,
    title: 'Inception',
    poster_path: '/oYuSwwAIgoIu90QvS9mc7vCq4pZ.jpg',
    genre_ids: [28, 878],
    release_date: '2010',
    vote_average: 8.8,
  },
  {
    id: 2,
    title: 'Dark Knight',
    poster_path: '/qJ2tW6WMUDp9BDpSNG6pT6IV9mK.jpg',
    genre_ids: [28, 80],
    release_date: '2008',
    vote_average: 9.0,
  },
  {
    id: 3,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6vCU6m9i2vQpP.jpg',
    genre_ids: [12, 18],
    release_date: '2014',
    vote_average: 8.6,
  },
  {
    id: 4,
    title: 'The Matrix',
    poster_path: '/f89U3Y9SJuCYFJjbbG7asXp996g.jpg',
    genre_ids: [28, 878],
    release_date: '1999',
    vote_average: 8.7,
  },
  {
    id: 5,
    title: 'Pulp Fiction',
    poster_path: '/d5iIl9h9btztU0kzUvOvi7tQDPi.jpg',
    genre_ids: [80, 53],
    release_date: '1994',
    vote_average: 8.9,
  },
  {
    id: 6,
    title: 'Fight Club',
    poster_path: '/pB8BM79vS9v5FTWDYp9wfI0lhvI.jpg',
    genre_ids: [18],
    release_date: '1999',
    vote_average: 8.8,
  },
  {
    id: 7,
    title: 'Se7en',
    poster_path: '/6yog7S6q7nz9C2oUvRk9PZJ1oCl.jpg',
    genre_ids: [80, 9648],
    release_date: '1995',
    vote_average: 8.6,
  },
  {
    id: 8,
    title: 'Silence of the Lambs',
    poster_path: '/uS9mY7o97SjTsn90o69gnzYf93n.jpg',
    genre_ids: [80, 27],
    release_date: '1991',
    vote_average: 8.6,
  },
  {
    id: 9,
    title: 'Gladiator',
    poster_path: '/ty8TGRSbmVpJsQihqOyrCcobv78.jpg',
    genre_ids: [28, 12],
    release_date: '2000',
    vote_average: 8.5,
  },
  {
    id: 10,
    title: 'The Lion King',
    poster_path: '/sKCr7SwwvntZ9Zy9nJsRjmCG81S.jpg',
    genre_ids: [16, 12],
    release_date: '1994',
    vote_average: 8.5,
  },
  {
    id: 11,
    title: 'The Godfather',
    poster_path: '/3bhkrj58Vtu7enP5Yq6LJsS7C6n.jpg',
    genre_ids: [80, 18],
    release_date: '1972',
    vote_average: 9.2,
  },
];

let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const perPage = 9;

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('libraryGallery');
  const loadMoreBtn = document.getElementById('loadMore');
  const genreSelect = document.getElementById('genreFilter');
  if (!container) return;

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
  } catch (error) {
    console.error('Kütüphane yüklenirken hata:', error);
  }
});

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
      const genres = await convertGenreIdsToNames(movie.genre_ids);
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
