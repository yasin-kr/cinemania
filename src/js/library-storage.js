import { reportError } from './logger.js';

export const SAVED_MOVIES_KEY = 'cinemania-saved-movies';
export const LIBRARY_ADD_EVENT = 'cinemania:library:add';
export const LIBRARY_REMOVE_EVENT = 'cinemania:library:remove';

function safeParseSavedMovies(rawValue) {
  try {
    const parsedValue = JSON.parse(rawValue || '[]');
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    reportError('Saved movies parse error:', error);
    return [];
  }
}

export function readSavedMovies() {
  return safeParseSavedMovies(localStorage.getItem(SAVED_MOVIES_KEY));
}

export function isMovieSaved(movieId) {
  return readSavedMovies().some(savedMovie => Number(savedMovie.id) === Number(movieId));
}

export function normalizeMovieForLibrary(movie) {
  const genreIds =
    movie.genre_ids ||
    movie.genres?.map(genre =>
      typeof genre === 'object' && genre !== null ? genre.id : genre
    ) ||
    [];

  const genreNames =
    movie.genre_names ||
    movie.genres?.map(genre =>
      typeof genre === 'object' && genre !== null ? genre.name : genre
    ) ||
    [];

  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || '',
    backdrop_path: movie.backdrop_path || '',
    release_date: movie.release_date || '',
    vote_average: movie.vote_average ?? 0,
    overview: movie.overview || '',
    genre_ids: genreIds.filter(Boolean),
    genre_names: genreNames.filter(Boolean),
  };
}

export function saveMovieToLibrary(movie) {
  const savedMovies = readSavedMovies();

  if (savedMovies.some(savedMovie => Number(savedMovie.id) === Number(movie.id))) {
    return false;
  }

  const movieSummary = normalizeMovieForLibrary(movie);

  localStorage.setItem(
    SAVED_MOVIES_KEY,
    JSON.stringify([...savedMovies, movieSummary])
  );

  document.dispatchEvent(
    new CustomEvent(LIBRARY_ADD_EVENT, {
      detail: movieSummary,
    })
  );

  return true;
}

export function removeMovieFromLibrary(movieId) {
  const savedMovies = readSavedMovies();
  const nextSavedMovies = savedMovies.filter(
    savedMovie => Number(savedMovie.id) !== Number(movieId)
  );

  if (nextSavedMovies.length === savedMovies.length) {
    return false;
  }

  localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(nextSavedMovies));

  document.dispatchEvent(
    new CustomEvent(LIBRARY_REMOVE_EVENT, {
      detail: { movieId: Number(movieId) },
    })
  );

  return true;
}

export function getLatestSavedMovie() {
  const savedMovies = readSavedMovies();
  return savedMovies[savedMovies.length - 1] || null;
}

