# Photo Gallery

An Angular photo library with an infinite random photostream and a persistent Favorites list, built with Angular Material and SCSS.

## Features

- **Photos** (`/`) — an infinite-scrolling grid of random photos from [Lorem Picsum](https://picsum.photos). New pages load automatically as you scroll, with a simulated 200–300ms network delay and a loading indicator. Click a photo to add it to Favorites.
- **Favorites** (`/favorites`) — every photo you've favorited, persisted to `localStorage` so it survives a page refresh. Click a photo to open it full-screen.
- **Single photo** (`/photos/:id`) — a full-screen view of one favorite with a "Remove from favorites" button.
- The header highlights whichever view is currently active.

Infinite scroll is implemented from scratch with the native `IntersectionObserver` API (no third-party scroll library).

## Getting started

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

## Running unit tests

```bash
npm test
```

## Building

```bash
npm run build
```

Build artifacts are written to `dist/photo-gallery`.

## Project structure

```
src/app/
├── components/
│   ├── header/      # nav between Photos and Favorites
│   ├── gallery/      # infinite-scrolling photo grid (Photos page)
│   ├── favorites/    # saved favorites list
│   ├── photo/        # single favorite, full-screen
│   └── image/        # reusable photo tile (loading/error states)
├── services/
│   ├── photo.ts       # simulated random-photo API
│   └── favorites.ts   # favorites state, persisted to localStorage
└── models/
    └── photo.ts        # Photo type
```
