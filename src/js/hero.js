import { getTrending, hasTmdbKey, TMDB_CONFIG_ERROR } from "./API.js";
import { showMovieSpotlight, showMovieTrailerSpotlight } from './movie-spotlight.js';

const MOBILE_TABLET_MAX_WIDTH = 1279;
const OVERVIEW_MAX_LENGTH = 192;

let currentHeroMovie = null;
let isLibraryHero = false;

// Ekran boyutu deðiþtiðinde hero içeriðini mevcut moda göre yeniden kuruyoruz.
window.addEventListener('resize', handleHeroResize);

export async function initHero() {
  const hero = document.getElementById('hero');

  if (!hero) return;

  // Library sayfasýnda hero farklý içerikle çalýþtýðý için ayrý akýþa giriyoruz.
  if (window.location.pathname.toLowerCase().includes('library')) {
    isLibraryHero = true;
    renderLibraryHero();
    return;
  }

  if (!hasTmdbKey()) {
    renderHeroMessage(TMDB_CONFIG_ERROR);
    return;
  }

  try {
    const data = await getTrending('day');

    if (!data || !data.results) {
      console.error('Hero returned invalid data:', data);
      renderHeroMessage('Unable to load live spotlight right now.');
      return;
    }

    const movies = data.results.filter(movie => movie.backdrop_path);

    if (movies.length === 0) {
      renderHeroMessage('No spotlight movie is available right now.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * movies.length);
    const movie = movies[randomIndex];

    currentHeroMovie = movie;
    isLibraryHero = false;

    renderHero(movie);
  } catch (error) {
    console.error('Hero error:', error);
    renderHeroMessage('Unable to load live spotlight right now.');
  }
}

function getAssetUrl(filename) {
  return new URL(`../img/${filename}`, import.meta.url).href;
}

function shouldTruncateOverview() {
  return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH;
}

function formatOverviewText(text) {
  const overview = text?.trim() || 'No description';

  if (!shouldTruncateOverview() || overview.length <= OVERVIEW_MAX_LENGTH) {
    return overview;
  }

  return `${overview.slice(0, OVERVIEW_MAX_LENGTH).trimEnd()}...`;
}

function handleHeroResize() {
  const hero = document.getElementById('hero');

  if (!hero) return;

  if (isLibraryHero) {
    renderLibraryHero();
    return;
  }

  if (currentHeroMovie) {
    renderHero(currentHeroMovie);
  }
}

function renderHero(movie) {
  const hero = document.getElementById('hero');

  const image = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const rawRating = Math.round((movie.vote_average / 2) * 2) / 2;
  const starHtml = generateStarIcons(rawRating);

  hero.innerHTML = `
    <img class="hero__bg" src="${image}" alt="" />

    <div class="hero__overlay">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">${movie.title}</h1>
          <div class="hero__rating">${starHtml}</div>
          <p class="hero__overview">${formatOverviewText(movie.overview)}</p>
          <div class="hero__actions">
            <button class="btn btn--primary">Watch trailer</button>
            <button class="btn btn--secondary">More details</button>
          </div>
        </div>
      </div>
    </div>
  `;

  attachHeroSpotlightEvents(movie.id);
}

function renderHeroMessage(message) {
  const hero = document.getElementById('hero');

  if (!hero) return;

  hero.innerHTML = `
    <div class="hero__overlay">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Cinemania</h1>
          <p class="hero__overview hero__status">${message}</p>
        </div>
      </div>
    </div>
  `;
}

function generateStarIcons(rating) {
  const maxStars = 5;
  const fullStarCount = Math.floor(rating);
  const halfStarCount = rating - fullStarCount >= 0.5 ? 1 : 0;
  const emptyStarCount = maxStars - fullStarCount - halfStarCount;

  let html = '';

  for (let i = 0; i < fullStarCount; i += 1) {
    html += `<img src="${getAssetUrl('full.svg')}" alt="full star" class="hero__star" />`;
  }

  if (halfStarCount > 0) {
    html += `<img src="${getAssetUrl('half.svg')}" alt="half star" class="hero__star" />`;
  }

  for (let i = 0; i < emptyStarCount; i += 1) {
    html += `<img src="${getAssetUrl('empty.svg')}" alt="empty star" class="hero__star" />`;
  }

  return html;
}

function renderLibraryHero() {
  const hero = document.getElementById('hero');

  isLibraryHero = true;

  const mobile = getAssetUrl('library-mobile.jpg');
  const tablet = getAssetUrl('library-tablet.jpg');
  const desktop = getAssetUrl('library-desktop.jpg');

  hero.innerHTML = `
    <img
      class="hero__bg"
      src="${mobile}"
      srcset="${mobile} 480w, ${tablet} 768w, ${desktop} 1280w"
      sizes="(min-width: 1280px) 100vw, (min-width: 768px) 100vw, 100vw"
      alt="Library background"
    />

    <div class="hero__overlay">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Create Your Dream Cinema</h1>
          <div class="hero__rating"></div>
          <p class="hero__overview">
            ${formatOverviewText('Is a guide to designing a personalized movie theater experience with the right equipment, customized decor, and favorite films. This guide helps you bring the cinema experience into your own home with cozy seating, dim lighting, and movie theater snacks.')}
          </p>
        </div>
      </div>
    </div>
  `;
}

function attachHeroSpotlightEvents(movieId) {
  const hero = document.getElementById('hero');

  if (!hero || !movieId) return;

  const trailerButton = hero.querySelector('.btn--primary');
  const detailsButton = hero.querySelector('.btn--secondary');

  trailerButton?.addEventListener('click', () => {
    showMovieTrailerSpotlight(movieId);
  });

  detailsButton?.addEventListener('click', () => {
    showMovieSpotlight(movieId);
  });
}
