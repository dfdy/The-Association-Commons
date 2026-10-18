(() => {
  'use strict';
  const root = document.querySelector('.legal-matrix');
  if (!root) return;
  const reveal = (focus = false) => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!/^legal-record-[a-z0-9-]+$/.test(id)) return;
    const record = document.getElementById(id);
    if (!record || !root.contains(record)) return;
    record.open = true;
    if (focus) { record.querySelector('summary').focus(); record.scrollIntoView({block: 'start', behavior: 'instant'}); }
  };
  reveal();
  addEventListener('hashchange', () => reveal(true));
  root.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#legal-record-"]');
    if (link && location.hash === link.hash) reveal(true);
  });
  if (typeof window.DataTable !== 'function') return;
  const search = root.querySelector('#legal-matrix-search');
  const type = root.querySelector('#legal-matrix-type');
  const status = root.querySelector('#legal-matrix-status');
  // Status filter and announcement have deliberately distinct IDs.
  const state = root.querySelector('#legal-matrix-legal-status');
  const review = root.querySelector('#legal-matrix-review');
  const tables = [];
  root.querySelectorAll('.legal-matrix-table').forEach(element => {
    const api = new DataTable(element, {paging: false, info: false, layout: {topStart: null, topEnd: null, bottomStart: null, bottomEnd: null}, order: [], autoWidth: false});
    api.search.fixed('matrix-filters', (_search, _data, index) => {
      const row = api.row(index).node();
      return (!type.value || row.dataset.provisionType === type.value)
        && (!state.value || row.dataset.legalStatus === state.value)
        && (!review.value || row.dataset.reviewStatus === review.value);
    });
    tables.push(api);
  });
  const update = () => {
    tables.forEach(table => table.search(search.value).draw());
    const count = tables.reduce((total, table) => total + table.rows({search: 'applied'}).count(), 0);
    status.textContent = `${count} of ${tables.reduce((total, table) => total + table.rows().count(), 0)} records match the index filters.`;
  };
  search.addEventListener('input', update);
  [type, state, review].forEach(select => select.addEventListener('change', update));
  root.querySelector('#legal-matrix-reset').addEventListener('click', () => {
    search.value = ''; type.value = ''; state.value = ''; review.value = '';
    update(); search.focus();
  });
  root.querySelector('.legal-matrix-filters').hidden = false;
  update();
})();
