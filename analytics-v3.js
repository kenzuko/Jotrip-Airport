(()=>{
const DATA_BASE='https://raw.githubusercontent.com/kenzuko/Jotrip-Lab/data-sunairport/data/sunairport';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const tr=(key,fallback,vars)=>{try{const v=window.JT_T?.(key,vars);return v&&v!==key?v:fallback}catch(_){return fallback}};
const liveUrl=()=>String(window.JOTRIP_LIVE_API_URL||'').replace(/\/$/,'');
const cache=new Map();
const A={period:'today',view:'overview',direction:'all',market:'all',airline:'all',rows:[],dates:[],loading:false,error:null};

function todayVN(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function addDay(day,n){const d=new Date(day+'T12:00:00+07:00');d.setUTCDate(d.getUTCDate()+n);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}
function dateList(a,b,max=31){const out=[];let d=a;while(d<=b&&out.length<max){out.push(d);d=addDay(d,1)}return out}
function hhmm(v){const s=String(v??'');const m=s.match(/^(\d{2})(\d{2})/);if(m)return m[1]+':'+m[2];return s.match(/^\d{1,2}:\d{2}$/)?.[0]||null}
function mins(v){const t=hhmm(v);if(!t)return null;const [h,m]=t.split(':').map(Number);return h*60+m}
function signedDiff(a,b){const x=mins(a),y=mins(b);if(x==null||y==null)return null;let d=y-x;if(d>720)d-=1440;if(d<-720)d+=1440;return d}
function fold(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toUpperCase().replace(/\s+/g,' ').trim()}
function station(r){const raw=r.station||r.cityName||'';try{return typeof window.JT_STATION==='function'?window.JT_STATION(raw.replace('HO CHI MINH','TP.HCM').replace('HA NOI','HÀ NỘI').replace('DA NANG','ĐÀ NẴNG').replace('HAI PHONG','HẢI PHÒNG').replace('CAN THO','CẦN THƠ').replace('PUDONG- SHANGHAI','SHANGHAI').replace('XIANYANG-XI AN',"XI'AN")):raw}catch(_){return raw}}
function airline(r){return r.airline_name||r.airlineName||r.airline||r.airline_code||r.airlineCode||tr('unknownAirline','Chưa rõ hãng')}
function direction(r){return r.direction||r._direction||(r.arrDep==='A'?'arrival':r.arrDep==='D'?'departure':'')}
function market(r){if(r.market)return r.market;return String(r.country||'').toUpperCase()==='VN'?'domestic':'international'}
function scheduled(r){return hhmm(r.scheduled_time||r.scheduledTime)}
function actual(r){return hhmm(r.actual_time||r.actualTime)}
function statusText(r){return String(r.status||r.raw_status||r.notesVn||r.notesEn||r.remarks||'')}
function cancelled(r){return /CANCELLED/.test(String(r.status_code||'').toUpperCase())||/HUY|CANCEL/.test(fold(statusText(r)))}
function actualDelay(r){const direct=Number(r.actual_delay_minutes);if(Number.isFinite(direct))return direct;const s=scheduled(r),a=actual(r);return s&&a?signedDiff(s,a):null}

function normalizeRaw(r,dir,date){return{
  _date:date,direction:dir,operating_flight_number:r.flightNo||'',station:r.cityName||'',country:r.country||'',market:String(r.country||'').toUpperCase()==='VN'?'domestic':'international',
  airline_name:r.airlineName||r.airline||'',airline_code:r.airline||'',scheduled_time:hhmm(r.scheduledTime),estimated_time:hhmm(r.estimatedTime),actual_time:hhmm(r.actualTime),
  actual_delay_minutes:hhmm(r.actualTime)?signedDiff(hhmm(r.scheduledTime),hhmm(r.actualTime)):null,status:r.notesVn||r.notesEn||'',status_code:/HUY|CANCEL/.test(fold(r.notesVn||r.notesEn||''))?'CANCELLED':''
}}
async function fetchJson(url){const res=await fetch(url+(url.includes('?')?'&':'?')+'t='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);return res.json()}
async function fetchArchiveDate(date){const raw=await fetchJson(`${DATA_BASE}/raw/${date}.json`);return[...(raw.arrivals||[]).map(r=>normalizeRaw(r,'arrival',date)),...(raw.departures||[]).map(r=>normalizeRaw(r,'departure',date))]}
async function fetchLiveDate(date){const base=liveUrl();if(!base)throw new Error('LIVE_API_NOT_CONFIGURED');const u=new URL(base);u.searchParams.set('date',date);u.searchParams.set('t',Date.now());const res=await fetch(u,{cache:'no-store',headers:{accept:'application/json'}});if(!res.ok)throw new Error('HTTP '+res.status);const p=await res.json();return (p?.latest?.records||[]).map(r=>({...r,_date:date}))}
async function fetchDate(date){
  if(cache.has(date))return cache.get(date);
  const today=todayVN();let rows=[];
  try{
    if(date>=today)rows=await fetchLiveDate(date);
    else rows=await fetchArchiveDate(date);
  }catch(e){
    try{rows=date>=today?await fetchArchiveDate(date):await fetchLiveDate(date)}catch(_){rows=[]}
  }
  cache.set(date,rows);return rows;
}
async function mapLimit(items,limit,fn){const out=new Array(items.length);let next=0;const workers=Array.from({length:Math.min(limit,items.length)},async()=>{while(true){const i=next++;if(i>=items.length)break;try{out[i]=await fn(items[i])}catch(_){out[i]=[]}}});await Promise.all(workers);return out.flat()}

function periodDates(){
  const t=todayVN();
  if(A.period==='yesterday')return[addDay(t,-1)];
  if(A.period==='today')return[t];
  if(A.period==='tomorrow')return[addDay(t,1)];
  if(A.period==='last7')return dateList(addDay(t,-6),t,7);
  if(A.period==='last30')return dateList(addDay(t,-29),t,30);
  const from=$('#analyticsFrom')?.value||t,to=$('#analyticsTo')?.value||from;
  const a=from<=to?from:to,b=from<=to?to:from;
  return dateList(a,b,31);
}
function periodLabel(){
  const d=A.dates;
  if(!d.length)return'';
  if(A.period==='yesterday')return tr('yesterday','Hôm qua');
  if(A.period==='today')return tr('todayShort','Hôm nay');
  if(A.period==='tomorrow')return tr('tomorrow','Ngày mai');
  if(A.period==='last7')return tr('analyticsLast7','7 ngày gần nhất');
  if(A.period==='last30')return tr('analyticsLast30','30 ngày gần nhất');
  return d.length===1?d[0]:d[0]+' → '+d[d.length-1];
}
function filtered(){
  let rows=A.rows.slice();
  if(A.direction!=='all')rows=rows.filter(r=>direction(r)===A.direction);
  if(A.market!=='all')rows=rows.filter(r=>market(r)===A.market);
  if(A.airline!=='all')rows=rows.filter(r=>fold(airline(r))===A.airline);
  return rows;
}
function pct(n,d){return d?((n*100/d).toFixed(1)+'%'):'0.0%'}

function refreshAirlines(){
  const sel=$('#analyticsAirline');if(!sel)return;
  const current=A.airline,names=[...new Set(A.rows.map(airline).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  sel.innerHTML='<option value="all">'+esc(tr('allAirlines','Tất cả hãng'))+'</option>'+names.map(n=>'<option value="'+esc(fold(n))+'">'+esc(n)+'</option>').join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;else{A.airline='all';sel.value='all'}
}
function summary(rows){
  const total=rows.length,arr=rows.filter(r=>direction(r)==='arrival').length,dep=rows.filter(r=>direction(r)==='departure').length,intl=rows.filter(r=>market(r)==='international').length,dom=total-intl,airlines=new Set(rows.map(airline).filter(Boolean)).size;
  return{total,arr,dep,intl,dom,airlines};
}
function summaryHtml(rows){
  const s=summary(rows);
  const data=[[tr('total','Tổng chuyến'),s.total],[tr('arrivals','Chuyến đến'),s.arr],[tr('departures','Chuyến đi'),s.dep],[tr('international','Quốc tế'),s.intl],[tr('domestic','Nội địa'),s.dom],[tr('analyticsAirlinesCount','Hãng bay'),s.airlines]];
  return'<div class="analytics-summary-grid">'+data.map(([k,v])=>'<article><span>'+esc(k)+'</span><strong>'+v+'</strong></article>').join('')+'</div>';
}
function routeRows(rows,limit=20){const m=new Map();for(const r of rows){const k=station(r)||tr('unknown','CHƯA RÕ');m.set(k,(m.get(k)||0)+1)}return[...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit)}
function barsHtml(rows,titleKey,titleFallback,limit=20){
  const data=rows,max=data[0]?.[1]||1;
  return'<div class="analytics-panel"><h4>'+esc(tr(titleKey,titleFallback))+'</h4><div class="analytics-bar-list">'+(data.length?data.map(([k,v])=>'<div class="analytics-bar-row"><span title="'+esc(k)+'">'+esc(k)+'</span><div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:'+(v/max*100)+'%"></div></div><b>'+v+'</b></div>').join(''):'<div class="analytics-empty">'+esc(tr('analyticsNoData','Chưa có dữ liệu phù hợp.'))+'</div>')+'</div></div>';
}
function routesHtml(rows){return barsHtml(routeRows(rows), 'routeDistribution','Tất cả điểm đi / đến')}
function airlineRows(rows,limit=30){const m=new Map();for(const r of rows){const k=airline(r);m.set(k,(m.get(k)||0)+1)}return[...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit)}
function airlinesHtml(rows){return barsHtml(airlineRows(rows),'analyticsAirlineVolume','Số chuyến theo hãng bay')}
function timeHtml(rows){
  const bins=[0,3,6,9,12,15,18,21].map(h=>({h,label:String(h).padStart(2,'0')+'h',count:0}));
  for(const r of rows){const m=mins(scheduled(r));if(m==null)continue;const h=Math.floor(m/60),i=Math.min(7,Math.floor(h/3));bins[i].count++}
  const max=Math.max(1,...bins.map(x=>x.count));
  return'<div class="analytics-panel"><h4>'+esc(tr('timeDistribution','Phân bố theo khung giờ'))+'</h4><div class="analytics-time-grid">'+bins.map(x=>'<div class="analytics-time-col"><div class="analytics-time-bar" style="height:'+(x.count/max*100)+'%" title="'+x.count+' '+esc(tr('flightUnit','chuyến'))+'"></div><span>'+x.label+'</span></div>').join('')+'</div></div>';
}
function marketHtml(rows){
  const arr=rows.filter(r=>direction(r)==='arrival'),dep=rows.filter(r=>direction(r)==='departure');
  const ai=arr.filter(r=>market(r)==='international').length,ad=arr.length-ai,di=dep.filter(r=>market(r)==='international').length,dd=dep.length-di;
  const data=[[tr('intlArrivals','Quốc tế đến'),ai,pct(ai,arr.length)],[tr('domestic')+' '+tr('arrivals').toLowerCase(),ad,pct(ad,arr.length)],[tr('international')+' '+tr('departures').toLowerCase(),di,pct(di,dep.length)],[tr('domestic')+' '+tr('departures').toLowerCase(),dd,pct(dd,dep.length)]];
  return'<div class="analytics-panel"><h4>'+esc(tr('analyticsMarketMix','Cơ cấu thị trường'))+'</h4><div class="analytics-market-grid">'+data.map(([k,v,p])=>'<article><span>'+esc(k)+'</span><strong>'+v+'</strong><small>'+p+'</small></article>').join('')+'</div></div>';
}
function otpStats(rows,dir){
  const m=new Map();
  for(const r of rows){if(direction(r)!==dir)continue;const d=actualDelay(r);if(d==null||cancelled(r))continue;const name=airline(r);if(!m.has(name))m.set(name,{name,total:0,on:0,late:0,sum:0});const a=m.get(name);a.total++;if(d<=15)a.on++;else{a.late++;a.sum+=Math.max(0,d)}}
  return[...m.values()].sort((a,b)=>b.total-a.total||b.on-a.on||a.name.localeCompare(b.name));
}
function otpCard(rows,dir){
  const stats=otpStats(rows,dir),total=stats.reduce((n,a)=>n+a.total,0),on=stats.reduce((n,a)=>n+a.on,0),rate=total?(on*100/total).toFixed(1)+'%':'-';
  const title=dir==='arrival'?tr('arrivalsPqc','Đến Phú Quốc'):tr('departuresPqc','Rời Phú Quốc'),kicker=dir==='arrival'?tr('arrivalsKicker','CHUYẾN ĐẾN'):tr('departuresKicker','CHUYẾN ĐI');
  const headers=[tr('airlineCol','Hãng'),tr('completedCol','Đã thực hiện'),tr('onTimeCol','Đúng giờ'),tr('late15Col',"Trễ >15'"),'OTP15',tr('avgDelayCol','Trễ TB')];
  const body=stats.length?stats.map(a=>{const op=a.total?(a.on*100/a.total).toFixed(1)+'%':'-',avg=a.late?Math.round(a.sum/a.late)+' '+tr('minuteUnit','phút'):'-';return'<tr><td><strong>'+esc(a.name)+'</strong></td><td>'+a.total+'</td><td>'+a.on+'</td><td>'+a.late+'</td><td class="analytics-rate-good">'+op+'</td><td>'+esc(avg)+'</td></tr>'}).join(''):'<tr><td colspan="6">'+esc(tr('notEnoughActual','Chưa đủ chuyến có giờ thực tế để tính tỷ lệ đúng giờ.'))+'</td></tr>';
  return'<section class="analytics-otp-card"><div class="analytics-otp-head"><div><span class="section-kicker">'+esc(kicker)+'</span><h4>'+esc(title)+'</h4></div><div class="analytics-otp-summary"><b>'+rate+'</b><span>'+esc(tr('onTimeShort',"ĐÚNG GIỜ ≤15'"))+'</span><small>'+esc(total?tr('onTimeSample','{on}/{total} chuyến đúng giờ',{on,total}):tr('noCompleted','Chưa có chuyến đã thực hiện'))+'</small></div></div><div class="analytics-table-wrap"><table class="analytics-table"><thead><tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table></div></section>';
}
function otpHtml(rows){return'<div class="analytics-panel"><h4>'+esc(tr('airlinePerfTitle','Đúng giờ / trễ theo hãng'))+'</h4><p class="analytics-panel-note">'+esc(tr('otpNote','OTP15 theo ngưỡng 15 phút, chỉ tính chuyến đã thực hiện.'))+'</p><div class="analytics-otp-stack">'+otpCard(rows,'arrival')+otpCard(rows,'departure')+'</div></div>'}

function renderLabels(){
  const head=$('#analytics .analytics-head');if(head){head.querySelector('h3').textContent=tr('analyticsExplorerTitle','Phân tích chuyến bay');head.querySelector('p').textContent=tr('analyticsExplorerDesc','Chọn khoảng thời gian và góc phân tích.')}
  const periods={yesterday:tr('yesterday','Hôm qua'),today:tr('todayShort','Hôm nay'),tomorrow:tr('tomorrow','Ngày mai'),last7:tr('analyticsLast7Short','7 ngày'),last30:tr('analyticsLast30Short','30 ngày'),custom:tr('analyticsCustom','Tùy chọn')};
  $$('#analyticsPeriods button').forEach(b=>{b.textContent=periods[b.dataset.period]||b.textContent;b.classList.toggle('active',b.dataset.period===A.period)});
  const labels=$$('.analytics-filter-grid label>span');const l=[tr('analyticsAnalysis','Phân tích'),tr('direction','Chiều bay'),tr('market','Thị trường'),tr('airlineCol','Hãng bay')];labels.forEach((el,i)=>el.textContent=l[i]||el.textContent);
  const view=$('#analyticsView');if(view){const opts={overview:tr('analyticsOverview','Tổng quan'),routes:tr('analyticsRoutes','Tuyến bay'),time:tr('analyticsTime','Khung giờ'),market:tr('analyticsMarket','Thị trường'),airlines:tr('analyticsAirlines','Hãng bay'),otp:tr('analyticsOtp','Đúng giờ OTP15')};[...view.options].forEach(o=>o.textContent=opts[o.value]||o.textContent);view.value=A.view}
  const dir=$('#analyticsDirection');if(dir){dir.options[0].text=tr('all','Tất cả');dir.options[1].text=tr('arrival','Chuyến đến');dir.options[2].text=tr('departure','Chuyến đi');dir.value=A.direction}
  const marketSel=$('#analyticsMarket');if(marketSel){marketSel.options[0].text=tr('all','Tất cả');marketSel.options[1].text=tr('domestic','Nội địa');marketSel.options[2].text=tr('international','Quốc tế');marketSel.value=A.market}
  const airlineSel=$('#analyticsAirline');if(airlineSel&&airlineSel.options[0])airlineSel.options[0].text=tr('allAirlines','Tất cả hãng');
  const rangeLabels=$$('#analyticsCustomRange label>span');if(rangeLabels[0])rangeLabels[0].textContent=tr('fromDate','Từ ngày');if(rangeLabels[1])rangeLabels[1].textContent=tr('toDate','Đến ngày');
  const apply=$('#analyticsApplyRange');if(apply)apply.textContent=tr('apply','Áp dụng');
}
function renderCurrent(){
  renderLabels();
  const host=$('#analyticsContent'),note=$('#analyticsDataNote');if(!host)return;
  if(A.loading){host.innerHTML='<div class="analytics-empty">'+esc(tr('analyticsLoading','Đang tải dữ liệu phân tích...'))+'</div>';if(note)note.textContent=tr('analyticsLoadingShort','Đang tải...');return}
  if(A.error){host.innerHTML='<div class="analytics-error">'+esc(A.error)+'</div>';if(note)note.textContent=tr('analyticsNoData','Chưa có dữ liệu phù hợp.');return}
  const rows=filtered();if(note)note.textContent=tr('analyticsDataLabel','{period} · {n} chuyến',{period:periodLabel(),n:rows.length});
  if(!rows.length){host.innerHTML='<div class="analytics-empty">'+esc(tr('analyticsNoData','Chưa có dữ liệu phù hợp.'))+'</div>';return}
  let html='';
  if(A.view==='overview')html=summaryHtml(rows)+routesHtml(rows)+timeHtml(rows);
  else if(A.view==='routes')html=summaryHtml(rows)+routesHtml(rows);
  else if(A.view==='time')html=summaryHtml(rows)+timeHtml(rows);
  else if(A.view==='market')html=summaryHtml(rows)+marketHtml(rows);
  else if(A.view==='airlines')html=summaryHtml(rows)+airlinesHtml(rows);
  else html=summaryHtml(rows)+otpHtml(rows);
  host.innerHTML=html;
}
async function loadData(){
  A.loading=true;A.error=null;A.dates=periodDates();renderCurrent();
  try{
    const rows=await mapLimit(A.dates,6,fetchDate);
    A.rows=rows;
    if(!rows.length)A.error=tr('analyticsNoDataRange','Không có dữ liệu trong khoảng đã chọn.');
    refreshAirlines();
  }catch(e){A.rows=[];A.error=tr('analyticsLoadError','Không tải được dữ liệu phân tích lúc này.')}
  finally{A.loading=false;renderCurrent()}
}
function setPeriod(p){A.period=p;const custom=$('#analyticsCustomRange');custom?.classList.toggle('hidden',p!=='custom');if(p==='custom'){const t=todayVN();if(!$('#analyticsFrom').value)$('#analyticsFrom').value=t;if(!$('#analyticsTo').value)$('#analyticsTo').value=t;renderLabels();return}loadData()}
function bind(){
  $$('#analyticsPeriods button').forEach(b=>b.onclick=()=>setPeriod(b.dataset.period));
  $('#analyticsApplyRange').onclick=()=>loadData();
  $('#analyticsView').onchange=e=>{A.view=e.target.value;renderCurrent()};
  $('#analyticsDirection').onchange=e=>{A.direction=e.target.value;renderCurrent()};
  $('#analyticsMarket').onchange=e=>{A.market=e.target.value;renderCurrent()};
  $('#analyticsAirline').onchange=e=>{A.airline=e.target.value;renderCurrent()};
}
window.JT_ANALYTICS_RENDER=renderCurrent;
window.JT_ANALYTICS_RELOAD=loadData;
bind();setPeriod('today');
})();