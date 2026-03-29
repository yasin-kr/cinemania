import axios from 'axios';

// CONFIG
// API anahtarını sabit yazmak yerine .env içinden alıyoruz.
const API_KEY = import.meta.env.VITE_TMDB_KEY;

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

// GENERIC REQUEST
const fetchData = async (url, params = {}) => {
  try {
    // Ortam değişkeni eksikse istek atmadan önce net hata veriyoruz.
    if (!API_KEY) {
      throw new Error('Missing VITE_TMDB_KEY in environment variables');
    }

    const response = await api.get(url, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API ERROR:', error.message);
    throw error;
  }
};

// TRENDING (day / week)
export const getTrending = (timeWindow = 'day') =>
  fetchData(`/trending/movie/${timeWindow}`);

// TRENDING PAGED
// Catalog tarafındaki sayfalama akışı için haftalık trend verisini sayfa parametresiyle çekiyoruz.
export const getTrendingPaged = (page = 1, timeWindow = 'week') =>
  fetchData(`/trending/movie/${timeWindow}`, { page });

// UPCOMING
export const getUpcoming = () => fetchData('/movie/upcoming');

// SEARCH
export const searchMovies = (query, page = 1, year = '') =>
  fetchData('/search/movie', {
    query,
    page,
    primary_release_year: year || undefined,
  });

// MOVIE DETAILS
export const getMovieDetails = movieId => fetchData(`/movie/${movieId}`);

// MOVIE VIDEOS (TRAILER)
export const getMovieVideos = movieId => fetchData(`/movie/${movieId}/videos`);

// GENRES (CACHE)
let genreMapCache = null;

const getGenres = async () => {
  if (genreMapCache) return genreMapCache;

  const data = await fetchData('/genre/movie/list');

  genreMapCache = new Map(data.genres.map(genre => [genre.id, genre.name]));

  return genreMapCache;
};

export const convertGenreIdsToNames = async genreIds => {
  const genreMap = await getGenres();

  return genreIds.map(id => genreMap.get(id) || 'Unknown');
};

