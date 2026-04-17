// ── CONTENT CONFIG ── Edit this to update site content ──────────────────────
const CONFIG = {
  featureCharacter: {
    name: "[FEATURE NAME]",
    title: "[Title, Organisation]",
    quote: "[Insert cover quote from featured executive — pulled from interview]",
    issue: "Issue No. [X] · [Month] 2026",
    image: null
  },
  stats: [
    { value: "[X,XXX+]", label: "Global Subscribers" },
    { value: "[XX]", label: "Nations Reached" },
    { value: "[XXX+]", label: "Exclusive Interviews" },
    { value: "9", label: "Award Categories" }
  ],
  latestInsights: [
    { category: "Port Strategy", title: "Why Egypt's Red Sea Corridor is the Most Undervalued Asset in Global Trade", date: "April 2026", readTime: "12 min" },
    { category: "Maritime Law", title: "Liability Without Precedent: The Legal Void in Autonomous Shipping", date: "March 2026", readTime: "9 min" },
    { category: "Executive Dialogue", title: "Kamel Al-Wazir on Egypt's Industrial Transformation — A Private Interview", date: "March 2026", readTime: "15 min" },
    { category: "Supply Chain", title: "The Decoupling of Global Hubs: How Regional Logistics Powers Are Emerging", date: "February 2026", readTime: "11 min" },
    { category: "Green Logistics", title: "Carbon Compliance in 2026: Who Is Paying the Price and Who Is Profiting", date: "February 2026", readTime: "8 min" },
    { category: "Awards Preview", title: "The Gold List 2026: Nominations Are Open Across Nine Categories", date: "January 2026", readTime: "4 min" },
  ],
  advisoryBoard: [
    { name: "[Board Member Name]", title: "[Title, Organisation]", country: "[Country]", linkedin: "#" },
    { name: "[Board Member Name]", title: "[Title, Organisation]", country: "[Country]", linkedin: "#" },
    { name: "[Board Member Name]", title: "[Title, Organisation]", country: "[Country]", linkedin: "#" },
    { name: "[Board Member Name]", title: "[Title, Organisation]", country: "[Country]", linkedin: "#" },
    { name: "[Board Member Name]", title: "[Title, Organisation]", country: "[Country]", linkedin: "#" },
    { name: "[Board Member Name]", title: "[Title, Organisation]", country: "[Country]", linkedin: "#" },
  ],
  events: [
    { date: "MAY 14", city: "SINGAPORE", title: "Maritime Digital Forum 2026", desc: "Exploring digital twin adoption and autonomous vessel regulation across Southeast Asian shipping lanes.", type: "Conference" },
    { date: "JUN 02", city: "ROTTERDAM", title: "Sustainable Freight 2026", desc: "The premier European summit on decarbonisation strategies and green port infrastructure investment.", type: "Summit" },
    { date: "JUN 22", city: "NEW YORK", title: "Supply Chain Resilience Workshop", desc: "Closed-door executive session on nearshoring, geopolitical risk, and diversified sourcing strategy.", type: "Workshop" },
    { date: "SEP 10", city: "MONACO", title: "Logistics Awards Gala 2026", desc: "The Gold List awards ceremony celebrating excellence across nine categories of global logistics and maritime trade.", type: "Awards" },
    { date: "OCT 07", city: "CAIRO", title: "Egypt Maritime Summit", desc: "Inaugural high-level dialogue between Egyptian government, port authorities, and international logistics leaders.", type: "Summit" },
    { date: "NOV 18", city: "SHANGHAI", title: "Belt & Road Symposium", desc: "Annual forum on trade route development, infrastructure financing, and Sino-African logistics corridors.", type: "Forum" },
  ],
  awards: [
    { title: "Maritime Lawyer of the Year", desc: "Recognising exceptional legal expertise in maritime, shipping, and international trade law." },
    { title: "Logistics Executive of the Year", subtitle: "Private Sector", desc: "Honouring visionary leadership that has measurably advanced logistics excellence in the private sector." },
    { title: "Excellence in Public Service", subtitle: "Government & Port Authorities", desc: "Celebrating government officials and port authority leaders who have transformed infrastructure and policy." },
    { title: "Rising Star Award", subtitle: "Under 35", desc: "Honouring the next generation of innovators reshaping the future of global trade and logistics." },
    { title: "Best Shipping Line", subtitle: "Sea Freight", desc: "Recognising the shipping company demonstrating outstanding performance, reliability, and customer service." },
    { title: "Best Inland Transport Company", desc: "Awarded to the land logistics operator delivering consistent excellence across regional or global operations." },
    { title: "Supply Chain Innovation Award", desc: "For the organisation introducing breakthrough technology or methodology that redefines supply chain performance." },
    { title: "Green Logistics Award", desc: "Recognising commitment to environmental sustainability, carbon reduction, and responsible logistics practices." },
    { title: "Lifetime Achievement Award", desc: "The most prestigious recognition — awarded to an individual whose career has fundamentally shaped global logistics." },
  ],
  digitalIssues: [
    { issue: "No. 12", title: "The Architecture of Commerce", date: "April 2026", color: "#1e3a14" },
    { issue: "No. 11", title: "Beyond the Final Mile", date: "March 2026", color: "#1a2e10" },
    { issue: "No. 10", title: "Digital Logistics: Beyond Crypto", date: "February 2026", color: "#162608" },
    { issue: "No. 09", title: "The Decoupling of Global Hubs", date: "January 2026", color: "#111f06" },
    { issue: "No. 08", title: "Material Ethics: Future Sourcing", date: "December 2025", color: "#0e1a05" },
    { issue: "No. 07", title: "Beyond Vertical Hubs", date: "November 2025", color: "#0b1503" },
  ],
  partners: [
    "[Partner Organisation Name]",
    "[Partner Organisation Name]",
    "[Partner Organisation Name]",
    "[Partner Organisation Name]",
    "[Partner Organisation Name]",
    "[Partner Organisation Name]",
  ],
  ticker: [
    "Egypt's Red Sea trade volume increases 18% in Q1 2026",
    "Rotterdam announces €2.4B green port infrastructure investment",
    "IMO 2026 carbon targets enter enforcement phase",
    "Suez Canal Authority records highest single-day transit revenue",
    "Singapore MPA launches autonomous vessel regulatory framework",
    "Dubai Maritime City expands to new logistics free zone",
    "West Africa Ports Consortium signs Pan-African trade agreement",
  ]
};

// ── CURSOR ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  function animFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      follower.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });

  // ── HIDE-ON-SCROLL NAV ────────────────────────────────────────────────────
  let lastY = 0;
  const nav = document.querySelector('nav');
  const topBar = document.querySelector('.top-bar');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 150) {
      nav && nav.classList.add('hidden');
      topBar && topBar.classList.add('hidden');
    } else {
      nav && nav.classList.remove('hidden');
      topBar && topBar.classList.remove('hidden');
    }
    lastY = y;
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => el.classList.add('hidden'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.remove('hidden'); });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));

  // ── MOBILE NAV ────────────────────────────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }

  // ── MARK ACTIVE NAV LINK ─────────────────────────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
