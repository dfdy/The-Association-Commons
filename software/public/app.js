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
function theme(){document.body.classList.toggle("@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@",prefs.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@");document.getElementById("@@text:516fa9cddb900620b74e64020e025d1e84e2728183d63b50524951ac42b9793a@@").textContent=prefs.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@"?"@@text:6864bb77953b5948e8a7889f8805263f837579d7c32828e78e3db1159c4fc07f@@":"@@text:13c3d243ac00feed29214dbfd934a89018b95ce38dc432c88907209a02c8b6b1@@";document.getElementById("@@text:fd410c6d1fee29ffd8d14a9fbca57c504c582f1b153af1e70e88ba24de79d7cd@@").textContent=prefs.theme==="@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@"?"@@text:a0a2b015fee305ebe34ddf0009c76f5b6c7b4a639fc20fe6efaca871f42aa4d9@@":"@@text:88063e5a3c40660cb37b74c42df11df0918abb4deddedeaba07a43abbc19780a@@";}
function renderNav(){const code=currentCode();for(const root of [document.getElementById("@@text:6cb574fa10b6ee206bf9b8e73dcb1913e3ee52c09f4534027d01c354c0c2d68c@@"),...document.querySelectorAll("@@text:a7d70bbd272c4b8a330b3df0e22a6b037215f5424fedca29b2484858956d5d38@@")]){root.replaceChildren();for(const c of prefs.order){const a=document.createElement("@@text:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb@@");a.className="@@text:616f7def70ebc104304d6d2efb002fcb6100d8a6d8e76c5aa06f6572e69a0e8e@@";a.dataset.language=c;a.href=/\/(stadgar|donate)\/?$/.test(location.pathname)?"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+c+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+location.pathname.split("@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@").filter(Boolean).at(-1)+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@":"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+c+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@";a.textContent=c==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:7a1c5ab8ff80a645c64c89d6d6e43d746577bcb0f79fa5b24895bb2707a5d4c9@@":languages.find(x=>x[0]===c)[1];if(c==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"){a.title=languages.find(x=>x[0]===c)[1];a.setAttribute("@@text:66ba2129a90d4a5810ec62bcf19ac63372c4ca9f44becbd2cf588b101cc8228d@@",a.title);}a.lang=c==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@":c;a.dir=c==="@@text:4cd8cf8e48cfb313c2c5136ab40bd2b5f43de704542db49b85c0a2006a47832e@@"?"@@text:09317fe22ca2985249d900071ed1e7bba89a9eb8120d31f66e7143957e44dbcf@@":"@@text:9422b24d2f1f1fc85c11d8c79624a50a75fc77c4dedb8d12ad59d597ac545431@@";a.style.setProperty("@@text:255a031292d9b5ec89010c6557d069e7d0f220b9e8f87f296cb0d13122e7ff05@@",languageHeat(prefs.clicks[c]).toFixed(3)+"@@text:bbf3f11cb5b43e700273a78d12de55e4a7eab741ed2abf13787a4d2dc832b8ec@@");if(c===code&&!/\/languages\/?$/.test(location.pathname))a.setAttribute("@@text:92f91897ec88a666df48f57d93f97c40ff301d00af6548dafe420a54c02d1308@@","@@text:3660315a9af3df255d8f19ab077e4797822b41488a0e2a04bc6af71213c23274@@");a.addEventListener("@@text:c1eeb2f850af9bca8edfa7f6c63127ffa6673d56fe83da1695e3641824160172@@",e=>{if(e.button===1){recordLanguageClick(c);refreshLanguageHeat();}});a.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",e=>{recordLanguageClick(c);refreshLanguageHeat();if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();navigate(c)});root.appendChild(a);}if(root.id==="@@text:6cb574fa10b6ee206bf9b8e73dcb1913e3ee52c09f4534027d01c354c0c2d68c@@"){const other=document.createElement("@@text:ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb@@");other.className="@@text:e58d8f9779ff1af7a706ec790e395a96394039082f2c98077253a980ba4d74bd@@";other.href=currentCode()==="@@text:afac70e63187b00e8fc5f50d7a23eeeae956e72af28c5ecd25e1cc664811ce6e@@"?"@@text:3b81d7e167958bba94d42556baad39339dcd35117f77383f2f430b94063e711e@@":"@@text:cb452ccf88ce275715f43ef9822541c11ac0e717910e8cb51e87cbd8f76fe6a8@@";other.textContent="@@text:28bdc8d3d09d197a210eeb9127e1c4f22f93c6c2ed891359257feeb5d0f2576a@@";if(/\/languages\/?$/.test(location.pathname))other.setAttribute("@@text:92f91897ec88a666df48f57d93f97c40ff301d00af6548dafe420a54c02d1308@@","@@text:3660315a9af3df255d8f19ab077e4797822b41488a0e2a04bc6af71213c23274@@");root.appendChild(other);}}for(const id of ["@@text:6329b40d59abdb836ffa9c01091e7f4632b2c56e0422a258576f71990e8386dd@@","@@text:94df8b923fde3ac6de984ac976af823cb3e26d8800cd9dea6e412d3b2c3941d4@@"]){const link=document.getElementById(id);if(link)link.href=code==="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@"?"@@text:266c7a56bfc62042f84e93a6f6392d78c3306d43072afa3a8b345631ad543edb@@":"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+code+"@@text:266c7a56bfc62042f84e93a6f6392d78c3306d43072afa3a8b345631ad543edb@@";}refreshLanguageHeat();}
function refreshLanguageHeat(){for(const link of document.querySelectorAll("@@text:1ac4627ebb4ebe3924604d742207ced82fc9c5433375cc71992c6ea9fe340995@@"))link.style.setProperty("@@text:255a031292d9b5ec89010c6557d069e7d0f220b9e8f87f296cb0d13122e7ff05@@",languageHeat(prefs.clicks[link.dataset.language]).toFixed(3)+"@@text:bbf3f11cb5b43e700273a78d12de55e4a7eab741ed2abf13787a4d2dc832b8ec@@");}
function navigate(code){stopSpeech();if(!validCodes.includes(code))code="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";prefs.order=[code,...prefs.order.filter(x=>x!==code)];save();if(code!==currentCode()){location.assign("@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+code+"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@");return;}history.pushState({code},"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@",`${"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"}${code}${"@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"}`);render();window.scrollTo({top:0,behavior:"@@text:618dc58379dda348eba010597accf72a98ab4cd357b42acdda4091901b2ff144@@"});}
function render(){stopSpeech();const code=currentCode(),lang=languages.find(x=>x[0]===code);document.getElementById("@@text:adb896165c1ef8b5d855dfa874465d917ff7edd0bdc7845626961898ea4ba045@@").hidden=code!=="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";document.getElementById("@@text:e5165c7266790e6dfdf72f80ae026a454dca05b539fd115ace57fc3a92a4bd84@@").hidden=code==="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";document.getElementById("@@text:29286f2e4d1a0cc126873eb6921d7d5ed89cb104994a4b15136ad3d9e3f44ea7@@").hidden=code!=="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@";if(code!=="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@"){document.getElementById("@@text:a8ea84743f95178b5aae18d11df1f257c92979d887484a49e7e8f4be36de8e39@@").textContent=lang[1];document.getElementById("@@text:c28d053d89776bb72eb231abb46e8cb0dd95823afe94a1295d53e777e8365ad5@@").textContent="@@text:20cb399e7a7cee55d7a3ff8ee63c50c884edee3659f3ab0980a2cfa3416e0941@@"+lang[1]+"@@text:a299170caebe0bc23e4d85527971b5c6899a66cdaa4bc58c40750c09aa5ecbe0@@";document.documentElement.lang="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";document.getElementById("@@text:a8ea84743f95178b5aae18d11df1f257c92979d887484a49e7e8f4be36de8e39@@").lang=code==="@@text:7730a0c845880bb451fce54287dc86bce4c40e499fd60237cc7c6e5e377e12c1@@"?"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@":code;document.getElementById("@@text:a8ea84743f95178b5aae18d11df1f257c92979d887484a49e7e8f4be36de8e39@@").dir=code==="@@text:4cd8cf8e48cfb313c2c5136ab40bd2b5f43de704542db49b85c0a2006a47832e@@"?"@@text:09317fe22ca2985249d900071ed1e7bba89a9eb8120d31f66e7143957e44dbcf@@":"@@text:9422b24d2f1f1fc85c11d8c79624a50a75fc77c4dedb8d12ad59d597ac545431@@";document.title=lang[1]+"@@text:3db7855a223423b866291ca333bec6655868e428cb715db4217533849d604baf@@";}else{document.documentElement.lang="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";document.title="@@text:5bcbb30b931e7777609bd26d7b777849bb558473b8114fc9dae7cac36311abbb@@";}document.getElementById("@@text:2af35073a32d3d3fcbd6600174cf849561927fda87b27e52b206c2f0b304afbb@@").href="@@text:8a5edab282632443219e051e4ade2d1d5bbc671c781051bf1437897cbdfea0f1@@"+code+"@@text:32a3d4dc0763feb816ea384752c67f34b755f2c4c837e8e6fbbd932d0ce13a94@@";renderNav();}
const principles=[["@@text:0991728cdf17765b37c3aa401bae1f35fe5546da42aebaa87da0934f224df3b1@@","@@text:aadea0c046eeb1523e065abf369e0fa00da7835b63b211ae019b0df07bcb9193@@","@@text:181fb3bc8ccfba26ce1997abf5b1f095e7e4c2647e87b7db17e5d1545da230b2@@"],["@@text:50885597f500b19ed34b9cb7bbf4af78f9fc71652e3ea3db1056380246e147d4@@","@@text:2764395d9e3cea48114421522fb9348764d92fce234f611e2af46817dac7bee5@@","@@text:5b0d5837251cfac1a896fd4f713e03e1ccf2a838bb8f5f2116bfe87e6fb7b591@@"],["@@text:f07db8ff19e691355695937fc01a1a027deea17ee74013e53ab562e81bce8455@@","@@text:f0ac08274abc7d4457f251bfd99026fda02e8aca2d11364de55d74cf89d6f552@@","@@text:33f87307d280c341d6bc4f29d51d9c08389d58c365ed74f965d6d04d4b260370@@"],["@@text:44c3a727b2d0c72772d836a77968777c1fe5a58751ca3ffc04158a14c178a21a@@","@@text:3dcaa01f218e08d6e9ea27a0bc930bd106aced618d6971f7a7de7216129526f3@@","@@text:7c3a947f1711f1e0ab6da271ab0c42cd8061a5ad99dc9dbd03420d03902c5073@@"],["@@text:5f91db385cabcef40de06d0e2a51350ba40038fe22c22da45926960027e8668f@@","@@text:fe27f0aebe824cb7324629819a9d12307ee693c91aaec88cf827a8e67564b12d@@","@@text:816546d3828aca94d623b5a9be997d4e9a442a106bb0b32dcabe5c78192a2177@@"],["@@text:2d76277e5fb1663b5db5099715e461c3668ce6920df7bb4d9313d0b1d65c88ff@@","@@text:2e254ac31819a1dbe236c42e93b2a862ccb0ecb82175205d75bd5be6a365a0c8@@","@@text:5f7e1545308018717214b6dfd0a264fe3d586ac79b94b1a0594d851be0e789a0@@"],["@@text:189cba40eb74325578b62816ab771f650bb5902699f6fe5d8ccd025589b66d22@@","@@text:28aa0c771c9147a275c4533dd539b0cad4f84f9485dc5fc3f4c30dd89a911f60@@","@@text:c21a6cfd171e1b7e72f99ad72f5890a984e2c130342e423784b8e52536951e8b@@"]];
const pRoot=document.getElementById("@@text:f9a2a84d6c846ba9c85763e5ce4adc5f0ec8a31a2076f276c13df334870ec5e6@@");principles.forEach((p,i)=>{const el=document.createElement("@@text:84393add8c489d33569360efd1bcb5f70ed5a22408127d241c751e5ea345eb7c@@");el.className="@@text:763f2223af429e9217be6bb4bd228441578f7646ea64b191057a81f9482d939e@@";el.innerHTML=`${"@@text:22dd75535403fa3ef52222eabd1eac6e2c62d4b6615760063d2cae65fe27207c@@"}${String(i+1).padStart(2,"@@text:5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9@@")}${"@@text:ffc9dffbf7d074c1f0bad5bb9b16d59fb71eb9fed7d9b8366226e215f6cbfd95@@"}${p[0]}${"@@text:6ffafed75795c1aad8dc9dc979f7c3cdc901d672d5d1c8fd8fe999843b4f8ee7@@"}${p[1]}${"@@text:7debde7735cecd9e32ed469aad33fd46f3e8a4245a0da7acd81f5aae62ce5b16@@"}${p[2]}${"@@text:66a72e31b374c1039522cbdb28c2bb9c10339b60bf63f33f099e7ef95d879709@@"}`;pRoot.appendChild(el)});
const clauses=[
["@@text:c841f668d0cf11acc82ecde58c87fece72f282c3cf75a90061d42e141991cadc@@","@@text:cf2d2be9652aabdf8369f21f1a48fdafe6afd9f70878a9239c392013a9ed450a@@"],
["@@text:8446f4815678662dc5ec31f39718e99e4df9d4f485dae89831a32c64b4408415@@","@@text:f6074ae49f6b9606e8e946a6e3ee0a8e0bf8291a9c5b52c16b2386061c0df236@@"],
["@@text:3ee78d73b81a47c7e3df763e65e9bf55e1888c99d25b5717532e40e675975482@@","@@text:cfe4771232247dbe10950d48613ebf1f936d52c86d2d886cf94e9bb702932bd4@@"],
["@@text:d456583904a7dd394696064df1106bc90fc44eefc1e884d5420a4b0ebf7794db@@","@@text:d696e4395b281bcdc410ea67eaef184592269dd6980dd2c345019ce05cf1e496@@"],
["@@text:7f3bb885a3e1863f80e2e82b895d79c886e0cf057980798db0e89ba3ce6b4a68@@","@@text:09abf50ea71da923c2826858cad598c016e4b7dc60c5c07bb244878922bf2593@@"],
["@@text:a6b7036effb76bb398b07f59446d8a25c00fbd8c34f63182a3c10140368020ff@@","@@text:61a717475df80a870b1816a028fafd71e508cc5963a23f361f22de3e233027f2@@"],
["@@text:3c026567d74783b5dd32d5709d9bbf53ff5b709baa30d03a57be603ae1b123a9@@","@@text:f4ce4c52e15df8879f629230ed7a680471671b41f9c569f40b2ae37315569cf6@@"],
["@@text:b13a94a3d9f2bf1820bf609c2f5d0d7045e89b111104d224c4590fd8e8084493@@","@@text:7af76cdb7b029ec17d0e75e270e5819a67b9f7c680dabc0534a2ddddc17f8655@@"],
["@@text:c95fac43dbdbb345a38d28f2f367de56d6bfcf972a03bed8274ca7fc6805e1eb@@","@@text:e0f804995c875c5b12152299239ca3639a56cb84e608ea26c341f633369385dc@@"],
["@@text:c2d55ae0f39b8ad8ddc908f8ac4f927ca253e292b23feec4ce4f639568116854@@","@@text:b69d534e708c8709f6b8f4b74766e08c31bafc476c29851887079b625bfc3d91@@"],
["@@text:61a49f5b82a3a581de36ab48f2ade83a1db4d7029e9061ba18b70eba7adbd24f@@","@@text:9248c6adf63d8378453a9dbc9e1959eb4d2c05c6714bc4b009e6cb9b1286bb8b@@"],
["@@text:ac290a81d935a47acd05baa10134055761cbe30c1159030515eeb096aaa457e7@@","@@text:dfa6986255835ae12716f3d70e1108c30c5b7f4080293a7c1d2688150b46954c@@"]
];
const cRoot=document.getElementById("@@text:82145d53916950aadcfe277b929a7ae70694ab76aa39c7589d7798aa2251067e@@");clauses.forEach((c,i)=>{const a=document.createElement("@@text:84393add8c489d33569360efd1bcb5f70ed5a22408127d241c751e5ea345eb7c@@");a.className="@@text:9d96e17fd46eb91085fe8e47f714bd58f95300e1a6eb7792fb30d3efdf85446c@@";const n=document.createElement("@@text:37a0025aa1f2e29f9f88f59f961e44a320849dfc79a85ef3c02654d50d2e7480@@");n.className="@@text:a56ca2ea9a519f5f5443fb54fbff6441c82c0795986f64e4f6b0561dba8e47ba@@";n.textContent=String(i+1).padStart(2,"@@text:5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9@@");const d=document.createElement("@@text:cd35a2426062b7d58fd4a63f813cc506ef87e449087d28d256b8c393f20fa364@@");const h=document.createElement("@@text:97fb5f8538b89f6c1accfd19836b65a73b61fbc2e0cbf84bb858a0fffa3f1592@@");h.textContent=c[0];const p=document.createElement("@@text:148de9c5a7a44d19e56cd9ae1a554bf67847afb0c58f6e12fa29ac7ddfca9940@@");p.textContent=c[1];d.append(h,p);a.append(n,d);cRoot.appendChild(a)});
const terms=[["@@text:b3c6e539553158528297ce41e9f9475ea921d6e318ede1d392d7cc6d77e5b3d4@@","@@text:55d57a2fb41e6ab556d7906dc7d1f5f60bd98a52601e6ed693c2b1d7f85f0362@@"],["@@text:aadea0c046eeb1523e065abf369e0fa00da7835b63b211ae019b0df07bcb9193@@","@@text:0991728cdf17765b37c3aa401bae1f35fe5546da42aebaa87da0934f224df3b1@@"],["@@text:2764395d9e3cea48114421522fb9348764d92fce234f611e2af46817dac7bee5@@","@@text:a7e9fba3f4fe411e0a084a29d20396c52d67455f4765b30a1a8cc2c4c4258097@@"],["@@text:f0ac08274abc7d4457f251bfd99026fda02e8aca2d11364de55d74cf89d6f552@@","@@text:7dfd4060fea954991c66bb8e0558c9d67a393a33dfa603bb99087fe9f20f03e4@@"],["@@text:3dcaa01f218e08d6e9ea27a0bc930bd106aced618d6971f7a7de7216129526f3@@","@@text:44c3a727b2d0c72772d836a77968777c1fe5a58751ca3ffc04158a14c178a21a@@"],["@@text:fe27f0aebe824cb7324629819a9d12307ee693c91aaec88cf827a8e67564b12d@@","@@text:9fa00526f1375d65f61cb8629d30ff13306f7a97e49283cf59faee78e625e8f2@@"],["@@text:2e254ac31819a1dbe236c42e93b2a862ccb0ecb82175205d75bd5be6a365a0c8@@","@@text:d579022ae506699f6265c68ea1300d75f018a51449eb240955bda718593a0322@@"],["@@text:28aa0c771c9147a275c4533dd539b0cad4f84f9485dc5fc3f4c30dd89a911f60@@","@@text:189cba40eb74325578b62816ab771f650bb5902699f6fe5d8ccd025589b66d22@@"],["@@text:00a353a74bbb12fb9232ab6cd19b545df00f6185a4cff23c6bdcfd2da3e77ee2@@","@@text:408d048098c553f75147b6bbfd0f5f61e267be1f28a3c299321d2ef606b7f5a8@@"],["@@text:7b3e34abc3fbd2920aef2e8f131887f0e49b97b001733a683ca8380e7a5592f9@@","@@text:6c53a8889e99859e72a90eb1173766a222046c368950c6cf3281865ecb0e89b5@@"],["@@text:a23f0f2994e2ec5cdf1986d562e57f97354ff0ba5eebe4345090c202889d8c61@@","@@text:a08a3d68f22f2aa762d118fdf49d0e70d61da41f09703af11b0838e904bed098@@"],["@@text:12a4d160bcc4700f364478fd9802d186ca59f6115d7f382de670d8899dcf9f27@@","@@text:1044a4c056d0d685bf4f09174d2bc136137765d62916779fadcacf006a99ffac@@"],["@@text:8b132550a9a1eb178920ac137ece006bd517eb1371abe0cf6393e831a41b4f83@@","@@text:a398b0643999a5abc90836fa6039bace6ddcbaa155c6ae56db7f7690ecd6d2c7@@"],["@@text:fd4b19c2011ba66b8ceaceb1aca111669db3b71ac6ccc045e328d7cc56c16f6e@@","@@text:4472a4d4ee5b86a1273685e846c995bfe06b69a2b1217f900249c72498f91f74@@"],["@@text:5578e47911ce7f8bf9517ed616530560ee6f258ed6735c1110d3592ec6f30d62@@","@@text:d4078222dd309dac853a98dc55092cb785374a6f8c67c3556fa40e9e27d72641@@"],["@@text:be90b15915763fb7ad4b2d066762e78aad034ff6a266b21dbf06cec26c00cfea@@","@@text:095adfbbd24fa042ea8f7e3d77082eae8e1913ca2a01d5b0f726c0f4d267b692@@"],["@@text:f5584ba8cc4cc07da90cecabf418a1b873bf49fb165c723b4b1b430be990a42f@@","@@text:89796fa1f007dc47752e4f1f8e9602b79c6f55ccb074ea9525f6dcfaad569dec@@"],["@@text:58f00518e00bc6729701ab0bb3b9ed81cc4a575f889bf4ccdea0c68b3e83d0ba@@","@@text:5a3e03aabc1167d7e6795bcc5855f242285e88ea650a3ab8a3e5850dbf17eaba@@"],["@@text:462bbd0dce5a06a3d26707a2dbe9a65cdef21a133ffbec0c5a2ff88dc269d629@@","@@text:eed123b54b714d4f043923b66efd35feb8b581aec24b7e71a76cdb94629aaba2@@"],["@@text:341a9a32337b2e53c0355f5d0d9bcd6b1a6c7d92343540aeb62fec3a0262afd9@@","@@text:4915feae51aace1c55d66f576feff65e84d0a531026fd36072c9e532049ba8aa@@"],["@@text:3cd89bfca75808a587c7229a5102dc7c7fba688bf1839314168f514f1849133d@@","@@text:7349deb09fbde7a8675af5035abbd5a6febaaa2e360f2ceaf8728a60d72d21fb@@"]];
const tRoot=document.getElementById("@@text:51d2361f4faea3bc8f9facdbc7d99abb555596a2e51f7b25fd3b41c93587e616@@");terms.forEach(([sv,en])=>{const a=document.createElement("@@text:cd35a2426062b7d58fd4a63f813cc506ef87e449087d28d256b8c393f20fa364@@");a.className="@@text:599f7703547e9c8e980f44d7d192d978b9e70386af1812b2042beeaf4ba03dfb@@";const b=document.createElement("@@text:3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d@@");b.lang="@@text:afac70e63187b00e8fc5f50d7a23eeeae956e72af28c5ecd25e1cc664811ce6e@@";b.textContent=sv;const p=document.createElement("@@text:148de9c5a7a44d19e56cd9ae1a554bf67847afb0c58f6e12fa29ac7ddfca9940@@");p.textContent=en;const links=document.createElement("@@text:abca4de9dd94d3ac2db9c470f8d4557f421b969fab4990c3c719629f7e7a8b69@@");links.className="@@text:5809e3380476fa8464f447007c603609ceded5110dee3d3cc9594d007ad9dbd7@@";links.setAttribute("@@text:66ba2129a90d4a5810ec62bcf19ac63372c4ca9f44becbd2cf588b101cc8228d@@","@@text:a8abdeb8f5e1772104a56cf012a3b4767bb6bf8c0d7428915b1d575840d1ed12@@"+sv);a.append(b,p,links);tRoot.appendChild(a)});
document.getElementById("@@text:3cb8201e7ff1e7777446032ef1bf4338535aadbabe464c15411cdce8c2317590@@").addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{prefs.theme=prefs.theme==="@@text:944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b@@"?"@@text:176473d7313395b6e209bc6b1d57aa160b628706860aa0554d7af60a1d40ab87@@":"@@text:944c27e5b97ab7793e4b6e9ff29384890ece0c7c04d2e2bf81c5f763469cc66b@@";save();theme();});
window.addEventListener("@@text:74de4b294cfb787fe8b56b3887a18925e48ececee09292345bbddaab8cbb6e99@@",()=>{const code=currentCode();prefs.order=[code,...prefs.order.filter(x=>x!==code)];save();render()});
function wireInterestForm(formId,messageId,isProject){
 const form=document.getElementById(formId);
 form.addEventListener("@@text:75490bd7b93e6fa7d18cfdea90cc6bcb983d5f3ea326249d2709ca6c94bc07ba@@",async e=>{
   e.preventDefault();const msg=document.getElementById(messageId),button=form.querySelector("@@text:973ec0854001cec80e3c054fb1c74097454248d241a988be0f63a09f3845dcb9@@");
   msg.textContent="@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@";button.disabled=true;
   const fields=Object.fromEntries(new FormData(form));fields.consent=form.elements.consent.checked;
   if(isProject){fields.project=currentCode();fields.requestType="@@text:0d47e81b5976fb454525bdb8421a06b389f98982c1c33217f468d7474a84a367@@";}else{fields.requestType="@@text:0feae16d55365acf07fe9f909834361ba6ee606854746539230bdc84a6a24cee@@";}
   try{const res=await fetch("@@text:719f814569f2677f9c8857249b7ccbb24ac1f8391d8795b323d21d3558ba8d73@@",{method:"@@text:9aee6b1bcdf617d8e39bb1f2b624c68ea33deb9d48e0364aeaded836d3d00293@@",headers:{"@@text:85eb00994d09e4d052a0480491f909eaf1674566972877d1a5932d0f014444b7@@":"@@text:bacb769b46f6d169fb227ea026550f411d46cbe66a9c2a6ba36449c8cf8e4dea@@"},body:JSON.stringify(fields)});
     const data=await res.json();if(!res.ok)throw new Error(data.error||"@@text:5f597b46aa27115622f9df48afe209e9c4f10438f9165d13af20915c0bb62ea0@@");
     msg.textContent=isProject?"@@text:61d758bdba871364f52f34c5e395f18c44fc20cbe95fa5436c119d2306cb6562@@"+languages.find(l=>l[0]===fields.project)[1]+"@@text:8da27014fd77eae50816ceff0de87be7819e87814c411ed9b79fbdbc84fdd85a@@":"@@text:faaf7078ede9d2b8a87c278fe8d78fe8dc77e9657e0ae8d8255a7e6b3351941c@@";
     form.reset();
   }catch(err){msg.textContent=err.message||"@@text:5ef79196937c444893422700d82f3225c06af8c1bbbbd3932dc225d969a7055f@@";}
   finally{button.disabled=false;}
 });
}
wireInterestForm("@@text:84bab36acf1280835f6796b3a037b89fe88708e7f76a34947343445d9ac20dd4@@","@@text:7d8165564437628c1fb83670e9719321b09c57918204ec865ad2e8b336ee9d45@@",false);
wireInterestForm("@@text:23f41c306b2d65054352a718d39cd5cafcc5f2a35db69d5ff9110563846bcc17@@","@@text:c43e07bbc6a80a2eb6d09a539ba61b2e1a160ad3ea0a67557c46417e9f807ff9@@",true);

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
  const action=playing?"@@text:02b13ec22d708fd84867bd07b99feb657e92a8465bd27488d5256544a0ad85e1@@":active?"@@text:b4c5939242ee02a4833e89bc3c3cf88719f73b996d6018667491b151ca24d94d@@":entry.idleLabel;
  entry.button.disabled=!speechAvailable;
  entry.icon.textContent=playing?"@@text:12c34a19d48a8ff98dce658f0bc760d236359acda979026e65e8ae3962a449ed@@":"@@text:0c969d4a2a2cda4eb015715c1a1e82045a398a50794bd3dec2bf2287d0a5873c@@";
  if(entry.label)entry.label.textContent=playing?"@@text:858e4ba7a29fd38b630ed73a79e2738333b3fc6778fafa90252f5556c1262fdc@@":active?"@@text:d640c7421da066618a39daf4266da5f61f66a9b1afcd626481b831a17064965d@@":entry.idleLabel;
  entry.button.setAttribute("@@text:66ba2129a90d4a5810ec62bcf19ac63372c4ca9f44becbd2cf588b101cc8228d@@",action+(entry.context?"@@text:45822f54a0d0e030f75698c9252f1345982e743c9466806048f542467b3ca4f9@@"+entry.context:"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@"));
  entry.button.setAttribute("@@text:caf57005bfdd09951472bf5986439ca14cdf760b0d5ff57f0cbcf681099f1d68@@",String(playing));
  entry.button.title=action;
 }

}
function stopSpeech(){runId++;queue=[];pointer=0;reading=false;paused=false;activePlaybackControl=null;voiceRestartPending=false;if(speechAvailable)synth.cancel();clearHighlight();if(status)status.textContent="@@text:679ff8954a55cb154bd356fd9ea0ed849ad05d1e2fae9a9c9432d7f13685be95@@";if(readPage)updateSpeechControls();}
function togglePause(){
 if(!reading)return;
 if(paused){paused=false;if(voiceRestartPending){voiceRestartPending=false;nextSpeech(runId);}else synth.resume();status.textContent="@@text:2304e319d0fb751c5c7a969e1d3e0ae433f48c1e8c6d230936736ae88b151bd7@@";}
 else{paused=true;synth.pause();status.textContent="@@text:7d7dbdf19f0791a9ea79f28e61ba8f750ffc83b0a07f343c358b6e2141575a28@@";}
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
 voiceSelect.replaceChildren(new Option("@@text:47813ba0bdf5a3bf09d2b412144b8d02bbb66adc2defd595b0dcfe6a02f45c20@@","@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@"));
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
function nextSpeech(id){if(id!==runId||!reading||paused)return;if(primeSpeech(id))return;clearHighlight();while(pointer<queue.length){const el=queue[pointer++];if(!eligible(el))continue;const text=textFor(el);if(!text)continue;activeBlock=el;el.classList.add("@@text:ddff131584bc80bd50f3f0eebcb0eec831bde29dead703cd1f01e12ac35ed771@@");const utterance=new Reader(text);utterance.lang=el.closest("@@text:02bd5ec8cd2acf67854f9449aabb40591bc48f751a6fbcd43d27f2cc894b0d92@@")?.lang||document.documentElement.lang||"@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@";utterance.rate=prefs.rate;const voice=chooseVoice();if(voice){utterance.voice=voice;if(voiceSelect.value)utterance.lang=voice.lang;}utterance.onend=()=>nextSpeech(id);utterance.onerror=e=>{if(e.error!=="@@text:f12fde684b2ed4c627b777a0d2346ef769ccdd9f3e4ad3dab5cf663ba9598d0f@@"&&e.error!=="@@text:d512d96ea31ab0b9bb9b66da70c4d675f7db657518f4b6c0cc6d5823e6da5509@@")status.textContent="@@text:b3d4da8b7ae35994a5de63577b80406de6b5b95bb655dcc0a44853d4d94bca58@@"+e.error;nextSpeech(id);};synth.speak(utterance);status.textContent="@@text:8f9f2773cd199caf78779e9c2220c2a021c050ac23d565af023904714cbf8bec@@"+text.slice(0,90);return;}reading=false;paused=false;activePlaybackControl=null;clearHighlight();updateSpeechControls();status.textContent="@@text:8808c0f1767dacdf0873c12ce7262ab3cfed757c51e28b33972dc5a01b3f6b48@@";}
function playElements(elements,control=readPage){if(!speechAvailable)return;stopSpeech();queue=elements.filter(eligible);pointer=0;if(!queue.length){status.textContent="@@text:583464a77a0d9d5b50f3faec5ba703a293eb1cb6332f7425fb02d5e5d01013ad@@";return;}activePlaybackControl=control;reading=true;updateSpeechControls();nextSpeech(runId);}
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
  bindPlaybackButton(button,()=>elements,excerpt,"@@text:597a718dce732639a0e75a1488e4ea22052ba52aaf62eb66b430532defde122c@@");
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
bindPlaybackButton(readPage,()=>[...blocksFrom(document.getElementById("@@text:7ab4098aed0cfa88338b5de1ac26cb6b0e2b3907525ec74e319bd440528b6643@@")),...blocksFrom(document.getElementById(currentCode()==="@@text:dbd3a49d0d906b4ed9216b73330d2fb080ef2f758c12f3885068222e5e17151c@@"?"@@text:adb896165c1ef8b5d855dfa874465d917ff7edd0bdc7845626961898ea4ba045@@":"@@text:e5165c7266790e6dfdf72f80ae026a454dca05b539fd115ace57fc3a92a4bd84@@"))],"@@text:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855@@","@@text:3ce62016c72988e5cb641f83c26d225fd79d79d00de1ee236f68040b68eb159c@@");
stopButton.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",stopSpeech);
if(!speechAvailable){status.textContent="@@text:97a63c4c22bda734291420e3ebe0b4a5226a5dc8c2e191f16d8038b77db9b949@@";readPage.title="@@text:13c01674af4f95cd11c5fc97526c0c0e3bb42153089a17c9a79943c399ce1a20@@";}
else{refreshVoices();if("@@text:35a7274c5a50bb996a6041e38a056e0a095db989fefe4b014995ff4b9fe67f4f@@" in synth)synth.addEventListener("@@text:e268d370611ac73dff589379034bef4a5ec13ea4709bedf9ff1a8e0c5bc095c5@@",refreshVoices);}
enhanceReading();updateSpeechControls();

// Recent selections move left even after visiting bookmarked language URLs.
const first=currentCode();prefs.order=[first,...prefs.order.filter(x=>x!==first)];save();theme();render();

// Print the entire active edition, rather than a viewport screenshot.
document.getElementById("@@text:46ea3523e4eb05b2562e99e492e4b246331864b70c80a0aa927469352071abe6@@").addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",()=>{
  stopSpeech();
  window.downloadPagePdf();
});

for(const link of document.querySelectorAll("@@text:bd516af4a7cfa9489e10d1bbd5a2e89ff0180465a2251eaa041e7e9b7967acf1@@")){const code=link.dataset.language;link.addEventListener("@@text:e5c7ffac26fed654fe62045898f55b551a0dc120badf3d116bcd364418f3ec16@@",e=>{recordLanguageClick(code);refreshLanguageHeat();if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();navigate(code);});link.addEventListener("@@text:c1eeb2f850af9bca8edfa7f6c63127ffa6673d56fe83da1695e3641824160172@@",e=>{if(e.button===1){recordLanguageClick(code);refreshLanguageHeat();}});}
