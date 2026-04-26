// ── SHARED COMPONENTS ────────────────────────────────────────────────────────

function renderNav() {
  return `
  <div class="top-bar">
    <div class="top-bar-inner">
      <a href="index.html" class="top-bar-logo">
        <img src="logo-4k.png" alt="Logistics Magazine">
      </a>
      <div class="top-bar-links">
        <a href="events.html" class="top-bar-link">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Calendar
        </a>
        <a href="partners.html" class="top-bar-link">Partners</a>
        <a href="advisory.html" class="top-bar-link">Advisory Board</a>
        <a href="contact.html" class="top-bar-link">Contact Us</a>
      </div>
    </div>
  </div>
  <nav>
    <a href="index.html" class="nav-logo"><img src="logo-4k.png" alt="Logistics Magazine"></a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li class="nav-dropdown">
        <a href="about.html" class="nav-dropdown-toggle">
          About
          <svg class="dropdown-arrow" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </a>
        <div class="nav-dropdown-menu">
          <a href="advisory.html">Advisory Board</a>
          <a href="partners.html">Strategic Partners</a>
        </div>
      </li>
      <li><a href="issues.html">The Magazine</a></li>
      <li><a href="insights.html">Interviews</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="awards.html">Awards 2026</a></li>
    </ul>
    <a href="#subscribe" class="nav-cta">Subscribe</a>
    <button class="nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="mobile-nav">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="advisory.html" style="font-size:1.2rem;padding-left:1rem;opacity:0.6">Advisory Board</a>
    <a href="partners.html" style="font-size:1.2rem;padding-left:1rem;opacity:0.6">Strategic Partners</a>
    <a href="issues.html">The Magazine</a>
    <a href="insights.html">Interviews</a>
    <a href="events.html">Events</a>
    <a href="awards.html">Awards 2026</a>
    <a href="contact.html">Contact</a>
  </div>`;
}

function renderTicker() {
  const items = [
    "Egypt's Red Sea trade volume increases 18% in Q1 2026",
    "Rotterdam announces €2.4B green port infrastructure investment",
    "IMO 2026 carbon targets enter enforcement phase",
    "Suez Canal Authority records highest single-day transit revenue",
    "Singapore MPA launches autonomous vessel regulatory framework",
    "Dubai Maritime City expands to new logistics free zone",
    "West Africa Ports Consortium signs Pan-African trade agreement"
  ];
  const doubled = [...items, ...items];
  return `
  <div class="ticker-wrap">
    <span class="ticker-label">Latest</span>
    <div class="ticker">
      ${doubled.map(t => `<span>${t}</span>`).join('')}
    </div>
  </div>`;
}

function renderFooter() {
  return `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="logo-4k.png" alt="Logistics Magazine" style="height:30px;opacity:0.85;margin-bottom:1rem">
        <p>The leading specialised magazine providing in-depth analysis and expert perspectives on global logistics, sea freight, and supply chain sectors.</p>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="issues.html">The Magazine</a></li>
          <li><a href="insights.html">Interviews</a></li>
          <li><a href="awards.html">Awards 2026</a></li>
          <li><a href="events.html">Events & Training</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="advisory.html">Advisory Board</a></li>
          <li><a href="partners.html">Partners</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Subscribe</h4>
        <ul>
          <li><a href="#subscribe">Newsletter</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Logistics Magazine. All rights reserved.</p>
      <p style="color:var(--green-bright);font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase">Shaping the Future of Arab Logistics.</p>
    </div>
  </footer>`;
}

function initComponents() {
  const navEl = document.getElementById('nav-placeholder');
  const tickerEl = document.getElementById('ticker-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  if (navEl) navEl.innerHTML = renderNav();
  if (tickerEl) tickerEl.innerHTML = renderTicker();
  if (footerEl) footerEl.innerHTML = renderFooter();
}

document.addEventListener('DOMContentLoaded', initComponents);
