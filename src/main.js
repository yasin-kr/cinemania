import { initHeader } from './js/header.js';
import { initHero } from './js/hero.js';
import { initUpcoming } from './js/upcoming.js';
import { initWeeklyTrends } from './js/weekly-trends.js';
import './js/footer.js';

// Ana sayfadaki ortak bölümleri tek noktadan başlatıyoruz.
function bootstrapPage() {
  initHeader();
  initHero();
  initUpcoming();
  initWeeklyTrends();
}

// HTML henüz hazır değilse init zincirini DOM yüklendikten sonra çalıştırıyoruz.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapPage, { once: true });
} else {
  bootstrapPage();
}
