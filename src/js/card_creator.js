import { showMovieSpotlight } from './movie-spotlight.js';
import { generateStarIconsMarkup } from './star-icons.js';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK = './img/oops-logo.png';

// liste donduren kart yapisi 

// bu kart ayni isimli baska js'den cagirilabilir ama tum degisken isimlerimi degistirmem gerekir. 
export function createMovieCard(movie, genreNames) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const poster = movie.poster_path ? IMG_BASE + movie.poster_path : FALLBACK;
  const genres = genreNames.slice(0, 2).join(', ') || 'Unknown';
  
  const starsHtml = '<div class="movie-card__stars">' + generateStarIconsMarkup(movie.vote_average, 'movie-card__star') + '</div>';

  const li = document.createElement('li');
  li.className = 'movie-card';
  li.dataset.id = movie.id;
  // Ortak kart yapısını kullanan sayfalarda karta tıklanınca detay popup'ı açıyoruz.
  li.addEventListener('click', () => {
    showMovieSpotlight(movie.id);
  });
// yildizlar hos olmadi bakilacak. 
  li.innerHTML =
    '<img class="movie-card__poster" src="' + poster + '" alt="' + movie.title + '" loading="lazy" onerror="this.src=\'' + FALLBACK + '\'">' +
    '<div class="movie-card__info">' +
      '<h3 class="movie-card__title">' + movie.title + '</h3>' +
      '<div class="movie-card__meta">' +
        '<div class="movie-card__text">' +
          '<span class="movie-card__genre">' + genres + '</span>' +
          '<span class="movie-card__year">| ' + year + '</span>' +
        '</div>' +
        starsHtml +
      '</div>' +
    '</div>';

  return li;
}

// Film dizisini grid'e renderla
export async function renderMovies(movies, container, convertFn) {
  container.innerHTML = '';

  for (var i = 0; i < movies.length; i++) {
    var genreNames = await convertFn(movies[i].genre_ids || []);
    var card = createMovieCard(movies[i], genreNames);
    container.appendChild(card);
  }
}
