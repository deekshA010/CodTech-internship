# E‑Learning Platform UI

A styled, interactive, multi‑page front‑end for an e‑learning platform. Includes course listing, video embedding per lesson, and progress tracking with localStorage.

## Structure
```
e-learning-ui/
  index.html        # Course listing with search and category filter
  course.html       # Video player page with lesson selector and progress controls
  dashboard.html    # Overview of progress across all courses
  styles.css        # Shared responsive styles
  script.js         # Client-side logic, mock data, and localStorage progress
```

## Features
- Course listing with search and category filter
- Course detail page with embedded videos (YouTube iframes), lesson selector, and "mark complete"
- Dashboard page summarizing progress across courses
- Responsive layout and accessible controls

## Usage
- Open `index.html` to browse courses.
- Click "View Course" on any card to open `course.html`.
- Use the "Mark lesson complete" button to track progress.
- Open `dashboard.html` to see overall progress.

No build step is required—these are static files you can open directly in a browser or serve via any static file server.
