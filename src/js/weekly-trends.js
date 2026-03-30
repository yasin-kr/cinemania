// Haftalık trend verisini çeker ve kartları ekrana basar.
import { getTrending, convertGenreIdsToNames } from './API.js';
// Kart tıklanınca film detay modalını açar.
import { showMovieSpotlight } from './movie-spotlight.js';
import { generateStarIconsMarkup } from './star-icons.js';
// Haftalık trend filmleri çekme ve popup açma

// Weekly Trends kartlarının yerleşeceği alan.
const weeklyMovie = document.querySelector('#weekly-movie');
let weeklyMoviesState = [];
let currentWeeklyMode = '';

function getWeeklyMode() {
  return window.innerWidth < 768 ? 'mobile' : 'large';
}

function buildWeeklyStars(voteAverage) {
  return `<div class="movie-rating">${generateStarIconsMarkup(voteAverage, 'movie-rating__star')}</div>`;
}

// Bölüm açıldığında trend filmleri çekip render sürecini başlatır.
export async function initWeeklyTrends() {
  if (!weeklyMovie) return;

  try {
    const data = await getTrending('week');
    weeklyMoviesState = data.results || [];
    renderWeekly(weeklyMoviesState);
  } catch (error) {
    console.error('Weekly Trends Error:', error);
  }
}

// Gelen film listesinden kart HTML yapısını oluşturur.
async function renderWeekly(movies) {
  // Mobile gorunumde tek film, tablet ve desktop gorunumde ise eski duzendeki gibi 3 film gosteriyoruz.
  currentWeeklyMode = getWeeklyMode();
  const visibleMovies =
    currentWeeklyMode === 'mobile' ? movies.slice(0, 1) : movies.slice(0, 3);

  const markup = await Promise.all(
    visibleMovies.map(async movie => {
      // Tür id'lerini okunabilir tür isimlerine çevirir.
      const genres = await convertGenreIdsToNames(movie.genre_ids);
      const starsHtml = buildWeeklyStars(movie.vote_average);
      return `<div class="movie-card" data-id="${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" loading="lazy" decoding="async" width="395" height="574" />
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-info__meta">
              <p>${genres.slice(0, 2).join(', ')} | ${movie.release_date?.slice(0, 4)}</p>
              ${starsHtml}
            </div>
        </div>
    </div>`;
    })
  );

  weeklyMovie.innerHTML = markup.join('');

  addCardListeners();
}

// Kart tıklamasından film id'sini alıp ilgili modalı açar.
function addCardListeners() {
  if (weeklyMovie.dataset.listenerAttached === 'true') return;

  weeklyMovie.addEventListener('click', e => {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    const movieId = card.dataset.id;

    showMovieSpotlight(movieId);
  });

  weeklyMovie.dataset.listenerAttached = 'true';
}

window.addEventListener('resize', function () {
  if (!weeklyMovie || weeklyMoviesState.length === 0) return;

  // Ekran kirilimi degistiginde weekly kart sayisini yeni duzene gore yeniden basiyoruz.
  var nextWeeklyMode = getWeeklyMode();

  if (nextWeeklyMode !== currentWeeklyMode) {
    renderWeekly(weeklyMoviesState);
  }
});
