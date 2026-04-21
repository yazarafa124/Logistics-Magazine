// ── ARTICLE ENGINE v2 ─────────────────────────────────────────────────────────
// Reads from local articles.json — no external API, no CORS issues

let ARTICLES_CACHE = null;

async function getArticles() {
  if (ARTICLES_CACHE) return ARTICLES_CACHE;
  try {
    const res = await fetch('/articles.json?v=' + Date.now());
    if (!res.ok) throw new Error('Could not load articles.json');
    const data = await res.json();
    ARTICLES_CACHE = data.articles;
    return ARTICLES_CACHE;
  } catch(e) {
    console.error('Article load error:', e);
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function renderInsightsPage() {
  const grid = document.getElementById('insights-page-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="padding:3rem;color:#999;font-family:Jost,sans-serif;font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase">Loading...</div>';
  const articles = await getArticles();
  if (!articles.length) {
    grid.innerHTML = '<div style="padding:3rem;color:#aaa;font-family:\'Cormorant Garamond\',serif;font-size:1.1rem">No articles published yet.</div>';
    return;
  }
  grid.innerHTML = '';
  articles.forEach((article, i) => {
    const div = document.createElement('div');
    div.className = 'insight-page-card reveal';
    div.style.transitionDelay = i * 0.06 + 's';
    div.innerHTML = '<div class="insight-category">' + article.category + '</div><h3>' + article.title + '</h3>' + (article.lead ? '<p>' + article.lead.slice(0,140) + '...</p>' : '') + '<div class="insight-meta"><span>' + formatDate(article.date) + '</span><span class="meta-dot">·</span><span>' + article.readTime + ' read</span></div><a href="article.html?slug=' + article.slug + '" class="insight-link">Read Full Article →</a>';
    grid.appendChild(div);
  });
}

async function renderArticlePage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) { document.getElementById('article-dynamic-content').innerHTML = '<p>No article specified.</p>'; return; }
  const articles = await getArticles();
  const article = articles.find(function(a) { return a.slug === slug; });
  if (!article) { document.getElementById('article-dynamic-content').innerHTML = '<p>Article not found. Slug: ' + slug + '</p>'; return; }
  document.title = article.title + ' — Logistics Magazine';
  var heroEl = document.getElementById('article-hero-dynamic');
  if (heroEl) {
    heroEl.innerHTML = '<div class="article-hero-image">' + (article.heroImage ? '<img src="' + article.heroImage + '" alt="' + article.title + '" style="width:100%;height:100%;object-fit:cover">' : '<div class="article-hero-img-placeholder"><div class="placeholder-label">[ ' + article.category + ' ]</div></div>') + '<div class="article-hero-overlay"></div></div><div class="article-hero-content"><div class="article-meta-top"><span class="article-category">' + article.category + '</span><span class="article-meta-dot">·</span><span class="article-read-time">' + article.readTime + ' read</span></div><h1 class="article-title">' + article.title + '</h1><div class="article-byline"><div class="article-author-avatar">' + article.author.split(' ').map(function(w){return w[0];}).join('').slice(0,2) + '</div><div class="article-author-info"><span class="article-author-name">' + article.author + '</span><span class="article-publish-date">' + formatDate(article.date) + '</span></div></div></div>';
  }
  var tagList = document.getElementById('tag-list');
  if (tagList && article.tags) { tagList.innerHTML = article.tags.map(function(t){return '<span class="tag">'+t+'</span>';}).join(''); }
  var bodyEl = document.getElementById('article-dynamic-content');
  bodyEl.innerHTML = (article.lead ? '<p class="article-lead">' + article.lead + '</p>' : '') + (article.body || '') + '<div class="article-footer-meta"><div class="article-footer-source"><span class="footer-label">Published by</span><span class="footer-source">' + article.author + ' · ' + formatDate(article.date) + '</span></div></div>';
  var relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    var related = articles.filter(function(a){return a.slug !== slug;}).slice(0,3);
    relatedGrid.innerHTML = related.map(function(a){ return '<a href="article.html?slug=' + a.slug + '" class="related-card"><div class="related-category">' + a.category + '</div><h3>' + a.title + '</h3><div class="related-meta">' + formatDate(a.date) + ' · ' + a.readTime + ' read</div></a>'; }).join('');
  }
}

async function renderHomepageArticles() {
  var grid = document.getElementById('insights-grid');
  if (!grid) return;
  var articles = await getArticles();
  if (!articles.length) return;
  grid.innerHTML = '';
  articles.slice(0,6).forEach(function(article, i) {
    var div = document.createElement('div');
    div.className = 'insight-card reveal' + (i === 0 ? ' insight-featured' : '');
    div.style.transitionDelay = i * 0.08 + 's';
    div.innerHTML = '<div class="insight-category">' + article.category + '</div><h3 class="insight-title">' + article.title + '</h3><div class="insight-meta"><span>' + formatDate(article.date) + '</span><span class="meta-dot">·</span><span>' + article.readTime + ' read</span></div><a href="article.html?slug=' + article.slug + '" class="insight-link">Read →</a>';
    grid.appendChild(div);
  });
