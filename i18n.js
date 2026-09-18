
(function(){
  var LANGS=['vi','en','ko','ru','zh'];
  var stored='vi';
  try{stored=localStorage.getItem('jotrip_airport_lang')||'vi'}catch(_){}
  if(!LANGS.includes(stored))stored='vi';
  var lang=stored;
  window.JT_I18N_ACTIVE=true;

  var D={
    vi:{
      today:'Hôm nay tại Phú Quốc',heroSub:'3 giây để biết sân bay đang ra sao.',
      total:'Tổng chuyến',arrivals:'Chuyến đến',departures:'Chuyến đi',intlArrivals:'Quốc tế đến',
      flightBoard:'Chuyến bay hôm nay',search:'Tìm chuyến',arrival:'Chuyến đến',departure:'Chuyến đi',all:'Tất cả',
      next3:'3 giờ tới',international:'Quốc tế',domestic:'Nội địa',changed:'Có thay đổi',showMore:'Xem thêm',
      searchPh:'Tìm số chuyến, hãng hoặc nơi đi/đến: VJ339, Hà Nội, Da Nang...',
      opsWatch:'Operations Watch',nextArrivals:'Next Arrivals',dataHealth:'Data Health',
      flights:'Flights',history:'History',analytics:'Analytics',refresh:'Refresh',
      fidsTitle:'Bảng thông tin chuyến bay',fidsDesc:'Giờ bay, dự kiến - thực tế, trạng thái, cửa, quầy và băng chuyền.',
      sched:'LỊCH',estActual:'DỰ KIẾN / THỰC TẾ',flight:'CHUYẾN',route:'HÀNH TRÌNH',status:'TRẠNG THÁI',gate:'CỬA',counterBelt:'QUẦY / BĂNG',change:'THAY ĐỔI',
      counter:'QUẦY',belt:'BĂNG',arr:'ĐẾN',dep:'ĐI',intl:'QUỐC TẾ',dom:'NỘI ĐỊA',
      actual:'ACTUAL',est:'EST',schedShort:'SCHED',changedNow:'ĐÃ ĐỔI',
      stable:'FIDS đang ổn định',changesActive:'{n} thay đổi đang hiệu lực',
      noFidsChanges:'Chưa ghi nhận đổi cửa, đổi quầy hoặc đổi băng chuyền đang hiệu lực.',
      noFidsFlights:'Chưa có chuyến sắp tới trong dữ liệu FIDS.',
      sourceAirport:'Cập nhật theo dữ liệu sân bay',sourceAt:'Nguồn {time}',
      onTime:'Đúng giờ',checkinOpen:'Đang check-in',checkinClosed:'Check-in đã đóng',checkinSoon:'Sắp mở check-in',
      boarding:'Đang lên máy bay',arrived:'Đã hạ cánh',departed:'Đã cất cánh',cancelled:'Hủy',
      flyingToPqc:'Đang bay đến Phú Quốc',waitArrival:'Chờ giờ hạ cánh',waitDeparture:'Chờ giờ cất cánh',
      early:'Dự kiến sớm {n} phút',late:'Trễ {n} phút',lateMin:'Trễ ≥ {n} phút',
      changeGate:'ĐỔI CỬA {from} → {to}',changeCounter:'ĐỔI QUẦY {from} → {to}',changeBelt:'ĐỔI BĂNG {from} → {to}',
      market:'Thị trường',scheduleCompare:'So với lịch',checkinCounter:'Quầy làm thủ tục',checkinTime:'Giờ mở check-in',
      boardingGate:'Cửa ra máy bay',baggageBelt:'Băng chuyền hành lý',parking:'Vị trí đỗ',source:'Nguồn',
      scheduledAt:'Theo lịch · {time}',actualAt:'Thực tế · {time}',estimatedAt:'Dự kiến · {time}',
      noDelay:'Đúng giờ / chưa ghi nhận lệch lịch',earlyBy:'Sớm {n} phút',lateBy:'Trễ {n} phút',
      updated:'Cập nhật {time} · {age} phút trước · {source} · tự làm mới 1 phút',unknown:'CHƯA RÕ',
      noEstimate:'Chưa có giờ dự kiến',scheduleWord:'lịch',dataStale:'Dữ liệu đã stale'
    },
    en:{
      today:'Today at Phu Quoc',heroSub:'Understand the airport in 3 seconds.',
      total:'Total flights',arrivals:'Arrivals',departures:'Departures',intlArrivals:'International arrivals',
      flightBoard:'Today’s flights',search:'Find flight',arrival:'Arrivals',departure:'Departures',all:'All',
      next3:'Next 3 hours',international:'International',domestic:'Domestic',changed:'Changed',showMore:'Show more',
      searchPh:'Search flight, airline or city: VJ339, Hanoi, Da Nang...',
      opsWatch:'Operations Watch',nextArrivals:'Next Arrivals',dataHealth:'Data Health',
      flights:'Flights',history:'History',analytics:'Analytics',refresh:'Refresh',
      fidsTitle:'Flight information display',fidsDesc:'Schedule, estimate/actual, status, gate, check-in and baggage belt.',
      sched:'SCHED',estActual:'EST / ACTUAL',flight:'FLIGHT',route:'ROUTE',status:'STATUS',gate:'GATE',counterBelt:'CHECK-IN / BELT',change:'CHANGE',
      counter:'CHECK-IN',belt:'BELT',arr:'ARR',dep:'DEP',intl:'INTL',dom:'DOM',
      actual:'ACTUAL',est:'EST',schedShort:'SCHED',changedNow:'CHANGED',
      stable:'FIDS stable',changesActive:'{n} active changes',
      noFidsChanges:'No active gate, check-in counter or baggage belt changes.',
      noFidsFlights:'No upcoming flights in FIDS data.',
      sourceAirport:'Updated from airport data',sourceAt:'Source {time}',
      onTime:'On time',checkinOpen:'Check-in open',checkinClosed:'Check-in closed',checkinSoon:'Check-in opening soon',
      boarding:'Boarding',arrived:'Arrived',departed:'Departed',cancelled:'Cancelled',
      flyingToPqc:'En route to Phu Quoc',waitArrival:'Awaiting arrival time',waitDeparture:'Awaiting departure time',
      early:'Estimated {n} min early',late:'Delayed {n} min',lateMin:'Delayed ≥ {n} min',
      changeGate:'GATE {from} → {to}',changeCounter:'CHECK-IN {from} → {to}',changeBelt:'BELT {from} → {to}',
      market:'Market',scheduleCompare:'Vs schedule',checkinCounter:'Check-in counter',checkinTime:'Check-in opens',
      boardingGate:'Boarding gate',baggageBelt:'Baggage belt',parking:'Parking bay',source:'Source',
      scheduledAt:'Scheduled · {time}',actualAt:'Actual · {time}',estimatedAt:'Estimated · {time}',
      noDelay:'On time / no schedule deviation',earlyBy:'{n} min early',lateBy:'{n} min late',
      updated:'Updated {time} · {age} min ago · {source} · refreshes every minute',unknown:'UNKNOWN',
      noEstimate:'No estimated time yet',scheduleWord:'sched',dataStale:'Data is stale'
    },
    ko:{
      today:'오늘의 푸꾸옥 공항',heroSub:'3초 만에 공항 상황을 확인하세요.',
      total:'전체 항공편',arrivals:'도착',departures:'출발',intlArrivals:'국제선 도착',
      flightBoard:'오늘의 항공편',search:'항공편 찾기',arrival:'도착',departure:'출발',all:'전체',
      next3:'향후 3시간',international:'국제선',domestic:'국내선',changed:'변경 있음',showMore:'더 보기',
      searchPh:'편명, 항공사 또는 도시 검색: VJ339, Hanoi, Da Nang...',
      opsWatch:'운항 주의',nextArrivals:'다음 도착편',dataHealth:'데이터 상태',
      flights:'항공편',history:'이력',analytics:'분석',refresh:'새로고침',
      fidsTitle:'항공편 정보 안내',fidsDesc:'예정·예상/실제 시간, 상태, 게이트, 체크인 카운터 및 수하물 벨트.',
      sched:'예정',estActual:'예상 / 실제',flight:'편명',route:'노선',status:'상태',gate:'게이트',counterBelt:'체크인 / 벨트',change:'변경',
      counter:'체크인',belt:'벨트',arr:'도착',dep:'출발',intl:'국제선',dom:'국내선',
      actual:'실제',est:'예상',schedShort:'예정',changedNow:'변경됨',
      stable:'FIDS 정상',changesActive:'변경 {n}건 적용 중',
      noFidsChanges:'현재 게이트, 체크인 카운터 또는 수하물 벨트 변경이 없습니다.',
      noFidsFlights:'FIDS에 예정 항공편이 없습니다.',
      sourceAirport:'공항 데이터 기준',sourceAt:'데이터 {time}',
      onTime:'정시',checkinOpen:'체크인 중',checkinClosed:'체크인 마감',checkinSoon:'체크인 곧 시작',
      boarding:'탑승 중',arrived:'도착 완료',departed:'출발 완료',cancelled:'취소',
      flyingToPqc:'푸꾸옥으로 운항 중',waitArrival:'도착 시간 대기',waitDeparture:'출발 시간 대기',
      early:'예상 {n}분 조기',late:'{n}분 지연',lateMin:'최소 {n}분 지연',
      changeGate:'게이트 {from} → {to}',changeCounter:'체크인 {from} → {to}',changeBelt:'벨트 {from} → {to}',
      market:'구분',scheduleCompare:'예정 대비',checkinCounter:'체크인 카운터',checkinTime:'체크인 시작',
      boardingGate:'탑승 게이트',baggageBelt:'수하물 벨트',parking:'주기장',source:'출처',
      scheduledAt:'예정 · {time}',actualAt:'실제 · {time}',estimatedAt:'예상 · {time}',
      noDelay:'정시 / 시간 변동 없음',earlyBy:'{n}분 조기',lateBy:'{n}분 지연',
      updated:'업데이트 {time} · {age}분 전 · {source} · 1분마다 갱신',unknown:'미확인',
      noEstimate:'예상 시간이 아직 없습니다',scheduleWord:'예정',dataStale:'데이터가 오래되었습니다'
    },
    ru:{
      today:'Сегодня в аэропорту Фукуока',heroSub:'Ситуация в аэропорту за 3 секунды.',
      total:'Всего рейсов',arrivals:'Прибытия',departures:'Вылеты',intlArrivals:'Международные прибытия',
      flightBoard:'Рейсы сегодня',search:'Найти рейс',arrival:'Прибытия',departure:'Вылеты',all:'Все',
      next3:'Ближайшие 3 часа',international:'Международные',domestic:'Внутренние',changed:'Есть изменения',showMore:'Показать ещё',
      searchPh:'Поиск по рейсу, авиакомпании или городу: VJ339, Hanoi, Da Nang...',
      opsWatch:'Контроль операций',nextArrivals:'Ближайшие прибытия',dataHealth:'Состояние данных',
      flights:'Рейсы',history:'История',analytics:'Аналитика',refresh:'Обновить',
      fidsTitle:'Табло рейсов',fidsDesc:'Расписание, расчётное/фактическое время, статус, выход, стойка и багажная лента.',
      sched:'РАСП.',estActual:'РАСЧ. / ФАКТ.',flight:'РЕЙС',route:'МАРШРУТ',status:'СТАТУС',gate:'ВЫХОД',counterBelt:'СТОЙКА / ЛЕНТА',change:'ИЗМЕНЕНИЕ',
      counter:'СТОЙКА',belt:'ЛЕНТА',arr:'ПРИБ.',dep:'ВЫЛ.',intl:'МЕЖД.',dom:'ВНУТР.',
      actual:'ФАКТ',est:'РАСЧ',schedShort:'РАСП',changedNow:'ИЗМЕНЕНО',
      stable:'FIDS без изменений',changesActive:'Активных изменений: {n}',
      noFidsChanges:'Нет активных изменений выхода, стойки регистрации или багажной ленты.',
      noFidsFlights:'Нет ближайших рейсов в данных FIDS.',
      sourceAirport:'По данным аэропорта',sourceAt:'Источник {time}',
      onTime:'По расписанию',checkinOpen:'Регистрация открыта',checkinClosed:'Регистрация закрыта',checkinSoon:'Регистрация скоро откроется',
      boarding:'Посадка',arrived:'Прибыл',departed:'Вылетел',cancelled:'Отменён',
      flyingToPqc:'В пути на Фукуок',waitArrival:'Ожидается время прибытия',waitDeparture:'Ожидается время вылета',
      early:'Ожидается на {n} мин раньше',late:'Задержка {n} мин',lateMin:'Задержка ≥ {n} мин',
      changeGate:'ВЫХОД {from} → {to}',changeCounter:'СТОЙКА {from} → {to}',changeBelt:'ЛЕНТА {from} → {to}',
      market:'Рынок',scheduleCompare:'К расписанию',checkinCounter:'Стойка регистрации',checkinTime:'Начало регистрации',
      boardingGate:'Выход на посадку',baggageBelt:'Багажная лента',parking:'Место стоянки',source:'Источник',
      scheduledAt:'По расписанию · {time}',actualAt:'Факт · {time}',estimatedAt:'Расчётное · {time}',
      noDelay:'По расписанию / отклонений нет',earlyBy:'На {n} мин раньше',lateBy:'На {n} мин позже',
      updated:'Обновлено {time} · {age} мин назад · {source} · обновление каждую минуту',unknown:'НЕТ ДАННЫХ',
      noEstimate:'Расчётное время пока не опубликовано',scheduleWord:'расп.',dataStale:'Данные устарели'
    },
    zh:{
      today:'今日富国岛机场',heroSub:'3秒了解机场运行情况。',
      total:'航班总数',arrivals:'到达',departures:'出发',intlArrivals:'国际到达',
      flightBoard:'今日航班',search:'查找航班',arrival:'到达',departure:'出发',all:'全部',
      next3:'未来3小时',international:'国际',domestic:'国内',changed:'有变更',showMore:'查看更多',
      searchPh:'搜索航班、航空公司或城市：VJ339、Hanoi、Da Nang...',
      opsWatch:'运行提醒',nextArrivals:'即将到达',dataHealth:'数据状态',
      flights:'航班',history:'历史',analytics:'分析',refresh:'刷新',
      fidsTitle:'航班信息显示',fidsDesc:'计划、预计/实际时间、状态、登机口、值机柜台和行李转盘。',
      sched:'计划',estActual:'预计 / 实际',flight:'航班',route:'航线',status:'状态',gate:'登机口',counterBelt:'值机 / 行李',change:'变更',
      counter:'值机',belt:'行李',arr:'到达',dep:'出发',intl:'国际',dom:'国内',
      actual:'实际',est:'预计',schedShort:'计划',changedNow:'已变更',
      stable:'FIDS 正常',changesActive:'当前 {n} 项变更',
      noFidsChanges:'目前没有登机口、值机柜台或行李转盘变更。',
      noFidsFlights:'FIDS 暂无即将起飞或到达的航班。',
      sourceAirport:'依据机场数据更新',sourceAt:'数据 {time}',
      onTime:'准点',checkinOpen:'正在值机',checkinClosed:'值机已关闭',checkinSoon:'即将开始值机',
      boarding:'正在登机',arrived:'已到达',departed:'已起飞',cancelled:'取消',
      flyingToPqc:'飞往富国岛途中',waitArrival:'等待到达时间',waitDeparture:'等待起飞时间',
      early:'预计提前 {n} 分钟',late:'延误 {n} 分钟',lateMin:'延误至少 {n} 分钟',
      changeGate:'登机口 {from} → {to}',changeCounter:'值机 {from} → {to}',changeBelt:'行李 {from} → {to}',
      market:'类型',scheduleCompare:'相对计划',checkinCounter:'值机柜台',checkinTime:'值机开始',
      boardingGate:'登机口',baggageBelt:'行李转盘',parking:'停机位',source:'来源',
      scheduledAt:'计划 · {time}',actualAt:'实际 · {time}',estimatedAt:'预计 · {time}',
      noDelay:'准点 / 暂无时间偏差',earlyBy:'提前 {n} 分钟',lateBy:'延后 {n} 分钟',
      updated:'更新于 {time} · {age} 分钟前 · {source} · 每分钟刷新',unknown:'未知',
      noEstimate:'暂无预计时间',scheduleWord:'计划',dataStale:'数据已过期'
    }
  };

  function t(key,vars){
    var s=(D[lang]&&D[lang][key])||(D.vi[key])||key;
    if(vars)Object.keys(vars).forEach(function(k){s=s.replace(new RegExp('\\{'+k+'\\}','g'),vars[k]);});
    return s;
  }

  function status(s){
    s=String(s||'');
    var m;
    if((m=s.match(/^Dự kiến sớm (\d+) phút$/i)))return t('early',{n:m[1]});
    if((m=s.match(/^Trễ ≥ (\d+) phút$/i)))return t('lateMin',{n:m[1]});
    if((m=s.match(/^Trễ (\d+) phút$/i)))return t('late',{n:m[1]});
    if((m=s.match(/^Đã hạ cánh\s+(\d{1,2}:\d{2})(?:\s*·\s*trễ\s*(\d+)\s*phút)?$/i))){
      var x=t('arrived')+' '+m[1]; if(m[2])x+=' · '+t('late',{n:m[2]}); return x;
    }
    if((m=s.match(/^Đã cất cánh\s+(\d{1,2}:\d{2})(?:\s*·\s*(trễ|sớm)\s*(\d+)\s*phút)?$/i))){
      var y=t('departed')+' '+m[1]; if(m[2]==='trễ')y+=' · '+t('late',{n:m[3]}); if(m[2]==='sớm')y+=' · '+t('earlyBy',{n:m[3]}); return y;
    }
    var exact={
      'Đúng giờ':'onTime','Đang check-in':'checkinOpen','Check-in đã đóng':'checkinClosed','Sắp mở check-in':'checkinSoon',
      'Đang lên máy bay':'boarding','Đã hạ cánh':'arrived','Đã cất cánh':'departed','Hủy':'cancelled',
      'Đang bay đến Phú Quốc':'flyingToPqc','Chờ giờ hạ cánh':'waitArrival','Chờ giờ cất cánh':'waitDeparture'
    };
    return exact[s]?t(exact[s]):s;
  }

  window.JT_T=t;
  window.JT_STATUS=status;
  window.JT_LANG=function(){return lang};

  function setText(sel,key){
    var el=document.querySelector(sel);if(el)el.textContent=t(key);
  }
  function setAll(sel,key){
    document.querySelectorAll(sel).forEach(function(el){el.textContent=t(key);});
  }

  function translateDynamicText(root){
    if(!root)return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    var n;
    while((n=walker.nextNode())){
      var raw=n.nodeValue,trim=raw.trim();
      if(!trim)continue;
      var out=trim;
      out=status(out);
      var m;
      if((m=out.match(/^Dự kiến\s+(\d{1,2}:\d{2})$/)))out=t('estimatedAt',{time:m[1]});
      if(out==='Chưa có giờ dự kiến')out=t('noEstimate');
      if(out==='Quốc tế')out=t('international');
      if(out==='Nội địa')out=t('domestic');
      if(out==='CHƯA RÕ')out=t('unknown');
      if((m=out.match(/^lịch\s+(\d{1,2}:\d{2})$/i)))out=t('scheduleWord')+' '+m[1];
      if(out==='Dữ liệu đã stale')out=t('dataStale');
      if(out!==trim)n.nodeValue=raw.replace(trim,out);
    }
  }

  function applyStatic(){
    document.documentElement.lang=lang==='zh'?'zh-CN':lang;
    var sel=document.getElementById('languageSelect');if(sel&&sel.value!==lang)sel.value=lang;

    setText('.hero h2','today');setText('.hero p','heroSub');
    var hero=document.querySelectorAll('.hero-stats article span');
    if(hero[0])hero[0].textContent=t('total');if(hero[1])hero[1].textContent=t('arrivals');if(hero[2])hero[2].textContent=t('departures');if(hero[3])hero[3].textContent=t('intlArrivals');

    setText('#flightBoard .card-head h3','flightBoard');setText('#searchToggle','search');
    var inp=document.getElementById('flightSearch');if(inp)inp.placeholder=t('searchPh');
    var dirs=document.querySelectorAll('#directionTabs button');
    if(dirs[0])dirs[0].textContent=t('arrival');if(dirs[1])dirs[1].textContent=t('departure');if(dirs[2])dirs[2].textContent=t('all');
    var chips=document.querySelectorAll('#filterChips button');
    if(chips[0])chips[0].textContent=t('all');if(chips[1])chips[1].textContent=t('next3');if(chips[2])chips[2].textContent=t('international');if(chips[3])chips[3].textContent=t('domestic');if(chips[4])chips[4].textContent=t('changed');
    setText('#showMore','showMore');

    var side=document.querySelectorAll('.sidebar .side-head h3');
    if(side[0])side[0].textContent=t('opsWatch');if(side[1])side[1].textContent=t('nextArrivals');if(side[2])side[2].textContent=t('dataHealth');

    var nav=document.querySelectorAll('.mobile-nav button');
    if(nav[1])nav[1].lastChild.nodeValue=t('flights');
    if(nav[2])nav[2].lastChild.nodeValue=t('history');
    if(nav[3])nav[3].lastChild.nodeValue=t('analytics');
    if(nav[4])nav[4].lastChild.nodeValue=t('refresh');

    var updated=document.getElementById('updatedAt');
    if(updated){
      var um=updated.textContent.match(/Cập nhật\s+(\d{1,2}:\d{2})\s*·\s*(\d+)\s*phút trước\s*·\s*([^·]+)\s*·\s*tự làm mới 1 phút/i);
      if(um)updated.textContent=t('updated',{time:um[1],age:um[2],source:um[3].trim()});
    }

    var f=document.getElementById('fidsBoard');
    if(f){
      var h=f.querySelector('.fids-head h3'),p=f.querySelector('.fids-head p');
      if(h)h.textContent=t('fidsTitle');if(p)p.textContent=t('fidsDesc');
      var cols=f.querySelectorAll('.fids-columns span');
      var keys=['sched','estActual','flight','route','status','gate','counterBelt','change'];
      cols.forEach(function(el,i){if(keys[i])el.textContent=t(keys[i])});
      var foot=f.querySelector('.fids-foot span:first-child');if(foot)foot.textContent=t('sourceAirport');
    }
  }

  function applyDynamic(){
    ['#flightList','#watchList','#nextArrivalsList','#drawerContent','#statusSummary'].forEach(function(s){translateDynamicText(document.querySelector(s))});
  }

  function apply(){
    applyStatic();
    applyDynamic();
  }

  function wrap(name){
    var fn=window[name];if(typeof fn!=='function'||fn.__jt_i18n)return;
    var wrapped=function(){
      var out=fn.apply(this,arguments);
      apply();
      return out;
    };
    wrapped.__jt_i18n=true;
    window[name]=wrapped;
  }

  ['renderSummary','renderHealth','renderFlights','renderWatch','renderNextArrivals','renderAnalytics'].forEach(wrap);

  if(typeof window.openDrawer==='function'){
    var baseDrawer=window.openDrawer;
    window.openDrawer=function(){
      var out=baseDrawer.apply(this,arguments);apply();return out;
    };
  }

  if(typeof window.displayStatusLabel==='function'){
    var baseStatus=window.displayStatusLabel;
    window.displayStatusLabel=function(r){return status(baseStatus(r));};
  }
  if(typeof window.delayStatusLabel==='function'){
    var baseDelay=window.delayStatusLabel;
    window.delayStatusLabel=function(r){return status(baseDelay(r));};
  }
  if(typeof window.statusClass==='function'){
    var baseClass=window.statusClass;
    window.statusClass=function(value){
      var cls=baseClass(value);
      if(cls && cls!=='gray')return cls;
      var s=String(value||'');
      var normalized=s.toLowerCase();
      var cancelWords=[D.en.cancelled,D.ko.cancelled,D.ru.cancelled,D.zh.cancelled];
      var okWords=[D.en.onTime,D.ko.onTime,D.ru.onTime,D.zh.onTime,D.en.checkinOpen,D.ko.checkinOpen,D.ru.checkinOpen,D.zh.checkinOpen,D.en.boarding,D.ko.boarding,D.ru.boarding,D.zh.boarding];
      var greenWords=[D.en.arrived,D.ko.arrived,D.ru.arrived,D.zh.arrived,D.en.departed,D.ko.departed,D.ru.departed,D.zh.departed,D.en.flyingToPqc,D.ko.flyingToPqc,D.ru.flyingToPqc,D.zh.flyingToPqc];
      if(cancelWords.some(function(x){return s.indexOf(x)>=0}))return'red';
      if(/delay|late|early|지연|조기|задерж|раньше|延误|提前/i.test(normalized))return'amber';
      if(greenWords.some(function(x){return s.indexOf(x)>=0}))return'green';
      if(okWords.some(function(x){return s.indexOf(x)>=0}))return'blue';
      return cls||'gray';
    };
  }


  window.JT_SET_LANG=function(next){
    if(!LANGS.includes(next))return;
    lang=next;
    try{localStorage.setItem('jotrip_airport_lang',lang)}catch(_){}
    if(typeof window.renderAll==='function')window.renderAll();
    if(typeof window.JT_RENDER_FIDS==='function')window.JT_RENDER_FIDS(true);
    apply();
  };

  var select=document.getElementById('languageSelect');
  if(select){
    select.value=lang;
    select.addEventListener('change',function(){window.JT_SET_LANG(select.value)});
  }

  apply();
})();
