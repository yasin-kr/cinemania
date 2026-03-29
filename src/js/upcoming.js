import { getApiKey, hasTmdbKey, TMDB_CONFIG_ERROR } from './API.js';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let genresMap = {};

// Upcoming bölümü sadece ilgili elemanlar varsa çalışsın diye DOM referanslarını tek yerden topluyoruz.
function getUpcomingElements() {
  return {
    titleEl: document.querySelector('.movie-title'),
    dateEl: document.querySelector('.upcoming-date'),
    voteEl: document.querySelector('.vote'),
    popularityEl: document.querySelector('.popularity'),
    genreEl: document.querySelector('.genre'),
    overviewEl: document.querySelector('.overview'),
    imgEl: document.querySelector('.movie-img'),
  };
}

async function fetchGenres() {
  try {
    // Upcoming akışı da ortak .env anahtarını kullanıyor.
    if (!hasTmdbKey()) {
      throw new Error(TMDB_CONFIG_ERROR);
    }

    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${getApiKey()}`);
    const data = await res.json();

    data.genres.forEach(g => {
      genresMap[g.id] = g.name;
    });
  } catch (error) {
    console.error('Genres error:', error);
  }
}

async function fetchUpcoming(elements) {
  try {
    // Anahtar eksikse burada da sessiz bozulma yerine görünür hata veriyoruz.
    if (!hasTmdbKey()) {
      throw new Error(TMDB_CONFIG_ERROR);
    }

    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${getApiKey()}`);
    const data = await res.json();

    const movie = data?.results?.[0];

    if (!movie) {
      renderUpcomingStatus(elements, 'No upcoming movie is available right now.');
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
    } = elements;

    titleEl.textContent = movie.title ?? 'No title';

    dateEl.textContent = movie.release_date ?? '-';
    voteEl.textContent = `${movie.vote_average ?? 0} / ${movie.vote_count ?? 0}`;
    popularityEl.textContent = Math.round(movie.popularity ?? 0);

    const genres = (movie.genre_ids || [])
      .map(id => genresMap[id])
      .filter(Boolean);

    genreEl.textContent = genres.length ? genres.join(', ') : '-';

    overviewEl.textContent = movie.overview ?? 'No overview available';

    imgEl.src = movie.backdrop_path
      ? IMG_URL + movie.backdrop_path
      : 'https://via.placeholder.com/800x450';
  } catch (error) {
    console.error('Upcoming error:', error);
    renderUpcomingStatus(elements, 'Unable to load upcoming movies right now.');
  }
}

export async function initUpcoming() {
  const elements = getUpcomingElements();

  // Bölüm ilgili sayfada yoksa script hiçbir şey yapmadan çıkar.
  if (Object.values(elements).some(element => !element)) {
    return;
  }

  if (!hasTmdbKey()) {
    renderUpcomingStatus(elements, TMDB_CONFIG_ERROR);
    return;
  }

  await fetchGenres();
  await fetchUpcoming(elements);
}

function renderUpcomingStatus(elements, message) {
  const { titleEl, overviewEl, imgEl } = elements;

  titleEl.textContent = 'Live data unavailable';
  overviewEl.textContent = message;
  imgEl.removeAttribute('src');
  imgEl.alt = 'Live data unavailable';
}
