import {
  getGenres,
  getUpcoming,
  hasTmdbKey,
  TMDB_CONFIG_ERROR,
} from './api.js';
import { reportError } from './logger.js';
import {
  isMovieSaved,
  LIBRARY_ADD_EVENT,
  LIBRARY_REMOVE_EVENT,
  removeMovieFromLibrary,
  saveMovieToLibrary,
} from './library-storage.js';

function getUpcomingImageBaseUrl() {
  if (window.innerWidth >= 1280) {
    return 'https://image.tmdb.org/t/p/w1280';
  }

  return 'https://image.tmdb.org/t/p/w780';
}

let genresMap = {};
let currentUpcomingMovie = null;
let upcomingLibrarySyncBound = false;

function formatReleaseDate(dateString) {
  if (!dateString) return '-';

  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
}

function buildVoteMarkup(voteAverage, voteCount) {
  const averageValue = voteAverage ? voteAverage.toFixed(1) : '0.0';
  const totalVotes = voteCount ?? 0;

  return `
    <span class="vote-pill">${averageValue}</span>
    <span class="vote-separator">/</span>
    <span class="vote-pill">${totalVotes}</span>
  `;
}

// Upcoming bolumu sadece ilgili elemanlar varsa calissin diye DOM referanslarini tek yerden topluyoruz.
function getUpcomingElements() {
  return {
    sectionEl: document.querySelector('.upcoming'),
    containerEl: document.querySelector('.upcoming .container'),
    statusEl: document.querySelector('.upcoming__status'),
    wrapperEl: document.querySelector('.upcoming__wrapper'),
    imageWrapEl: document.querySelector('.upcoming__image'),
    contentEl: document.querySelector('.upcoming__content'),
    titleEl: document.querySelector('.movie-title'),
    metaEl: document.querySelector('.meta'),
    dateEl: document.querySelector('.upcoming-date'),
    voteEl: document.querySelector('.vote'),
    popularityEl: document.querySelector('.popularity'),
    genreEl: document.querySelector('.genre'),
    aboutTitleEl: document.querySelector('.about-title'),
    overviewEl: document.querySelector('.overview'),
    imgEl: document.querySelector('.movie-img'),
    buttonEl: document.querySelector('.upcoming .btn'),
  };
}

function getRandomMovie(movies) {
  if (!Array.isArray(movies) || movies.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex];
}

function filterMoviesForCurrentMonth(movies) {
  if (!Array.isArray(movies) || movies.length === 0) return [];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  return movies.filter(movie => {
    if (!movie?.release_date) return false;

    const releaseDate = new Date(`${movie.release_date}T00:00:00`);

    if (Number.isNaN(releaseDate.getTime())) {
      return false;
    }

    return (
      releaseDate.getFullYear() === currentYear &&
      releaseDate.getMonth() === currentMonth
    );
  });
}

function updateUpcomingLibraryButton(buttonEl, movieId) {
  if (!buttonEl || !movieId) return;

  const movieSaved = isMovieSaved(movieId);
  buttonEl.textContent = movieSaved
    ? 'Remove from my Library'
    : 'Add to my Library';
}

function bindUpcomingLibraryButton(buttonEl) {
  if (!buttonEl || buttonEl.dataset.libraryBound === 'true') return;

  buttonEl.addEventListener('click', () => {
    if (!currentUpcomingMovie?.id) return;

    if (isMovieSaved(currentUpcomingMovie.id)) {
      const wasRemoved = removeMovieFromLibrary(currentUpcomingMovie.id);

      if (wasRemoved) {
        updateUpcomingLibraryButton(buttonEl, currentUpcomingMovie.id);
      }

      return;
    }

    const wasAdded = saveMovieToLibrary(currentUpcomingMovie);

    if (wasAdded) {
      updateUpcomingLibraryButton(buttonEl, currentUpcomingMovie.id);
    }
  });

  buttonEl.dataset.libraryBound = 'true';
}

