# Cinemania

Cinemania is a multi-page movie discovery application built with Vite and vanilla JavaScript. The project integrates with the TMDB API to provide trending movies, upcoming releases, searchable catalog views, trailer access, and a persistent client-side library.

The repository was developed as a team-based technical project with a shared component structure and page-specific modules. The current implementation is organized around reusable partials, centralized API access, and browser-side state persistence through `localStorage`.

## Functional Scope

The application includes the following user-facing flows:

- Home page with hero, weekly trends, and upcoming movie sections
- Catalog page with search, year filtering, paginated movie results, and empty states
- My Library page with saved movies, genre filtering, progressive loading, and fallback states
- Shared movie detail and trailer modal interactions
- Theme switching with persisted preference
- Shared loader and scroll-up behaviors

## Core Features

- Daily hero selection based on TMDB trending data with fallback rendering
- Weekly trends list rendered from live API data
- Upcoming movie selection for the current month
- Search by keyword and release year
- Paginated catalog rendering using TMDB page responses
- Add to library / remove from library workflow backed by `localStorage`
- Team modal in the footer
- Responsive behavior across mobile, tablet, and desktop breakpoints

## Technical Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite
- Axios
- TMDB API

## Architecture Notes

- `src/js/api.js` is the centralized data access layer for TMDB requests.
- Shared page sections are composed through HTML partials under `src/partials/`.
- Entry pages are `src/index.html`, `src/catalog.html`, and `src/library.html`.
- UI responsibilities are split into focused modules such as hero, catalog, upcoming, weekly trends, footer, and library management.
- Persistent client-side data is stored in `localStorage`.

## Project Structure

```text
src/
  css/          Global and page-level styles
  img/          Static assets
  js/           Feature modules and shared logic
  partials/     Reusable HTML fragments
  index.html    Home page entry
  catalog.html  Catalog page entry
  library.html  My Library page entry
```

## External API Coverage

The project uses TMDB endpoints for:

- trending movies
- upcoming movies
- movie search
- movie details
- movie videos
- movie genres

## Local Development

### Requirements

- Node.js
- npm
- TMDB API key

### Installation

```bash
git clone https://github.com/yasin-kr/cinemania.git
cd cinemania
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_TMDB_KEY=your_tmdb_api_key
```

### Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the project for production.

```bash
npm run preview
```

Serves the production build locally for verification.

## Team

Cinemania was developed as a collaborative team project.

- Yasin Kara - Team Leader, Developer
- Omer Faruk Yildirim - Developer
- Gizem Nur Avci - Developer
- Ubeydullah Yasir Yurtseven - Developer
- Aylin Gunes Buyukasman - Developer

## References

- [TMDB](https://www.themoviedb.org/)
- [TMDB Developer Documentation](https://developer.themoviedb.org/docs)

