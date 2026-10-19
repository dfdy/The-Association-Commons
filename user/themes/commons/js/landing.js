(() => {
  'use strict';
  const dialog = document.querySelector('#language-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const show = () => {
    dialog.showModal();
    document.querySelector('#language-title').focus({preventScroll:true});
    dialog.scrollTop = 0;
  };
  // Choosing an ordinary language link is the way forward; Escape must not dismiss the picker.
  dialog.addEventListener('cancel', event => event.preventDefault());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const first = dialog.querySelector('a[href]');
    const last = [...dialog.querySelectorAll('a[href]')].at(-1);
    const title = document.querySelector('#language-title');
    if (event.shiftKey && [first, title, dialog].includes(document.activeElement)) {
      event.preventDefault();last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();first.focus();
    }
  });
  dialog.removeAttribute('open');
  show();
})();
