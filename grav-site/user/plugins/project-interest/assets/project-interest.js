(() => {
  'use strict';
  document.querySelectorAll('.project-interest form').forEach(form => {
    const root = form.closest('.project-interest');
    const summary = form.querySelector('.interest-errors');
    const status = root.querySelector('.interest-status');
    const button = form.querySelector('button[type="submit"]');
    let busy = false;
    summary.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && link.hash) { event.preventDefault(); form.querySelector(link.hash)?.focus(); }
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      busy = true;
      button.setAttribute('aria-disabled', 'true');
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Submitting your interest…';
      summary.hidden = true;
      form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      form.querySelectorAll('.interest-field-error').forEach(error => { error.hidden = true; error.textContent = ''; });
      try {
        const response = await fetch(form.action, {method: 'POST', body: new FormData(form), headers: {'Accept': 'application/json'}, credentials: 'same-origin'});
        const data = await response.json();
        if (!response.ok || !data.success) {
          const list = summary.querySelector('ul');
          list.replaceChildren();
          const errors = data.errors && typeof data.errors === 'object' ? data.errors : {form: 'Your interest could not be saved. Please try again.'};
          Object.entries(errors).forEach(([key, message]) => {
            const item = document.createElement('li');
            const field = ['name', 'email', 'organisation', 'message', 'consent'].includes(key) ? form.querySelector(`#interest-${key}`) : null;
            if (field) {
              const error = form.querySelector(`#interest-${key}-error`);
              field.setAttribute('aria-invalid', 'true'); error.textContent = message; error.hidden = false;
              const link = document.createElement('a'); link.href = `#interest-${key}`; link.textContent = message; item.append(link);
            } else item.textContent = message;
            list.append(item);
          });
          summary.hidden = false; summary.focus(); status.textContent = '';
        } else {
          form.reset(); form.hidden = true;
          status.textContent = data.message;
          status.focus();
        }
      } catch {
        status.textContent = 'We could not confirm that your interest was saved. Check your connection and try again; retrying this form will not create a duplicate.';
        status.focus();
      } finally {
        busy = false; button.removeAttribute('aria-disabled'); form.removeAttribute('aria-busy');
      }
    });
  });
})();
