(() => {
  'use strict';
  const key = 'ddc-text-size';
  const sizes = ['100', '112.5', '125', '150', '175', '200', '250', '300', '350', '400'];
  const read = () => {
    try {
      const entry = document.cookie.split('; ').find(item => item.startsWith(key + '='));
      const value = entry?.slice(key.length + 1);
      return sizes.includes(value) ? value : '100';
    } catch { return '100'; }
  };
  const apply = value => {
    document.documentElement.style.fontSize = `${value}%`;
    document.documentElement.dataset.largeText = String(Number(value) > 200);
    const output = document.querySelector('#text-size-value');
    if (output) output.value = `${value}%`;
    document.querySelector('[data-text-size="decrease"]')?.setAttribute('aria-disabled', String(value === sizes[0]));
    document.querySelector('[data-text-size="increase"]')?.setAttribute('aria-disabled', String(value === sizes.at(-1)));
  };
  apply(read());
  document.addEventListener('DOMContentLoaded', () => {
    const group = document.querySelector('.text-size-control');
    if (!group) return;
    apply(read());
    group.hidden = false;
    group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
      if (button.getAttribute('aria-disabled') === 'true') return;
      const current = parseFloat(document.querySelector('#text-size-value').value);
      const index = sizes.indexOf(String(current));
      const value = sizes[index + (button.dataset.textSize === 'increase' ? 1 : -1)];
      if (!value) return;
      apply(value);
      try {
        document.cookie = `${key}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      } catch { /* Text resizing still works if cookies are blocked. */ }
    }));
  });
  window.addEventListener('pageshow', () => apply(read()));
})();
