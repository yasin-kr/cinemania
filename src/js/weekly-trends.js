//API'den haftalık trend filmleri çekip, tür id'lerini tür isimlerine çeviren ve her bir film için popup açan fonksiyonları içeren dosya.
// Haftalık trend verisini çeker ve kartları ekrana basar.
import {
  getTrending,
  convertGenreIdsToNames,
  hasTmdbKey,
  TMDB_CONFIG_ERROR,
} from './API.js';
// Kart tıklanınca film detay modalını açar.
import { showMovieSpotlight } from './movie-spotlight.js';
// Haftalık trend filmleri çekme ve popup açma

// Weekly Trends kartlarının yerleşeceği alan.
const weeklyMovie = document.querySelector('#weekly-movie');

// Bölüm açıldığında trend filmleri çekip render sürecini başlatır.
export async function initWeeklyTrends() {
  if (!weeklyMovie) return;

  if (!hasTmdbKey()) {
    renderWeeklyStatus(TMDB_CONFIG_ERROR);
    return;
  }

  try {
    const data = await getTrending('week');
    renderWeekly(data.results);
  } catch (error) {
    console.error('Weekly Trends Error:', error);
    renderWeeklyStatus('Unable to load weekly trends right now.');
  }
}

// Gelen film listesinden kart HTML yapısını oluşturur.
async function renderWeekly(movies) {
  if (!movies?.length) {
    renderWeeklyStatus('No weekly trends are available right now.');
    return;
  }

  const markup = await Promise.all(
    movies.slice(0, 5).map(async movie => {
      // Tür id'lerini okunabilir tür isimlerine çevirir.
      const genres = await convertGenreIdsToNames(movie.genre_ids);
      return `<div class="movie-card" data-id="${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${genres.slice(0, 2).join(', ')} | ${movie.release_date?.slice(0, 4)}</p>
        </div>
    </div>`;
    })
  );

  weeklyMovie.innerHTML = markup.join('');

  addCardListeners();
}

function renderWeeklyStatus(message) {
  weeklyMovie.innerHTML = `<p class="weekly-status">${message}</p>`;
}

// Kart tıklamasından film id'sini alıp ilgili modalı açar.
function addCardListeners() {
  weeklyMovie.addEventListener('click', e => {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    const movieId = card.dataset.id;

    showMovieSpotlight(movieId);
  });
}
