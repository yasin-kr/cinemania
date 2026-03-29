import{g as $,a as k,c as L,i as M,b as x}from"./footer-DD8GppvP.js";const v="163542112cf15bca1d68bf0de03b2c75",h="https://api.themoviedb.org/3",C="https://image.tmdb.org/t/p/original";let m={};function A(){return{titleEl:document.querySelector(".movie-title"),dateEl:document.querySelector(".upcoming-date"),voteEl:document.querySelector(".vote"),popularityEl:document.querySelector(".popularity"),genreEl:document.querySelector(".genre"),overviewEl:document.querySelector(".overview"),imgEl:document.querySelector(".movie-img")}}async function I(){try{(await(await fetch(`${h}/genre/movie/list?api_key=${v}`)).json()).genres.forEach(e=>{m[e.id]=e.name})}catch(t){console.error("Genres error:",t)}}async function q(t){var o;try{const a=await(await fetch(`${h}/movie/upcoming?api_key=${v}`)).json(),n=(o=a==null?void 0:a.results)==null?void 0:o[0];if(!n)return;const{titleEl:s,dateEl:r,voteEl:i,popularityEl:c,genreEl:E,overviewEl:w,imgEl:_}=t;s.textContent=n.title??"No title",r.textContent=n.release_date??"-",i.textContent=`${n.vote_average??0} / ${n.vote_count??0}`,c.textContent=Math.round(n.popularity??0);const u=(n.genre_ids||[]).map(S=>m[S]).filter(Boolean);E.textContent=u.length?u.join(", "):"-",w.textContent=n.overview??"No overview available",_.src=n.backdrop_path?C+n.backdrop_path:"https://via.placeholder.com/800x450"}catch(e){console.error("Upcoming error:",e)}}async function N(){const t=A();Object.values(t).some(o=>!o)||(await I(),await q(t))}const y="movie-spotlight-overlay",f="cinemania-saved-movies";function V(t,o){return`
    <span class="spotlight-vote-pill">${t?t.toFixed(1):"N/A"}</span>
    <span class="spotlight-vote-separator">/</span>
    <span class="spotlight-vote-pill">${o??0}</span>
  `}function d(t,o){return`
    <div class="spotlight-meta-row">
      <span class="spotlight-meta-label">${t}</span>
      <span class="spotlight-meta-value">${o}</span>
    </div>
  `}function U(t){var r,i;const o=t.poster_path?`https://image.tmdb.org/t/p/w500${t.poster_path}`:"https://placehold.co/500x750/111111/ffffff?text=No+Image";(r=t.release_date)!=null&&r.slice(0,4);const e=((i=t.genres)==null?void 0:i.length)>0?t.genres.map(c=>c.name).join(" "):"Unknown",a=t.popularity?t.popularity.toFixed(1):"N/A",n=t.overview||"No description available for this movie.",s=O(t.id)?"Added to my library":"Add to my library";return`
    <div class="spotlight-shell" role="dialog" aria-modal="true" aria-labelledby="spotlight-title">
      <button class="spotlight-close" type="button" aria-label="Close movie details">&times;</button>
      <div class="spotlight-poster-wrap">
        <img class="spotlight-poster" src="${o}" alt="${t.title}" />
      </div>
      <div class="spotlight-content">
        <h2 id="spotlight-title" class="spotlight-title">${t.title}</h2>
        <div class="spotlight-meta">
          ${d("Vote / Votes",V(t.vote_average,t.vote_count))}
          ${d("Popularity",a)}
          ${d("Genre",e)}
        </div>
        <div class="spotlight-copy-block">
          <h3 class="spotlight-copy-title">ABOUT</h3>
          <p class="spotlight-overview">${n}</p>
        </div>
        <button class="spotlight-library-button" type="button" data-movie-id="${t.id}">
          ${s}
        </button>
      </div>
    </div>
  `}function b(){return JSON.parse(localStorage.getItem(f)||"[]")}function O(t){return b().some(o=>o.id===t)}function T(t){const o=b();if(o.some(a=>a.id===t.id))return!1;const e={id:t.id,title:t.title,poster_path:t.poster_path,release_date:t.release_date,genres:t.genres,vote_average:t.vote_average};return localStorage.setItem(f,JSON.stringify([...o,e])),document.dispatchEvent(new CustomEvent("cinemania:library:add",{detail:e})),!0}function l(){const t=document.getElementById(y);t&&(t.remove(),document.body.classList.remove("spotlight-open"))}function j(t,o){const e=t.querySelector(".spotlight-close"),a=t.querySelector(".spotlight-library-button");e==null||e.addEventListener("click",l),a==null||a.addEventListener("click",()=>{T(o)&&(a.textContent="Added to my library",a.disabled=!0)}),t.addEventListener("click",s=>{s.target===t&&l()});const n=s=>{s.key==="Escape"&&(l(),document.removeEventListener("keydown",n))};document.addEventListener("keydown",n)}async function G(t){l();try{const o=await $(t),e=document.createElement("div");e.id=y,e.className="spotlight-backdrop",e.innerHTML=U(o),document.body.appendChild(e),document.body.classList.add("spotlight-open"),j(e,o)}catch(o){console.error("Movie spotlight error:",o)}}const p=document.querySelector("#weekly-movie");async function D(){if(p)try{const t=await k("week");H(t.results)}catch(t){console.error("Weekly Trends Error:",t)}}async function H(t){const o=await Promise.all(t.slice(0,5).map(async e=>{var n;const a=await L(e.genre_ids);return`<div class="movie-card" data-id="${e.id}">
        <img src="https://image.tmdb.org/t/p/w500${e.poster_path}" alt="${e.title}" />
        <div class="movie-info">
            <h3>${e.title}</h3>
            <p>${a.slice(0,2).join(", ")} | ${(n=e.release_date)==null?void 0:n.slice(0,4)}</p>
        </div>
    </div>`}));p.innerHTML=o.join(""),P()}function P(){p.addEventListener("click",t=>{const o=t.target.closest(".movie-card");if(!o)return;const e=o.dataset.id;G(e)})}function g(){M(),x(),N(),D()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:!0}):g();
//# sourceMappingURL=main-vyVTKaJz.js.map
