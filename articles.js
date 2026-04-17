// ── ARTICLE ENGINE ────────────────────────────────────────────────────────────
// Reads markdown files from GitHub and renders them dynamically
// Articles are stored in /_articles/ folder by Netlify CMS

const REPO = 'yazarafa124/Logistics-Magazine';
const BRANCH = 'main';
const ARTICLES_PATH = '_articles';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const API_BASE = `https://api.github.com/repos/${REPO}/contents/${ARTICLES_PATH}`;

// Parse frontmatter from markdown
function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text };
  
  const data = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    data[key] = val;
  });
  
  return { data, content: match[2].trim() };
}

// Convert markdown body to HTML
function markdownToHTML(md) {
  const lines = md.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith('## ')) {
      html += `<h2>${line.slice(3)}</h2>\n`;
      i++; continue;
    }
    // H3
    if (line.startsWith('### ')) {
      html += `<h3>${line.slice(4)}</h3>\n`;
      i++; continue;
    }

    // Pull quote — blockquote followed by attribution line starting with —
    if (line.startsWith('> ')) {
      const quote = line.slice(2);
      let attribution = '';
      if (lines[i+1] && lines[i+1].startsWith('> — ')) {
        attribution = lines[i+1].slice(4);
        i++;
      } else if (lines[i+1] && lines[i+1].startsWith('— ')) {
        attribution = lines[i+1].slice(2);
        i++;
      }
      html += `<div class="article-pull-quote">
        <blockquote>${quote}</blockquote>
        ${attribution ? `<cite>— ${attribution}</cite>` : ''}
      </div>\n`;
      i++; continue;
    }

    // Data block — lines like: 776,000 m² | Terminal Area
    if (line.includes(' | ') && lines[i+1] && lines[i+1].includes(' | ')) {
      const dataItems = [];
      while (i < lines.length && lines[i].includes(' | ')) {
        const parts = lines[i].split(' | ');
        if (parts.length >= 2) {
          dataItems.push({ value: parts[0].trim(), label: parts[1].trim() });
        }
        i++;
      }
      if (dataItems.length > 0) {
        html += `<div class="article-data-block">
          ${dataItems.map(d => `
            <div class="data-item">
              <span class="data-value">${d.value}</span>
              <span class="data-label">${d.label}</span>
            </div>`).join('')}
        </div>\n`;
      }
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      html += `<hr style="border:none;border-top:0.5px solid rgba(0,0,0,0.1);margin:2rem 0">\n`;
      i++; continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++; continue;
    }

    // Regular paragraph — collect consecutive non-special lines
    let para = '';
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('>') && !lines[i].match(/^---+$/)) {
      let l = lines[i]
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      para += (para ? ' ' : '') + l;
      i++;
    }
    if (para) html += `<p>${para}</p>\n`;
  }

  return html;
}

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Slug from filename
function slugFromFilename(filename) {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

// Fetch all articles from GitHub
async function fetchArticles() {
  try {
    // Try GitHub API first
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('API failed');
    const files = await res.json();
    if (!Array.isArray(files)) throw new Error('Not array');
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    
    const articles = await Promise.all(mdFiles.map(async file => {
      const raw = await fetch(`${RAW_BASE}/${ARTICLES_PATH}/${file.name}`);
      const text = await raw.text();
      const { data, content } = parseFrontmatter(text);
      return {
        slug: slugFromFilename(file.name),
        filename: file.name,
        title: data.title || 'Untitled',
        category: data.category || 'Intelligence',
        author: data.author || 'Logistics Magazine',
        date: data.date || '',
        readTime: data.readTime || '5 min',
        featured: data.featured === 'true',
        heroImage: data.heroImage || null,
        lead: data.lead || '',
        content,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : []
      };
    }));
    
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch(e) {
    console.warn('GitHub API failed, trying direct fetch:', e);
    return [];
  }
}

// Fetch single article by slug — tries direct raw URL first
async function fetchArticleBySlug(slug) {
  // Build possible filename patterns
  const today = new Date();
  const dates = [
    '2026-04-17',
    '2026-04-18',
    today.toISOString().slice(0,10)
  ];
  
  const filenames = [...new Set([
    ...dates.map(d => `${d}-${slug}.md`),
    `${slug}.md`
  ])];

  for (const filename of filenames) {
    try {
      const url = `${RAW_BASE}/${ARTICLES_PATH}/${filename}`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const { data, content } = parseFrontmatter(text);
        return {
          slug,
          filename,
          title: data.title || 'Untitled',
          category: data.category || 'Intelligence',
          author: data.author || 'Logistics Magazine',
          date: data.date || '',
          readTime: data.readTime ? data.readTime + ' min' : '5 min',
          featured: data.featured === 'true',
          heroImage: data.heroImage || null,
          lead: data.lead || '',
          content,
          tags: data.tags ? data.tags.split(',').map(t => t.trim()) : []
        };
      }
    } catch(e) { continue; }
  }

  // Last resort: GitHub API listing
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      const files = await res.json();
      if (Array.isArray(files)) {
        const match = files.find(f => f.name.endsWith('.md') && slugFromFilename(f.name) === slug);
        if (match) {
          const raw = await fetch(`${RAW_BASE}/${ARTICLES_PATH}/${match.name}`);
          if (raw.ok) {
            const text = await raw.text();
            const { data, content } = parseFrontmatter(text);
            return {
              slug,
              filename: match.name,
              title: data.title || 'Untitled',
              category: data.category || 'Intelligence',
              author: data.author || 'Logistics Magazine',
              date: data.date || '',
              readTime: data.readTime ? data.readTime + ' min' : '5 min',
              featured: data.featured === 'true',
              heroImage: data.heroImage || null,
              lead: data.lead || '',
              content,
              tags: data.tags ? data.tags.split(',').map(t => t.trim()) : []
            };
          }
        }
      }
    }
  } catch(e) {}

  return null;
}

