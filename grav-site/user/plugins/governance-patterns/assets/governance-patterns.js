(() => {
  'use strict';
  const root = document.querySelector('.governance-library');
  if (!root) return;
  const reveal = (focus = false) => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!/^pattern-record-[a-z0-9-]+$/.test(id)) return;
    const record = document.getElementById(id);
    if (!record || !root.contains(record)) return;
    record.open = true;
    if (focus) { record.querySelector('summary').focus(); record.scrollIntoView({block: 'start', behavior: 'instant'}); }
  };
  reveal();
  addEventListener('hashchange', () => reveal(true));
  root.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#pattern-record-"]');
    if (link && location.hash === link.hash) reveal(true);
  });
  if (typeof window.DataTable !== 'function') return;
  const search = root.querySelector('#pattern-search');
  const category = root.querySelector('#pattern-category');
  const testing = root.querySelector('#pattern-testing');
  const type = root.querySelector('#pattern-type');
  const table = new DataTable(root.querySelector('table'), {paging: false, info: false, layout: {topStart: null, topEnd: null, bottomStart: null, bottomEnd: null}, order: [], autoWidth: false});
  table.search.fixed('pattern-filters', (_search, _data, index) => {
    const row = table.row(index).node();
    return (!category.value || row.dataset.category === category.value) && (!testing.value || row.dataset.testing === testing.value) && (!type.value || row.dataset.type === type.value);
  });
  const update = () => {
    table.search(search.value).draw();
    root.querySelector('#pattern-status').textContent = `${table.rows({search: 'applied'}).count()} of ${table.rows().count()} patterns match the index filters.`;
  };
  search.addEventListener('input', update);
  [category, testing, type].forEach(select => select.addEventListener('change', update));
  root.querySelector('#pattern-reset').addEventListener('click', () => {
    search.value = ''; category.value = ''; testing.value = ''; type.value = '';
    update(); search.focus();
  });
  root.querySelector('.legal-matrix-filters').hidden = false;
  update();
})();
