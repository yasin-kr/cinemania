export function initHero() {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  hero.innerHTML = `
    <div class="container">
      <div class="hero__content">
        <h1 class="hero__title">Discover<br>Your Next<br>Favorite Film</h1>
        <p class="hero__text">Explore trending movies, search by title or year,<br>and build your personal library.</p>
        <a class="hero__btn" href="./catalog.html">Get Started</a>
      </div>
    </div>
  `;
}
