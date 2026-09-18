(()=>{
  const CFG={
    salt:'C4AJ/IGyalUVhXVNR3NPYg==',
    expected:'smCe5EAO9vSXy9cY/2Kg3JpURLAfDoQvNdgdKegKbq0=',
    iterations:210000,
    sessionHours:12,
    maxAttempts:5,
    lockSeconds:30
  };
  const STORAGE='jt_airport_analytics_auth_v1';
  const FAILS='jt_airport_analytics_fails_v1';
  const $=s=>document.querySelector(s);
  const LANG={
    vi:{title:'Khu vực phân tích',desc:'Nhập khóa truy cập để mở Analytics.',label:'Khóa truy cập',ph:'Nhập access key',unlock:'Mở Analytics',bad:'Khóa không đúng.',locked:'Thử lại sau {n} giây.',logout:'Đăng xuất',secure:'Khu vực riêng · JoTrip Airport Intelligence'},
    en:{title:'Analytics access',desc:'Enter the access key to open Analytics.',label:'Access key',ph:'Enter access key',unlock:'Open Analytics',bad:'Incorrect access key.',locked:'Try again in {n} seconds.',logout:'Sign out',secure:'Private area · JoTrip Airport Intelligence'},
    ko:{title:'분석 접근',desc:'Analytics를 열려면 액세스 키를 입력하세요.',label:'액세스 키',ph:'액세스 키 입력',unlock:'Analytics 열기',bad:'액세스 키가 올바르지 않습니다.',locked:'{n}초 후 다시 시도하세요.',logout:'로그아웃',secure:'비공개 영역 · JoTrip Airport Intelligence'},
    ru:{title:'Доступ к аналитике',desc:'Введите ключ доступа, чтобы открыть Analytics.',label:'Ключ доступа',ph:'Введите ключ',unlock:'Открыть Analytics',bad:'Неверный ключ доступа.',locked:'Повторите через {n} сек.',logout:'Выйти',secure:'Закрытая зона · JoTrip Airport Intelligence'},
    zh:{title:'分析访问',desc:'请输入访问密钥以打开 Analytics。',label:'访问密钥',ph:'输入访问密钥',unlock:'打开 Analytics',bad:'访问密钥不正确。',locked:'请在 {n} 秒后重试。',logout:'退出',secure:'私有区域 · JoTrip Airport Intelligence'}
  };
  let analyticsLoaded=false;
  const b64ToBytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const bytesToB64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
  const currentLang=()=>{try{const x=localStorage.getItem('jotrip_airport_lang')||'vi';return LANG[x]?x:'vi'}catch(_){return'vi'}};
  const text=(k,vars)=>{let s=(LANG[currentLang()]||LANG.vi)[k]||k;if(vars)Object.entries(vars).forEach(([a,v])=>s=s.replace('{'+a+'}',String(v)));return s};

  async function derive(value){
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(value),'PBKDF2',false,['deriveBits']);
    return crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:b64ToBytes(CFG.salt),iterations:CFG.iterations},material,256);
  }
  function safeEqual(a,b){
    if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0;
  }
  function sessionValid(){
    try{
      const raw=sessionStorage.getItem(STORAGE);if(!raw)return false;
      const x=JSON.parse(raw);return x&&x.proof===CFG.expected&&Date.now()<Number(x.until||0);
    }catch(_){return false}
  }
  function saveSession(){
    try{sessionStorage.setItem(STORAGE,JSON.stringify({proof:CFG.expected,until:Date.now()+CFG.sessionHours*3600*1000}))}catch(_){}
  }
  function getFailState(){
    try{return JSON.parse(sessionStorage.getItem(FAILS)||'{}')}catch(_){return{}}
  }
  function setFailState(v){try{sessionStorage.setItem(FAILS,JSON.stringify(v))}catch(_){}}
  function clearFails(){try{sessionStorage.removeItem(FAILS)}catch(_){}}

  function localizeGate(){
    const title=$('#analyticsLockTitle'),desc=$('#analyticsLockDesc'),lab=$('#analyticsLockLabel'),inp=$('#analyticsKey'),btn=$('#analyticsUnlock'),logout=$('#analyticsLogout'),note=$('#analyticsSecureNote');
    if(title)title.textContent=text('title');if(desc)desc.textContent=text('desc');if(lab)lab.textContent=text('label');if(inp)inp.placeholder=text('ph');if(btn)btn.textContent=text('unlock');if(logout)logout.textContent=text('logout');if(note)note.textContent=text('secure');
  }
  function showError(msg){
    const el=$('#analyticsAuthError');if(el){el.textContent=msg;el.classList.remove('hidden')}
  }
  function clearError(){const el=$('#analyticsAuthError');if(el){el.textContent='';el.classList.add('hidden')}}
  function loadAnalytics(){
    if(analyticsLoaded)return;analyticsLoaded=true;
    $('#analyticsGate')?.classList.add('hidden');
    $('#analyticsProtected')?.classList.remove('hidden');
    const s=document.createElement('script');s.src='./analytics-v3.js?v=20260918af';s.defer=true;document.body.appendChild(s);
  }
  async function unlock(){
    clearError();
    const fail=getFailState(),now=Date.now();
    if(fail.lockUntil&&now<fail.lockUntil){showError(text('locked',{n:Math.ceil((fail.lockUntil-now)/1000)}));return}
    const input=$('#analyticsKey'),btn=$('#analyticsUnlock'),value=input?.value||'';if(!value)return;
    if(btn){btn.disabled=true;btn.textContent='…'}
    try{
      const proof=bytesToB64(await derive(value));
      if(safeEqual(proof,CFG.expected)){saveSession();clearFails();if(input)input.value='';loadAnalytics();return}
      const attempts=(Number(fail.attempts)||0)+1;
      if(attempts>=CFG.maxAttempts){setFailState({attempts:0,lockUntil:Date.now()+CFG.lockSeconds*1000});showError(text('locked',{n:CFG.lockSeconds}))}
      else{setFailState({attempts});showError(text('bad'))}
    }catch(_){showError(text('bad'))}
    finally{if(btn){btn.disabled=false;btn.textContent=text('unlock')}}
  }

  window.JT_ANALYTICS_AUTH_LOCALIZE=localizeGate;
  document.addEventListener('DOMContentLoaded',()=>{
    localizeGate();
    $('#analyticsUnlock')?.addEventListener('click',unlock);
    $('#analyticsKey')?.addEventListener('keydown',e=>{if(e.key==='Enter')unlock()});
    $('#analyticsLogout')?.addEventListener('click',()=>{try{sessionStorage.removeItem(STORAGE)}catch(_){}location.reload()});
    $('#languageSelect')?.addEventListener('change',()=>setTimeout(localizeGate,0));
    if(sessionValid())loadAnalytics();else setTimeout(()=>$('#analyticsKey')?.focus(),120);
  });
})();