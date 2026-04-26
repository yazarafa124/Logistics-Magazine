// ── CONTENT LOADER ───────────────────────────────────────────────────────────
async function loadJSON(path) {
  const res = await fetch(path + '?v=' + Date.now());
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

async function initSite() {
  try {
    const [cover, eventsData, partnersData, advisoryData] = await Promise.all([
      loadJSON('/data/cover.json'),
      loadJSON('/data/events.json'),
      loadJSON('/data/partners.json'),
      loadJSON('/data/advisory.json')
    ]);

    const heroHeadline = document.querySelector('.hero-headline');
    const bylineName = document.querySelector('.byline-name');
    const bylineTitle = document.querySelector('.byline-title');
    const heroExcerpt = document.querySelector('.hero-excerpt');
    const kickerText = document.querySelector('.kicker-text');
    const portraitInitials = document.querySelector('.portrait-initials');
    const portraitIssue = document.querySelector('.portrait-issue');

    if (heroHeadline) heroHeadline.innerHTML = '<em>' + cover.quote + '</em>';
    if (bylineName) bylineName.textContent = cover.name;
    if (bylineTitle) bylineTitle.textContent = cover.title;
    if (heroExcerpt) heroExcerpt.textContent = cover.intro;
    if (kickerText) kickerText.textContent = 'Cover Feature · ' + cover.issue;
    if (portraitInitials) portraitInitials.textContent = cover.name.split(' ').map(w => w[0]).join('').slice(0, 2);
    if (portraitIssue) portraitIssue.textContent = cover.issue;

    if (cover.image) {
      const frame = document.querySelector('.portrait-placeholder');
      if (frame) frame.innerHTML = '<img src="' + cover.image + '" style="width:100%;height:100%;object-fit:cover">';
    }

    const eventsList = document.getElementById('events-list');
    if (eventsList && eventsData.events) {
      eventsList.innerHTML = '';
      eventsData.events.forEach((ev, i) => {
        const div = document.createElement('div');
        div.className = 'event-row';
        div.style.transitionDelay = i * 0.08 + 's';
        div.innerHTML = '<div class="event-date">' + ev.date + '</div><div class="event-city">' + ev.city + '</div><div class="event-info"><h3>' + ev.title + '</h3><p>' + ev.desc + '</p></div><span class="event-type">' + ev.type + '</span>';
        eventsList.appendChild(div);
      });
    }

    const partnersGrid = document.getElementById('partners-page-grid');
    if (partnersGrid && partnersData.partners) {
      partnersGrid.innerHTML = '';
      partnersData.partners.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = 'partner-card';
        div.style.transitionDelay = i * 0.07 + 's';
        const inner = p.logo
          ? '<img src="' + p.logo + '" alt="' + p.name + '" style="max-width:120px;max-height:60px;object-fit:contain"><div class="partner-name">' + p.name + '</div>'
          : '<div class="partner-logo-placeholder"><span>' + p.name.split(' ').map(w => w[0]).join('').slice(0, 3) + '</span></div><div class="partner-name">' + p.name + '</div>';
        div.innerHTML = inner;
        if (p.website) { div.style.cursor = 'pointer'; div.onclick = () => window.open(p.website, '_blank'); }
        partnersGrid.appendChild(div);
      });
    }

    const advPage = document.getElementById('advisory-page-grid');
    const advPreview = document.getElementById('advisory-preview');

    function renderAdvisory(container, members) {
      container.innerHTML = '';
      members.forEach((m, i) => {
        const div = document.createElement('div');
        const isPreview = container.id === 'advisory-preview';
        div.className = isPreview ? 'advisory-preview-card' : 'advisory-card';
        div.style.transitionDelay = i * 0.1 + 's';
        if (isPreview) {
          const avatar = m.photo
            ? '<img src="' + m.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
            : m.name.split(' ').map(n => n[0]).join('').slice(0, 2);
          div.innerHTML = '<div class="advisory-avatar">' + avatar + '</div><div class="advisory-info"><div class="advisory-name">' + m.name + '</div><div class="advisory-title-text">' + m.title + '</div><div class="advisory-country">' + m.country + '</div></div><a href="' + m.linkedin + '" class="advisory-li" target="_blank">in</a>';
        } else {
          const avatar = m.photo
            ? '<img src="' + m.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
            : m.name.split(' ').map(n => n[0]).join('').slice(0, 2);
          div.innerHTML = '<div class="advisory-card-avatar">' + avatar + '</div><div class="advisory-card-name">' + m.name + '</div><div class="advisory-card-title">' + m.title + '</div><div class="advisory-card-country">' + m.country + '</div><a href="' + m.linkedin + '" target="_blank" class="advisory-card-li">View LinkedIn Profile →</a>';
        }
        container.appendChild(div);
      });
    }

    if (advPage && advisoryData.members) renderAdvisory(advPage, advisoryData.members);
    if (advPreview && advisoryData.members) renderAdvisory(advPreview, advisoryData.members.slice(0, 3));

    const awardsPreview = document.getElementById('awards-preview');
    if (awardsPreview) {
      const awards = [
        { title: "Maritime Lawyer of the Year" },
        { title: "Logistics Executive of the Year", subtitle: "Private Sector" },
        { title: "Excellence in Public Service", subtitle: "Government & Port Authorities" },
        { title: "Rising Star Award", subtitle: "Under 35" }
      ];
      awards.forEach(a => {
        const div = document.createElement('div');
        div.className = 'award-preview-item';
        div.innerHTML = '<div class="award-preview-title">' + a.title + (a.subtitle ? '<span class="award-preview-sub">' + a.subtitle + '</span>' : '') + '</div>';
        awardsPreview.appendChild(div);
      });
      const more = document.createElement('div');
      more.className = 'award-preview-more';
      more.innerHTML = '<a href="awards.html">+ 5 more categories →</a>';
      awardsPreview.appendChild(more);
    }

    const issuesGrid = document.getElementById('issues-grid');
    if (issuesGrid) {
      const div = document.createElement('div');
      div.className = 'issue-preview-card';
      div.style.background = '#1e3a14';
      div.style.cursor = 'pointer';
      div.onclick = () => window.location.href = 'issues.html';
      div.innerHTML = '<div class="issue-card-inner"><div class="issue-number">No. 01</div><div class="issue-title">Logistics in the Canal Region</div><div class="issue-date">May 2026</div><a href="issues.html" class="issue-download">Read Now →</a></div>';
      issuesGrid.appendChild(div);
    }

  } catch(err) {
    console.error('Site init failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', initSite);

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

  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => el.classList.add('hidden'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.remove('hidden'); });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));

  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