// ── RENDER INSIGHTS PAGE ─────────────────────────────────────────────────────
async function renderInsightsPage() {
  const grid = document.getElementById('insights-page-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="articles-loading">Loading articles...</div>';

  const articles = await fetchArticles();

  if (articles.length === 0) {
    grid.innerHTML = '<div class="articles-empty">No articles published yet.</div>';
    return;
  }

  grid.innerHTML = '';

  articles.forEach((article, i) => {
    const div = document.createElement('div');
    div.className = `insight-page-card reveal ${i === 0 ? 'insight-featured-card' : ''}`;
    div.style.transitionDelay = `${i * 0.06}s`;
    div.innerHTML = `
      <div class="insight-category">${article.category}</div>
      <h3>${article.title}</h3>
      ${article.lead ? `<p>${article.lead.slice(0, 120)}...</p>` : ''}
      <div class="insight-meta">
        <span>${formatDate(article.date)}</span>
        <span class="meta-dot">·</span>
        <span>${article.readTime} read</span>
      </div>
      <a href="article.html?slug=${article.slug}" class="insight-link">Read Full Article →</a>
    `;
    grid.appendChild(div);
  });

  // Re-trigger reveal
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('hidden'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.remove('hidden'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }, 100);
}

// ── RENDER ARTICLE PAGE ───────────────────────────────────────────────────────
async function renderArticlePage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  
  if (!slug) {
    document.getElementById('article-dynamic-content').innerHTML = '<p>Article not found.</p>';
    return;
  }

  // Show loading
  document.getElementById('article-dynamic-content').innerHTML = `
    <div class="article-loading">
      <div class="loading-bar"></div>
      <p>Loading article...</p>
    </div>`;

  const article = await fetchArticleBySlug(slug);

  if (!article) {
    document.getElementById('article-dynamic-content').innerHTML = '<p>Article not found.</p>';
    return;
  }

  // Update page title
  document.title = `${article.title} — Logistics Magazine`;

  // Update hero
  const heroEl = document.getElementById('article-hero-dynamic');
  if (heroEl) {
    heroEl.innerHTML = `
      <div class="article-hero-image">
        ${article.heroImage 
          ? `<img src="${article.heroImage}" alt="${article.title}">`
          : `<div class="article-hero-img-placeholder"><div class="placeholder-label">[ ${article.category} ]</div></div>`
        }
        <div class="article-hero-overlay"></div>
      </div>
      <div class="article-hero-content">
        <div class="article-meta-top">
          <span class="article-category">${article.category}</span>
          <span class="article-meta-dot">·</span>
          <span class="article-read-time">${article.readTime} read</span>
        </div>
        <h1 class="article-title">${article.title}</h1>
        <div class="article-byline">
          <div class="article-author-avatar">${article.author.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div class="article-author-info">
            <span class="article-author-name">${article.author}</span>
            <span class="article-publish-date">${formatDate(article.date)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Update sidebar
  const sidebarEl = document.getElementById('article-sidebar-dynamic');
  if (sidebarEl && article.tags.length > 0) {
    sidebarEl.querySelector('.tag-list').innerHTML = 
      article.tags.map(t => `<span class="tag">${t}</span>`).join('');
  }

  // Render body
  const bodyEl = document.getElementById('article-dynamic-content');
  const bodyHTML = markdownToHTML(article.content);
  
  bodyEl.innerHTML = `
    ${article.lead ? `<p class="article-lead">${article.lead}</p>` : ''}
    ${bodyHTML}
    <div class="article-footer-meta">
      <div class="article-footer-source">
        <span class="footer-label">Published by</span>
        <span class="footer-source">${article.author} · ${formatDate(article.date)}</span>
      </div>
      <div class="article-share-row">
        <span class="footer-label">Share</span>
        <div class="share-links" style="flex-direction:row">
          <a href="https://www.linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">LinkedIn</a>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}" target="_blank" class="share-btn">X / Twitter</a>
          <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href);this.textContent='Copied!'">Copy Link</button>
        </div>
      </div>
    </div>
  `;

  // Fetch related articles
  const allArticles = await fetchArticles();
  const related = allArticles.filter(a => a.slug !== slug).slice(0, 3);
  const relatedGrid = document.querySelector('.related-grid');
  if (relatedGrid && related.length > 0) {
    relatedGrid.innerHTML = related.map(a => `
      <a href="article.html?slug=${a.slug}" class="related-card">
        <div class="related-category">${a.category}</div>
        <h3>${a.title}</h3>
        <div class="related-meta">${formatDate(a.date)} · ${a.readTime} read</div>
      </a>
    `).join('');
  }
}

// ── RENDER HOMEPAGE ARTICLES ──────────────────────────────────────────────────
async function renderHomepageArticles() {
  const grid = document.getElementById('insights-grid');
  if (!grid) return;

  const articles = await fetchArticles();
  if (articles.length === 0) return; // Keep placeholder cards if no articles

  grid.innerHTML = '';

  const toShow = articles.slice(0, 6);
  toShow.forEach((article, i) => {
    const isFeatured = i === 0;
    const div = document.createElement('div');
    div.className = `insight-card reveal ${isFeatured ? 'insight-featured' : ''}`;
    div.style.transitionDelay = `${i * 0.08}s`;
    div.innerHTML = `
      <div class="insight-category">${article.category}</div>
      <h3 class="insight-title">${article.title}</h3>
      <div class="insight-meta">
        <span>${formatDate(article.date)}</span>
        <span class="meta-dot">·</span>
        <span>${article.readTime} read</span>
      </div>
      <a href="article.html?slug=${article.slug}" class="insight-link">Read →</a>
    `;
    grid.appendChild(div);
  });
}
