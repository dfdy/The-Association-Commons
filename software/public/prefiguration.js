(() => {
 "@@text:d96cdf6b2af72cafeb4130ea0259d11c700387604fb847b6a4e2d1c91fab9adf@@";
 const section=document.getElementById("@@text:7ab4098aed0cfa88338b5de1ac26cb6b0e2b3907525ec74e319bd440528b6643@@"),panel=document.getElementById("@@text:3769bec0e79c0825581cdda140db6d5e71168081b92dc68b928e5cdfca3a2402@@"),button=document.getElementById("@@text:c5a4fd282be4d4562345945b9cb66728099f844d8ebe194ba2a1ffa2cd4c5a96@@"),weekButton=document.getElementById("@@text:fcd84fd2a181eb71787fc6821977efe089b23a609c99a6b6d51430c7e624d363@@");
 if(!section||!panel||!button)return;
 const dayCookie="@@text:48cf82f769c81e469d071a220b327eeb292390407548a5d69974a6b251179115@@",weekCookie="@@text:61ef539bc16cf58422406121625ef443411e326ac961c753a8c3d8cbf3dde298@@";
 const DAY=86400000,WEEK=7*DAY;
 function read(name){try{const pair=document.cookie.split("@@text:0a2d3f8f9b727cf73e6c7e44f2feefc41855195b3010a3c4f6b05c33aeb484a9@@").find(value=>value.startsWith(name+"@@text:380918b946a526640a40df5dced6516794f3d97bbd9e6bb553d037c4439f31c3@@"));return pair?decodeURIComponent(pair.slice(name.length+1)):null;}catch{return null;}}
 function write(name,value,seconds){try{document.cookie=name+"@@text:380918b946a526640a40df5dced6516794f3d97bbd9e6bb553d037c4439f31c3@@"+encodeURIComponent(value)+"@@text:c179c7397f7235f684d9221e66856487fd83ed8df2b1886996cd94cf00e3609e@@"+seconds+"@@text:d68ad97df2f74cb41f0da8eba5cb494bdc167073909237772ba7ae8c6ca87e11@@"+(location.protocol==="@@text:08cf2045c958cd55b2a5b4a9f9548ab747d9304a796e26fc5ffad07eb3784929@@"?"@@text:40744f57fe9e14b8571352a5289a41170c7c0902e448ef13891a9ae391656144@@":"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@");}catch{}}
 function until(name){const value=Number(read(name));return Number.isFinite(value)?value:0;}
 // Migrate away from the old visit-count and remembered-open rules.
 for(const name of ["@@text:883409366dfa188e3d476e2c757a0ba5da24be0f7784afe34ea5e55d4e1d140f@@","@@text:36cc2bf1351e8e5bc98fab4d067ee89f2b501c3d085f15a0d1294a7dfec6cc09@@","@@text:b9055bae3c34de8751ba85956fec50384e3de32290cd0b989eb0ad87ffe3e008@@"])if(read(name)!==null)write(name,"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@",0);
 const now=Date.now();
 let expanded=until(dayCookie)<=now&&until(weekCookie)<=now;
 // Count this first display immediately, so reloads and other pages stay collapsed.
 if(expanded)write(dayCookie,String(now+DAY),86400);
 function apply(){
  if(!expanded&&panel.contains(document.activeElement))button.focus();
  panel.hidden=!expanded;section.classList.toggle("@@text:878c1bf31fd1bc5260bbf970b9ec01e26bda44a9b72bed291bb5dddbfdddbfb9@@",!expanded);button.setAttribute("@@text:3e9cf9b3cf3ee226ca2b4119b171650185e8cd7e5829c8e4a10f70368970ba7a@@",String(expanded));
  const swedish=document.documentElement.lang==="@@text:afac70e63187b00e8fc5f50d7a23eeeae956e72af28c5ecd25e1cc664811ce6e@@";
  button.querySelector("@@text:cfb4f6dfb1523e145862097571902a8138215cc9ceaf1a5b5747abdcca6b4e91@@").textContent=(expanded?button.dataset?.hideLabel:button.dataset?.showLabel)||(swedish?(expanded?"@@text:11b921b5c4ea4f80d355907ce140b42ccade7ef337bb751e0dbd01e71591fef1@@":"@@text:f1db86eaa906e3266dd8e3c5930b81a526174d1e1b3f862fd5d0538d90e9f5b5@@"):(expanded?"@@text:9807e6d8968365f2eaa95c66fa1b9a265789abf264272ea090f88df8de92af8a@@":"@@text:3fdaca03cb003ee0b6ff1f192a417fe6e301d23da80347366aee35dd7bbac5bd@@"));
 }
 function close(){if(!expanded)return;expanded=false;if(typeof stopSpeech==="@@text:78f9ac018e554365069108352dacabb7fbd15246edf19400677e3b54fe24e126@@")stopSpeech();apply();}
 button.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{expanded=!expanded;if(!expanded&&typeof stopSpeech==="@@text:78f9ac018e554365069108352dacabb7fbd15246edf19400677e3b54fe24e126@@")stopSpeech();apply();});
 weekButton?.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{write(weekCookie,String(Date.now()+WEEK),604800);close();});
 // Capture before page navigation or other link handlers, including same-page anchors
 // and modifier/middle clicks that open another tab. Timers are never extended here.
 const followLink=event=>{if(event.type==="@@text:c1eeb2f850af9bca8edfa7f6c63127ffa6673d56fe83da1695e3641824160172@@"&&event.button!==1)return;if(event.target?.closest?.("@@text:49973cc2d813cb8aae497c9c0b0d61b02a3d4ea30bd4a3d1cc9c57bfacaa3b50@@"))close();};
 document.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",followLink,true);document.addEventListener("@@text:c1eeb2f850af9bca8edfa7f6c63127ffa6673d56fe83da1695e3641824160172@@",followLink,true);
 apply();
})();
