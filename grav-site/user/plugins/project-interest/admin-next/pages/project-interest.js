(() => {
  const tag = window.__GRAV_PAGE_TAG || 'grav-project-interest--page';
  class ProjectInterestAdmin extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true; this.page = 1;
      this.innerHTML = `<style>
        .interest-admin{max-width:75rem;padding:1rem;color:inherit;font:inherit}
        .interest-admin .controls{display:flex;flex-wrap:wrap;align-items:end;gap:1rem;margin:1rem 0}
        .interest-admin label{display:grid;gap:.3rem;flex:1 1 15rem;min-width:0}
        .interest-admin input,.interest-admin button{min-height:44px;max-width:100%;font:inherit;padding:.5rem .75rem;border:1px solid currentColor;border-radius:.35rem;background:transparent;color:inherit}
        .interest-admin button{cursor:pointer}.interest-admin button[disabled]{cursor:default;opacity:.6}
        .interest-admin :focus-visible{outline:3px solid currentColor;outline-offset:3px}
        .interest-admin details{margin:1rem 0;padding:1rem;border:1px solid currentColor;border-radius:.4rem}
        .interest-admin summary{min-height:44px;padding:.5rem 0;cursor:pointer;font-weight:bold;overflow-wrap:anywhere}
        .interest-admin dt{font-weight:bold;margin-top:.75rem}.interest-admin dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
        .interest-admin dialog{max-width:min(34rem,90vw);max-height:90vh;overflow:auto;border:2px solid currentColor;border-radius:.5rem;padding:1.5rem;background:Canvas;color:CanvasText}
        .interest-admin dialog::backdrop{background:#0008}
        .interest-admin .paging{display:flex;gap:1rem;align-items:center;flex-wrap:wrap}
      </style><section class="interest-admin" aria-label="Private project-interest submissions">
        <p>Private submissions — super-admin access only. Submitting the public form does not create membership or authorise mailing-list enrolment.</p>
        <form class="controls" aria-label="Search submissions"><label>Search name, email, organisation, or message<input type="search" maxlength="120" autocomplete="off"></label><button type="submit">Search</button><button type="button" data-refresh>Refresh</button></form>
        <p role="status" aria-live="polite" data-status></p><p data-retention></p><div data-records></div>
        <div class="paging"><button type="button" data-previous>Previous page</button><span data-page></span><button type="button" data-next>Next page</button></div>
        <dialog aria-labelledby="interest-delete-title"><h2 id="interest-delete-title">Delete this submission?</h2><p>This removes the private record from the active site. It does not remove copies held in backups.</p><form method="dialog"><button value="cancel" autofocus>Cancel</button><button value="delete">Delete submission</button></form></dialog>
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
      const response=await fetch(server+prefix+'/project-interest/submissions'+path,{...options,credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json','Authorization':'Bearer '+window.__GRAV_API_TOKEN}});
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
        for(const record of result.records) {
          const details=document.createElement('details');const summary=document.createElement('summary');
          summary.textContent=record.name+' — '+record.submitted_at;details.append(summary);
          const fields=document.createElement('dl');
          for(const [name,value] of Object.entries({'Record ID':record.id,'Submitted (UTC)':record.submitted_at,'Name':record.name,'Email':record.email,'Organisation or community':record.organisation||'Not supplied','Message':record.message||'Not supplied','Source page':record.source_route,'Language':record.language_code,'Request type':record.request_type,'Consent confirmed':record.consent?'Yes':'No','Consent notice version':record.consent_notice_version})) {
            const dt=document.createElement('dt');dt.textContent=name;const dd=document.createElement('dd');dd.textContent=value;fields.append(dt,dd);
          }
          details.append(fields);
          const button=document.createElement('button');button.type='button';button.textContent='Delete submission';button.setAttribute('aria-label','Delete submission from '+record.name);
          button.addEventListener('click',()=>{this.pendingId=record.id;this.opener=button;const dialog=this.root.querySelector('dialog');dialog.returnValue='cancel';dialog.showModal();});
          details.append(button);list.append(details);
        }
        status.textContent=result.total?result.total+' matching submissions.':'No submissions found.';
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
  if(!customElements.get(tag)) customElements.define(tag,ProjectInterestAdmin);
})();
