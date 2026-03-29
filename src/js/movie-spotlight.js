import { getMovieDetails } from './API.js';

// Modalın DOM içinde tekil olarak bulunabilmesi için kullanılan id.
const OVERLAY_ID = 'movie-spotlight-overlay';
// Library tarafına dokunmadan geçici kayıt tutmak için kullanılan localStorage anahtarı.
const SAVED_MOVIES_KEY = 'cinemania-saved-movies';

// Vote / Votes alanındaki küçük kutucuklu yapıyı üretir.
function buildVoteMarkup(voteAverage, voteCount) {
  const averageValue = voteAverage ? voteAverage.toFixed(1) : 'N/A';
  const totalVotes = voteCount ?? 0;

  return `
    <span class="spotlight-vote-pill">${averageValue}</span>
    <span class="spotlight-vote-separator">/</span>
    <span class="spotlight-vote-pill">${totalVotes}</span>
  `;
}

// Modal içindeki bilgi satırlarını ortak bir yapıda üretir.
function buildInfoRow(label, value) {
  return `
    <div class="spotlight-meta-row">
      <span class="spotlight-meta-label">${label}</span>
      <span class="spotlight-meta-value">${value}</span>
    </div>
  `;
}

// Film detay verisini kullanarak modalın HTML içeriğini oluşturur.
function createSpotlightMarkup(movie) {
  const posterSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750/111111/ffffff?text=No+Image';

  const year = movie.release_date?.slice(0, 4) || 'Unknown';
  const genres =
    movie.genres?.length > 0
      ? movie.genres.map(genre => genre.name).join(' ')
      : 'Unknown';
  const popularity = movie.popularity ? movie.popularity.toFixed(1) : 'N/A';
  const overview = movie.overview || 'No description available for this movie.';
  const buttonLabel = isMovieSaved(movie.id)
    ? 'Added to my library'
    : 'Add to my library';

  return `
    <div class="spotlight-shell" role="dialog" aria-modal="true" aria-labelledby="spotlight-title">
      <button class="spotlight-close" type="button" aria-label="Close movie details">&times;</button>
      <div class="spotlight-poster-wrap">
        <img class="spotlight-poster" src="${posterSrc}" alt="${movie.title}" />
      </div>
      <div class="spotlight-content">
        <h2 id="spotlight-title" class="spotlight-title">${movie.title}</h2>
        <div class="spotlight-meta">
          ${buildInfoRow(
            'Vote / Votes',
            buildVoteMarkup(movie.vote_average, movie.vote_count)
          )}
          ${buildInfoRow('Popularity', popularity)}
          ${buildInfoRow('Genre', genres)}
        </div>
        <div class="spotlight-copy-block">
          <h3 class="spotlight-copy-title">ABOUT</h3>
          <p class="spotlight-overview">${overview}</p>
        </div>
        <button class="spotlight-library-button" type="button" data-movie-id="${movie.id}">
          ${buttonLabel}
        </button>
      </div>
    </div>
  `;
}

// Daha önce kaydedilen filmleri localStorage içinden okur.
function readSavedMovies() {
  return JSON.parse(localStorage.getItem(SAVED_MOVIES_KEY) || '[]');
}

// İlgili film daha önce eklenmiş mi kontrol eder.
function isMovieSaved(movieId) {
  return readSavedMovies().some(savedMovie => savedMovie.id === movieId);
}

// Filmi localStorage'a ekler ve isteyen modüller dinleyebilsin diye event yayınlar.
function saveMovieToLibrary(movie) {
  const savedMovies = readSavedMovies();

  if (savedMovies.some(savedMovie => savedMovie.id === movie.id)) {
    return false;
  }

  const movieSummary = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    genres: movie.genres,
    vote_average: movie.vote_average,
  };

  localStorage.setItem(
    SAVED_MOVIES_KEY,
    JSON.stringify([...savedMovies, movieSummary])
  );

  document.dispatchEvent(
    new CustomEvent('cinemania:library:add', {
      detail: movieSummary,
    })
  );

  return true;
}

// Açık modal varsa kaldırır ve body scroll kilidini çözer.
function removeSpotlight() {
  const existingOverlay = document.getElementById(OVERLAY_ID);

  if (!existingOverlay) return;

  existingOverlay.remove();
  document.body.classList.remove('spotlight-open');
}

// Kapatma, dışarı tıklama, Escape ve library butonu eventlerini bağlar.
function attachSpotlightEvents(overlayElement, movie) {
  const closeButton = overlayElement.querySelector('.spotlight-close');
  const libraryButton = overlayElement.querySelector('.spotlight-library-button');

  closeButton?.addEventListener('click', removeSpotlight);
  libraryButton?.addEventListener('click', () => {
    const wasAdded = saveMovieToLibrary(movie);

    if (wasAdded) {
      libraryButton.textContent = 'Added to my library';
      libraryButton.disabled = true;
    }
  });

  overlayElement.addEventListener('click', event => {
    if (event.target === overlayElement) {
      removeSpotlight();
    }
  });

  const handleEscape = event => {
    if (event.key === 'Escape') {
      removeSpotlight();
      document.removeEventListener('keydown', handleEscape);
    }
  };

  document.addEventListener('keydown', handleEscape);
}

// Dışarıdan çağrılan ana fonksiyon: film detayını çekip modalı ekrana basar.
export async function showMovieSpotlight(movieId) {
  removeSpotlight();

  try {
    const movie = await getMovieDetails(movieId);
    const overlayElement = document.createElement('div');

    overlayElement.id = OVERLAY_ID;
    overlayElement.className = 'spotlight-backdrop';
    overlayElement.innerHTML = createSpotlightMarkup(movie);

    document.body.appendChild(overlayElement);
    document.body.classList.add('spotlight-open');

    attachSpotlightEvents(overlayElement, movie);
  } catch (error) {
    console.error('Movie spotlight error:', error);
  }
}
