(() => {
  const tag = window.__GRAV_PAGE_TAG || 'grav-language-suggestions--page';
  class LanguageSuggestionsAdmin extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true; this.page = 1;
      this.innerHTML = `<style>
        .interest-admin{--ia-bg:var(--card,#fff);--ia-fg:var(--foreground,#20242c);--ia-soft:var(--muted,#f3f4f6);--ia-line:var(--border,#d1d5db);--ia-action:#5b21b6;--ia-on-action:#fff;--ia-danger:#a11928;box-sizing:border-box;width:100%;max-width:90rem;padding:clamp(.75rem,2vw,1.5rem);color:var(--ia-fg);font:inherit;font-size:.9375rem;line-height:1.6}
        .dark .interest-admin{--ia-action:#ddc8ff;--ia-on-action:#29144c;--ia-danger:#ffb4bc}
        .interest-admin *{box-sizing:border-box}
        .interest-admin>p:first-child{margin:0 0 1.5rem;padding:.875rem 1rem;border:1px solid var(--ia-line);border-left:4px solid var(--ia-action);border-radius:.5rem;background:var(--ia-bg);max-width:85ch}
        .interest-admin .controls{display:flex;flex-wrap:wrap;align-items:end;gap:.75rem;margin:0 0 1.25rem;padding:1.25rem;border:1px solid var(--ia-line);border-radius:.75rem;background:var(--ia-bg)}
        .interest-admin label{display:grid;gap:.5rem;flex:1 1 20rem;min-width:0;font-weight:600}
        .interest-admin input,.interest-admin button{min-height:44px;max-width:100%;font:inherit;line-height:1.4;padding:.65rem 1rem;border:1px solid var(--ia-fg);border-radius:.5rem;background:var(--ia-bg);color:var(--ia-fg)}
        .interest-admin input{width:100%;font-weight:400}
        .interest-admin button{cursor:pointer;font-weight:600}
        .interest-admin .controls button[type=submit]{background:var(--ia-action);border-color:var(--ia-action);color:var(--ia-on-action)}
        .interest-admin button:not(:disabled):hover{box-shadow:inset 0 0 0 1px currentColor}
        .interest-admin button:disabled{cursor:default;opacity:.5}
        .interest-admin :focus-visible,.interest-admin h2:focus{outline:3px solid var(--ia-action);outline-offset:4px}
        .interest-admin [data-status]{margin:1rem 0;font-weight:600}
        .interest-admin [data-retention]{margin:1.5rem 0 0;font-size:.875rem;max-width:90ch;line-height:1.7}
        .interest-admin .table-scroll{overflow-x:auto;max-width:100%;border:1px solid var(--ia-line);border-radius:.75rem;background:var(--ia-bg)}
        .interest-admin table{width:100%;min-width:48rem;border-collapse:separate;border-spacing:0;text-align:left;font-size:inherit;line-height:1.6}
        .interest-admin caption{text-align:left;font-weight:650;padding:1rem 1.25rem;caption-side:top;color:var(--ia-fg);background:var(--ia-bg)}
        .interest-admin th,.interest-admin td{padding:1rem 1.25rem;vertical-align:top;border:0;border-top:1px solid var(--ia-line);overflow-wrap:anywhere;text-align:left}
        .interest-admin thead th{background:var(--ia-soft);font-size:.8125rem;font-weight:700;letter-spacing:.025em}
        .interest-admin tbody tr:nth-child(even){background:color-mix(in srgb,var(--ia-bg) 55%,var(--ia-soft))}
        .interest-admin tbody tr:focus-within{background:var(--ia-soft)}
        .interest-admin td{max-width:20rem;min-width:7rem}
        .interest-admin td:first-child{min-width:10.5rem;font-variant-numeric:tabular-nums}
        .interest-admin td:last-child{min-width:6rem;white-space:nowrap}
        .interest-admin time span{display:block;font-size:.8125rem;margin-top:.2rem}
        .interest-admin a{color:var(--ia-action);display:inline-block;padding:.5rem .25rem;min-height:44px;text-decoration:underline;text-underline-offset:.2em;font-weight:600}
        .interest-admin a[aria-expanded=true]{font-weight:750}
        .interest-admin .paging{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;margin-top:1.25rem}
        .interest-admin .paging span{padding:.5rem;font-variant-numeric:tabular-nums}
        .interest-admin .entry{margin:1.5rem 0 0;padding:clamp(1rem,3vw,2rem);border:1px solid var(--ia-line);border-top:4px solid var(--ia-action);border-radius:.75rem;background:var(--ia-bg)}
        .interest-admin .entry h2{font-size:1.25rem;line-height:1.4;font-weight:700;margin:0 0 .5rem;overflow-wrap:anywhere}
        .interest-admin dl{margin:1rem 0 1.5rem}
        .interest-admin dl>div{display:grid;grid-template-columns:minmax(9rem,12rem) minmax(0,1fr);gap:.5rem 1.5rem;padding:.875rem 0;border-bottom:1px solid var(--ia-line)}
        .interest-admin dt{font-weight:650;margin:0}.interest-admin dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;max-width:80ch}
        .interest-admin .danger{color:var(--ia-danger);border-color:var(--ia-danger)}
        .interest-admin dialog{width:min(34rem,calc(100% - 2rem));max-height:90vh;overflow:auto;border:1px solid var(--ia-line);border-radius:.75rem;padding:1.5rem;background:var(--ia-bg);color:var(--ia-fg);box-shadow:0 20px 70px #0005}
        .interest-admin dialog h2{font-size:1.25rem;font-weight:700;margin:0 0 .75rem}
        .interest-admin dialog p{margin:0 0 1.25rem}
        .interest-admin dialog form{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:flex-end}
        .interest-admin dialog::backdrop{background:#0009}
        .interest-admin [hidden]{display:none!important}
        @media(max-width:600px){.interest-admin .controls{padding:1rem}.interest-admin label{flex-basis:100%}.interest-admin dl>div{grid-template-columns:minmax(0,1fr);gap:.25rem}.interest-admin .paging{gap:.5rem}}
        @media(forced-colors:active){.interest-admin{--ia-bg:Canvas;--ia-fg:CanvasText;--ia-soft:Canvas;--ia-line:CanvasText;--ia-action:LinkText;--ia-on-action:Canvas;--ia-danger:CanvasText}.interest-admin .controls button[type=submit]{background:ButtonFace;color:ButtonText;border-color:ButtonText}.interest-admin tbody tr:focus-within{outline:1px solid CanvasText}}
      </style><section class="interest-admin" aria-label="Private language-suggestions submissions">
        <p>Private language suggestions — super-admin access only. Public counts contain language names and totals only.</p>
        <form class="controls" aria-label="Search submissions"><label>Search language name or code<input type="search" maxlength="120" autocomplete="off"></label><button type="submit">Search</button><button type="button" data-refresh>Refresh</button></form>
        <p role="status" aria-live="polite" data-status></p><div data-records></div>
        <div class="paging"><button type="button" data-previous>Previous page</button><span data-page></span><button type="button" data-next>Next page</button></div>
        <p data-retention></p>
        <dialog aria-labelledby="interest-delete-title"><h2 id="interest-delete-title">Delete this submission?</h2><p>This removes the private record from the active site. It does not remove copies held in backups.</p><form method="dialog"><button value="cancel" autofocus>Cancel</button><button class="danger" value="delete">Delete submission</button></form></dialog>
      </section>`;
      this.root = this.querySelector('.interest-admin');
      this.root.querySelector('form.controls').addEventListener('submit', e => {e.preventDefault(); this.page=1; this.load();});
      this.root.querySelector('[data-refresh]').addEventListener('click', () => this.load());
      this.root.querySelector('[data-previous]').addEventListener('click', () => {this.page--; this.load();});
      this.root.querySelector('[data-next]').addEventListener('click', () => {this.page++; this.load();});
      const dialog=this.root.querySelector('dialog');
      dialog.addEventListener('close', async () => {
        if(dialog.returnValue!=='delete') {this.opener?.focus(); return;}
        try {await this.request('/'+this.pendingId,{method:'DELETE'});await this.load();this.root.querySelector('[data-refresh]').focus();}
        catch {this.root.querySelector('[data-status]').textContent='The submission could not be deleted. Refresh and try again.';this.opener?.focus();}
      });
      this.load();
    }
    async request(path='', options={}) {
      const server=window.__GRAV_API_SERVER_URL || '';
      const prefix=window.__GRAV_API_PREFIX || '/api/v1';
      const response=await fetch(server+prefix+'/language-suggestions/submissions'+path,{...options,credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json','Authorization':'Bearer '+window.__GRAV_API_TOKEN}});
      if(!response.ok) throw new Error('Private submissions unavailable');
      const body=await response.json();return body.data;
    }
    async load() {
      const status=this.root.querySelector('[data-status]');status.textContent='Loading private submissions…';
      try {
        const query=this.root.querySelector('input').value;
        const result=await this.request('?page='+this.page+'&q='+encodeURIComponent(query));
        if(this.page>1 && !result.records.length) {this.page--;return this.load();}
        const list=this.root.querySelector('[data-records]');list.replaceChildren();
        const scroll=document.createElement('div');scroll.className='table-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Submissions table; scroll horizontally on smaller screens');
        const table=document.createElement('table');
        const caption=document.createElement('caption');caption.textContent='Language suggestions';table.append(caption);
        const head=document.createElement('thead');const headings=document.createElement('tr');
        for(const label of ['Date (UTC)','Language','Code','Entry']) {const th=document.createElement('th');th.scope='col';th.textContent=label;headings.append(th);}
        head.append(headings);table.append(head);const body=document.createElement('tbody');table.append(body);scroll.append(table);list.append(scroll);
        const entries=document.createElement('div');list.append(entries);
        const setExpanded=(link,expanded)=>{const action=expanded?'Close':'Open';link.textContent=action;link.setAttribute('aria-label',action+' submission from '+link.dataset.name);link.setAttribute('aria-expanded',String(expanded));};
        const excerpt=value=>{const text=(value||'Not supplied').replace(/\s+/g,' ').trim();return text.length>80?text.slice(0,80)+'…':text;};
        for(const record of result.records) {
          const row=document.createElement('tr');
          for(const value of [record.submitted_at,record.name,record.code]) {const cell=document.createElement('td');
            if(!row.children.length && !Number.isNaN(Date.parse(value))) {
              const date=new Date(value);const time=document.createElement('time');time.dateTime=value;time.title=value;
              time.append(new Intl.DateTimeFormat('en-ZA',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(date));
              const clock=document.createElement('span');clock.textContent=new Intl.DateTimeFormat('en-ZA',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'UTC'}).format(date)+' UTC';time.append(clock);cell.append(time);
            } else cell.textContent=value;
            row.append(cell);}
          const details=document.createElement('section');details.className='entry';details.id='interest-entry-'+record.id;details.hidden=true;
          const title=document.createElement('h2');title.tabIndex=-1;title.textContent='Submission from '+record.name;details.setAttribute('aria-labelledby',details.id+'-title');title.id=details.id+'-title';details.append(title);
          const open=document.createElement('a');open.href='#'+details.id;open.textContent='Open';open.dataset.name=record.name;setExpanded(open,false);open.setAttribute('aria-controls',details.id);
          const cell=document.createElement('td');cell.append(open);row.append(cell);body.append(row);
          const close=document.createElement('a');close.href='#';close.textContent='Back to submissions';
          close.addEventListener('click',e=>{e.preventDefault();details.hidden=true;setExpanded(open,false);open.focus();});details.append(close);
          open.addEventListener('click',e=>{e.preventDefault();const expanding=details.hidden;for(const entry of entries.children)entry.hidden=true;for(const link of body.querySelectorAll('a'))setExpanded(link,false);if(expanding){details.hidden=false;setExpanded(open,true);title.focus();}else{open.focus();}});
          const fields=document.createElement('dl');
          for(const [name,value] of Object.entries({'Record ID':record.id,'Submitted (UTC)':record.submitted_at,'Language':record.name,'Code':record.code})) {
            const dt=document.createElement('dt');dt.textContent=name;const dd=document.createElement('dd');dd.textContent=value;const field=document.createElement('div');field.append(dt,dd);fields.append(field);
          }
          details.append(fields);
          const button=document.createElement('button');button.type='button';button.className='danger';button.textContent='Delete submission';button.setAttribute('aria-label','Delete submission from '+record.name);
          button.addEventListener('click',()=>{this.pendingId=record.id;this.opener=button;const dialog=this.root.querySelector('dialog');dialog.returnValue='cancel';dialog.showModal();});
          details.append(button);entries.append(details);
        }
        status.textContent=result.total?result.total+(result.total===1?' matching submission.':' matching submissions.'):'No submissions found.';
        this.root.querySelector('[data-retention]').textContent='Retention setting: '+result.retention_days+' days. Expired records are removed when this view is loaded, on subsequent submission handling, or by scheduled maintenance. Backups are separate.';
        this.root.querySelector('[data-page]').textContent='Page '+this.page;
        this.root.querySelector('[data-previous]').disabled=this.page<=1;
        this.root.querySelector('[data-next]').disabled=this.page*result.per_page>=result.total;
      } catch {
        this.root.querySelector('[data-records]').replaceChildren();
        status.textContent='Private submissions could not be loaded. You must be signed in as a super-admin; sign in again if your session expired.';
      }
    }
  }
  if(!customElements.get(tag)) customElements.define(tag,LanguageSuggestionsAdmin);
})();
