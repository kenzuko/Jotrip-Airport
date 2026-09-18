(() => {
  const tr=(key,fallback)=>{try{const v=window.JT_T?.(key);return v&&v!==key?v:fallback}catch(_){return fallback}};
  function fold(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toUpperCase()}
  function isCancelled(r){return String(r?.status_code||'').toUpperCase()==='CANCELLED'||/HUY|CANCEL/.test(fold(r?.status||r?.raw_status))}
  function isLate(r){
    if(typeof isDelayed==='function'&&isDelayed(r))return true;
    const s=fold(r?.status||r?.raw_status);
    return /TRE|DELAY|HOAN|DOI GIO|RESCHEDULED|POSTPONED/.test(s);
  }
  function classifyArrival(r){
    const code=String(r?.status_code||'').toUpperCase(),raw=fold(r?.status||r?.raw_status);
    if(isCancelled(r))return'ssCancelled';
    if(r?.actual_time||/ARRIVED|ON_BLOCK/.test(code)||/DA HA CANH/.test(raw))return'ssArrived';
    if(isLate(r))return'ssDelayed';
    if(/DANG BAY DEN PHU QUOC/.test(raw))return'ssEnRoute';
    if(/CHO GIO HA CANH/.test(raw))return'ssAwaitArr';
    return'ssSchedArr';
  }
  function classifyDeparture(r){
    const code=String(r?.status_code||'').toUpperCase(),raw=fold(r?.status||r?.raw_status);
    if(isCancelled(r))return'ssCancelled';
    if(r?.actual_time||code==='DEPARTED'||/DA CAT CANH/.test(raw))return'ssDeparted';
    if(isLate(r))return'ssDelayed';
    if(/CHO GIO CAT CANH/.test(raw))return'ssAwaitDep';
    if(/CHECKIN_OPEN|CHECKIN_CLOSED|BOARDING/.test(code)||/DANG LAM THU TUC|QUAY THU TUC DA DONG|DANG LEN MAY BAY|CUA KHOI HANH DA DONG/.test(raw))return'ssServing';
    if(code==='CHECKIN_SCHEDULED'||/SAP MO CHECK.?IN|CHECK.?IN TU/.test(raw))return'ssCheckinSoon';
    return'ssSchedDep';
  }
  function countBy(records,direction,classify){
    const m=new Map();
    for(const r of records||[]){if(r?.direction!==direction)continue;const key=classify(r);m.set(key,(m.get(key)||0)+1)}
    return m;
  }
  const ARRIVAL_ORDER=['ssArrived','ssEnRoute','ssDelayed','ssAwaitArr','ssSchedArr','ssCancelled'];
  const DEPARTURE_ORDER=['ssDeparted','ssServing','ssCheckinSoon','ssDelayed','ssAwaitDep','ssSchedDep','ssCancelled'];
  const FALLBACK={
    ssArrivals:'CHUYẾN ĐẾN',ssDepartures:'CHUYẾN ĐI',ssNoFlights:'Không có chuyến',ssCancelled:'Hủy chuyến',
    ssArrived:'Đã hạ cánh',ssDelayed:'Trễ / đổi giờ',ssEnRoute:'Đang bay đến Phú Quốc',ssAwaitArr:'Chờ xác nhận hạ cánh',
    ssSchedArr:'Chưa hạ cánh · theo lịch',ssDeparted:'Đã cất cánh',ssServing:'Đang phục vụ tại sân bay',
    ssCheckinSoon:'Sắp làm thủ tục',ssAwaitDep:'Chờ xác nhận cất cánh',ssSchedDep:'Theo lịch · chưa cất cánh'
  };
  function groupHtml(titleKey,map,order){
    const rows=order.filter(k=>map.get(k)).map(k=>`<div class="status-line"><span>${tr(k,FALLBACK[k])}</span><b>${map.get(k)}</b></div>`).join('');
    return `<div class="flight-status-group"><div class="flight-status-group-title">${tr(titleKey,FALLBACK[titleKey])}</div>${rows||`<div class="status-line"><span>${tr('ssNoFlights',FALLBACK.ssNoFlights)}</span><b>0</b></div>`}</div>`;
  }
  function renderOperationalStatus(){
    const host=document.getElementById('statusSummary');
    if(!host||typeof state==='undefined'||!state?.latest?.records)return;
    const records=state.latest.records;
    host.innerHTML=groupHtml('ssArrivals',countBy(records,'arrival',classifyArrival),ARRIVAL_ORDER)+groupHtml('ssDepartures',countBy(records,'departure',classifyDeparture),DEPARTURE_ORDER);
  }
  window.JT_RENDER_STATUS_SUMMARY=renderOperationalStatus;
  if(!document.getElementById('operationalStatusStyle')){
    const style=document.createElement('style');style.id='operationalStatusStyle';
    style.textContent='.flight-status-group+.flight-status-group{margin-top:14px;padding-top:12px;border-top:1px solid #e7eef3}.flight-status-group-title{font-size:10px;font-weight:850;letter-spacing:.08em;color:#1680aa;margin:0 0 4px}.status-summary .status-line span{text-transform:none}';
    document.head.appendChild(style);
  }
  if(typeof renderAnalytics==='function'){
    const baseRenderAnalytics=renderAnalytics;
    renderAnalytics=function(){baseRenderAnalytics();renderOperationalStatus()};
  }
  window.addEventListener('jotrip:board-date',renderOperationalStatus);
  window.addEventListener('load',renderOperationalStatus);
  setTimeout(renderOperationalStatus,0);
})();