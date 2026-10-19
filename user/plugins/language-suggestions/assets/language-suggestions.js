(() => {
  const focusNotice=()=>{
    const notice=document.querySelector('.language-suggestions .interest-errors, .language-suggestions [role="status"]');
    if(notice) notice.focus();
  };
  window.addEventListener('pageshow',focusNotice);
})();
