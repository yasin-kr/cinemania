const API_KEY = '163542112cf15bca1d68bf0de03b2c75';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

const titleEl = document.querySelector('.movie-title');
const dateEl = document.querySelector('.upcoming-date');
const voteEl = document.querySelector('.vote');
const popularityEl = document.querySelector('.popularity');
const genreEl = document.querySelector('.genre');
const overviewEl = document.querySelector('.overview');
const imgEl = document.querySelector('.movie-img');

let genresMap = {};

async function fetchGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await res.json();

    data.genres.forEach(g => {
      genresMap[g.id] = g.name;
    });
  } catch (error) {
    console.error('Genres error:', error);
  }
}

async function fetchUpcoming() {
  try {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
    const data = await res.json();

    const movie = data?.results?.[0];

    if (!movie) return;

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
  }
}

async function init() {
  await fetchGenres();
  await fetchUpcoming();
}

init();
