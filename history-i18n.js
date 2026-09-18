
(function(){
  const LANGS=['vi','en','ko','ru','zh'];
  let lang='vi';
  try{lang=localStorage.getItem('jotrip_airport_lang')||'vi'}catch(_){}
  if(!LANGS.includes(lang))lang='vi';

  const D={
    vi:{
      page:'Airport History',sub:'PQC historical flight intelligence',mode:'HISTORY',source:'JoTrip AutoSync · Lưu theo ngày',
      hero:'Tìm lại dữ liệu chuyến bay',heroDesc:'Dữ liệu được lưu theo ngày, kèm lịch sử thay đổi theo sự kiện. Có thể tra cứu và thống kê theo khoảng ngày.',
      from:'Từ ngày',to:'Đến ngày',direction:'Chiều bay',airline:'Hãng bay',time:'Khung giờ',search:'Tìm kiếm',
      all:'Tất cả',arrivals:'Chuyến đến',departures:'Chuyến đi',allAirlines:'Tất cả hãng',allDay:'Cả ngày',
      note:'Mỗi lần tra cứu tối đa 31 ngày. OTP15 chỉ tính các chuyến đã thực hiện.',
      total:'Tổng chuyến',onTime:'Đúng giờ ≤15 phút',delayed:'Trễ >15 phút',onTimeRate:'Tỷ lệ đúng giờ',avgDelay:'Trễ TB >15\'',
      airlinePerf:'Đúng giờ theo hãng trong khoảng đã chọn',airlineNote:'OTP15 là On-Time Performance theo ngưỡng 15 phút: chuyến được tính đúng giờ khi giờ thực tế không muộn quá 15 phút so với giờ lịch. Chỉ các chuyến đã thực hiện mới được chấm; chuyến chưa thực hiện hoặc hủy không tính.',
      arrPqc:'Đến Phú Quốc',depPqc:'Rời Phú Quốc',completed:'Đã thực hiện',otp:'Đúng giờ',late15:'Trễ >15\'',latePct:'Trễ %',avg:'Trễ TB',
      archive:'Dữ liệu theo khoảng ngày',flightArchive:'FLIGHT ARCHIVE',live:'Live',flights:'Flights',history:'History',analytics:'Analytics',refresh:'Refresh',
      loading:'ĐANG TẢI',noData:'CHƯA CÓ DỮ LIỆU',day:'NGÀY',days:'NGÀY',flightWord:'CHUYẾN',
      suitable:'{n} chuyến phù hợp',actualCount:'{n} chuyến có giờ thực tế',dataDate:'Dữ liệu {date}',dataRange:'Dữ liệu {from} - {to}',
      arrType:'CHUYẾN ĐẾN',depType:'CHUYẾN ĐI',actual:'Thực tế {time}',estimated:'Dự kiến {time}',toPqc:'Đến PQC',fromPqc:'Rời PQC',
      changes:'{n} lần thay đổi',firstSeen:'GHI NHẬN',changed:'THAY ĐỔI',noEvent:'Chưa ghi nhận thay đổi trong lịch sử sự kiện.',
      noMatch:'Không có chuyến phù hợp với bộ lọc hiện tại.',unknown:'Chưa có trạng thái',
      checkinFrom:'Check-in từ {time}',checkinOpen:'Đang check-in',checkinClosed:'Check-in đã đóng',gateClosed:'Cửa khởi hành đã đóng',boarding:'Đang lên máy bay',
      arrived:'Đã hạ cánh',departed:'Đã cất cánh',cancelled:'Đã hủy',delay:'Trễ {n} phút',delayChange:'Trễ / đổi giờ',
      searchPh:'VJ337, Hà Nội, VietJet, Incheon...',unknownAirline:'Chưa rõ hãng',noDataRange:'Chưa có dữ liệu lưu trong khoảng {from} - {to}.',notEnoughActual:'Chưa đủ chuyến có giờ thực tế để tính tỷ lệ đúng giờ.',onTimeSample:'{on}/{total} chuyến đúng giờ',noSample:'0 chuyến',minuteUnit:'phút',eventFirstSeenDetail:'Ghi nhận chuyến lần đầu trong JoTrip AutoSync.',eventChangedFallback:'Dữ liệu chuyến có thay đổi.',fieldEstimated:'Giờ dự kiến',fieldActual:'Giờ thực tế',fieldStatus:'Trạng thái',fieldGate:'Cửa',fieldBelt:'Băng chuyền',fieldParking:'Vị trí đỗ',fieldScheduled:'Giờ lịch',fieldBoardingStart:'Bắt đầu boarding',fieldBoardingFinish:'Kết thúc boarding',arrivalsKicker:'CHUYẾN ĐẾN',departuresKicker:'CHUYẾN ĐI',onTimeShort:"ĐÚNG GIỜ ≤15'"
    },
    en:{
      page:'Airport History',sub:'PQC historical flight intelligence',mode:'HISTORY',source:'JoTrip AutoSync · Daily archive',
      hero:'Find historical flight data',heroDesc:'Flights are stored by day with event-based change history. Search and analyze any selected date range.',
      from:'From',to:'To',direction:'Direction',airline:'Airline',time:'Time window',search:'Search',
      all:'All',arrivals:'Arrivals',departures:'Departures',allAirlines:'All airlines',allDay:'All day',
      note:'Each search can cover up to 31 days. OTP15 only scores completed flights.',
      total:'Total flights',onTime:'On time ≤15 min',delayed:'Delayed >15 min',onTimeRate:'On-time rate',avgDelay:'Avg delay >15 min',
      airlinePerf:'On-time performance by airline',airlineNote:'OTP15 counts a flight as on time when its actual time is no more than 15 minutes later than scheduled. Only completed flights are scored; cancelled or not-yet-operated flights are excluded.',
      arrPqc:'Arrivals to Phu Quoc',depPqc:'Departures from Phu Quoc',completed:'Completed',otp:'On time',late15:'Delayed >15 min',latePct:'Delay %',avg:'Avg delay',
      archive:'Flight data by date range',flightArchive:'FLIGHT ARCHIVE',live:'Live',flights:'Flights',history:'History',analytics:'Analytics',refresh:'Refresh',
      loading:'LOADING',noData:'NO DATA',day:'DAY',days:'DAYS',flightWord:'FLIGHTS',
      suitable:'{n} matching flights',actualCount:'{n} with actual time',dataDate:'Data {date}',dataRange:'Data {from} - {to}',
      arrType:'ARRIVAL',depType:'DEPARTURE',actual:'Actual {time}',estimated:'Estimated {time}',toPqc:'Arrive PQC',fromPqc:'Depart PQC',
      changes:'{n} changes',firstSeen:'FIRST SEEN',changed:'CHANGED',noEvent:'No recorded changes in event history.',
      noMatch:'No flights match the current filters.',unknown:'No status yet',
      checkinFrom:'Check-in from {time}',checkinOpen:'Check-in open',checkinClosed:'Check-in closed',gateClosed:'Departure gate closed',boarding:'Boarding',
      arrived:'Arrived',departed:'Departed',cancelled:'Cancelled',delay:'Delayed {n} min',delayChange:'Delayed / rescheduled',
      searchPh:'VJ337, Hanoi, VietJet, Incheon...',unknownAirline:'航空公司未知',noDataRange:'{from} - {to} 期间没有归档数据。',notEnoughActual:'实际时间数据不足，无法计算准点率。',onTimeSample:'{on}/{total} 准点',noSample:'0班',minuteUnit:'分钟',eventFirstSeenDetail:'该航班首次记录于JoTrip AutoSync。',eventChangedFallback:'航班数据已变更。',fieldEstimated:'预计时间',fieldActual:'实际时间',fieldStatus:'状态',fieldGate:'登机口',fieldBelt:'行李转盘',fieldParking:'停机位',fieldScheduled:'计划时间',fieldBoardingStart:'开始登机',fieldBoardingFinish:'结束登机',arrivalsKicker:'到达',departuresKicker:'出发',onTimeShort:'准点 ≤15分钟',unknownAirline:'Авиакомпания не указана',noDataRange:'Нет архивных данных за период {from} - {to}.',notEnoughActual:'Недостаточно рейсов с фактическим временем для расчёта пунктуальности.',onTimeSample:'{on}/{total} вовремя',noSample:'0 рейсов',minuteUnit:'мин',eventFirstSeenDetail:'Рейс впервые зафиксирован в JoTrip AutoSync.',eventChangedFallback:'Данные рейса изменились.',fieldEstimated:'Расчётное время',fieldActual:'Фактическое время',fieldStatus:'Статус',fieldGate:'Выход',fieldBelt:'Багажная лента',fieldParking:'Место стоянки',fieldScheduled:'Время по расписанию',fieldBoardingStart:'Начало посадки',fieldBoardingFinish:'Окончание посадки',arrivalsKicker:'ПРИБЫТИЯ',departuresKicker:'ВЫЛЕТЫ',onTimeShort:'ВОВРЕМЯ ≤15 МИН',unknownAirline:'항공사 미확인',noDataRange:'{from} - {to} 기간의 저장 데이터가 없습니다.',notEnoughActual:'정시율을 계산할 실제 시간 데이터가 충분하지 않습니다.',onTimeSample:'{on}/{total} 정시',noSample:'0편',minuteUnit:'분',eventFirstSeenDetail:'JoTrip AutoSync에 항공편이 처음 기록되었습니다.',eventChangedFallback:'항공편 데이터가 변경되었습니다.',fieldEstimated:'예상 시간',fieldActual:'실제 시간',fieldStatus:'상태',fieldGate:'게이트',fieldBelt:'수하물 벨트',fieldParking:'주기장',fieldScheduled:'예정 시간',fieldBoardingStart:'탑승 시작',fieldBoardingFinish:'탑승 종료',arrivalsKicker:'도착',departuresKicker:'출발',onTimeShort:'정시 ≤15분',unknownAirline:'Unknown airline',noDataRange:'No archived data for {from} - {to}.',notEnoughActual:'Not enough flights with actual times to calculate on-time performance.',onTimeSample:'{on}/{total} on time',noSample:'0 flights',minuteUnit:'min',eventFirstSeenDetail:'Flight first recorded in JoTrip AutoSync.',eventChangedFallback:'Flight data changed.',fieldEstimated:'Estimated time',fieldActual:'Actual time',fieldStatus:'Status',fieldGate:'Gate',fieldBelt:'Baggage belt',fieldParking:'Parking bay',fieldScheduled:'Scheduled time',fieldBoardingStart:'Boarding start',fieldBoardingFinish:'Boarding end',arrivalsKicker:'ARRIVALS',departuresKicker:'DEPARTURES',onTimeShort:"ON TIME ≤15'"
    },
    ko:{
      page:'항공편 기록',sub:'PQC 과거 항공편 데이터',mode:'기록',source:'JoTrip AutoSync · 일별 보관',
      hero:'과거 항공편 데이터 찾기',heroDesc:'항공편은 날짜별로 저장되며 변경 이력도 함께 기록됩니다. 원하는 기간을 검색하고 통계로 확인할 수 있습니다.',
      from:'시작일',to:'종료일',direction:'방향',airline:'항공사',time:'시간대',search:'검색',
      all:'전체',arrivals:'도착',departures:'출발',allAirlines:'전체 항공사',allDay:'종일',
      note:'한 번에 최대 31일까지 조회할 수 있습니다. OTP15는 운항 완료 항공편만 계산합니다.',
      total:'전체 항공편',onTime:'정시 ≤15분',delayed:'지연 >15분',onTimeRate:'정시율',avgDelay:'평균 지연 >15분',
      airlinePerf:'선택 기간 항공사별 정시 운항',airlineNote:'OTP15는 실제 시간이 예정 시간보다 15분 이내 늦은 경우 정시로 계산합니다. 운항 완료 항공편만 평가하며 취소 또는 미운항 항공편은 제외합니다.',
      arrPqc:'푸꾸옥 도착',depPqc:'푸꾸옥 출발',completed:'운항 완료',otp:'정시',late15:'지연 >15분',latePct:'지연 %',avg:'평균 지연',
      archive:'기간별 항공편 데이터',flightArchive:'항공편 기록',live:'실시간',flights:'항공편',history:'기록',analytics:'분석',refresh:'새로고침',
      loading:'불러오는 중',noData:'데이터 없음',day:'일',days:'일',flightWord:'편',
      suitable:'조건 일치 {n}편',actualCount:'실제 시간 기록 {n}편',dataDate:'데이터 {date}',dataRange:'데이터 {from} - {to}',
      arrType:'도착',depType:'출발',actual:'실제 {time}',estimated:'예상 {time}',toPqc:'PQC 도착',fromPqc:'PQC 출발',
      changes:'변경 {n}회',firstSeen:'최초 기록',changed:'변경',noEvent:'이벤트 기록에 변경 사항이 없습니다.',
      noMatch:'현재 조건에 맞는 항공편이 없습니다.',unknown:'상태 없음',
      checkinFrom:'체크인 {time}부터',checkinOpen:'체크인 중',checkinClosed:'체크인 마감',gateClosed:'출발 게이트 마감',boarding:'탑승 중',
      arrived:'도착 완료',departed:'출발 완료',cancelled:'취소',delay:'{n}분 지연',delayChange:'지연 / 시간 변경',
      searchPh:'VJ337, Hanoi, VietJet, Incheon...'
    },
    ru:{
      page:'История рейсов',sub:'Исторические данные рейсов PQC',mode:'ИСТОРИЯ',source:'JoTrip AutoSync · Архив по дням',
      hero:'Найти историю рейсов',heroDesc:'Данные сохраняются по дням вместе с историей изменений. Можно искать и анализировать выбранный период.',
      from:'С даты',to:'По дату',direction:'Направление',airline:'Авиакомпания',time:'Время',search:'Поиск',
      all:'Все',arrivals:'Прибытия',departures:'Вылеты',allAirlines:'Все авиакомпании',allDay:'Весь день',
      note:'Один запрос охватывает до 31 дня. OTP15 учитывает только выполненные рейсы.',
      total:'Всего рейсов',onTime:'Вовремя ≤15 мин',delayed:'Задержка >15 мин',onTimeRate:'Пунктуальность',avgDelay:'Средняя задержка >15 мин',
      airlinePerf:'Пунктуальность по авиакомпаниям',airlineNote:'OTP15 считает рейс выполненным вовремя, если фактическое время не позже расписания более чем на 15 минут. Учитываются только выполненные рейсы; отменённые и ещё не выполненные исключаются.',
      arrPqc:'Прибытия на Фукуок',depPqc:'Вылеты с Фукуока',completed:'Выполнено',otp:'Вовремя',late15:'Задержка >15 мин',latePct:'Задержка %',avg:'Средняя задержка',
      archive:'Данные по выбранному периоду',flightArchive:'АРХИВ РЕЙСОВ',live:'Live',flights:'Рейсы',history:'История',analytics:'Аналитика',refresh:'Обновить',
      loading:'ЗАГРУЗКА',noData:'НЕТ ДАННЫХ',day:'ДЕНЬ',days:'ДНЕЙ',flightWord:'РЕЙСОВ',
      suitable:'Подходит рейсов: {n}',actualCount:'С фактическим временем: {n}',dataDate:'Данные {date}',dataRange:'Данные {from} - {to}',
      arrType:'ПРИБЫТИЕ',depType:'ВЫЛЕТ',actual:'Факт {time}',estimated:'Расч. {time}',toPqc:'Прибытие PQC',fromPqc:'Вылет PQC',
      changes:'Изменений: {n}',firstSeen:'ПЕРВАЯ ЗАПИСЬ',changed:'ИЗМЕНЕНО',noEvent:'Изменений в истории событий не зафиксировано.',
      noMatch:'Нет рейсов по выбранным фильтрам.',unknown:'Статус отсутствует',
      checkinFrom:'Регистрация с {time}',checkinOpen:'Регистрация открыта',checkinClosed:'Регистрация закрыта',gateClosed:'Выход закрыт',boarding:'Посадка',
      arrived:'Прибыл',departed:'Вылетел',cancelled:'Отменён',delay:'Задержка {n} мин',delayChange:'Задержка / перенос',
      searchPh:'VJ337, Hanoi, VietJet, Incheon...'
    },
    zh:{
      page:'航班历史',sub:'PQC 历史航班数据',mode:'历史',source:'JoTrip AutoSync · 按日归档',
      hero:'查找历史航班数据',heroDesc:'航班数据按日期保存，并保留事件变更记录。可按日期范围查询和统计。',
      from:'开始日期',to:'结束日期',direction:'方向',airline:'航空公司',time:'时间段',search:'搜索',
      all:'全部',arrivals:'到达',departures:'出发',allAirlines:'全部航空公司',allDay:'全天',
      note:'每次最多查询31天。OTP15仅统计已执行航班。',
      total:'航班总数',onTime:'准点 ≤15分钟',delayed:'延误 >15分钟',onTimeRate:'准点率',avgDelay:'平均延误 >15分钟',
      airlinePerf:'所选期间航空公司准点表现',airlineNote:'OTP15将实际时间比计划时间晚不超过15分钟的航班计为准点。仅统计已执行航班，取消或尚未执行的航班不计。',
      arrPqc:'到达富国岛',depPqc:'从富国岛出发',completed:'已执行',otp:'准点',late15:'延误 >15分钟',latePct:'延误 %',avg:'平均延误',
      archive:'按日期范围的航班数据',flightArchive:'航班历史',live:'实时',flights:'航班',history:'历史',analytics:'分析',refresh:'刷新',
      loading:'加载中',noData:'暂无数据',day:'天',days:'天',flightWord:'航班',
      suitable:'符合条件 {n} 班',actualCount:'有实际时间 {n} 班',dataDate:'数据 {date}',dataRange:'数据 {from} - {to}',
      arrType:'到达',depType:'出发',actual:'实际 {time}',estimated:'预计 {time}',toPqc:'到达PQC',fromPqc:'从PQC出发',
      changes:'变更 {n} 次',firstSeen:'首次记录',changed:'变更',noEvent:'事件历史中没有记录到变更。',
      noMatch:'当前筛选条件下没有航班。',unknown:'暂无状态',
      checkinFrom:'{time} 开始值机',checkinOpen:'正在值机',checkinClosed:'值机已关闭',gateClosed:'登机口已关闭',boarding:'正在登机',
      arrived:'已到达',departed:'已起飞',cancelled:'已取消',delay:'延误 {n} 分钟',delayChange:'延误 / 改时',
      searchPh:'VJ337, Hanoi, VietJet, Incheon...'
    }
  };

  function t(k,v){let s=(D[lang]&&D[lang][k])||D.vi[k]||k;if(v)Object.keys(v).forEach(x=>s=s.replace(new RegExp('\\{'+x+'\\}','g'),v[x]));return s}
  window.JT_HISTORY_T=t;window.JT_HISTORY_LANG=()=>lang;
  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  function set(sel,val){const el=typeof sel==='string'?q(sel):sel;if(el)el.textContent=val}

  function translateStatus(s){
    s=String(s||'').trim();let m;
    if((m=s.match(/^Check-in từ\s+(\d{1,2}:\d{2})$/)))return t('checkinFrom',{time:m[1]});
    if((m=s.match(/^Trễ\s+(\d+)\s+phút$/)))return t('delay',{n:m[1]});
    const map={'Đang check-in':'checkinOpen','Check-in đã đóng':'checkinClosed','Cửa khởi hành đã đóng':'gateClosed','Đang lên máy bay':'boarding','Đã hạ cánh':'arrived','Đã cất cánh':'departed','Đã hủy':'cancelled','Trễ / đổi giờ':'delayChange','Đúng giờ / chưa ghi nhận trễ':'unknown','Chưa có trạng thái':'unknown'};
    return map[s]?t(map[s]):s;
  }

  function applyStatic(){
    document.documentElement.lang=lang==='zh'?'zh-CN':lang;
    const sel=q('#languageSelect');if(sel)sel.value=lang;
    set('.history-app .brand h1',t('page'));set('.history-app .brand p',t('sub'));
    set('.history-mode-pill',t('mode'));set('.history-source-strip .source-label',t('source'));
    set('.history-hero h2',t('hero'));set('.history-hero p',t('heroDesc'));

    const labels=qa('.history-filters label>span');[t('from'),t('to'),t('direction'),t('airline'),t('time'),t('search')].forEach((x,i)=>{if(labels[i])labels[i].textContent=x});
    const dir=q('#historyDirection');if(dir){dir.options[0].text=t('all');dir.options[1].text=t('arrivals');dir.options[2].text=t('departures');}
    const air=q('#historyAirline');if(air&&air.options[0])air.options[0].text=t('allAirlines');
    const time=q('#historyTime');if(time&&time.options[0])time.options[0].text=t('allDay');
    const search=q('#historySearch');if(search)search.placeholder=t('searchPh');
    set('.history-range-note',t('note'));

    const metrics=qa('.history-metrics article span');[t('total'),t('arrivals'),t('departures'),t('onTime'),t('delayed'),t('onTimeRate'),t('avgDelay')].forEach((x,i)=>{if(metrics[i])metrics[i].textContent=x});
    set('.history-airline-block>h3',t('airlinePerf'));set('.history-airline-block>p',t('airlineNote'));
    const dh=qa('.otp-direction-head h4');if(dh[0])dh[0].textContent=t('arrPqc');if(dh[1])dh[1].textContent=t('depPqc');
    const tables=qa('.history-airline-block table thead tr');
    tables.forEach(tr=>{const th=tr.querySelectorAll('th');[t('airline'),t('completed'),t('otp'),t('late15'),'OTP15',t('latePct'),t('avg')].forEach((x,i)=>{if(th[i])th[i].textContent=x})});
    set('.history-card:last-of-type .section-kicker',t('flightArchive'));

    const modes=qa('.mode-switch button');if(modes[0])modes[0].textContent=t('live');if(modes[1])modes[1].textContent=t('history');if(modes[2])modes[2].textContent=t('analytics');
    const kickers=qa('.otp-direction-head .section-kicker');if(kickers[0])kickers[0].textContent=t('arrivalsKicker');if(kickers[1])kickers[1].textContent=t('departuresKicker');
    qa('.otp-summary>span').forEach(el=>el.textContent=t('onTimeShort'));
    const nav=qa('.mobile-nav button');if(nav[0])nav[0].lastChild.nodeValue=t('live');if(nav[1])nav[1].lastChild.nodeValue=t('flights');if(nav[2])nav[2].lastChild.nodeValue=t('history');if(nav[3])nav[3].lastChild.nodeValue=t('analytics');if(nav[4])nav[4].lastChild.nodeValue=t('refresh');
  }

  function applyDynamic(){
    const empty=q('#historyList .history-empty');if(empty)empty.textContent=t('noMatch');
  }
  function apply(){applyStatic();applyDynamic()}

  if(typeof render==='function'){
    const base=render;render=function(){const out=base.apply(this,arguments);apply();return out};
  }
  if(typeof refreshAirlines==='function'){
    const base=refreshAirlines;refreshAirlines=function(){const out=base.apply(this,arguments);setTimeout(applyStatic,0);return out};
  }

  window.JT_HISTORY_SET_LANG=function(next){
    if(!LANGS.includes(next))return;lang=next;try{localStorage.setItem('jotrip_airport_lang',lang)}catch(_){}
    if(typeof render==='function')render();else apply();
  };
  const sel=q('#languageSelect');if(sel){sel.value=lang;sel.addEventListener('change',()=>window.JT_HISTORY_SET_LANG(sel.value));}
  apply();
})();
