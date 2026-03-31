import { getMovieDetails, getMovieVideos } from './api.js';
import { reportError } from './logger.js';
import {
  isMovieSaved as isMovieSavedInLibrary,
  removeMovieFromLibrary as deleteMovieFromLibrary,
  saveMovieToLibrary as persistMovieToLibrary,
} from './library-storage.js';

// More details ve Watch trailer popup'ları bu modül içinden yönetiliyor.

// Modalın DOM içinde tekil olarak bulunabilmesi için kullanılan id.
const OVERLAY_ID = 'movie-spotlight-overlay';
let spotlightEscapeHandler = null;
// Library tarafına dokunmadan geçici kayıt tutmak için kullanılan localStorage anahtarı.

// Vote / Votes alanındaki küçük kutucuklu yapıyı üretir.
// More details için oy bilgisini ortak bir yapıda üretir.
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
    ? 'Remove from my library'
    : 'Add to my library';
  const buttonStateClass = isMovieSaved(movie.id)
    ? 'spotlight-library-button--remove'
    : 'spotlight-library-button--add';

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
        <button class="spotlight-library-button ${buttonStateClass}" type="button" data-movie-id="${movie.id}">
          ${buttonLabel}
        </button>
      </div>
    </div>
  `;
}

// Watch trailer için yalnızca videoyu gösteren sade popup yapısını üretir.
function createTrailerMarkup(movie, trailerKey) {
  return `
    <div class="spotlight-shell spotlight-shell--trailer" role="dialog" aria-modal="true" aria-labelledby="spotlight-trailer-title">
      <button class="spotlight-close" type="button" aria-label="Close trailer">&times;</button>
      <div class="spotlight-content spotlight-content--trailer">
        <div class="spotlight-trailer-frame-wrap">
          <iframe
            class="spotlight-trailer-frame"
            src="https://www.youtube.com/embed/${trailerKey}?autoplay=1"
            title="${movie.title} trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  `;
}

function createTrailerFallbackMarkup() {
  const fallbackImage = new URL('../img/oops-logo.png', import.meta.url).href;

  return `
    <div class="spotlight-shell spotlight-shell--trailer spotlight-shell--trailer-fallback" role="dialog" aria-modal="true" aria-labelledby="spotlight-trailer-fallback-title">
      <button class="spotlight-close" type="button" aria-label="Close trailer fallback">&times;</button>
      <div class="spotlight-trailer-fallback">
        <div class="spotlight-trailer-fallback__copy">
          <h2 id="spotlight-trailer-fallback-title" class="spotlight-trailer-fallback__title">OOPS...</h2>
          <p class="spotlight-trailer-fallback__text">We are very sorry!</p>
          <p class="spotlight-trailer-fallback__text">But we couldn&apos;t find the trailer.</p>
        </div>
        <img
          class="spotlight-trailer-fallback__image"
          src="${fallbackImage}"
          alt="Trailer unavailable"
          width="320"
          height="240"
        />
      </div>
    </div>
  `;
}

// İlgili film daha önce eklenmiş mi kontrol eder.
function isMovieSaved(movieId) {
  return isMovieSavedInLibrary(movieId);
}

// Filmi localStorage'a ekler ve isteyen modüller dinleyebilsin diye event yayınlar.
function saveMovieToLibrary(movie) {
  return persistMovieToLibrary(movie);
}

// Açık modal varsa kaldırır ve body scroll kilidini çözer.
function removeSpotlight() {
  const existingOverlay = document.getElementById(OVERLAY_ID);

  if (spotlightEscapeHandler) {
    document.removeEventListener('keydown', spotlightEscapeHandler);
    spotlightEscapeHandler = null;
  }

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
    const movieIsSaved = isMovieSaved(movie.id);

    if (movieIsSaved) {
      const wasRemoved = deleteMovieFromLibrary(movie.id);

      if (wasRemoved) {
        updateLibraryButtonState(libraryButton, false);
      }

      return;
    }

    const wasAdded = saveMovieToLibrary(movie);

    if (wasAdded) {
      updateLibraryButtonState(libraryButton, true);
    }
  });

  overlayElement.addEventListener('click', event => {
    if (event.target === overlayElement) {
      removeSpotlight();
    }
  });

  spotlightEscapeHandler = event => {
    if (event.key === 'Escape') {
      removeSpotlight();
    }
  };

  document.addEventListener('keydown', spotlightEscapeHandler);
}

function updateLibraryButtonState(button, isSaved) {
  if (!button) return;

  button.textContent = isSaved
    ? 'Remove from my library'
    : 'Add to my library';
  button.classList.toggle('spotlight-library-button--add', !isSaved);
  button.classList.toggle('spotlight-library-button--remove', isSaved);
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
    reportError('Movie spotlight error:', error);
  }
}

// Hero içindeki fragman butonu bu akışla aynı overlay içinde video açar.
export async function showMovieTrailerSpotlight(movieId) {
  removeSpotlight();

  try {
    const [movie, videoData] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId),
    ]);
    const videos = videoData?.results || [];
    const trailer =
      videos.find(
        video =>
          video.site === 'YouTube' &&
          video.type === 'Trailer' &&
          video.official
      ) ||
      videos.find(
        video => video.site === 'YouTube' && video.type === 'Trailer'
      ) ||
      videos.find(video => video.site === 'YouTube');

    // Önce resmi trailer'ı, yoksa diğer YouTube videolarını yedek olarak kullanıyoruz.
    const overlayElement = document.createElement('div');

    overlayElement.id = OVERLAY_ID;
    overlayElement.className = 'spotlight-backdrop';
    overlayElement.innerHTML = trailer?.key
      ? createTrailerMarkup(movie, trailer.key)
      : createTrailerFallbackMarkup();

    document.body.appendChild(overlayElement);
    document.body.classList.add('spotlight-open');

    attachSpotlightEvents(overlayElement);
  } catch (error) {
    reportError('Movie trailer error:', error);
  }
}



