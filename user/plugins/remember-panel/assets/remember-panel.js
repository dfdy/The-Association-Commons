'use strict';
(() => {
  const MAX_TIMEOUT = 2147483647;
  document.querySelectorAll('[data-remember-panel]').forEach(panel => {
    const button = panel.querySelector('.remember-panel__handle');
    const content = panel.querySelector('.remember-panel__content');
    const action = button.querySelector('[data-panel-action]');
    const key = 'association-commons:remember-panel:' + panel.dataset.rememberPanel;
    const duration = Number(panel.dataset.resetMs);
    let open = true, expiresAt = 0, timer;

    const read = raw => {
      try {
        const saved = JSON.parse(raw);
        if (saved && typeof saved.open === 'boolean' && Number.isFinite(saved.expiresAt)
            && saved.expiresAt > Date.now()) return saved;
      } catch { /* Unavailable or malformed storage defaults to visible content. */ }
      return {open: true, expiresAt: 0};
    };
    const stored = () => {
      try { return read(localStorage.getItem(key)); }
      catch { return {open: true, expiresAt: 0}; }
    };
    const render = () => {
      content.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      action.textContent = open ? button.dataset.hideLabel : button.dataset.showLabel;
      panel.classList.toggle('is-closed', !open);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (expiresAt) timer = setTimeout(expire, Math.min(MAX_TIMEOUT, Math.max(0, expiresAt - Date.now())));
    };
    const apply = saved => {
      open = saved.open; expiresAt = saved.expiresAt;
      render(); schedule();
    };
    const expire = () => {
      if (!expiresAt) return;
      if (expiresAt > Date.now()) { schedule(); return; }
      // Clear only this preference. Restoration never renews its lifetime.
      try { localStorage.removeItem(key); } catch {}
      apply({open: true, expiresAt: 0});
    };
    apply(stored());
    button.hidden = false;
    button.addEventListener('click', () => {
      const saved = {open: !open, expiresAt: Date.now() + duration};
      try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
      window.dispatchEvent(new CustomEvent('remember-panel:change', {detail: {key, saved}}));
    });
    window.addEventListener('remember-panel:change', event => {
      if (event.detail.key === key) apply(event.detail.saved);
    });
    window.addEventListener('storage', event => {
      if (event.key === key || event.key === null) apply(read(event.newValue));
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) expire();
    });
  });
})();
