'use strict';
document.querySelectorAll('a[href]').forEach(a=>{const url=new URL(a.href,location.href);if(['http:','https:'].includes(url.protocol)&&url.origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer';}});
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
