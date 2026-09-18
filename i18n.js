
(function(){
  const LANGS=['vi','en','ko','ru','zh'];
  let lang='vi';
  try{lang=localStorage.getItem('jotrip_airport_lang')||'vi'}catch(_){}
  if(!LANGS.includes(lang))lang='vi';
  window.JT_I18N_ACTIVE=true;

  const D={
    vi:{
      today:'Hôm nay tại Phú Quốc',heroSub:'3 giây để biết sân bay đang ra sao.',total:'Tổng chuyến',arrivals:'Chuyến đến',departures:'Chuyến đi',intlArrivals:'Quốc tế đến',
      flightBoard:'Chuyến bay hôm nay',search:'Tìm chuyến',arrival:'Chuyến đến',departure:'Chuyến đi',all:'Tất cả',next3:'3 giờ tới',international:'Quốc tế',domestic:'Nội địa',changed:'Có thay đổi',showMore:'Xem thêm',
      searchPh:'Tìm số chuyến, hãng hoặc nơi đi/đến: VJ339, Hà Nội, Da Nang...',opsWatch:'Operations Watch',nextArrivals:'Next Arrivals',dataHealth:'Data Health',
      live:'LIVE',history:'HISTORY',analytics:'ANALYTICS',flights:'Flights',refresh:'Refresh',
      yesterday:'HÔM QUA',todayShort:'HÔM NAY',tomorrow:'NGÀY MAI',yesterdayAt:'Hôm qua tại Phú Quốc',tomorrowAt:'Ngày mai tại Phú Quốc',flightsYesterday:'Chuyến bay hôm qua',flightsTomorrow:'Chuyến bay ngày mai',board:'BẢNG',boardYesterday:'BẢNG HÔM QUA',boardTomorrow:'BẢNG NGÀY MAI',
      healthPillGood:'GOOD · dữ liệu đang mới',healthPillWatch:'WATCH · dữ liệu chậm',healthPillStale:'STALE · dữ liệu cũ',sourceLive:'JoTrip Live · Tự động làm mới',
      fidsTitle:'Bảng thông tin chuyến bay',fidsDesc:'Giờ bay, dự kiến - thực tế, trạng thái, cửa, quầy và băng chuyền.',
      sched:'LỊCH',estActual:'DỰ KIẾN / THỰC TẾ',flight:'CHUYẾN',route:'HÀNH TRÌNH',status:'TRẠNG THÁI',gate:'CỬA',counterBelt:'QUẦY / BĂNG',change:'THAY ĐỔI',
      counter:'QUẦY',belt:'BĂNG',arr:'ĐẾN',dep:'ĐI',intl:'QUỐC TẾ',dom:'NỘI ĐỊA',actual:'THỰC TẾ',est:'DỰ KIẾN',schedShort:'LỊCH',changedNow:'ĐÃ ĐỔI',
      stable:'FIDS đang ổn định',changesActive:'{n} thay đổi đang hiệu lực',noFidsChanges:'Chưa ghi nhận đổi cửa, đổi quầy hoặc đổi băng chuyền đang hiệu lực.',noFidsFlights:'Chưa có chuyến sắp tới trong dữ liệu FIDS.',
      sourceAirport:'Cập nhật theo dữ liệu sân bay',sourceAt:'Nguồn {time}',onTime:'Đúng giờ',checkinOpen:'Đang check-in',checkinClosed:'Check-in đã đóng',checkinSoon:'Sắp mở check-in',
      boarding:'Đang lên máy bay',arrived:'Đã hạ cánh',departed:'Đã cất cánh',cancelled:'Hủy',flyingToPqc:'Đang bay đến Phú Quốc',waitArrival:'Chờ giờ hạ cánh',waitDeparture:'Chờ giờ cất cánh',
      early:'Dự kiến sớm {n} phút',late:'Trễ {n} phút',lateMin:'Trễ ≥ {n} phút',earlyBy:'Sớm {n} phút',lateBy:'Trễ {n} phút',
      changeGate:'ĐỔI CỬA {from} → {to}',changeCounter:'ĐỔI QUẦY {from} → {to}',changeBelt:'ĐỔI BĂNG {from} → {to}',
      watchDelayed:'Trễ',watchCancelled:'Hủy',watchEarly:'Sớm',watchClear:'Không có chuyến trễ, hủy hoặc sớm đáng kể hôm nay.',estimatedWord:'dự kiến',
      market:'Thị trường',scheduleCompare:'So với lịch',checkinCounter:'Quầy làm thủ tục',checkinTime:'Giờ mở check-in',boardingGate:'Cửa ra máy bay',baggageBelt:'Băng chuyền hành lý',parking:'Vị trí đỗ',source:'Nguồn',
      scheduledAt:'Theo lịch · {time}',actualAt:'Thực tế · {time}',estimatedAt:'Dự kiến · {time}',rawStatus:'Trạng thái gốc:',statusSource:'Trạng thái theo dữ liệu sân bay.',actualDesc:'Giờ thực tế đã được ghi nhận trong dữ liệu chuyến bay.',estimateDesc:'Giờ cập nhật theo dữ liệu chuyến bay.',
      noEstimateDesc:'Nguồn hiện tại chỉ báo trễ, chưa có giờ dự kiến nên JoTrip không tự đoán giờ.',noDelay:'Đúng giờ / chưa ghi nhận lệch lịch',unknown:'CHƯA RÕ',
      updated:'Cập nhật {time} · {age} phút trước · {source} · tự làm mới 1 phút',opsNormal:'OPERATIONS NORMAL',opsWatchCount:'WATCH · {n} BẤT THƯỜNG',dataStale:'DATA STALE',
      healthGoodTitle:'GOOD · dữ liệu đang mới',healthGoodDesc:'JoTrip Live đang cập nhật tự động, có cache ngắn để giữ ổn định.',healthWatchTitle:'WATCH · dữ liệu chậm cập nhật',healthWatchDesc:'Dữ liệu đang có độ trễ cao hơn bình thường. Trang sẽ tự kiểm tra lại mỗi phút.',
      healthStaleTitle:'STALE · không còn là dữ liệu live',healthStaleDesc:'Dữ liệu đã quá 15 phút. Không nên xem đây là trạng thái tức thời của sân bay.',healthFallbackTitle:'FALLBACK · đang dùng AutoSync',healthFallbackDesc:'Luồng live tạm không phản hồi. Giao diện đã chuyển sang bản lưu gần nhất.',
      analyticsTitle:'Cơ cấu chuyến bay',currentData:'Dữ liệu hiện tại',routeDistribution:'Tất cả điểm đi / đến',timeDistribution:'Phân bố theo khung giờ',flightStatus:'Flight Status',dataAge:'Data age',
      noFlights:'Không có chuyến phù hợp bộ lọc hiện tại.',noNextArrivals:'Chưa có chuyến đến tiếp theo trong dữ liệu.'
    },
    en:{
      today:'Today at Phu Quoc',heroSub:'Understand the airport in 3 seconds.',total:'Total flights',arrivals:'Arrivals',departures:'Departures',intlArrivals:'International arrivals',
      flightBoard:'Today’s flights',search:'Find flight',arrival:'Arrivals',departure:'Departures',all:'All',next3:'Next 3 hours',international:'International',domestic:'Domestic',changed:'Changed',showMore:'Show more',
      searchPh:'Search flight, airline or city: VJ339, Hanoi, Da Nang...',opsWatch:'Daily Flight Watch',nextArrivals:'Next Arrivals',dataHealth:'Data Health',
      live:'LIVE',history:'HISTORY',analytics:'ANALYTICS',flights:'Flights',refresh:'Refresh',
      yesterday:'YESTERDAY',todayShort:'TODAY',tomorrow:'TOMORROW',yesterdayAt:'Yesterday at Phu Quoc',tomorrowAt:'Tomorrow at Phu Quoc',flightsYesterday:'Yesterday’s flights',flightsTomorrow:'Tomorrow’s flights',board:'BOARD',boardYesterday:'YESTERDAY BOARD',boardTomorrow:'TOMORROW BOARD',
      healthPillGood:'GOOD · data fresh',healthPillWatch:'WATCH · data delayed',healthPillStale:'STALE · data old',sourceLive:'JoTrip Live · Auto refresh',
      fidsTitle:'Flight information display',fidsDesc:'Schedule, estimate/actual, status, gate, check-in and baggage belt.',
      sched:'SCHED',estActual:'EST / ACTUAL',flight:'FLIGHT',route:'ROUTE',status:'STATUS',gate:'GATE',counterBelt:'CHECK-IN / BELT',change:'CHANGE',
      counter:'CHECK-IN',belt:'BELT',arr:'ARR',dep:'DEP',intl:'INTL',dom:'DOM',actual:'ACTUAL',est:'EST',schedShort:'SCHED',changedNow:'CHANGED',
      stable:'FIDS stable',changesActive:'{n} active changes',noFidsChanges:'No active gate, check-in counter or baggage belt changes.',noFidsFlights:'No upcoming flights in FIDS data.',
      sourceAirport:'Updated from airport data',sourceAt:'Source {time}',onTime:'On time',checkinOpen:'Check-in open',checkinClosed:'Check-in closed',checkinSoon:'Check-in opening soon',
      boarding:'Boarding',arrived:'Arrived',departed:'Departed',cancelled:'Cancelled',flyingToPqc:'En route to Phu Quoc',waitArrival:'Awaiting arrival time',waitDeparture:'Awaiting departure time',
      early:'Estimated {n} min early',late:'Delayed {n} min',lateMin:'Delayed ≥ {n} min',earlyBy:'{n} min early',lateBy:'{n} min late',
      changeGate:'GATE {from} → {to}',changeCounter:'CHECK-IN {from} → {to}',changeBelt:'BELT {from} → {to}',
      watchDelayed:'Delayed',watchCancelled:'Cancelled',watchEarly:'Early',watchClear:'No significantly delayed, cancelled or early flights today.',estimatedWord:'estimated',
      market:'Market',scheduleCompare:'Vs schedule',checkinCounter:'Check-in counter',checkinTime:'Check-in opens',boardingGate:'Boarding gate',baggageBelt:'Baggage belt',parking:'Parking bay',source:'Source',
      scheduledAt:'Scheduled · {time}',actualAt:'Actual · {time}',estimatedAt:'Estimated · {time}',rawStatus:'Original airport status:',statusSource:'Status from airport data.',actualDesc:'Actual time recorded in flight data.',estimateDesc:'Updated time from flight data.',
      noEstimateDesc:'The source reports a delay but has not published an estimated time. JoTrip does not guess it.',noDelay:'On time / no schedule deviation',unknown:'UNKNOWN',
      updated:'Updated {time} · {age} min ago · {source} · refreshes every minute',opsNormal:'OPERATIONS NORMAL',opsWatchCount:'WATCH · {n} ISSUES',dataStale:'DATA STALE',
      healthGoodTitle:'GOOD · DATA FRESH',healthGoodDesc:'JoTrip Live is updating automatically with a short stability cache.',healthWatchTitle:'WATCH · DATA DELAYED',healthWatchDesc:'Data is slower than usual. The page checks again every minute.',
      healthStaleTitle:'STALE · DATA OLD',healthStaleDesc:'Data is over 15 minutes old and should not be treated as real-time.',healthFallbackTitle:'FALLBACK · AUTOSYNC',healthFallbackDesc:'The live feed is temporarily unavailable. The page is using the latest stored snapshot.',
      analyticsTitle:'Flight mix',currentData:'Current data',routeDistribution:'All origins / destinations',timeDistribution:'Distribution by time',flightStatus:'Flight Status',dataAge:'Data age',
      noFlights:'No flights match the current filters.',noNextArrivals:'No upcoming arrivals in the current data.'
    },
    ko:{
      today:'오늘의 푸꾸옥 공항',heroSub:'3초 만에 공항 상황을 확인하세요.',total:'전체 항공편',arrivals:'도착',departures:'출발',intlArrivals:'국제선 도착',
      flightBoard:'오늘의 항공편',search:'항공편 찾기',arrival:'도착',departure:'출발',all:'전체',next3:'향후 3시간',international:'국제선',domestic:'국내선',changed:'변경 있음',showMore:'더 보기',
      searchPh:'편명, 항공사 또는 도시 검색: VJ339, Hanoi, Da Nang...',opsWatch:'오늘의 운항 주의',nextArrivals:'다음 도착편',dataHealth:'데이터 상태',
      live:'실시간',history:'이력',analytics:'분석',flights:'항공편',refresh:'새로고침',
      yesterday:'어제',todayShort:'오늘',tomorrow:'내일',yesterdayAt:'어제 푸꾸옥 공항',tomorrowAt:'내일 푸꾸옥 공항',flightsYesterday:'어제 항공편',flightsTomorrow:'내일 항공편',board:'운항표',boardYesterday:'어제 운항표',boardTomorrow:'내일 운항표',
      healthPillGood:'정상 · 최신 데이터',healthPillWatch:'주의 · 데이터 지연',healthPillStale:'오래된 데이터',sourceLive:'JoTrip Live · 자동 새로고침',
      fidsTitle:'항공편 정보 안내',fidsDesc:'예정·예상/실제 시간, 상태, 게이트, 체크인 카운터 및 수하물 벨트.',
      sched:'예정',estActual:'예상 / 실제',flight:'편명',route:'노선',status:'상태',gate:'게이트',counterBelt:'체크인 / 벨트',change:'변경',
      counter:'체크인',belt:'벨트',arr:'도착',dep:'출발',intl:'국제선',dom:'국내선',actual:'실제',est:'예상',schedShort:'예정',changedNow:'변경됨',
      stable:'FIDS 정상',changesActive:'변경 {n}건 적용 중',noFidsChanges:'현재 게이트, 체크인 카운터 또는 수하물 벨트 변경이 없습니다.',noFidsFlights:'FIDS에 예정 항공편이 없습니다.',
      sourceAirport:'공항 데이터 기준',sourceAt:'데이터 {time}',onTime:'정시',checkinOpen:'체크인 중',checkinClosed:'체크인 마감',checkinSoon:'체크인 곧 시작',
      boarding:'탑승 중',arrived:'도착 완료',departed:'출발 완료',cancelled:'취소',flyingToPqc:'푸꾸옥으로 운항 중',waitArrival:'도착 시간 대기',waitDeparture:'출발 시간 대기',
      early:'예상 {n}분 조기',late:'{n}분 지연',lateMin:'최소 {n}분 지연',earlyBy:'{n}분 조기',lateBy:'{n}분 지연',
      changeGate:'게이트 {from} → {to}',changeCounter:'체크인 {from} → {to}',changeBelt:'벨트 {from} → {to}',
      watchDelayed:'지연',watchCancelled:'취소',watchEarly:'조기',watchClear:'오늘 큰 지연, 취소 또는 조기 운항 항공편이 없습니다.',estimatedWord:'예상',
      market:'구분',scheduleCompare:'예정 대비',checkinCounter:'체크인 카운터',checkinTime:'체크인 시작',boardingGate:'탑승 게이트',baggageBelt:'수하물 벨트',parking:'주기장',source:'출처',
      scheduledAt:'예정 · {time}',actualAt:'실제 · {time}',estimatedAt:'예상 · {time}',rawStatus:'공항 원문 상태:',statusSource:'공항 데이터 기준 상태입니다.',actualDesc:'실제 시간이 항공편 데이터에 기록되었습니다.',estimateDesc:'항공편 데이터의 업데이트 시간입니다.',
      noEstimateDesc:'지연은 표시되었지만 예상 시간은 아직 공개되지 않았습니다. JoTrip은 임의로 추정하지 않습니다.',noDelay:'정시 / 시간 변동 없음',unknown:'미확인',
      updated:'업데이트 {time} · {age}분 전 · {source} · 1분마다 갱신',opsNormal:'운항 정상',opsWatchCount:'주의 · {n}건',dataStale:'데이터 지연',
      healthGoodTitle:'정상 · 최신 데이터',healthGoodDesc:'JoTrip Live가 자동 업데이트 중이며 안정성을 위한 짧은 캐시를 사용합니다.',healthWatchTitle:'주의 · 데이터 지연',healthWatchDesc:'데이터가 평소보다 늦습니다. 페이지는 매분 다시 확인합니다.',
      healthStaleTitle:'오래된 데이터',healthStaleDesc:'데이터가 15분 이상 지나 실시간 상태로 보기 어렵습니다.',healthFallbackTitle:'대체 데이터 · AUTOSYNC',healthFallbackDesc:'실시간 피드가 일시적으로 응답하지 않아 최근 저장 데이터를 사용합니다.',
      analyticsTitle:'항공편 구성',currentData:'현재 데이터',routeDistribution:'전체 출발지 / 도착지',timeDistribution:'시간대별 분포',flightStatus:'항공편 상태',dataAge:'데이터 경과',
      noFlights:'현재 필터에 맞는 항공편이 없습니다.',noNextArrivals:'다음 도착편 정보가 없습니다.'
    },
    ru:{
      today:'Сегодня в аэропорту Фукуока',heroSub:'Ситуация в аэропорту за 3 секунды.',total:'Всего рейсов',arrivals:'Прибытия',departures:'Вылеты',intlArrivals:'Международные прибытия',
      flightBoard:'Рейсы сегодня',search:'Найти рейс',arrival:'Прибытия',departure:'Вылеты',all:'Все',next3:'Ближайшие 3 часа',international:'Международные',domestic:'Внутренние',changed:'Есть изменения',showMore:'Показать ещё',
      searchPh:'Поиск по рейсу, авиакомпании или городу: VJ339, Hanoi, Da Nang...',opsWatch:'Сводка рейсов за день',nextArrivals:'Ближайшие прибытия',dataHealth:'Состояние данных',
      live:'LIVE',history:'ИСТОРИЯ',analytics:'АНАЛИТИКА',flights:'Рейсы',refresh:'Обновить',
      yesterday:'ВЧЕРА',todayShort:'СЕГОДНЯ',tomorrow:'ЗАВТРА',yesterdayAt:'Вчера в аэропорту Фукуока',tomorrowAt:'Завтра в аэропорту Фукуока',flightsYesterday:'Рейсы вчера',flightsTomorrow:'Рейсы завтра',board:'ТАБЛО',boardYesterday:'ТАБЛО ВЧЕРА',boardTomorrow:'ТАБЛО ЗАВТРА',
      healthPillGood:'GOOD · ДАННЫЕ СВЕЖИЕ',healthPillWatch:'WATCH · ЗАДЕРЖКА ДАННЫХ',healthPillStale:'STALE · ДАННЫЕ УСТАРЕЛИ',sourceLive:'JoTrip Live · Автообновление',
      fidsTitle:'Табло рейсов',fidsDesc:'Расписание, расчётное/фактическое время, статус, выход, стойка и багажная лента.',
      sched:'РАСП.',estActual:'РАСЧ. / ФАКТ.',flight:'РЕЙС',route:'МАРШРУТ',status:'СТАТУС',gate:'ВЫХОД',counterBelt:'СТОЙКА / ЛЕНТА',change:'ИЗМЕНЕНИЕ',
      counter:'СТОЙКА',belt:'ЛЕНТА',arr:'ПРИБ.',dep:'ВЫЛ.',intl:'МЕЖД.',dom:'ВНУТР.',actual:'ФАКТ',est:'РАСЧ',schedShort:'РАСП',changedNow:'ИЗМЕНЕНО',
      stable:'FIDS без изменений',changesActive:'Активных изменений: {n}',noFidsChanges:'Нет активных изменений выхода, стойки регистрации или багажной ленты.',noFidsFlights:'Нет ближайших рейсов в данных FIDS.',
      sourceAirport:'По данным аэропорта',sourceAt:'Источник {time}',onTime:'По расписанию',checkinOpen:'Регистрация открыта',checkinClosed:'Регистрация закрыта',checkinSoon:'Регистрация скоро откроется',
      boarding:'Посадка',arrived:'Прибыл',departed:'Вылетел',cancelled:'Отменён',flyingToPqc:'В пути на Фукуок',waitArrival:'Ожидается время прибытия',waitDeparture:'Ожидается время вылета',
      early:'Ожидается на {n} мин раньше',late:'Задержка {n} мин',lateMin:'Задержка ≥ {n} мин',earlyBy:'На {n} мин раньше',lateBy:'На {n} мин позже',
      changeGate:'ВЫХОД {from} → {to}',changeCounter:'СТОЙКА {from} → {to}',changeBelt:'ЛЕНТА {from} → {to}',
      watchDelayed:'Задержано',watchCancelled:'Отменено',watchEarly:'Раньше',watchClear:'Сегодня нет значительных задержек, отмен или ранних вылетов.',estimatedWord:'расч.',
      market:'Тип',scheduleCompare:'К расписанию',checkinCounter:'Стойка регистрации',checkinTime:'Начало регистрации',boardingGate:'Выход на посадку',baggageBelt:'Багажная лента',parking:'Место стоянки',source:'Источник',
      scheduledAt:'По расписанию · {time}',actualAt:'Факт · {time}',estimatedAt:'Расчётное · {time}',rawStatus:'Исходный статус аэропорта:',statusSource:'Статус по данным аэропорта.',actualDesc:'Фактическое время записано в данных рейса.',estimateDesc:'Обновлённое время из данных рейса.',
      noEstimateDesc:'Источник сообщает о задержке, но расчётное время ещё не опубликовано. JoTrip не прогнозирует его самостоятельно.',noDelay:'По расписанию / отклонений нет',unknown:'НЕТ ДАННЫХ',
      updated:'Обновлено {time} · {age} мин назад · {source} · обновление каждую минуту',opsNormal:'ОПЕРАЦИИ В НОРМЕ',opsWatchCount:'ВНИМАНИЕ · {n}',dataStale:'ДАННЫЕ УСТАРЕЛИ',
      healthGoodTitle:'GOOD · ДАННЫЕ СВЕЖИЕ',healthGoodDesc:'JoTrip Live обновляется автоматически с коротким кэшем для стабильности.',healthWatchTitle:'WATCH · ЗАДЕРЖКА ДАННЫХ',healthWatchDesc:'Данные поступают медленнее обычного. Страница проверяет их каждую минуту.',
      healthStaleTitle:'STALE · ДАННЫЕ УСТАРЕЛИ',healthStaleDesc:'Данным больше 15 минут, их нельзя считать оперативными.',healthFallbackTitle:'FALLBACK · AUTOSYNC',healthFallbackDesc:'Live-поток временно недоступен. Используется последний сохранённый снимок.',
      analyticsTitle:'Структура рейсов',currentData:'Текущие данные',routeDistribution:'Все пункты отправления / назначения',timeDistribution:'Распределение по времени',flightStatus:'Статусы рейсов',dataAge:'Возраст данных',
      noFlights:'Нет рейсов по выбранным фильтрам.',noNextArrivals:'Нет ближайших прибытий в текущих данных.'
    },
    zh:{
      today:'今日富国岛机场',heroSub:'3秒了解机场运行情况。',total:'航班总数',arrivals:'到达',departures:'出发',intlArrivals:'国际到达',
      flightBoard:'今日航班',search:'查找航班',arrival:'到达',departure:'出发',all:'全部',next3:'未来3小时',international:'国际',domestic:'国内',changed:'有变更',showMore:'查看更多',
      searchPh:'搜索航班、航空公司或城市：VJ339、Hanoi、Da Nang...',opsWatch:'今日航班运行摘要',nextArrivals:'即将到达',dataHealth:'数据状态',
      live:'实时',history:'历史',analytics:'分析',flights:'航班',refresh:'刷新',
      yesterday:'昨天',todayShort:'今天',tomorrow:'明天',yesterdayAt:'昨天的富国岛机场',tomorrowAt:'明天的富国岛机场',flightsYesterday:'昨天的航班',flightsTomorrow:'明天的航班',board:'航班表',boardYesterday:'昨天航班表',boardTomorrow:'明天航班表',
      healthPillGood:'正常 · 数据最新',healthPillWatch:'注意 · 数据延迟',healthPillStale:'数据已过期',sourceLive:'JoTrip Live · 自动刷新',
      fidsTitle:'航班信息显示',fidsDesc:'计划、预计/实际时间、状态、登机口、值机柜台和行李转盘。',
      sched:'计划',estActual:'预计 / 实际',flight:'航班',route:'航线',status:'状态',gate:'登机口',counterBelt:'值机 / 行李',change:'变更',
      counter:'值机',belt:'行李',arr:'到达',dep:'出发',intl:'国际',dom:'国内',actual:'实际',est:'预计',schedShort:'计划',changedNow:'已变更',
      stable:'FIDS 正常',changesActive:'当前 {n} 项变更',noFidsChanges:'目前没有登机口、值机柜台或行李转盘变更。',noFidsFlights:'FIDS 暂无即将起飞或到达的航班。',
      sourceAirport:'依据机场数据更新',sourceAt:'数据 {time}',onTime:'准点',checkinOpen:'正在值机',checkinClosed:'值机已关闭',checkinSoon:'即将开始值机',
      boarding:'正在登机',arrived:'已到达',departed:'已起飞',cancelled:'取消',flyingToPqc:'飞往富国岛途中',waitArrival:'等待到达时间',waitDeparture:'等待起飞时间',
      early:'预计提前 {n} 分钟',late:'延误 {n} 分钟',lateMin:'延误至少 {n} 分钟',earlyBy:'提前 {n} 分钟',lateBy:'延后 {n} 分钟',
      changeGate:'登机口 {from} → {to}',changeCounter:'值机 {from} → {to}',changeBelt:'行李 {from} → {to}',
      watchDelayed:'延误',watchCancelled:'取消',watchEarly:'提前',watchClear:'今天没有明显延误、取消或提前的航班。',estimatedWord:'预计',
      market:'类型',scheduleCompare:'相对计划',checkinCounter:'值机柜台',checkinTime:'值机开始',boardingGate:'登机口',baggageBelt:'行李转盘',parking:'停机位',source:'来源',
      scheduledAt:'计划 · {time}',actualAt:'实际 · {time}',estimatedAt:'预计 · {time}',rawStatus:'机场原始状态：',statusSource:'状态来自机场数据。',actualDesc:'实际时间已记录在航班数据中。',estimateDesc:'更新时间来自航班数据。',
      noEstimateDesc:'当前来源仅报告延误，尚未公布预计时间，JoTrip 不自行猜测。',noDelay:'准点 / 暂无时间偏差',unknown:'未知',
      updated:'更新于 {time} · {age} 分钟前 · {source} · 每分钟刷新',opsNormal:'运行正常',opsWatchCount:'注意 · {n} 项',dataStale:'数据已过期',
      healthGoodTitle:'正常 · 数据最新',healthGoodDesc:'JoTrip Live 正在自动更新，并使用短缓存保持稳定。',healthWatchTitle:'注意 · 数据延迟',healthWatchDesc:'数据比平时更慢，页面每分钟重新检查。',
      healthStaleTitle:'数据已过期',healthStaleDesc:'数据已超过15分钟，不应视为实时状态。',healthFallbackTitle:'备用 · AUTOSYNC',healthFallbackDesc:'实时数据暂时无响应，页面正在使用最近保存的数据。',
      analyticsTitle:'航班结构',currentData:'当前数据',routeDistribution:'全部出发地 / 目的地',timeDistribution:'按时间分布',flightStatus:'航班状态',dataAge:'数据时效',
      noFlights:'当前筛选条件下没有航班。',noNextArrivals:'当前数据中没有即将到达的航班。'
    }
  };

  function t(key,vars){
    let s=(D[lang]&&D[lang][key])||D.vi[key]||key;
    if(vars)Object.keys(vars).forEach(k=>{s=s.replace(new RegExp('\\{'+k+'\\}','g'),String(vars[k]));});
    return s;
  }
  window.JT_T=t;
  window.JT_LANG=()=>lang;

  function status(input){
    const s=String(input||'');
    let m;
    if((m=s.match(/^Dự kiến sớm (\d+) phút$/i)))return t('early',{n:m[1]});
    if((m=s.match(/^Trễ ≥ (\d+) phút$/i)))return t('lateMin',{n:m[1]});
    if((m=s.match(/^Trễ (\d+) phút$/i)))return t('late',{n:m[1]});
    if((m=s.match(/^Đã hạ cánh\s+(\d{1,2}:\d{2})(?:\s*·\s*trễ\s*(\d+)\s*phút)?$/i))){
      return t('arrived')+' '+m[1]+(m[2]?' · '+t('late',{n:m[2]}):'');
    }
    if((m=s.match(/^Đã cất cánh\s+(\d{1,2}:\d{2})(?:\s*·\s*(trễ|sớm)\s*(\d+)\s*phút)?$/i))){
      return t('departed')+' '+m[1]+(m[2]==='trễ'?' · '+t('late',{n:m[3]}):m[2]==='sớm'?' · '+t('earlyBy',{n:m[3]}):'');
    }
    if((m=s.match(/^Check-in từ\s+(\d{1,2}:\d{2})$/i)))return t('checkinOpen')+' · '+m[1];
    const exact={
      'Đúng giờ':'onTime','Đang check-in':'checkinOpen','Check-in đã đóng':'checkinClosed','Sắp mở check-in':'checkinSoon',
      'Đang lên máy bay':'boarding','Đã hạ cánh':'arrived','Đã cất cánh':'departed','Hủy':'cancelled',
      'Đang bay đến Phú Quốc':'flyingToPqc','Chờ giờ hạ cánh':'waitArrival','Chờ giờ cất cánh':'waitDeparture',
      'Chưa có giờ hạ cánh':'waitArrival','Chưa có giờ cất cánh':'waitDeparture'
    };
    return exact[s]?t(exact[s]):s;
  }
  window.JT_STATUS=status;

  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];
  const set=(sel,value)=>{const el=typeof sel==='string'?q(sel):sel;if(el&&value!=null)el.textContent=value};

  function applyStatic(){
    document.documentElement.lang=lang==='zh'?'zh-CN':lang;
    const sel=q('#languageSelect');if(sel&&sel.value!==lang)sel.value=lang;

    const offset=(typeof state!=='undefined'&&Number.isFinite(Number(state.boardOffset)))?Number(state.boardOffset):0;
    set('.hero h2',offset<0?t('yesterdayAt'):offset>0?t('tomorrowAt'):t('today'));set('.hero p',t('heroSub'));
    const hs=qa('.hero-stats article span');[t('total'),t('arrivals'),t('departures'),t('intlArrivals')].forEach((v,i)=>{if(hs[i])hs[i].textContent=v;});
    const dayBtns=qa('.board-day-switch button');dayBtns.forEach(btn=>{const o=Number(btn.dataset.offset);btn.textContent=o<0?t('yesterday'):o>0?t('tomorrow'):t('todayShort');});

    set('#flightBoard .card-head h3',offset<0?t('flightsYesterday'):offset>0?t('flightsTomorrow'):t('flightBoard'));set('#searchToggle',t('search'));const inp=q('#flightSearch');if(inp)inp.placeholder=t('searchPh');
    const dirs=qa('#directionTabs button');[t('arrival'),t('departure'),t('all')].forEach((v,i)=>{if(dirs[i])dirs[i].textContent=v;});
    const chips=qa('#filterChips button');[t('all'),t('next3'),t('international'),t('domestic'),t('changed')].forEach((v,i)=>{if(chips[i])chips[i].textContent=v;});
    set('#showMore',t('showMore'));

    const side=qa('.sidebar .side-head h3');if(side[0])side[0].textContent=t('opsWatch');if(side[1])side[1].textContent=t('nextArrivals');if(side[2])side[2].textContent=t('dataHealth');
    const modes=qa('.mode-switch button');if(modes[0])modes[0].textContent=t('live');if(modes[1])modes[1].textContent=t('history');if(modes[2])modes[2].textContent=t('analytics');
    const nav=qa('.mobile-nav button');if(nav[1])nav[1].lastChild.nodeValue=t('flights');if(nav[2])nav[2].lastChild.nodeValue=t('history');if(nav[3])nav[3].lastChild.nodeValue=t('analytics');if(nav[4])nav[4].lastChild.nodeValue=t('refresh');

    const analytics=q('#analytics');if(analytics){
      set(analytics.querySelector('.card-head h3'),t('analyticsTitle'));set(analytics.querySelector('.card-head .muted'),t('currentData'));
      const mh=qa('#analytics .analytics-block h4');if(mh[0])mh[0].textContent=t('routeDistribution');if(mh[1])mh[1].textContent=t('timeDistribution');
      const ms=qa('#analytics .analytics-metrics article span');[t('intlArrivals'),t('domestic')+' '+t('arrivals').toLowerCase(),t('international')+' '+t('departures').toLowerCase(),t('domestic')+' '+t('departures').toLowerCase()].forEach((v,i)=>{if(ms[i])ms[i].textContent=v;});
    }
    const ss=q('.sidebar .analytics-only .side-head h3');if(ss)ss.textContent=t('flightStatus');
    const dts=qa('.health-meta dt');if(dts[3])dts[3].textContent=t('dataAge');
  }

  function applySummary(){
    if(typeof state==='undefined'||!state.latest)return;
    const l=state.latest,age=typeof ageInfo==='function'?ageInfo(l.collected_at_vn):{minutes:0,level:'good'};
    const src=state.dataSource==='live'?'JoTrip Live':state.dataSource==='fallback'?'AutoSync fallback':'JoTrip AutoSync';
    try{
      const time=new Date(l.collected_at_vn).toLocaleTimeString(lang==='vi'?'vi-VN':lang==='zh'?'zh-CN':lang,{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Ho_Chi_Minh'});
      set('#updatedAt',t('updated',{time:time,age:age.minutes??0,source:src}));
    }catch(_){}
    const abnormal=(l.records||[]).filter(r=>!isPastRecord(r)&&(isAbnormal(r)||isEarly(r,10))).length;
    const ops=q('#opsState');
    if(ops){
      if(age.level==='stale'||age.level==='bad')ops.textContent=t('dataStale');
      else if(abnormal>0||age.level==='watch')ops.textContent=t('opsWatchCount',{n:abnormal});
      else ops.textContent=t('opsNormal');
    }
  }

  function applyHealth(){
    if(typeof state==='undefined'||!state.latest)return;
    const l=state.latest,h=state.health,age=ageInfo(l.collected_at_vn);
    const pass=!!(h?.collector_completed&&h?.parser_passed&&h?.normalization_passed&&h?.qa_passed&&l?.quality?.usable);
    const hp=q('#healthPill'),sl=q('.source-label');
    if(sl)sl.textContent=t('sourceLive');
    if(!pass){if(hp)hp.textContent='QA FAIL';return;}
    if(age.level==='good'){if(hp)hp.textContent=t('healthPillGood');}
    else if(age.level==='watch'){if(hp)hp.textContent=t('healthPillWatch');}
    else{if(hp)hp.textContent=t('healthPillStale');}
    if(state.dataSource==='fallback'){set('#healthTitle',t('healthFallbackTitle'));set('#healthDescription',t('healthFallbackDesc'));}
    else if(age.level==='good'){set('#healthTitle',t('healthGoodTitle'));set('#healthDescription',t('healthGoodDesc'));}
    else if(age.level==='watch'){set('#healthTitle',t('healthWatchTitle'));set('#healthDescription',t('healthWatchDesc'));}
    else{set('#healthTitle',t('healthStaleTitle'));set('#healthDescription',t('healthStaleDesc'));}
  }

  function applyFlights(){
    qa('#flightList .flight-row').forEach(row=>{
      const small=row.querySelector('.flight-time small');
      if(small){
        let s=small.textContent.trim(),m;
        if(s==='Đến PQC')small.textContent=t('arrival')+' PQC';
        else if(s==='Rời PQC')small.textContent=t('departure')+' PQC';
        else if((m=s.match(/^Dự kiến\s+(\d{1,2}:\d{2})$/)))small.textContent=t('est')+' '+m[1];
        else if(s==='Chưa có giờ dự kiến')small.textContent=lang==='vi'?'Chưa có giờ dự kiến':t('unknown');
      }
      const market=row.querySelector('.market-label');if(market)market.textContent=market.textContent.trim()==='Quốc tế'?t('international'):t('domestic');
      const pill=row.querySelector('.status-pill');if(pill)pill.textContent=status(pill.textContent.trim());
    });
    const empty=q('#flightList .empty-state');if(empty)empty.textContent=t('noFlights');
  }

  function applyNextArrivals(){
    qa('#nextArrivalsList .arrival-item').forEach(row=>{
      const sub=row.querySelector('.arrival-main span'),pill=row.querySelector('.status-pill');
      if(sub){const m=sub.textContent.trim().match(/^Dự kiến\s+(\d{1,2}:\d{2})$/);if(m)sub.textContent=t('est')+' '+m[1];}
      if(pill)pill.textContent=status(pill.textContent.trim());
    });
    const empty=q('#nextArrivalsList .empty-state');if(empty)empty.textContent=t('noNextArrivals');
  }

  function applyAnalytics(){
    qa('#analytics .analytics-metrics small').forEach(el=>{
      const m=el.textContent.match(/^([\d.,]+%)\s+chuyến\s+(đến|đi)$/i);
      if(m)el.textContent=m[1]+' '+(m[2].toLowerCase()==='đến'?t('arrivals'):t('departures')).toLowerCase();
    });
    qa('#statusSummary .status-line span').forEach(el=>{
      let s=el.textContent;
      if(s.startsWith('Đến · '))s=t('arrival')+' · '+s.slice(6);
      if(s.startsWith('Đi · '))s=t('departure')+' · '+s.slice(5);
      el.textContent=s;
    });
  }

  function applyDrawer(){
    const d=q('#drawerContent');if(!d)return;
    const title=d.querySelector('.drawer-title');if(title)title.textContent=title.textContent.includes('ĐẾN')?t('arrival').toUpperCase():t('departure').toUpperCase();
    const jc=qa('#drawerContent .journey-copy');
    if(jc[0]){
      const st=jc[0].querySelector('strong'),m=st&&st.textContent.match(/·\s*(\d{1,2}:\d{2})/);if(st&&m)st.textContent=t('scheduledAt',{time:m[1]});
    }
    if(jc[1]){
      const st=jc[1].querySelector('strong');if(st)st.textContent=status(st.textContent.trim());
      const p=jc[1].querySelector('p');if(p){
        if(p.textContent.startsWith('Nguồn sân bay:'))p.textContent=t('rawStatus')+' '+status(p.textContent.replace(/^Nguồn sân bay:\s*/,''));else p.textContent=t('statusSource');
      }
    }
    if(jc[2]){
      const st=jc[2].querySelector('strong'),p=jc[2].querySelector('p');if(st){
        let m=st.textContent.match(/^Thực tế\s*·\s*(.+)$/);if(m)st.textContent=t('actualAt',{time:m[1]});
        m=st.textContent.match(/^Dự kiến\s*·\s*(.+)$/);if(m)st.textContent=t('estimatedAt',{time:m[1]});
      }
      if(p){
        if(p.textContent.includes('Actual time')||p.textContent.includes('Giờ thực tế'))p.textContent=t('actualDesc');
        else if(p.textContent.includes('chỉ báo trễ'))p.textContent=t('noEstimateDesc');
        else p.textContent=t('estimateDesc');
      }
    }
    const labels=qa('#drawerContent .drawer-meta span');
    const map={'So với lịch':'scheduleCompare','Thị trường':'market','Quầy làm thủ tục':'checkinCounter','Giờ mở check-in':'checkinTime','Cửa ra máy bay':'boardingGate','Băng chuyền hành lý':'baggageBelt','Vị trí đỗ':'parking','Nguồn':'source'};
    labels.forEach(el=>{const k=map[el.textContent.trim()];if(k)el.textContent=t(k);});
    qa('#drawerContent .drawer-meta b').forEach(el=>{
      let s=el.textContent.trim(),m;
      if(s==='Quốc tế')el.textContent=t('international');else if(s==='Nội địa')el.textContent=t('domestic');
      else if((m=s.match(/^Sớm\s+(\d+)\s+phút$/)))el.textContent=t('earlyBy',{n:m[1]});
      else if((m=s.match(/^Trễ\s+(\d+)\s+phút$/)))el.textContent=t('lateBy',{n:m[1]});
      else if(s==='Đúng giờ / chưa ghi nhận lệch lịch')el.textContent=t('noDelay');
    });
  }

  function apply(){
    applyStatic();applySummary();applyHealth();applyFlights();applyNextArrivals();applyAnalytics();applyDrawer();
  }

  function wrap(name,after){
    const fn=window[name];if(typeof fn!=='function'||fn.__jtLang)return;
    const w=function(){const out=fn.apply(this,arguments);if(after)after();else apply();return out;};
    w.__jtLang=true;window[name]=w;
  }

  wrap('renderSummary',()=>{applyStatic();applySummary();});
  wrap('renderHealth',applyHealth);
  wrap('renderFlights',applyFlights);
  wrap('renderWatch',applyStatic);
  wrap('renderNextArrivals',applyNextArrivals);
  wrap('renderAnalytics',()=>{applyStatic();applyAnalytics();});

  if(typeof window.openDrawer==='function'){
    const base=window.openDrawer;window.openDrawer=function(){const out=base.apply(this,arguments);applyDrawer();return out;};
  }

  if(typeof window.displayStatusLabel==='function'){
    const base=window.displayStatusLabel;window.displayStatusLabel=function(r){return status(base(r));};
  }
  if(typeof window.delayStatusLabel==='function'){
    const base=window.delayStatusLabel;window.delayStatusLabel=function(r){return status(base(r));};
  }
  if(typeof window.statusClass==='function'){
    const base=window.statusClass;window.statusClass=function(value){
      const cls=base(value);if(cls&&cls!=='gray')return cls;
      const s=String(value||'');
      if([D.en.cancelled,D.ko.cancelled,D.ru.cancelled,D.zh.cancelled].some(x=>s.includes(x)))return'red';
      if(/delay|late|early|지연|조기|задерж|раньше|延误|提前/i.test(s))return'amber';
      if([D.en.arrived,D.ko.arrived,D.ru.arrived,D.zh.arrived,D.en.departed,D.ko.departed,D.ru.departed,D.zh.departed].some(x=>s.includes(x)))return'green';
      if([D.en.onTime,D.ko.onTime,D.ru.onTime,D.zh.onTime,D.en.checkinOpen,D.ko.checkinOpen,D.ru.checkinOpen,D.zh.checkinOpen,D.en.boarding,D.ko.boarding,D.ru.boarding,D.zh.boarding].some(x=>s.includes(x)))return'blue';
      return cls||'gray';
    };
  }

  window.JT_SET_LANG=function(next){
    if(!LANGS.includes(next))return;
    lang=next;try{localStorage.setItem('jotrip_airport_lang',lang)}catch(_){}
    if(typeof window.renderAll==='function')window.renderAll();
    if(typeof window.JT_RENDER_FIDS==='function')window.JT_RENDER_FIDS(true);
    apply();
  };

  const select=q('#languageSelect');if(select){select.value=lang;select.addEventListener('change',()=>window.JT_SET_LANG(select.value));}
  apply();
})();
