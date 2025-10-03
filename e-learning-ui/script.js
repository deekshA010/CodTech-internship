// E‑Learning Platform UI script
// Simple front-end state with mock data and localStorage-based progress

(function () {
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  const YEAR_EL = $('#year');
  if (YEAR_EL) YEAR_EL.textContent = new Date().getFullYear();

  // Theme toggle with persistence
  const THEME_KEY = 'elearn_theme_v1';
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('#themeToggle');
    if (btn) btn.textContent = theme === 'light' ? '🌞' : '🌙';
  }
  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }
  // initialize
  applyTheme(getPreferredTheme());
  const toggleBtn = $('#themeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Mock data
  const courses = [
    {
      id: 'js-basics',
      title: 'JavaScript Basics',
      category: 'Programming',
      description: 'Learn the fundamentals of JavaScript: variables, control flow, and functions.',
      thumbnail: 'https://picsum.photos/seed/js-basics/800/450',
      lessons: [
        { id: 'l1', title: 'Intro to JS', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
        { id: 'l2', title: 'Variables & Types', videoUrl: 'https://www.youtube.com/embed/zh2yL4lY9kc' },
        { id: 'l3', title: 'Functions', videoUrl: 'https://www.youtube.com/embed/SHINoHxvTso' }
      ]
    },
    {
      id: 'react-intro',
      title: 'Intro to React',
      category: 'Frontend',
      description: 'Get started with React components, props, and state.',
      thumbnail: 'https://picsum.photos/seed/react-intro/800/450',
      lessons: [
        { id: 'l1', title: 'What is React?', videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM' },
        { id: 'l2', title: 'Components & Props', videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0' }
      ]
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Fundamentals',
      category: 'Design',
      description: 'Core concepts of user interface and user experience design.',
      thumbnail: 'https://picsum.photos/seed/ui-ux/800/450',
      lessons: [
        { id: 'l1', title: 'Design Principles', videoUrl: 'https://www.youtube.com/embed/_f76jK4dTh0' },
        { id: 'l2', title: 'Accessibility Basics', videoUrl: 'https://www.youtube.com/embed/2-az4b2W0y8' },
        { id: 'l3', title: 'Visual Hierarchy', videoUrl: 'https://www.youtube.com/embed/lW62Eo2wI0Y' }
      ]
    },
    {
      id: 'python-data',
      title: 'Python for Data Science',
      category: 'Data Science',
      description: 'Numpy, Pandas, and data wrangling essentials to prepare datasets for analysis.',
      thumbnail: 'https://picsum.photos/seed/python-data/800/450',
      lessons: [
        { id: 'l1', title: 'Intro to Pandas', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg' },
        { id: 'l2', title: 'Data Cleaning', videoUrl: 'https://www.youtube.com/embed/efO7N5v6M1M' },
        { id: 'l3', title: 'Merging & Joining', videoUrl: 'https://www.youtube.com/embed/0C7S3n4h8h8' }
      ]
    },
    {
      id: 'node-api',
      title: 'Node.js REST APIs',
      category: 'Backend',
      description: 'Build REST APIs with Express, middleware, and authentication basics.',
      thumbnail: 'https://picsum.photos/seed/node-api/800/450',
      lessons: [
        { id: 'l1', title: 'Express Basics', videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE' },
        { id: 'l2', title: 'Routing & Middleware', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48' },
        { id: 'l3', title: 'Auth Intro', videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4' }
      ]
    },
    {
      id: 'cybersec',
      title: 'Cybersecurity Basics',
      category: 'Security',
      description: 'Understand core security concepts: OWASP, passwords, and network basics.',
      thumbnail: 'https://picsum.photos/seed/cybersec/800/450',
      lessons: [
        { id: 'l1', title: 'OWASP Top 10 Overview', videoUrl: 'https://www.youtube.com/embed/XkSESi_5Czs' },
        { id: 'l2', title: 'Network Security 101', videoUrl: 'https://www.youtube.com/embed/2aHkq-ONfVE' }
      ]
    }
  ];

  const STORAGE_KEY = 'elearn_progress_v1';

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  }
  function saveProgress(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }
  function getCourseProgress(courseId) {
    const data = loadProgress();
    return data[courseId] || { completed: [] };
  }
  function setCourseProgress(courseId, progress) {
    const data = loadProgress();
    data[courseId] = progress;
    saveProgress(data);
  }
  function computePercent(course) {
    const p = getCourseProgress(course.id);
    const total = course.lessons.length;
    const done = p.completed.length;
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }

  // Render helpers
  function renderCoursesGrid(list) {
    const grid = $('#coursesGrid');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '<p style="color:#9aa4bf">No courses found.</p>';
      return;
    }
    grid.innerHTML = list.map(c => {
      const pct = computePercent(c);
      return `
        <article class="card" data-id="${c.id}">
          <div class="thumb">${c.thumbnail ? `<img src="${c.thumbnail}" alt="${c.title} thumbnail" loading="lazy" />` : '16:9 Thumbnail'}</div>
          <div class="body">
            <h3>${c.title}</h3>
            <div class="meta"><span>${c.category}</span> • <span>${c.lessons.length} lessons</span></div>
            <p style="margin:0;color:#cbd5e1">${c.description}</p>
            <div class="progress" aria-label="${pct}% completed"><span style="width:${pct}%"></span></div>
          </div>
          <div class="actions">
            <a class="btn" href="course.html?id=${encodeURIComponent(c.id)}">View Course</a>
            <a class="btn secondary" href="dashboard.html">Dashboard</a>
          </div>
        </article>`;
    }).join('');
  }

  function populateCategories(list) {
    const select = $('#categorySelect');
    if (!select) return;
    const cats = Array.from(new Set(list.map(c => c.category))).sort();
    for (const c of cats) {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    }
  }

  function renderCategoryChips(list) {
    const chipsWrap = $('#categoryChips');
    if (!chipsWrap) return;
    const cats = Array.from(new Set(list.map(c => c.category))).sort();
    chipsWrap.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'chip';
    allBtn.textContent = 'All';
    allBtn.type = 'button';
    allBtn.setAttribute('aria-pressed', 'true');
    chipsWrap.appendChild(allBtn);
    for (const c of cats) {
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.type = 'button';
      btn.textContent = c;
      btn.setAttribute('aria-pressed', 'false');
      chipsWrap.appendChild(btn);
    }
  }

  function renderContinueLearning(list) {
    const section = $('#continueSection');
    const grid = $('#continueGrid');
    if (!section || !grid) return;
    const inProgress = list.filter(c => {
      const pct = computePercent(c);
      return pct > 0 && pct < 100;
    }).slice(0, 6);
    if (!inProgress.length) {
      section.style.display = 'none';
      grid.innerHTML = '';
      return;
    }
    section.style.display = '';
    grid.innerHTML = inProgress.map(c => {
      const pct = computePercent(c);
      return `
        <article class="card" data-id="${c.id}">
          <div class="thumb">${c.thumbnail ? `<img src="${c.thumbnail}" alt="${c.title} thumbnail" loading="lazy" />` : '16:9 Thumbnail'}</div>
          <div class="body">
            <h3>${c.title}</h3>
            <div class="meta"><span>${c.category}</span> • <span>${c.lessons.length} lessons</span></div>
            <div class="progress" aria-label="${pct}% completed"><span style="width:${pct}%"></span></div>
          </div>
          <div class="actions">
            <a class="btn" href="course.html?id=${encodeURIComponent(c.id)}">Continue</a>
          </div>
        </article>`;
    }).join('');
  }

  function initHome() {
    populateCategories(courses);
    renderCategoryChips(courses);
    const search = $('#searchInput');
    const category = $('#categorySelect');
    const chipsWrap = $('#categoryChips');

    function applyFilters() {
      const q = (search.value || '').toLowerCase().trim();
      const cat = category.value;
      const filtered = courses.filter(c => {
        const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
        const matchesCat = !cat || c.category === cat;
        return matchesQuery && matchesCat;
      });
      renderCoursesGrid(filtered);
      renderContinueLearning(courses);
    }

    search && search.addEventListener('input', applyFilters);
    category && category.addEventListener('change', applyFilters);
    // Chip interactions
    if (chipsWrap) {
      chipsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        // set pressed state
        $$('.chip', chipsWrap).forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        // update select and filter
        const label = btn.textContent;
        category.value = (label === 'All') ? '' : label;
        applyFilters();
      });
    }
    applyFilters();
  }

  function qs(key) {
    const url = new URL(location.href);
    return url.searchParams.get(key);
  }

  function initCourse() {
    const id = qs('id');
    const course = courses.find(c => c.id === id) || courses[0];
    if (!course) return;

    const titleEl = $('#courseTitle');
    const catEl = $('#courseCategory');
    const descEl = $('#courseDescription');
    const iframe = $('#playerIframe');
    const lessonSelect = $('#lessonSelect');
    const progressBar = $('#progressBar');
    const progressText = $('#progressText');
    const markBtn = $('#markCompleteBtn');

    titleEl.textContent = course.title;
    catEl.textContent = course.category;
    descEl.textContent = course.description;

    // Lessons
    lessonSelect.innerHTML = '';
    for (const l of course.lessons) {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = l.title;
      lessonSelect.appendChild(opt);
    }
    function loadLesson(lessonId) {
      const lesson = course.lessons.find(l => l.id === lessonId) || course.lessons[0];
      iframe.src = lesson.videoUrl;
    }

    lessonSelect.addEventListener('change', (e) => loadLesson(e.target.value));
    // Load first
    loadLesson(course.lessons[0].id);

    function updateProgressUI() {
      const percent = computePercent(course);
      progressBar.style.width = percent + '%';
      progressText.textContent = `${percent}% complete`;
    }

    markBtn.addEventListener('click', () => {
      const currentLessonId = lessonSelect.value;
      const cp = getCourseProgress(course.id);
      if (!cp.completed.includes(currentLessonId)) {
        cp.completed.push(currentLessonId);
        setCourseProgress(course.id, cp);
        updateProgressUI();
      }
    });

    updateProgressUI();

    const dash = $('#dashboardLink');
    if (dash) dash.href = 'dashboard.html';
  }

  function initDashboard() {
    const tbody = $('#dashboardTable tbody');
    tbody.innerHTML = courses.map(c => {
      const pct = computePercent(c);
      return `
        <tr>
          <td>${c.title}</td>
          <td>${c.category}</td>
          <td>${c.lessons.length}</td>
          <td>
            <div class="progress" aria-label="${pct}% completed" style="max-width:240px"><span style="width:${pct}%"></span></div>
          </td>
          <td><a class="btn" href="course.html?id=${encodeURIComponent(c.id)}">Continue</a></td>
        </tr>`;
    }).join('');
  }

  // Router
  const page = document.documentElement.dataset.page;
  if (page === 'home') initHome();
  if (page === 'course') initCourse();
  if (page === 'dashboard') initDashboard();
})();
