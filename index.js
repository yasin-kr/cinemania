/* empty css                      */import{a as v}from"./assets/vendor-B2N6ulqC.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=s(o);fetch(o.href,r)}})();const b="163542112cf15bca1d68bf0de03b2c75",w=v.create({baseURL:"https://api.themoviedb.org/3"}),d=async(t,e={})=>{try{return(await w.get(t,{params:{api_key:b,...e}})).data}catch(s){throw console.error("API ERROR:",s.message),s}},g=(t="day")=>d(`/trending/movie/${t}`),$=t=>d(`/movie/${t}`);let i=null;const L=async()=>{if(i)return i;const t=await d("/genre/movie/list");return i=new Map(t.genres.map(e=>[e.id,e.name])),i},E=async t=>{const e=await L();return t.map(s=>e.get(s)||"Unknown")};g().then(t=>{console.log(t.results)});const h="movie-spotlight-overlay",f="cinemania-saved-movies";function _(t,e){return`
    <span class="spotlight-vote-pill">${t?t.toFixed(1):"N/A"}</span>
    <span class="spotlight-vote-separator">/</span>
    <span class="spotlight-vote-pill">${e??0}</span>
  `}function l(t,e){return`
    <div class="spotlight-meta-row">
      <span class="spotlight-meta-label">${t}</span>
      <span class="spotlight-meta-value">${e}</span>
    </div>
  `}function S(t){var n,u;const e=t.poster_path?`https://image.tmdb.org/t/p/w500${t.poster_path}`:"https://placehold.co/500x750/111111/ffffff?text=No+Image";(n=t.release_date)!=null&&n.slice(0,4);const s=((u=t.genres)==null?void 0:u.length)>0?t.genres.map(y=>y.name).join(" "):"Unknown",a=t.popularity?t.popularity.toFixed(1):"N/A",o=t.overview||"No description available for this movie.",r=k(t.id)?"Added to my library":"Add to my library";return`
    <div class="spotlight-shell" role="dialog" aria-modal="true" aria-labelledby="spotlight-title">
      <button class="spotlight-close" type="button" aria-label="Close movie details">&times;</button>
      <div class="spotlight-poster-wrap">
        <img class="spotlight-poster" src="${e}" alt="${t.title}" />
      </div>
      <div class="spotlight-content">
        <h2 id="spotlight-title" class="spotlight-title">${t.title}</h2>
        <div class="spotlight-meta">
          ${l("Vote / Votes",_(t.vote_average,t.vote_count))}
          ${l("Popularity",a)}
          ${l("Genre",s)}
        </div>
        <div class="spotlight-copy-block">
          <h3 class="spotlight-copy-title">ABOUT</h3>
          <p class="spotlight-overview">${o}</p>
        </div>
        <button class="spotlight-library-button" type="button" data-movie-id="${t.id}">
          ${r}
        </button>
      </div>
    </div>
  `}function m(){return JSON.parse(localStorage.getItem(f)||"[]")}function k(t){return m().some(e=>e.id===t)}function M(t){const e=m();if(e.some(a=>a.id===t.id))return!1;const s={id:t.id,title:t.title,poster_path:t.poster_path,release_date:t.release_date,genres:t.genres,vote_average:t.vote_average};return localStorage.setItem(f,JSON.stringify([...e,s])),document.dispatchEvent(new CustomEvent("cinemania:library:add",{detail:s})),!0}function c(){const t=document.getElementById(h);t&&(t.remove(),document.body.classList.remove("spotlight-open"))}function O(t,e){const s=t.querySelector(".spotlight-close"),a=t.querySelector(".spotlight-library-button");s==null||s.addEventListener("click",c),a==null||a.addEventListener("click",()=>{M(e)&&(a.textContent="Added to my library",a.disabled=!0)}),t.addEventListener("click",r=>{r.target===t&&c()});const o=r=>{r.key==="Escape"&&(c(),document.removeEventListener("keydown",o))};document.addEventListener("keydown",o)}async function A(t){c();try{const e=await $(t),s=document.createElement("div");s.id=h,s.className="spotlight-backdrop",s.innerHTML=S(e),document.body.appendChild(s),document.body.classList.add("spotlight-open"),O(s,e)}catch(e){console.error("Movie spotlight error:",e)}}const p=document.querySelector("#weekly-movie");async function I(){if(p)try{const t=await g("week");N(t.results)}catch(t){console.error("Weekly Trends Error:",t)}}async function N(t){const e=await Promise.all(t.slice(0,5).map(async s=>{var o;const a=await E(s.genre_ids);return`<div class="movie-card" data-id="${s.id}">
        <img src="https://image.tmdb.org/t/p/w500${s.poster_path}" alt="${s.title}" />
        <div class="movie-info">
            <h3>${s.title}</h3>
            <p>${a.slice(0,2).join(", ")} | ${(o=s.release_date)==null?void 0:o.slice(0,4)}</p>
        </div>
    </div>`}));p.innerHTML=e.join(""),V()}function V(){p.addEventListener("click",t=>{const e=t.target.closest(".movie-card");if(!e)return;const s=e.dataset.id;A(s)})}I();
//# sourceMappingURL=index.js.map
