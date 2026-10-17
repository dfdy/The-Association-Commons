"@@text:d96cdf6b2af72cafeb4130ea0259d11c700387604fb847b6a4e2d1c91fab9adf@@";
const languages=[["@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@", "@@text:ba118bf7fc9c1aedc1edb28a0aa86e0b43b681f222af6616e13c43be87815b06@@"], ["@@text:afac70e63187b00e8fc5f50d7a23eeeae956e72af28c5ecd25e1cc664811ce6e@@", "@@text:48c85ec49f33e938263c79700174d92f166a1f89c5f791d64a94bdeca4cfd4b9@@"], ["@@text:82cefa8283d30fda9c86f8a976b95d79b395d4cff62a3c8242c7153039bfcde6@@", "@@text:56063629f95f67754b5f31ff89c39514a7ee03107a696eccb588676932075129@@"], ["@@text:fa4b905a71a4f87030fbcca8217df848720cc772abb51fb5481a814ce73599f5@@", "@@text:48781aedfc7fb4cfc31f83c4b3c4d200e494d88c14e251fd7505e3c03e548bfb@@"], ["@@text:503126878d17fcd6bde7df320ff6eb7c278a1c42f30014a03b17f3dd0c023c1d@@", "@@text:6884e4dc730055b5fa078865884341f1a6acbac2b0cde02bcfa9adbdc734be8f@@"], ["@@text:b0e8e4f09cdcbcb482e0eff27af8ea5f93bae99650b62d9c8e1156a504de32a6@@", "@@text:6fe2beb78226c8350ff30f98f90c13c95038ceded20602a6cac984e7839eb668@@"], ["@@text:7f46a725b2634e4c3dc09054aadd4e64632dc1423cb31a4adc2c2686c62256ba@@", "@@text:a34c5050acdd97f4ef5dc99ecccb381ac8937d4addf7c77f929387c176be7baa@@"], ["@@text:193d984cc43c234ce581f221496f1965ff3be1a7f416f8ea6ed83e7b96a132a2@@", "@@text:b510a1d33674fb57e45f2aee2524d3b111a5a79de4bad03f2d7f81dcceaa6ab2@@"], ["@@text:56af4bde70a47ae7d0f1ebb30e45ed336165d5c9ec00ba9a92311e33a4256d74@@", "@@text:558eb70abdfc24201e7559eb551a966d7f803241921e4364f093bb2c2bfeefd7@@"], ["@@text:44ad63f60af0f6db6fdde6d5186ef78176367df261fa06be3079b6c80c8adba4@@", "@@text:8196cc9fa75d4332a7ebe8501c2767f3e28fb4c70581f17acdde26941bd7054b@@"], ["@@text:a31fe9656fc8d3a459e623dc8204e6d0268f8df56d734dac3ca3262edb5db883@@", "@@text:1b90d05da8da903854b72f7599aaa07c2c14d5c962b138b1a523d4e716ae5dc2@@"], ["@@text:4bd2c412ba70847f497a7adb5ccd527724bfd229fc9b24f755c32b270459464b@@", "@@text:d3dc973774c8034d49dfc3b3cc0075f5079560339421d7e174630db5a5879d43@@"], ["@@text:6194e73eb25916046397e515de98f4e4357e06af9f3054d347ffe82aadfd8bf2@@", "@@text:ac47f6d02e9a9a4ee3da72228c42adcf722010177ef38c1a3e751cb3ab4bb3eb@@"], ["@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@", "@@text:b62f38289d034ef698df81c1f182fb03676abb4100e29367a1714fac73da5c8c@@"]];
const validCodes=languages.map(l=>l[0]);
const COOKIE_SECONDS=34560000; // 400 days; modern browser cookie lifetime upper bound
const cookieName="@@text:c7d277408b558f74c544f8feca9703d4c57d5cb9df124350276fb8e84d7baa0c@@";
function getPrefs(){try{const match=document.cookie.split("@@text:0a2d3f8f9b727cf73e6c7e44f2feefc41855195b3010a3c4f6b05c33aeb484a9@@").find(s=>s.startsWith(cookieName+"@@text:380918b946a526640a40df5dced6516794f3d97bbd9e6bb553d037c4439f31c3@@"));const p=match?JSON.parse(decodeURIComponent(match.slice(cookieName.length+1))):{};return {clicks:Object.fromEntries(validCodes.map(code=>[code,Number.isSafeInteger(p.clicks?.[code])&&p.clicks[code]>=0?p.clicks[code]:0])),voice:typeof p.voice==="@@text:473287f8298dba7163a897908958f7c0eae733e25d2e027992ea2edc9bed2fa8@@"?p.voice:"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@",rate:Number.isFinite(Number(p.rate))?Math.min(2,Math.max(0.5,Number(p.rate))):1,theme:p.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@"?"@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@":"@@text:944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b@@",order:Array.isArray(p.order)?[...new Set(p.order.filter(x=>validCodes.includes(x))),...validCodes.filter(x=>!p.order.includes(x))]:[...validCodes]};}catch{return {clicks:Object.fromEntries(validCodes.map(code=>[code,0])),theme:"@@text:944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b@@",order:[...validCodes],voice:"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@",rate:1};}}
let prefs=getPrefs();
function save(){document.cookie=cookieName+"@@text:380918b946a526640a40df5dced6516794f3d97bbd9e6bb553d037c4439f31c3@@"+encodeURIComponent(JSON.stringify(prefs))+"@@text:c179c7397f7235f684d9221e66856487fd83ed8df2b1886996cd94cf00e3609e@@" + COOKIE_SECONDS + "@@text:d68ad97df2f74cb41f0da8eba5cb494bdc167073909237772ba7ae8c6ca87e11@@"+(location.protocol==="@@text:08cf2045c958cd55b2a5b4a9f9548ab747d9304a796e26fc5ffad07eb3784929@@"?"@@text:40744f57fe9e14b8571352a5289a41170c7c0902e448ef13891a9ae391656144@@":"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@");}
function languageHeat(count){return Math.min(50,Math.max(0,50*count/(count+10)));}
function recordLanguageClick(code){const counts=getPrefs().clicks;counts[code]=Math.min(Number.MAX_SAFE_INTEGER,counts[code]+1);prefs.clicks=counts;save();return languageHeat(counts[code]);}
function currentCode(){const code=location.pathname.split("@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@").filter(Boolean)[0];return validCodes.includes(code)?code:"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";}
function theme(){document.body.classList.toggle("@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@",prefs.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@");document.getElementById("@@text:516fa9cddb900620b74e64020e025d1e84e2728183d63b50524951ac42b9793a@@").textContent=prefs.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@"?"@@text:9244a7f0c32fc0386f8bd0ac8a39ff965e501d67674d1c4418b67f0705bd37fb@@":"@@text:e7078f429474b63c27aa8bc9804697aa092db6c412983a6051b6f61d5030cbed@@";document.getElementById("@@text:fd410c6d1fee29ffd8d14a9fbca57c504c582f1b153af1e70e88ba24de79d7cd@@").textContent=prefs.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@"?"@@text:a0a2b015fee305ebe34ddf0009c76f5b6c7b4a639fc20fe6efaca871f42aa4d9@@":"@@text:88063e5a3c40660cb37b74c42df11df0918abb4deddedeaba07a43abbc19780a@@";}
function renderNav(){const code=currentCode();for(const root of [document.getElementById("@@text:6cb574fa10b6ee206bf9b8e73dcb1913e3ee52c09f4534027d01c354c0c2d68c@@"),...document.querySelectorAll("@@text:a7d70bbd272c4b8a330b3df0e22a6b037215f5424fedca29b2484858956d5d38@@")]){root.replaceChildren();for(const c of prefs.order){const a=document.createElement("@@text:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb@@");a.className="@@text:616f7def70ebc104304d6d2efb002fcb6100d8a6d8e76c5aa06f6572e69a0e8e@@";a.dataset.language=c;a.href=/\/(stadgar|donate)\/?$/.test(location.pathname)?"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+c+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+location.pathname.split("@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@").filter(Boolean).at(-1)+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@":"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+c+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@";a.textContent=c==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:7a1c5ab8ff80a645c64c89d6d6e43d746577bcb0f79fa5b24895bb2707a5d4c9@@":languages.find(x=>x[0]===c)[1];if(c==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"){a.title=languages.find(x=>x[0]===c)[1];a.setAttribute("@@text:66ba2129a90d4a5810ec62bcf19ac63372c4ca9f44becbd2cf588b101cc8228d@@",a.title);}a.lang=c==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@":c;a.dir=c==="@@text:4cd8cf8e48cfb313c2c5136ab40bd2b5f43de704542db49b85c0a2006a47832e@@"?"@@text:09317fe22ca2985249d900071ed1e7bba89a9eb8120d31f66e7143957e44dbcf@@":"@@text:9422b24d2f1f1fc85c11d8c79624a50a75fc77c4dedb8d12ad59d597ac545431@@";a.style.setProperty("@@text:255a031292d9b5ec89010c6557d069e7d0f220b9e8f87f296cb0d13122e7ff05@@",languageHeat(prefs.clicks[c]).toFixed(3)+"@@text:bbf3f11cb5b43e700273a78d12de55e4a7eab741ed2abf13787a4d2dc832b8ec@@");if(c===code&&!/\/languages\/?$/.test(location.pathname))a.setAttribute("@@text:92f91897ec88a666df48f57d93f97c40ff301d00af6548dafe420a54c02d1308@@","@@text:3660315a9af3df255d8f19ab077e4797822b41488a0e2a04bc6af71213c23274@@");a.addEventListener("@@text:c1eeb2f850af9bca8edfa7f6c63127ffa6673d56fe83da1695e3641824160172@@",e=>{if(e.button===1){recordLanguageClick(c);refreshLanguageHeat();}});a.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",e=>{recordLanguageClick(c);refreshLanguageHeat();if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();navigate(c)});root.appendChild(a);}if(root.id==="@@text:6cb574fa10b6ee206bf9b8e73dcb1913e3ee52c09f4534027d01c354c0c2d68c@@"){const other=document.createElement("@@text:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb@@");other.className="@@text:e58d8f9779ff1af7a706ec790e395a96394039082f2c98077253a980ba4d74bd@@";other.href=currentCode()==="@@text:afac70e63187b00e8fc5f50d7a23eeeae956e72af28c5ecd25e1cc664811ce6e@@"?"@@text:3b81d7e167958bba94d42556baad39339dcd35117f77383f2f430b94063e711e@@":"@@text:cb452ccf88ce275715f43ef9822541c11ac0e717910e8cb51e87cbd8f76fe6a8@@";other.textContent="@@text:c290b162c94ace60cd7068b505f33d13e3b57f3ef1a64483a274bce31df1d499@@";if(/\/languages\/?$/.test(location.pathname))other.setAttribute("@@text:92f91897ec88a666df48f57d93f97c40ff301d00af6548dafe420a54c02d1308@@","@@text:3660315a9af3df255d8f19ab077e4797822b41488a0e2a04bc6af71213c23274@@");root.appendChild(other);}}for(const id of ["@@text:6329b40d59abdb836ffa9c01091e7f4632b2c56e0422a258576f71990e8386dd@@","@@text:94df8b923fde3ac6de984ac976af823cb3e26d8800cd9dea6e412d3b2c3941d4@@"]){const link=document.getElementById(id);if(link)link.href=code==="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@"?"@@text:266c7a56bfc62042f84e93a6f6392d78c3306d43072afa3a8b345631ad543edb@@":"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+code+"@@text:266c7a56bfc62042f84e93a6f6392d78c3306d43072afa3a8b345631ad543edb@@";}refreshLanguageHeat();}
function refreshLanguageHeat(){for(const link of document.querySelectorAll("@@text:1ac4627ebb4ebe3924604d742207ced82fc9c5433375cc71992c6ea9fe340995@@"))link.style.setProperty("@@text:255a031292d9b5ec89010c6557d069e7d0f220b9e8f87f296cb0d13122e7ff05@@",languageHeat(prefs.clicks[link.dataset.language]).toFixed(3)+"@@text:bbf3f11cb5b43e700273a78d12de55e4a7eab741ed2abf13787a4d2dc832b8ec@@");}
// Progressive enhancement: screen-reader semantics remain valid if browser speech is unavailable.
// One playback toggle is added at the bottom of each related content group,
// without putting interactive buttons inside a heading or paragraph.
const synth=window.speechSynthesis;
const Reader=window.SpeechSynthesisUtterance;
const speechAvailable=!!(synth&&Reader);
const readPage=document.getElementById("@@text:790d97ed6e317dac9b265630e930267ae8e7a36e26694876586473f88548463b@@");
const stopButton=document.getElementById("@@text:4c21802e6b4b618b0476e5a0f3380519231f5cf57b5c905024c318271fe577a5@@");
const voiceSelect=document.getElementById("@@text:87d4a0892aadad6714cb5d8b8d617ed10b8597a1440449818e7b982b64149dc9@@");
const rateInput=document.getElementById("@@text:3e04f2f1d6b081b0107f45ce269d788328a7145218f525ed456bf7b0469a98f5@@");
const rateDisplay=document.getElementById("@@text:e4d7140d3c0d4ae910eb930b46f57be915378c201a6516950735fec79cd58fe6@@");
const status=document.getElementById("@@text:188a5c9f3f5817b9d3e05445f90ea5962c74db4d1f4e4eee818abe2b28e1cf27@@");
let queue=[],pointer=0,reading=false,paused=false,activeBlock=null,runId=0,voiceList=[];
let activePlaybackControl=null,voiceRestartPending=false;
const playbackControls=new Set();
const speakables="@@text:e05630e35987a2755ebc941e6be0096f2622fb1428f656a29f95cadc536a176e@@";
function eligible(el){return !!(el&&el.closest("@@text:7b8869de9685dc59c972319a2ed0c8e948526c6ed00fb258f5c963aa56c42e99@@")&&!el.closest("@@text:07397d633f25a7101990a75864ae03d5a3b9ac07c4ed6accbc52cbfd7d7c13b4@@")&&!el.closest("@@text:69fd60873a2c9a19c570737c6c54cc1a0018bc1781fb43ae88c22205e9d5d098@@")&&!el.closest("@@text:08460cd29d92c3e46e220abd9133261a2057e647e3c7593709b1b5267c415729@@")&&el.getClientRects().length&&el.textContent.trim());}
function textFor(el){
  const copy=el.cloneNode(true);
  copy.querySelectorAll("@@text:a75311d642f465978601887383d51211f4c393c714d82df3bf6aa0275860636c@@").forEach(node=>node.remove());
  return copy.textContent.replace(/\s+/g,"@@text:36a9e7f1c95b82ffb99743e0c5c4ce95d83c9a430aac59f84ef3cbfab6145068@@").trim();
}
function readingTargets(root){
  if(!root)return [];
  const candidates=[...root.querySelectorAll(speakables)];
  const selected=new Set(candidates);
  return candidates.filter(el=>{
    for(let parent=el.parentElement;parent&&parent!==root;parent=parent.parentElement)if(selected.has(parent))return false;
    return true;
  });
}
function blocksFrom(root){return readingTargets(root).filter(eligible).filter(el=>!el.closest("@@text:34a671458739d6230228b10181b70b362ffee26b9b49bd0f1abdee0ea6a1d80d@@"));}
function clearHighlight(){if(activeBlock){activeBlock.classList.remove("@@text:ddff131584bc80bd50f3f0eebcb0eec831bde29dead703cd1f01e12ac35ed771@@");activeBlock=null;}}
function updateSpeechControls(){
 readPage.disabled=!speechAvailable;stopButton.disabled=!reading;
 for(const entry of playbackControls){
  if(entry.button.isConnected===false){playbackControls.delete(entry);continue;}
  const active=reading&&activePlaybackControl===entry.button;
  const playing=active&&!paused;
  const action=playing?"@@text:86d951e333565b0cb3edb1a948ff5bee33cb49ee73df872b9f2fd698c0770353@@":active?"@@text:022b16ec8e02a83880c47222decf59245cc75380068c9ae50a61ec2e61536930@@":entry.idleLabel;
  entry.button.disabled=!speechAvailable;
  entry.icon.textContent=playing?"@@text:12c34a19d48a8ff98dce658f0bc760d236359acda979026e65e8ae3962a449ed@@":"@@text:0c969d4a2a2cda4eb015715c1a1e82045a398a50794bd3dec2bf2287d0a5873c@@";
  if(entry.label)entry.label.textContent=playing?"@@text:86d951e333565b0cb3edb1a948ff5bee33cb49ee73df872b9f2fd698c0770353@@":active?"@@text:022b16ec8e02a83880c47222decf59245cc75380068c9ae50a61ec2e61536930@@":entry.idleLabel;
  entry.button.setAttribute("@@text:66ba2129a90d4a5810ec62bcf19ac63372c4ca9f44becbd2cf588b101cc8228d@@",action+(entry.context?"@@text:45822f54a0d0e030f75698c9252f1345982e743c9466806048f542467b3ca4f9@@"+entry.context:"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@"));
  entry.button.setAttribute("@@text:caf57005bfdd09951472bf5986439ca14cdf760b0d5ff57f0cbcf681099f1d68@@",String(playing));
  entry.button.title=action;
 }

}
function stopSpeech(){runId++;queue=[];pointer=0;reading=false;paused=false;activePlaybackControl=null;voiceRestartPending=false;if(speechAvailable)synth.cancel();clearHighlight();if(status)status.textContent="@@text:cae7d57bc067a514b8e34c9589631a95c7dc051638ddd2a190773269279a99df@@";if(readPage)updateSpeechControls();}
function togglePause(){
 if(!reading)return;
 if(paused){paused=false;if(voiceRestartPending){voiceRestartPending=false;nextSpeech(runId);}else synth.resume();status.textContent="@@text:022b16ec8e02a83880c47222decf59245cc75380068c9ae50a61ec2e61536930@@";}
 else{paused=true;synth.pause();status.textContent="@@text:86d951e333565b0cb3edb1a948ff5bee33cb49ee73df872b9f2fd698c0770353@@";}
 updateSpeechControls();
}
function bindPlaybackButton(button,elements,context,idleLabel){
 const icon=button.querySelector("@@text:fc2d022d44fa48dc946367e87b0fb1ca691fc570d13182ef34438f205dda8437@@")||button;
 const label=button.querySelector("@@text:6ab8c39e84c4a5e033aacd1c5deb985b092dc366d1ca8ae807c05f4668b02312@@");
 playbackControls.add({button,icon,label,context,idleLabel});
 button.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{
  if(reading&&activePlaybackControl===button)togglePause();
  else playElements(elements(),button);
 });
}
function voiceKey(voice){return JSON.stringify([voice.voiceURI,voice.name,voice.lang,!!voice.localService]);}
function resolveVoice(key,voices){return voices.find(v=>voiceKey(v)===key)||voices.find(v=>v.voiceURI===key)||null;}
function chooseVoice(){
 // Read the control at playback time and obtain a current browser voice object.
 const voices=synth.getVoices();if(voices.length)voiceList=voices;
 const key=voiceSelect.value??prefs.voice;
 const selected=resolveVoice(key,voiceList);
 if(selected)return selected;
 const lang=(currentCode()==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@":currentCode()).split("@@text:3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112@@")[0].toLowerCase();
 return voiceList.find(v=>v.lang.toLowerCase().split("@@text:3973e022e93220f9212c18d0d0c543ae7c309e46640da93a4a0314de999f5112@@")[0]===lang)||null;
}
function refreshVoices(){
 if(!speechAvailable)return;
 const requested=voiceSelect.value||prefs.voice;
 voiceList=synth.getVoices();
 // A transient empty list must not erase an existing selection.
 if(!voiceList.length)return;
 const selected=resolveVoice(requested,voiceList);
 voiceSelect.replaceChildren(new Option("@@text:f46fb9bab1cdb0a42046debec42849bec0e7c3f9fa94e77e0021133b7fbad23a@@","@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@"));
 const lang=currentCode()==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@":currentCode();
 for(const voice of [...voiceList].sort((a,b)=>Number(b.lang.toLowerCase().startsWith(lang.toLowerCase()))-Number(a.lang.toLowerCase().startsWith(lang.toLowerCase()))||a.name.localeCompare(b.name))){
  voiceSelect.add(new Option(voice.name+"@@text:4f5a2ada1166172aa1744ca79a54e169d0a38da140fd0e02c6b0c68a4efbca90@@"+voice.lang+"@@text:ba5ec51d07a4ac0e951608704431d59a02b21a4e951acc10505a8dc407c501ee@@",voiceKey(voice)));
 }
 voiceSelect.value=selected?voiceKey(selected):"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@";
}
let speechPrimed=false;
function primeSpeech(id){
 // Firefox may ignore the chosen voice on its first utterance (Mozilla 1895109).
 // Initialise it silently, then read the requested passage with the chosen voice.
 if(speechPrimed||!(/Firefox\//.test(window.navigator?.userAgent||"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@")))return false;
 speechPrimed=true;
 const voice=chooseVoice();if(!voice)return false;
 const primer=new Reader("@@text:cdb4ee2aea69cc6a83331bbe96dc2caa9a299d21329efb0336fc02a82e1839a8@@");primer.voice=voice;primer.lang=voice.lang;primer.volume=0;
 const finish=()=>{if(id!==runId||!reading)return;if(paused)voiceRestartPending=true;else nextSpeech(id);};
 primer.onend=finish;primer.onerror=finish;synth.speak(primer);return true;
}
function nextSpeech(id){if(id!==runId||!reading||paused)return;if(primeSpeech(id))return;clearHighlight();while(pointer<queue.length){const el=queue[pointer++];if(!eligible(el))continue;const text=textFor(el);if(!text)continue;activeBlock=el;el.classList.add("@@text:ddff131584bc80bd50f3f0eebcb0eec831bde29dead703cd1f01e12ac35ed771@@");const utterance=new Reader(text);utterance.lang=el.closest("@@text:02bd5ec8cd2acf67854f9449aabb40591bc48f751a6fbcd43d27f2cc894b0d92@@")?.lang||document.documentElement.lang||"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";utterance.rate=prefs.rate;const voice=chooseVoice();if(voice){utterance.voice=voice;if(voiceSelect.value)utterance.lang=voice.lang;}utterance.onend=()=>nextSpeech(id);utterance.onerror=e=>{if(e.error!=="@@text:f12fde684b2ed4c627b777a0d2346ef769ccdd9f3e4ad3dab5cf663ba9598d0f@@"&&e.error!=="@@text:d512d96ea31ab0b9bb9b66da70c4d675f7db657518f4b6c0cc6d5823e6da5509@@")status.textContent="@@text:660e1a5434dbd35a598613533be15d464567d250cc1e08b0b799608c5e8e0167@@"+e.error;nextSpeech(id);};synth.speak(utterance);status.textContent="@@text:750e91863991221d7182b7d157cfd3360a2dfda16637b9cb4ffbe461ca7df16b@@"+text.slice(0,90);return;}reading=false;paused=false;activePlaybackControl=null;clearHighlight();updateSpeechControls();status.textContent="@@text:3ccf1ba7f814f545dcb588c4701d3ac7952fe849f440a8cd161092d2035584de@@";}
function playElements(elements,control=readPage){if(!speechAvailable)return;stopSpeech();queue=elements.filter(eligible);pointer=0;if(!queue.length){status.textContent="@@text:26b068909a8ffdd678036a04445346201857d4fae412363d59d04e0bf9070e02@@";return;}activePlaybackControl=control;reading=true;updateSpeechControls();nextSpeech(runId);}
function readingGroups(root){
 const groups=new Map();
 for(const el of readingTargets(root)){
  if(el.closest("@@text:07397d633f25a7101990a75864ae03d5a3b9ac07c4ed6accbc52cbfd7d7c13b4@@")||el.closest("@@text:69fd60873a2c9a19c570737c6c54cc1a0018bc1781fb43ae88c22205e9d5d098@@")||el.closest("@@text:34a671458739d6230228b10181b70b362ffee26b9b49bd0f1abdee0ea6a1d80d@@"))continue;
  const container=el.closest("@@text:8e4445a945df953427bc045610d91fa2e22e69f881b252913dbfa6fb514e53ce@@")||el.parentElement||el;
  if(!groups.has(container))groups.set(container,[]);
  groups.get(container).push(el);
 }
 return [...groups.values()];
}
function placeReadingControl(anchor,controls){
 // Preserve the authored document structure and put the control after its text.
 anchor.after(controls);
}
function enhanceReading(){
 // Keep controls after the complete group, outside headings and paragraphs.
 for(const elements of readingGroups(document.getElementById("@@text:ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73@@"))){
  if(elements.every(el=>el.dataset.speechReady))continue;
  elements.forEach(el=>{el.dataset.speechReady="@@text:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b@@";});
  const excerpt=textFor(elements[0]).slice(0,65);
  const button=document.createElement("@@text:c3e2d78f3ff335724b4029f06505b511e4f8f01e258828de29849b36b40b55d0@@");button.type="@@text:c3e2d78f3ff335724b4029f06505b511e4f8f01e258828de29849b36b40b55d0@@";button.className="@@text:c6c1941f0b7c2a20803f0b95dbc9dc975ed7e8a7da347e3b2648c035874fc030@@";button.textContent="@@text:0c969d4a2a2cda4eb015715c1a1e82045a398a50794bd3dec2bf2287d0a5873c@@";button.disabled=!speechAvailable;
  bindPlaybackButton(button,()=>elements,excerpt,"@@text:a65493756cbc0907504f219d99a9bc046b71cf3419fc5949e2a817c8f9d3921e@@");
  const controls=document.createElement("@@text:37a0025aa1f2e29f9f88f59f961e44a320849dfc79a85ef3c02654d50d2e7480@@");controls.className="@@text:009454391cf9e0be79ff4507384aa7bd75d525b00ab5448733579814a60dda93@@";
  controls.append(button);placeReadingControl(elements[elements.length-1],controls);
 }
}

rateInput.value=String(prefs.rate);rateDisplay.textContent=prefs.rate.toFixed(1).replace(/\.0$/,"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@")+"@@text:8db71ed28b0f2f1432561e8d8a0dc3878f2da540c53a2ab82335b6f716da2ef3@@";
rateInput.addEventListener("@@text:c96c6d5be8d08a12e7b5cdc1b207fa6b2430974c86803d8891675e76fd992c20@@",()=>{prefs.rate=Number(rateInput.value);rateDisplay.textContent=prefs.rate.toFixed(1).replace(/\.0$/,"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@")+"@@text:8db71ed28b0f2f1432561e8d8a0dc3878f2da540c53a2ab82335b6f716da2ef3@@";save();});
voiceSelect.addEventListener("@@text:12ea12eace7d655f471ce55e34f89b1b77a3d9d05a445ca82877dd2235beaa51@@",()=>{
 prefs.voice=voiceSelect.value;save();
 if(!reading)return;
 // Restart only the current passage; preserve its owner, queue and pause state.
 runId++;synth.cancel();if(activeBlock)pointer=Math.max(0,pointer-1);clearHighlight();
 voiceRestartPending=paused;
 if(!paused)nextSpeech(runId);
 updateSpeechControls();
});
bindPlaybackButton(readPage,()=>[...blocksFrom(document.getElementById("@@text:7ab4098aed0cfa88338b5de1ac26cb6b0e2b3907525ec74e319bd440528b6643@@")),...blocksFrom(document.getElementById("@@text:e5165c7266790e6dfdf72f80ae026a454dca05b539fd115ace57fc3a92a4bd84@@"))],"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@","@@text:05528ea63e73479f2431a161f8661b750e78ab2be878b9593aa8a665b411da2f@@");
stopButton.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",stopSpeech);
if(!speechAvailable){status.textContent="@@text:d61b9ca780a46166930e2fb7e16534275632d36b857d881ea768eb9f44c56dab@@";readPage.title="@@text:6209082a9d92714c49391b8f7a285bcfd6ac7083ec671393b1d57c126d2a62e7@@";}
else{refreshVoices();if("@@text:35a7274c5a50bb996a6041e38a056e0a095db989fefe4b014995ff4b9fe67f4f@@" in synth)synth.addEventListener("@@text:e268d370611ac73dff589379034bef4a5ec13ea4709bedf9ff1a8e0c5bc095c5@@",refreshVoices);}
enhanceReading();updateSpeechControls();


function navigate(code){stopSpeech();prefs.order=[code,...prefs.order.filter(c=>c!==code)];save();location.assign("@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+code+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@");}
document.getElementById("@@text:3cb8201e7ff1e7777446032ef1bf4338535aadbabe464c15411cdce8c2317590@@").addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{prefs.theme=prefs.theme==="@@text:944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b@@"?"@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@":"@@text:944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b@@";save();theme();});
document.getElementById("@@text:46ea3523e4eb05b2562e99e492e4b246331864b70c80a0aa927469352071abe6@@").addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{stopSpeech();window.downloadPagePdf();});
const form=document.getElementById("@@text:23f41c306b2d65054352a718d39cd5cafcc5f2a35db69d5ff9110563846bcc17@@");form.addEventListener("@@text:75490bd7b93e6fa7d18cfdea90cc6bcb983d5f3ea326249d2709ca6c94bc07ba@@",async e=>{e.preventDefault();const msg=document.getElementById("@@text:c43e07bbc6a80a2eb6d09a539ba61b2e1a160ad3ea0a67557c46417e9f807ff9@@"),button=form.querySelector("@@text:973ec0854001cec80e3c054fb1c74097454248d241a988be0f63a09f3845dcb9@@");msg.textContent="@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@";button.disabled=true;const fields=Object.fromEntries(new FormData(form));fields.consent=form.elements.consent.checked;fields.project=currentCode();fields.requestType="@@text:0d47e81b5976fb454525bdb8421a06b389f98982c1c33217f468d7474a84a367@@";try{const response=await fetch("@@text:719f814569f2677f9c8857249b7ccbb24ac1f8391d8795b323d21d3558ba8d73@@",{method:"@@text:9aee6b1bcdf617d8e39bb1f2b624c68ea33deb9d48e0364aeaded836d3d00293@@",headers:{"@@text:85eb00994d09e4d052a0480491f909eaf1674566972877d1a5932d0f014444b7@@":"@@text:bacb769b46f6d169fb227ea026550f411d46cbe66a9c2a6ba36449c8cf8e4dea@@"},body:JSON.stringify(fields)});if(!response.ok)throw new Error();msg.textContent="@@text:cbf4dd21b5d02195211715ad0e89ce4208977c3ded22f6621d2d91127c6202c2@@";form.reset();}catch{msg.textContent="@@text:69b2b865de7ef3e31aa3cc4ca96dcc9bdc5bda0322684dd2f924542ad92d4134@@";}finally{button.disabled=false;}});
for(const link of document.querySelectorAll("@@text:bd516af4a7cfa9489e10d1bbd5a2e89ff0180465a2251eaa041e7e9b7967acf1@@")){link.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{recordLanguageClick(link.dataset.language);prefs.order=[link.dataset.language,...prefs.order.filter(c=>c!==link.dataset.language)];save();});}
prefs.order=[currentCode(),...prefs.order.filter(c=>c!==currentCode())];save();renderNav();theme();updateSpeechControls();
