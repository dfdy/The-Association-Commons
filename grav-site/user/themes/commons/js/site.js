'use strict';
document.querySelectorAll('a[href]').forEach(a=>{const url=new URL(a.href,location.href);if(['http:','https:'].includes(url.protocol)&&url.origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer';}});
const form=document.querySelector('#stadgar-form');
if(form){
 const fields=[...form.querySelectorAll('textarea')],preview=document.querySelector('#stadgar-preview'),status=document.querySelector('#builder-status');
 const values=()=>Object.fromEntries(fields.map(f=>[f.name,f.value]));
 const update=()=>{preview.textContent=fields.filter(f=>f.value.trim()).map(f=>(f.name==='name'?'# ':'## ')+(f.name==='name'?f.value:f.dataset.label+'\n\n'+f.value)).join('\n\n');};
 form.addEventListener('input',update);update();
 form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;status.textContent='Preparing download…';try{const format=e.submitter.value;const response=await fetch(location.pathname+'?download='+format,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values())});if(!response.ok)throw Error();const blob=await response.blob(),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='constitution.'+format;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);status.textContent='Download ready.';}catch{status.textContent='The download could not be prepared. Please try again.'}});
}

// Keep the header compact after leaving the top, with hysteresis to avoid flicker.
(() => {
 const header=document.querySelector('.site-header');
 if(!header)return;
 const downloads=document.querySelector('.toolbar-downloads');
 const actions=header.querySelector('.header-actions');
 const downloadHome=downloads?document.createComment('Download controls return here when the header expands'):null;
 if(downloads)downloads.before(downloadHome);
 let compact=false,pending=false;
 const update=()=>{
  pending=false;
  const next=compact?scrollY>16:scrollY>96;
  if(next!==compact){
   compact=next;header.classList.toggle('is-compact',compact);
   if(downloads&&actions){
    if(compact)actions.prepend(downloads);
    else downloadHome.after(downloads);
   }
  }
 };
 const measure=()=>document.documentElement.style.setProperty('--site-header-height',header.getBoundingClientRect().height+'px');
 new ResizeObserver(measure).observe(header);
 addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
 addEventListener('pageshow',update);
 update();measure();
})();
