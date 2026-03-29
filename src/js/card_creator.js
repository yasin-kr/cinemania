const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK = './img/oops-logo.png';

// liste donduren kart yapisi 

// bu kart ayni isimli baska js'den cagirilabilir ama tum degisken isimlerimi degistirmem gerekir. 
export function createMovieCard(movie, genreNames) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const poster = movie.poster_path ? IMG_BASE + movie.poster_path : FALLBACK;
  const genres = genreNames.slice(0, 2).join(', ') || 'Unknown';
  
  const ratingValue = movie.vote_average ? movie.vote_average : 0;
  const starCount = Math.round(ratingValue / 2);
  let starsHtml = '<div class="movie-card__stars">';
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= starCount;
    const color = isFilled ? 'var(--orange)' : 'var(--grey-white-theme)';
    starsHtml += '<svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 0L9.4687 4.19577L14 5.25L10.8242 8.79093L11.7584 13L7 11.0264L2.24157 13L3.17578 8.79093L0 5.25L4.5313 4.19577L7 0Z" fill="' + color + '"/></svg>';
  }
  starsHtml += '</div>';

  const li = document.createElement('li');
  li.className = 'movie-card';
  li.dataset.id = movie.id;
// yildizlar hos olmadi bakilacak. 
  li.innerHTML =
    '<img class="movie-card__poster" src="' + poster + '" alt="' + movie.title + '" loading="lazy" onerror="this.src=\'' + FALLBACK + '\'">' +
    '<div class="movie-card__info">' +
      '<h3 class="movie-card__title">' + movie.title + '</h3>' +
      '<div class="movie-card__meta">' +
        '<span class="movie-card__genre">' + genres + '</span>' +
        '<span class="movie-card__year">| ' + year + '</span>' +
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
