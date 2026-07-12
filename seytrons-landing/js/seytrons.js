// Seytrons landing page JS (kept intentionally lightweight)

(function () {
  // Current year
  const y = document.getElementById('current-year');
  if (y) y.textContent = new Date().getFullYear();

  // Smooth scroll (hash links only)
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    // If this is a tabs anchor (like #terms), just scroll normally
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Mobile menu toggle
  const toggle = document.querySelector('.st-mobile-toggle');
  const mobileMenu = document.querySelector('#st-mobile-menu');
  if (toggle && mobileMenu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      mobileMenu.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      setOpen(!isOpen);
    });

    mobileMenu.addEventListener('click', (e) => {
      const link = e.target && e.target.closest ? e.target.closest('a[data-nav]') : null;
      if (link) setOpen(false);
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') setOpen(false);
    });
  }

  // Compliance tabs
  const tabs = Array.from(document.querySelectorAll('.st-tab[data-tab]'));
  const panels = Array.from(document.querySelectorAll('.st-tab-panel[id]'));

  function activateTab(tabKey) {
    tabs.forEach((t) => {
      const isActive = t.getAttribute('data-tab') === tabKey;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((p) => {
      const panelId = p.getAttribute('id');
      const shouldShow = panelId === `st-panel-${tabKey}` || (tabKey === 'how-to-use' && panelId === 'st-panel-how-to-use');
      p.classList.toggle('is-active', shouldShow);
    });

    // Ensure Terms anchor maps to the correct tab when user opens on #terms
    const termsAnchor = document.querySelector('#terms');
    if (termsAnchor && tabKey === 'terms') {
      termsAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (tabs.length && panels.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-tab');
        activateTab(key);
      });
    });

    // Activate based on current hash
    const hash = (window.location.hash || '').replace('#', '');
    if (hash === 'terms') activateTab('terms');
    if (hash === 'release-notes') activateTab('releases');
  }

})();