function setUpcomingStatusMode(elements, isStatusMode) {
  const {
    statusEl,
    wrapperEl,
    imageWrapEl,
    contentEl,
    metaEl,
    aboutTitleEl,
    buttonEl,
  } = elements;

  statusEl?.classList.toggle('is-hidden', !isStatusMode);
  wrapperEl?.classList.toggle('is-hidden', isStatusMode);
  if (statusEl) {
    statusEl.hidden = !isStatusMode;
  }
  if (wrapperEl) {
    wrapperEl.hidden = isStatusMode;
  }
  wrapperEl?.classList.toggle('upcoming__wrapper--status', isStatusMode);
  imageWrapEl?.classList.toggle('upcoming__image--status', isStatusMode);
  contentEl?.classList.toggle('upcoming__content--status', isStatusMode);
  metaEl?.classList.toggle('is-hidden', isStatusMode);
  buttonEl?.classList.toggle('is-hidden', isStatusMode);

  if (aboutTitleEl) {
    aboutTitleEl.textContent = isStatusMode ? 'OOPS...' : 'ABOUT';
  }
}

function renderUpcomingStatusMarkup(sectionEl, message) {
  if (!sectionEl) return;

  sectionEl.innerHTML = `
    <div class="container">
      <h2 class="upcoming__title">UPCOMING THIS MONTH</h2>
      <p class="upcoming__status">${message}</p>
    </div>
  `;
}

function bindUpcomingLibrarySync(elements) {
  if (upcomingLibrarySyncBound) return;

  const syncButtonState = () => {
    if (currentUpcomingMovie?.id) {
      updateUpcomingLibraryButton(elements.buttonEl, currentUpcomingMovie.id);
    }
  };

  document.addEventListener(LIBRARY_ADD_EVENT, syncButtonState);
  document.addEventListener(LIBRARY_REMOVE_EVENT, syncButtonState);
  upcomingLibrarySyncBound = true;
}

async function fetchGenres() {
  try {
    const genreMap = await getGenres();
    genresMap = Object.fromEntries(genreMap);
  } catch (error) {
    reportError('Genres error:', error);
  }
}

async function fetchUpcoming(elements) {
  try {
    const data = await getUpcoming();

    const monthlyMovies = filterMoviesForCurrentMonth(data?.results);
    const movie = getRandomMovie(monthlyMovies);

    if (!movie) {
      currentUpcomingMovie = null;
      renderUpcomingStatus(
        elements,
        'No upcoming movie is available for this month right now.'
      );
      return;
    }

    const {
      titleEl,
      dateEl,
      voteEl,
      popularityEl,
      genreEl,
      overviewEl,
      imgEl,
      buttonEl,
    } = elements;

    currentUpcomingMovie = movie;
    setUpcomingStatusMode(elements, false);
    titleEl.textContent = movie.title ?? 'No title';

    // Upcoming meta alanini figmadaki yapiya yaklastirmak icin tarihi formatlayip oy bilgisini kutucuklarla basiyoruz.
    dateEl.textContent = formatReleaseDate(movie.release_date);
    voteEl.innerHTML = buildVoteMarkup(movie.vote_average, movie.vote_count);
    popularityEl.textContent = Math.round(movie.popularity ?? 0);

    const genres = (movie.genre_ids || [])
      .map(id => genresMap[id])
      .filter(Boolean);

    genreEl.textContent = genres.length ? genres.join(', ') : '-';

    overviewEl.textContent = movie.overview ?? 'No overview available';

    imgEl.src = movie.backdrop_path
      ? getUpcomingImageBaseUrl() + movie.backdrop_path
      : 'https://via.placeholder.com/800x450';
    imgEl.alt = movie.title ?? 'Upcoming movie backdrop';

    bindUpcomingLibraryButton(buttonEl);
    updateUpcomingLibraryButton(buttonEl, movie.id);
  } catch (error) {
    reportError('Upcoming error:', error);
    currentUpcomingMovie = null;
    renderUpcomingStatus(elements, 'Unable to load upcoming movies right now.');
  }
}

export async function initUpcoming() {
  const elements = getUpcomingElements();

  // Bolum ilgili sayfada yoksa script hicbir sey yapmadan cikar.
  if (!elements.sectionEl) {
    return;
  }

  if (!hasTmdbKey()) {
    renderUpcomingStatus(elements, TMDB_CONFIG_ERROR);
    return;
  }

  await fetchGenres();
  bindUpcomingLibrarySync(elements);
  await fetchUpcoming(elements);
}

function renderUpcomingStatus(elements, message) {
  const { sectionEl } = elements;

  currentUpcomingMovie = null;
  renderUpcomingStatusMarkup(sectionEl, message);
}
