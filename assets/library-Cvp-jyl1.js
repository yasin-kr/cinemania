import{r as E,s as b,g as _,L as M,a as S,h as I,c as T,b as C,d as B}from"./footer-DArbxI-b.js";import"./main-Dti_AlFE.js";import"./vendor-B2N6ulqC.js";const G=E();let l=[],v=[],f=1;const L=9;document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("libraryGallery"),n=document.getElementById("loadMore"),e=document.getElementById("genreFilter");if(t){b();try{if(l=G,v=[...l],l.length===0){t.innerHTML=`
        <div class="empty-state">
          <p class="empty-text">OOPS... <br> We are very sorry! <br> You don't have any movies <br> 
          at your library.</p>
          <a href="catalog.html" class="btn-search-more">Search Movie</a>
        </div>
      `,n&&n.classList.add("is-hidden"),e&&e.classList.add("is-hidden");return}const o=await _(),a=new Set;if(l.forEach(s=>{var r;return(r=s.genre_ids)==null?void 0:r.forEach(i=>a.add(i))}),e&&e.tagName==="SELECT")e.innerHTML='<option value="all">Genre</option>',a.forEach(s=>{const r=o.get(s);if(r){const i=document.createElement("option");i.value=s,i.textContent=r,e.appendChild(i)}});else if(e&&e.classList.contains("custom-select")){const s=e.querySelector(".custom-select__list"),r=e.querySelector(".custom-select__button"),i=e.querySelector(".custom-select__label"),u=document.createElement("li");u.dataset.value="all",u.textContent="Genre",u.classList.add("selected"),s.appendChild(u),a.forEach(c=>{const d=o.get(c);if(d){const g=document.createElement("li");g.dataset.value=c,g.textContent=d,s.appendChild(g)}});const m=c=>{c?(s.classList.remove("hide"),r.setAttribute("aria-expanded","true")):(s.classList.add("hide"),r.setAttribute("aria-expanded","false"))};m(!1),r.addEventListener("click",c=>{const d=!s.classList.contains("hide");m(!d)}),document.addEventListener("click",c=>{e.contains(c.target)||m(!1)}),s.addEventListener("click",c=>{const d=c.target.closest("li");if(!d)return;s.querySelectorAll("li").forEach(y=>y.classList.remove("selected")),d.classList.add("selected"),i.textContent=d.textContent,m(!1);const g=d.dataset.value;f=1,t.innerHTML="",v=g==="all"?l:l.filter(y=>y.genre_ids.includes(Number(g))),h()})}h(),n.addEventListener("click",()=>{f++,h()}),e&&e.tagName==="SELECT"&&e.addEventListener("change",s=>{const r=s.target.value;f=1,t.innerHTML="",v=r==="all"?l:l.filter(i=>i.genre_ids.includes(Number(r))),h()}),H(t),document.addEventListener(M,p),document.addEventListener(S,p)}catch{}finally{I()}}});function p(){const t=document.getElementById("libraryGallery"),n=document.getElementById("loadMore");if(t){if(l=E(),v=[...l],f=1,t.innerHTML="",l.length===0){n==null||n.classList.add("is-hidden"),t.innerHTML=`
      <div class="empty-state">
        <p class="empty-text">OOPS... <br> We are very sorry! <br> You don't have any movies <br> 
        at your library.</p>
        <a href="catalog.html" class="btn-search-more">Search Movie</a>
      </div>
    `;return}h()}}async function h(){const t=document.getElementById("libraryGallery"),n=document.getElementById("loadMore"),e=(f-1)*L,o=e+L,a=v.slice(e,o);o>=v.length?n.classList.add("is-hidden"):n.classList.remove("is-hidden"),await x(a,t,!1)}async function x(t,n,e=!0){e&&(n.innerHTML="");const o=await Promise.all(t.map(async a=>{var m;const s=((m=a.genre_names)==null?void 0:m.length)>0?a.genre_names:await T(a.genre_ids||[]),r=a.release_date?a.release_date.slice(0,4):"—",i=a.poster_path?`https://image.tmdb.org/t/p/w500${a.poster_path}`:"./img/oops-logo.png",u=`<div class="movie-rating">${C(a.vote_average,"movie-rating__star")}</div>`;return`
        <div class="movie-card" data-id="${a.id}">
          <img class="movie-img" src="${i}" alt="${a.title}" loading="lazy" />
          <div class="movie-info">
              <h3 class="movie-title">${a.title}</h3>
              <div class="movie-info__meta">
                <p>${s.slice(0,2).join(", ")} | ${r}</p>
                ${u}
              </div>
          </div>
        </div>`}));n.innerHTML+=o.join("")}function H(t){t.dataset.listenerAttached!=="true"&&(t.addEventListener("click",n=>{const e=n.target.closest(".movie-card");if(!e)return;const o=e.dataset.id;B(o)}),t.dataset.listenerAttached="true")}
//# sourceMappingURL=library-Cvp-jyl1.js.map
