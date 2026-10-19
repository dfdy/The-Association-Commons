(() => {
  'use strict';
  const menu = document.querySelector('[data-language-menu]');
  if (!menu) return;
  const links = [...menu.querySelectorAll('a[data-language]')];
  const codes = new Set(links.map(link => link.dataset.language));
  const cookieName = 'va_language_menu';
  const read = () => {
    try {
      const value = document.cookie.split('; ').find(item => item.startsWith(cookieName + '='));
      const data = value ? JSON.parse(decodeURIComponent(value.slice(cookieName.length + 1))) : [];
      return Array.isArray(data) ? data.filter(code => typeof code === 'string' && codes.has(code)).slice(-50) : [];
    } catch { return []; }
  };
  const paint = history => {
    links.forEach(link => {
      const count = history.filter(code => code === link.dataset.language).length;
      // Percentage of recorded clicks, capped at 50% forest green on a pale green base.
      const darkness = history.length ? Math.min(0.5, count / history.length) : 0;
      const night = document.documentElement.dataset.theme === 'night';
      const base = night ? [34, 48, 41] : [233, 236, 223];
      const target = night ? [100, 130, 105] : [47, 86, 55];
      const shade = target.map((channel, i) => Math.round(base[i] + (channel - base[i]) * darkness));
      link.style.backgroundColor = `rgb(${shade.join(', ')})`;
    });
  };
  const record = event => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const link = event.target.closest('a[data-language]');
    if (!link || !menu.contains(link)) return;
    const history = [...read(), link.dataset.language].slice(-50);
    try {
      document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(history))}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch { /* Navigation still works when cookies are unavailable. */ }
    paint(history);
  };
  menu.addEventListener('click', record);
  menu.addEventListener('auxclick', record);
  window.addEventListener('pageshow', () => paint(read()));
  window.addEventListener('tac-theme-change', () => paint(read()));
  paint(read());
})();
