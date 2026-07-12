// Seytrons landing page JS — compliance tab switcher.
// Mobile menu, smooth scrolling, and the current year are handled
// by the shared js/main.js so behaviour stays uniform across the site.

(function () {
  const tabs = Array.from(document.querySelectorAll('.st-tab[data-tab]'));
  const panels = Array.from(document.querySelectorAll('.st-tab-panel[id]'));

  if (!tabs.length || !panels.length) return;

  function activateTab(tabKey) {
    tabs.forEach((t) => {
      const isActive = t.getAttribute('data-tab') === tabKey;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((p) => {
      const panelId = p.getAttribute('id');
      const shouldShow = panelId === `st-panel-${tabKey}`;
      p.classList.toggle('is-active', shouldShow);
    });

    const termsAnchor = document.querySelector('#terms');
    if (termsAnchor && tabKey === 'terms') {
      termsAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.getAttribute('data-tab')));
  });

  // Activate based on the current hash (e.g. opened on #terms / #release-notes)
  const hash = (window.location.hash || '').replace('#', '');
  if (hash === 'terms') activateTab('terms');
  if (hash === 'release-notes') activateTab('releases');
})();
