import{a as ee}from"./vendor-B2N6ulqC.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function o(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=o(i);fetch(i.href,r)}})();function ke(){te(),oe(),ie()}const x="cinemania-theme";function te(){const e=window.location.pathname;let t="home";e.includes("catalog")?t="catalog":e.includes("library")&&(t="library"),document.querySelectorAll(".nav-link").forEach(o=>{o.classList.remove("active")}),document.querySelectorAll(`[data-page="${t}"]`).forEach(o=>{o.classList.add("active")})}function oe(){const e=document.getElementById("menuToggle"),t=document.querySelector(".mobile-nav");!e||!t||(e.addEventListener("click",()=>{t.classList.toggle("open"),document.body.classList.toggle("nav-open")}),document.addEventListener("click",o=>{t.classList.contains("open")&&!t.contains(o.target)&&o.target!==e&&(t.classList.remove("open"),document.body.classList.remove("nav-open"))}))}function ie(){const e=document.querySelector(".theme-toggle");if(!e)return;const o=localStorage.getItem(x)==="light";document.body.classList.toggle("light-theme",o),e.classList.toggle("active",o),e.addEventListener("click",()=>{const s=!document.body.classList.contains("light-theme");document.body.classList.toggle("light-theme",s),e.classList.toggle("active",s),localStorage.setItem(x,s?"light":"dark")})}const j="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M17.25%2017.25L6.75%206.75M17.25%206.75L6.75%2017.25'%20stroke='%23F8F8F8'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",M="data:image/svg+xml,%3csvg%20width='17'%20height='16'%20viewBox='0%200%2017%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16.25%206.125H10.2031L8.375%200.5L6.54688%206.125H0.5L5.42188%209.5L3.52344%2015.125L8.375%2011.6094L13.2266%2015.125L11.3281%209.5L16.25%206.125Z'%20stroke='url(%23paint0_linear_148_6995)'%20stroke-linejoin='round'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_148_6995'%20x1='2.42377'%20y1='1.54501'%20x2='12.853'%20y2='15.5249'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23F84119'/%3e%3cstop%20offset='1'%20stop-color='%23F89F19'%20stop-opacity='0.68'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",S="data:image/svg+xml,%3csvg%20width='17'%20height='16'%20viewBox='0%200%2017%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M13.2876%2015.7505C13.1692%2015.751%2013.0537%2015.7141%2012.9575%2015.6451L8.43602%2012.3671L3.91458%2015.6451C3.81798%2015.7151%203.7016%2015.7527%203.58227%2015.7522C3.46294%2015.7518%203.34684%2015.7134%203.25076%2015.6427C3.15467%2015.5719%203.08358%2015.4724%203.04776%2015.3586C3.01194%2015.2447%203.01324%2015.1225%203.05149%2015.0094L4.81493%209.78628L0.244616%206.6521C0.14562%206.58429%200.0709031%206.48659%200.0313829%206.37329C-0.00813729%206.25999%20-0.01039%206.13702%200.024954%206.02235C0.060298%205.90768%200.131386%205.80732%200.227832%205.73592C0.324278%205.66453%200.441028%205.62585%200.561022%205.62554H6.19938L7.90094%200.389013C7.9376%200.275959%208.00912%200.177419%208.10525%200.107532C8.20138%200.0376441%208.31717%200%208.43602%200C8.55487%200%208.67067%200.0376441%208.7668%200.107532C8.86292%200.177419%208.93445%200.275959%208.9711%200.389013L10.6727%205.6273H16.311C16.4312%205.62724%2016.5482%205.66565%2016.6449%205.7369C16.7416%205.80816%2016.813%205.90851%2016.8486%206.02327C16.8842%206.13803%2016.882%206.26116%2016.8426%206.37464C16.8031%206.48811%2016.7283%206.58596%2016.6292%206.65386L12.0571%209.78628L13.8195%2015.008C13.8481%2015.0926%2013.8561%2015.1827%2013.8429%2015.271C13.8298%2015.3592%2013.7958%2015.4431%2013.7438%2015.5156C13.6919%2015.5882%2013.6234%2015.6473%2013.5441%2015.6881C13.4647%2015.729%2013.3768%2015.7504%2013.2876%2015.7505Z'%20fill='url(%23paint0_linear_148_6990)'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_148_6990'%20x1='2.06104'%20y1='1.12555'%20x2='13.311'%20y2='16.1255'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23F84119'/%3e%3cstop%20offset='1'%20stop-color='%23F89F19'%20stop-opacity='0.68'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",C="data:image/svg+xml,%3csvg%20width='18'%20height='18'%20viewBox='0%200%2018%2018'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M16.875%207.3125H10.8281L9%201.6875L7.17188%207.3125H1.125L6.04688%2010.6875L4.14844%2016.3125L9%2012.7969L13.8516%2016.3125L11.9531%2010.6875L16.875%207.3125Z'%20stroke='url(%23paint0_linear_148_6991)'%20stroke-linejoin='round'/%3e%3cpath%20d='M9%201.6875V12.7969L4.14844%2016.3125L6.04688%2010.6875L1.125%207.3125H7.17188L9%201.6875Z'%20fill='url(%23paint1_linear_148_6991)'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_148_6991'%20x1='3.04877'%20y1='2.73251'%20x2='13.478'%20y2='16.7124'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23F84119'/%3e%3cstop%20offset='1'%20stop-color='%23F89F19'%20stop-opacity='0.68'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_148_6991'%20x1='2.08688'%20y1='2.73251'%20x2='12.1506'%20y2='9.47748'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23F84119'/%3e%3cstop%20offset='1'%20stop-color='%23F89F19'%20stop-opacity='0.68'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e",T="data:image/png;base64,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",U="/cinemania/assets/hero-desktop-B-rlr9xy.jpg",B="/cinemania/assets/hero-desktop@2x-DS59bloy.jpg",H="/cinemania/assets/hero-mobile-DRdWGPJF.jpg",O="/cinemania/assets/hero-mobile@2x-CPV4ij2H.jpg",I="/cinemania/assets/hero-tablet-BvlRnwng.jpg",R="/cinemania/assets/hero-tablet@2x-9avlJkDE.jpg",F="/cinemania/assets/library-desktop-DCSg0NBg.jpg",q="/cinemania/assets/library-desktop@2x-DRgC57sh.jpg",D="/cinemania/assets/library-mobile-BfOPUaqZ.jpg",P="/cinemania/assets/library-mobile@2x-CGEOa-kd.jpg",N="/cinemania/assets/library-tablet-BoEWKE7O.jpg",Y="/cinemania/assets/library-tablet@2x-BjzAft3x.jpg",G="/cinemania/assets/logo-PQe6D84w.svg",Q="data:image/svg+xml,%3csvg%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M0.518229%207.27441C0.759845%2010.6211%203.6928%2013.3439%207.20294%2013.4933C9.67951%2013.5973%2011.8943%2012.4796%2013.2232%2010.7185C13.7736%209.99721%2013.4783%209.51634%2012.5588%209.6788C12.1091%209.75678%2011.646%209.78927%2011.1628%209.76977C7.88081%209.63981%205.19619%206.98199%205.18276%203.84329C5.17605%202.99851%205.35726%202.19921%205.68613%201.4714C6.04855%200.665606%205.6123%200.282204%204.77336%200.626616C2.11558%201.71184%200.296747%204.30467%200.518229%207.27441Z'%20stroke='white'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",J="/cinemania/assets/oops-logo-UsdGqXGh.png",K="data:image/svg+xml,%3csvg%20width='16'%20height='16'%20viewBox='0%200%2016%2016'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M7.75%2012.75C10.5114%2012.75%2012.75%2010.5114%2012.75%207.75C12.75%204.98858%2010.5114%202.75%207.75%202.75C4.98858%202.75%202.75%204.98858%202.75%207.75C2.75%2010.5114%204.98858%2012.75%207.75%2012.75Z'%20stroke='white'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M12.657%202.843L12.748%202.752M2.752%2012.748L2.843%2012.657M7.75%200.806V0.75M7.75%2014.75V14.694M0.806%207.75H0.75M14.75%207.75H14.694M2.843%202.843L2.752%202.752M12.748%2012.748L12.657%2012.657'%20stroke='white'%20stroke-width='1.5'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e",w="163542112cf15bca1d68bf0de03b2c75",se="TMDB live data is unavailable because VITE_TMDB_KEY is missing.",re=()=>!!w,Ee=()=>w,ne=ee.create({baseURL:"https://api.themoviedb.org/3"}),p=async(e,t={})=>{try{if(!re())throw new Error(se);return(await ne.get(e,{params:{api_key:w,...t}})).data}catch(o){throw console.error("API ERROR:",o.message),o}},ae=(e="day")=>p(`/trending/movie/${e}`),Ae=(e=1,t="week")=>p(`/trending/movie/${t}`,{page:e}),je=(e,t=1,o="")=>p("/search/movie",{query:e,page:t,primary_release_year:o||void 0}),V=e=>p(`/movie/${e}`),le=e=>p(`/movie/${e}/videos`);let u=null;const ce=async()=>{if(u)return u;const e=await p("/genre/movie/list");return u=new Map(e.genres.map(t=>[t.id,t.name])),u},Me=async e=>{const t=await ce();return e.map(o=>t.get(o)||"Unknown")},_="movie-spotlight-overlay",z="cinemania-saved-movies";function de(e,t){return`
    <span class="spotlight-vote-pill">${e?e.toFixed(1):"N/A"}</span>
    <span class="spotlight-vote-separator">/</span>
    <span class="spotlight-vote-pill">${t??0}</span>
  `}function f(e,t){return`
    <div class="spotlight-meta-row">
      <span class="spotlight-meta-label">${e}</span>
      <span class="spotlight-meta-value">${t}</span>
    </div>
  `}function ge(e){var n,l;const t=e.poster_path?`https://image.tmdb.org/t/p/w500${e.poster_path}`:"https://placehold.co/500x750/111111/ffffff?text=No+Image";(n=e.release_date)!=null&&n.slice(0,4);const o=((l=e.genres)==null?void 0:l.length)>0?e.genres.map(d=>d.name).join(" "):"Unknown",s=e.popularity?e.popularity.toFixed(1):"N/A",i=e.overview||"No description available for this movie.",r=he(e.id)?"Added to my library":"Add to my library";return`
    <div class="spotlight-shell" role="dialog" aria-modal="true" aria-labelledby="spotlight-title">
      <button class="spotlight-close" type="button" aria-label="Close movie details">&times;</button>
      <div class="spotlight-poster-wrap">
        <img class="spotlight-poster" src="${t}" alt="${e.title}" />
      </div>
      <div class="spotlight-content">
        <h2 id="spotlight-title" class="spotlight-title">${e.title}</h2>
        <div class="spotlight-meta">
          ${f("Vote / Votes",de(e.vote_average,e.vote_count))}
          ${f("Popularity",s)}
          ${f("Genre",o)}
        </div>
        <div class="spotlight-copy-block">
          <h3 class="spotlight-copy-title">ABOUT</h3>
          <p class="spotlight-overview">${i}</p>
        </div>
        <button class="spotlight-library-button" type="button" data-movie-id="${e.id}">
          ${r}
        </button>
      </div>
    </div>
  `}function pe(e,t){return`
    <div class="spotlight-shell spotlight-shell--trailer" role="dialog" aria-modal="true" aria-labelledby="spotlight-trailer-title">
      <button class="spotlight-close" type="button" aria-label="Close trailer">&times;</button>
      <div class="spotlight-content spotlight-content--trailer">
        <div class="spotlight-trailer-frame-wrap">
          <iframe
            class="spotlight-trailer-frame"
            src="https://www.youtube.com/embed/${t}?autoplay=1"
            title="${e.title} trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  `}function W(){return JSON.parse(localStorage.getItem(z)||"[]")}function he(e){return W().some(t=>t.id===e)}function me(e){const t=W();if(t.some(s=>s.id===e.id))return!1;const o={id:e.id,title:e.title,poster_path:e.poster_path,release_date:e.release_date,genres:e.genres,vote_average:e.vote_average};return localStorage.setItem(z,JSON.stringify([...t,o])),document.dispatchEvent(new CustomEvent("cinemania:library:add",{detail:o})),!0}function h(){const e=document.getElementById(_);e&&(e.remove(),document.body.classList.remove("spotlight-open"))}function Z(e,t){const o=e.querySelector(".spotlight-close"),s=e.querySelector(".spotlight-library-button");o==null||o.addEventListener("click",h),s==null||s.addEventListener("click",()=>{me(t)&&(s.textContent="Added to my library",s.disabled=!0)}),e.addEventListener("click",r=>{r.target===e&&h()});const i=r=>{r.key==="Escape"&&(h(),document.removeEventListener("keydown",i))};document.addEventListener("keydown",i)}async function ue(e){h();try{const t=await V(e),o=document.createElement("div");o.id=_,o.className="spotlight-backdrop",o.innerHTML=ge(t),document.body.appendChild(o),document.body.classList.add("spotlight-open"),Z(o,t)}catch(t){console.error("Movie spotlight error:",t)}}async function ve(e){h();try{const[t,o]=await Promise.all([V(e),le(e)]),s=(o==null?void 0:o.results)||[],i=s.find(n=>n.site==="YouTube"&&n.type==="Trailer"&&n.official)||s.find(n=>n.site==="YouTube"&&n.type==="Trailer")||s.find(n=>n.site==="YouTube");if(!(i!=null&&i.key)){console.warn("Movie trailer error: no YouTube trailer found",e);return}const r=document.createElement("div");r.id=_,r.className="spotlight-backdrop",r.innerHTML=pe(t,i.key),document.body.appendChild(r),document.body.classList.add("spotlight-open"),Z(r)}catch(t){console.error("Movie trailer error:",t)}}function y(e){return new URL(Object.assign({"../img/close-outline.svg":j,"../img/empty.svg":M,"../img/full.svg":S,"../img/half.svg":C,"../img/header-logo.png":T,"../img/hero-desktop.jpg":U,"../img/hero-desktop@2x.jpg":B,"../img/hero-mobile.jpg":H,"../img/hero-mobile@2x.jpg":O,"../img/hero-tablet.jpg":I,"../img/hero-tablet@2x.jpg":R,"../img/library-desktop.jpg":F,"../img/library-desktop@2x.jpg":q,"../img/library-mobile.jpg":D,"../img/library-mobile@2x.jpg":P,"../img/library-tablet.jpg":N,"../img/library-tablet@2x.jpg":Y,"../img/logo.svg":G,"../img/moon.svg":Q,"../img/oops-logo.png":J,"../img/sun.svg":K})[`../img/${e}`],import.meta.url).href}function be(e,t="star-icon"){const o=Math.round((e||0)/2*2)/2,s=5,i=Math.floor(o),r=o-i>=.5?1:0,n=s-i-r;let l="";for(let d=0;d<i;d++)l+=`<img src="${y("full.svg")}" alt="full star" class="${t}" />`;r>0&&(l+=`<img src="${y("half.svg")}" alt="half star" class="${t}" />`);for(let d=0;d<n;d++)l+=`<img src="${y("empty.svg")}" alt="empty star" class="${t}" />`;return l}const fe=1279,k=192,ye="Is a guide to creating a personalized movie theater experience. You'll need a projector, screen, and speakers. Decorate your space, choose your films, and stock up on snacks for the full experience.";let g=null,m=!1,v=null;window.addEventListener("resize",_e);async function Se(){if(document.getElementById("hero")){if(window.location.pathname.toLowerCase().includes("library")){m=!0,$();return}try{const t=await ae("day");if(!t||!t.results){g=null,b(),console.error("API data hatalı:",t);return}const o=t.results.filter(r=>r.backdrop_path);if(o.length===0){g=null,b();return}const s=Math.floor(Math.random()*o.length),i=o[s];g=i,m=!1,X(i)}catch(t){console.error("Hero error:",t),g=null,b()}}}function a(e){return new URL(Object.assign({"../img/close-outline.svg":j,"../img/empty.svg":M,"../img/full.svg":S,"../img/half.svg":C,"../img/header-logo.png":T,"../img/hero-desktop.jpg":U,"../img/hero-desktop@2x.jpg":B,"../img/hero-mobile.jpg":H,"../img/hero-mobile@2x.jpg":O,"../img/hero-tablet.jpg":I,"../img/hero-tablet@2x.jpg":R,"../img/library-desktop.jpg":F,"../img/library-desktop@2x.jpg":q,"../img/library-mobile.jpg":D,"../img/library-mobile@2x.jpg":P,"../img/library-tablet.jpg":N,"../img/library-tablet@2x.jpg":Y,"../img/logo.svg":G,"../img/moon.svg":Q,"../img/oops-logo.png":J,"../img/sun.svg":K})[`../img/${e}`],import.meta.url).href}function we(){return window.innerWidth<=fe}function L(e){const t=(e==null?void 0:e.trim())||"No description";return!we()||t.length<=k?t:`${t.slice(0,k).trimEnd()}...`}function _e(){v&&cancelAnimationFrame(v),v=requestAnimationFrame(()=>{if(v=null,!!document.getElementById("hero")){if(m){$();return}if(g){X(g);return}b()}})}function X(e){const t=document.getElementById("hero"),o=`https://image.tmdb.org/t/p/original${e.backdrop_path}`,s=be(e.vote_average,"hero__star");t.innerHTML=`
    <img
      class="hero__bg"
      src="${o}"
      alt=""
      fetchpriority="high"
      decoding="async"
      width="1280"
      height="660"
    />

    <div class="hero__overlay">
      <div class="container">
        <div class="hero__content">

          <h1 class="hero__title">${e.title}</h1>

          <div class="hero__rating">${s}</div>

          <p class="hero__overview">
            ${L(e.overview)}
          </p>

          <div class="hero__actions">
            <button class="btn btn--primary">Watch trailer</button>
            <button class="btn btn--secondary">More details</button>
          </div>

        </div>
      </div>
    </div>
  `,Le(e.id)}function b(){var l;const e=document.getElementById("hero");if(!e)return;m=!1;const t=a("hero-mobile.jpg"),o=a("hero-mobile@2x.jpg"),s=a("hero-tablet.jpg"),i=a("hero-tablet@2x.jpg"),r=a("hero-desktop.jpg"),n=a("hero-desktop@2x.jpg");e.innerHTML=`
    <picture class="hero__bg-picture">
      <source media="(min-width: 1280px)" srcset="${r} 1x, ${n} 2x" />
      <source media="(min-width: 768px)" srcset="${s} 1x, ${i} 2x" />
      <img
        class="hero__bg"
        src="${t}"
        srcset="${t} 1x, ${o} 2x"
        alt="Cinema hero background"
        fetchpriority="high"
        decoding="async"
        width="1280"
        height="660"
      />
    </picture>

    <div class="hero__overlay">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Let's Make Your Own Cinema</h1>
          <div class="hero__rating"></div>
          <p class="hero__overview">
            ${L(ye)}
          </p>
          <div class="hero__actions">
            <button class="btn btn--primary">Get started</button>
          </div>
        </div>
      </div>
    </div>
  `,(l=e.querySelector(".btn--primary"))==null||l.addEventListener("click",()=>{window.location.href="./catalog.html"})}function $(){const e=document.getElementById("hero");m=!0;const t=a("library-mobile.jpg"),o=a("library-mobile@2x.jpg"),s=a("library-tablet.jpg"),i=a("library-tablet@2x.jpg"),r=a("library-desktop.jpg"),n=a("library-desktop@2x.jpg");e.innerHTML=`
    <picture class="hero__bg-picture">
      <source media="(min-width: 1280px)" srcset="${r} 1x, ${n} 2x" />
      <source media="(min-width: 768px)" srcset="${s} 1x, ${i} 2x" />
      <img
        class="hero__bg"
        src="${t}"
        srcset="${t} 1x, ${o} 2x"
        alt="Library background"
        fetchpriority="high"
        decoding="async"
        width="1280"
        height="660"
      />
    </picture>

    <div class="hero__overlay">
      <div class="container">
        <div class="hero__content">
          <h1 class="hero__title">Create Your Dream Cinema</h1>
          <div class="hero__rating"></div>
          <p class="hero__overview">
            ${L("Is a guide to designing a personalized movie theater experience with the right equipment, customized decor, and favorite films. This guide helps you bring the cinema experience into your own home with cozy seating, dim lighting, and movie theater snacks.")}
          </p>
        </div>
      </div>
    </div>
  `}function Le(e){const t=document.getElementById("hero");if(!t||!e)return;const o=t.querySelector(".btn--primary"),s=t.querySelector(".btn--secondary");o==null||o.addEventListener("click",()=>{ve(e)}),s==null||s.addEventListener("click",()=>{ue(e)})}var c=document.getElementById("teamModalOverlay"),E=document.getElementById("openTeamModal"),A=document.getElementById("closeTeamModal");c&&E&&A&&(E.addEventListener("click",function(){c.classList.remove("hidden"),document.body.style.overflow="hidden"}),A.addEventListener("click",function(){c.classList.add("hidden"),document.body.style.overflow=""}),c.addEventListener("click",function(e){e.target===c&&(c.classList.add("hidden"),document.body.style.overflow="")}),document.addEventListener("keydown",function(e){e.key==="Escape"&&!c.classList.contains("hidden")&&(c.classList.add("hidden"),document.body.style.overflow="")}));export{se as T,be as a,ae as b,Me as c,Se as d,Ae as e,je as f,Ee as g,re as h,ke as i,ue as s};
//# sourceMappingURL=footer-CPeUwMva.js.map
