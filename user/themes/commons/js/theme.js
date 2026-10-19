(() => {
  'use strict';
  const key = 'tac-colour-mode';
  const system = matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['day', 'night'].includes(value);
  const read = () => {
    try {
      const cookie = document.cookie.split('; ').find(item => item.startsWith(key + '='));
      const value = cookie ? decodeURIComponent(cookie.slice(key.length + 1)) : null;
      return valid(value) ? value : null;
    } catch { return null; }
  };
  const save = value => {
    try {
      document.cookie = `${key}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {}
  };
  let preference = read();
  // Move the previous browser preference into the cookie once.
  try {
    const previous = localStorage.getItem(key);
    if (!preference && valid(previous)) { preference = previous; save(previous); }
    if (read()) localStorage.removeItem(key);
  } catch {}
  const apply = mode => {
    document.documentElement.dataset.theme = mode;
    // Carry the visible theme even when it comes from the system or cookies are blocked.
    document.querySelectorAll('.downloads a[href]').forEach(link => {
      const url = new URL(link.href, location.href);
      if (url.searchParams.get('download') !== 'pdf') return;
      url.searchParams.set('pdf_theme', mode);
      link.href = url.href;
    });
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(mode === 'night'));
    }
    window.dispatchEvent(new Event('tac-theme-change'));
  };
  apply(['day', 'night'].includes(preference) ? preference : system.matches ? 'night' : 'day');
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
      save(preference);
      apply(preference);
    });
  });
  system.addEventListener('change', () => {
    if (!['day', 'night'].includes(preference)) apply(system.matches ? 'night' : 'day');
  });
  const sync = () => {
    const saved = read();
    if (saved !== preference) {
      preference = saved;
      apply(valid(preference) ? preference : system.matches ? 'night' : 'day');
    }
  };
  window.addEventListener('pageshow', sync);
  window.addEventListener('focus', sync);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync();
  });
})();
