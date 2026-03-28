
// init almam gerektigi icin header gibimsi bi blok ekledim burasi onemsiz silinebilir. 

export function initHeader() {
  var header = document.querySelector('.header');
  if (!header) return;

  header.innerHTML = `
    <div class="container">
      <a class="header__logo" href="./index.html">
        <img src="./img/header-logo.png" alt="Cinemania" />
      </a>
      <nav class="header__nav">
        <a class="header__nav-link" href="./catalog.html">Catalog</a>
        <a class="header__nav-link" href="./library.html">My Library</a>
      </nav>
    </div>
  `;
}
