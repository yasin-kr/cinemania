const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let genresMap = {};

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
    if (!API_KEY) {
      throw new Error('Missing VITE_TMDB_KEY in environment variables');
    }

    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
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
    if (!API_KEY) {
      throw new Error('Missing VITE_TMDB_KEY in environment variables');
    }

    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    const data = await res.json();

    const movie = data?.results?.[0];

    if (!movie) return;

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
      ? IMG_URL + movie.backdrop_path
      : 'https://via.placeholder.com/800x450';
  } catch (error) {
    console.error('Upcoming error:', error);
  }
}

export async function initUpcoming() {
  const elements = getUpcomingElements();

  // Bölüm ilgili sayfada yoksa script hiçbir şey yapmadan çıkar.
  if (Object.values(elements).some(element => !element)) {
    return;
  }

  await fetchGenres();
  await fetchUpcoming(elements);
}
