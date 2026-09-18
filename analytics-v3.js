(()=>{
const DATA_BASE='https://raw.githubusercontent.com/kenzuko/Jotrip-Lab/data-sunairport/data/sunairport';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const tr=(key,fallback,vars)=>{try{const v=window.JT_T?.(key,vars);return v&&v!==key?v:fallback}catch(_){return fallback}};
const liveUrl=()=>String(window.JOTRIP_LIVE_API_URL||'').replace(/\/$/,'');
const rowCache=new Map(),eventCache=new Map();
const A={period:'today',view:'overview',direction:'all',market:'all',airline:'all',rows:[],events:[],dates:[],loading:false,error:null};

function todayVN(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function addDay(day,n){const d=new Date(day+'T12:00:00+07:00');d.setUTCDate(d.getUTCDate()+n);return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}
function dateList(a,b,max=31){const out=[];let d=a;while(d<=b&&out.length<max){out.push(d);d=addDay(d,1)}return out}
function hhmm(v){const s=String(v??'');const m=s.match(/^(\d{2})(\d{2})/);if(m)return m[1]+':'+m[2];return s.match(/^\d{1,2}:\d{2}$/)?.[0]||null}
function mins(v){const t=hhmm(v);if(!t)return null;const [h,m]=t.split(':').map(Number);return h*60+m}
function signedDiff(a,b){const x=mins(a),y=mins(b);if(x==null||y==null)return null;let d=y-x;if(d>720)d-=1440;if(d<-720)d+=1440;return d}
function fold(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toUpperCase().replace(/\s+/g,' ').trim()}
function station(r){const raw=r.station||r.cityName||'';const base=raw.replace('HO CHI MINH','TP.HCM').replace('HA NOI','HÀ NỘI').replace('DA NANG','ĐÀ NẴNG').replace('HAI PHONG','HẢI PHÒNG').replace('CAN THO','CẦN THƠ').replace('PUDONG- SHANGHAI','SHANGHAI').replace('XIANYANG-XI AN',"XI'AN");try{return typeof window.JT_STATION==='function'?window.JT_STATION(base):base}catch(_){return base}}
function airline(r){return r.airline_name||r.airlineName||r.airline||r.airline_code||r.airlineCode||tr('unknownAirline','Chưa rõ hãng')}
function direction(r){return r.direction||r._direction||(r.arrDep==='A'?'arrival':r.arrDep==='D'?'departure':'')}
function market(r){if(r.market)return r.market;return String(r.country||'').toUpperCase()==='VN'?'domestic':'international'}
function scheduled(r){return hhmm(r.scheduled_time||r.scheduledTime)}
function estimated(r){return hhmm(r.estimated_time||r.estimatedTime)}
function actual(r){return hhmm(r.actual_time||r.actualTime)}
function statusText(r){return String(r.status||r.raw_status||r.notesVn||r.notesEn||r.remarks||'')}
function cancelled(r){return /CANCELLED/.test(String(r.status_code||'').toUpperCase())||/HUY|CANCEL/.test(fold(statusText(r)))}
function actualDelay(r){const direct=Number(r.actual_delay_minutes);if(Number.isFinite(direct))return direct;const s=scheduled(r),a=actual(r);return s&&a?signedDiff(s,a):null}
function estimateError(r){const e=estimated(r),a=actual(r);return e&&a?signedDiff(e,a):null}
function mean(arr){return arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null}
function quantile(arr,q){if(!arr.length)return null;const x=arr.slice().sort((a,b)=>a-b),p=(x.length-1)*q,b=Math.floor(p),r=p-b;return x[b+1]!=null?x[b]+r*(x[b+1]-x[b]):x[b]}
function fmtMin(n){return Number.isFinite(n)?Math.round(n)+' '+tr('minuteUnit','phút'):'-'}
function flightId(r){return (r._date||'')+'|'+direction(r)+'|'+String(r.operating_flight_number||r.flightNo||'')}

function normalizeRaw(r,dir,date){return{
  _date:date,direction:dir,operating_flight_number:r.flightNo||'',station:r.cityName||'',country:r.country||'',market:String(r.country||'').toUpperCase()==='VN'?'domestic':'international',
  airline_name:r.airlineName||r.airline||'',airline_code:r.airline||'',scheduled_time:hhmm(r.scheduledTime),estimated_time:hhmm(r.estimatedTime),actual_time:hhmm(r.actualTime),
  actual_delay_minutes:hhmm(r.actualTime)?signedDiff(hhmm(r.scheduledTime),hhmm(r.actualTime)):null,status:r.notesVn||r.notesEn||'',status_code:/HUY|CANCEL/.test(fold(r.notesVn||r.notesEn||''))?'CANCELLED':''
}}
async function fetchJson(url){const res=await fetch(url+(url.includes('?')?'&':'?')+'t='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);return res.json()}
async function fetchText(url){const res=await fetch(url+(url.includes('?')?'&':'?')+'t='+Date.now(),{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);return res.text()}
async function fetchArchiveDate(date){const raw=await fetchJson(`${DATA_BASE}/raw/${date}.json`);return[...(raw.arrivals||[]).map(r=>normalizeRaw(r,'arrival',date)),...(raw.departures||[]).map(r=>normalizeRaw(r,'departure',date))]}
async function fetchLiveDate(date){const base=liveUrl();if(!base)throw new Error('LIVE_API_NOT_CONFIGURED');const u=new URL(base);u.searchParams.set('date',date);u.searchParams.set('t',Date.now());const res=await fetch(u,{cache:'no-store',headers:{accept:'application/json'}});if(!res.ok)throw new Error('HTTP '+res.status);const p=await res.json();return (p?.latest?.records||[]).map(r=>({...r,_date:date}))}
async function fetchDate(date){
  if(rowCache.has(date))return rowCache.get(date);
  const today=todayVN();let rows=[];
  try{rows=date>=today?await fetchLiveDate(date):await fetchArchiveDate(date)}
  catch(e){try{rows=date>=today?await fetchArchiveDate(date):await fetchLiveDate(date)}catch(_){rows=[]}}
  rowCache.set(date,rows);return rows
}
async function fetchEvents(date){
  if(eventCache.has(date))return eventCache.get(date);
  let events=[];
  try{const txt=await fetchText(`${DATA_BASE}/history/${date}/events.jsonl`);events=txt.split('\n').filter(Boolean).map(line=>{try{return{...JSON.parse(line),_date:date}}catch(_){return null}}).filter(Boolean)}catch(_){}
  eventCache.set(date,events);return events
}
async function mapLimit(items,limit,fn){const out=new Array(items.length);let next=0;const workers=Array.from({length:Math.min(limit,Math.max(1,items.length))},async()=>{while(true){const i=next++;if(i>=items.length)break;try{out[i]=await fn(items[i])}catch(_){out[i]=null}}});await Promise.all(workers);return out.filter(Boolean)}

function periodDates(){
  const t=todayVN();
  if(A.period==='yesterday')return[addDay(t,-1)];
  if(A.period==='today')return[t];
  if(A.period==='tomorrow')return[addDay(t,1)];
  if(A.period==='last7')return dateList(addDay(t,-6),t,7);
  if(A.period==='last30')return dateList(addDay(t,-29),t,30);
  const from=$('#analyticsFrom')?.value||t,to=$('#analyticsTo')?.value||from,a=from<=to?from:to,b=from<=to?to:from;
  return dateList(a,b,31)
}
function periodLabel(){
  const d=A.dates;if(!d.length)return'';
  if(A.period==='yesterday')return tr('yesterday','Hôm qua');
  if(A.period==='today')return tr('todayShort','Hôm nay');
  if(A.period==='tomorrow')return tr('tomorrow','Ngày mai');
  if(A.period==='last7')return tr('analyticsLast7','7 ngày gần nhất');
  if(A.period==='last30')return tr('analyticsLast30','30 ngày gần nhất');
  return d.length===1?d[0]:d[0]+' → '+d[d.length-1]
}
function filtered(){
  let rows=A.rows.slice();
  if(A.direction!=='all')rows=rows.filter(r=>direction(r)===A.direction);
  if(A.market!=='all')rows=rows.filter(r=>market(r)===A.market);
  if(A.airline!=='all')rows=rows.filter(r=>fold(airline(r))===A.airline);
  return rows
}
function eventPseudo(e){const c=e.current||{};return{_date:e._date,direction:e.direction,operating_flight_number:e.flight_number||c.flightNo,station:c.cityName,country:c.country,market:String(c.country||'').toUpperCase()==='VN'?'domestic':'international',airline_name:c.airlineName||c.airline}}
function filteredEvents(){
  return A.events.filter(e=>{const r=eventPseudo(e);if(A.direction!=='all'&&direction(r)!==A.direction)return false;if(A.market!=='all'&&market(r)!==A.market)return false;if(A.airline!=='all'&&fold(airline(r))!==A.airline)return false;return true})
}
function pct(n,d){return d?((n*100/d).toFixed(1)+'%'):'0.0%'}

function refreshAirlines(){
  const sel=$('#analyticsAirline');if(!sel)return;
  const current=A.airline,names=[...new Set(A.rows.map(airline).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  sel.innerHTML='<option value="all">'+esc(tr('allAirlines','Tất cả hãng'))+'</option>'+names.map(n=>'<option value="'+esc(fold(n))+'">'+esc(n)+'</option>').join('');
  if([...sel.options].some(o=>o.value===current))sel.value=current;else{A.airline='all';sel.value='all'}
}
function summary(rows){const total=rows.length,arr=rows.filter(r=>direction(r)==='arrival').length,dep=rows.filter(r=>direction(r)==='departure').length,intl=rows.filter(r=>market(r)==='international').length,dom=total-intl,airlines=new Set(rows.map(airline).filter(Boolean)).size;return{total,arr,dep,intl,dom,airlines}}
function summaryHtml(rows){
  const s=summary(rows),data=[[tr('total','Tổng chuyến'),s.total],[tr('arrivals','Chuyến đến'),s.arr],[tr('departures','Chuyến đi'),s.dep],[tr('international','Quốc tế'),s.intl],[tr('domestic','Nội địa'),s.dom],[tr('analyticsAirlinesCount','Hãng bay'),s.airlines]];
  return'<div class="analytics-summary-grid">'+data.map(([k,v])=>'<article><span>'+esc(k)+'</span><strong>'+v+'</strong></article>').join('')+'</div>'
}
function routeRows(rows,limit=20){const m=new Map();for(const r of rows){const k=station(r)||tr('unknown','CHƯA RÕ');m.set(k,(m.get(k)||0)+1)}return[...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit)}
function barsHtml(data,titleKey,titleFallback){
  const max=data[0]?.[1]||1;
  return'<div class="analytics-panel"><h4>'+esc(tr(titleKey,titleFallback))+'</h4><div class="analytics-bar-list">'+(data.length?data.map(([k,v])=>'<div class="analytics-bar-row"><span title="'+esc(k)+'">'+esc(k)+'</span><div class="analytics-bar-track"><div class="analytics-bar-fill" style="width:'+(v/max*100)+'%"></div></div><b>'+v+'</b></div>').join(''):'<div class="analytics-empty">'+esc(tr('analyticsNoData','Chưa có dữ liệu phù hợp.'))+'</div>')+'</div></div>'
}
function routesHtml(rows){return barsHtml(routeRows(rows),'routeDistribution','Tất cả điểm đi / đến')}
function airlineRows(rows,limit=30){const m=new Map();for(const r of rows){const k=airline(r);m.set(k,(m.get(k)||0)+1)}return[...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit)}
function airlinesHtml(rows){return barsHtml(airlineRows(rows),'analyticsAirlineVolume','Số chuyến theo hãng bay')}
function timeHtml(rows){
  const bins=[0,3,6,9,12,15,18,21].map(h=>({h,label:String(h).padStart(2,'0')+'h',count:0}));
  for(const r of rows){const m=mins(scheduled(r));if(m==null)continue;bins[Math.min(7,Math.floor(Math.floor(m/60)/3))].count++}
  const max=Math.max(1,...bins.map(x=>x.count));
  return'<div class="analytics-panel"><h4>'+esc(tr('timeDistribution','Phân bố theo khung giờ'))+'</h4><div class="analytics-time-grid">'+bins.map(x=>'<div class="analytics-time-col"><div class="analytics-time-bar" style="height:'+(x.count/max*100)+'%" title="'+x.count+' '+esc(tr('flightUnit','chuyến'))+'"></div><span>'+x.label+'</span></div>').join('')+'</div></div>'
}
function marketHtml(rows){
  const arr=rows.filter(r=>direction(r)==='arrival'),dep=rows.filter(r=>direction(r)==='departure'),ai=arr.filter(r=>market(r)==='international').length,ad=arr.length-ai,di=dep.filter(r=>market(r)==='international').length,dd=dep.length-di;
  const data=[[tr('intlArrivals','Quốc tế đến'),ai,pct(ai,arr.length)],[tr('domestic')+' '+tr('arrivals').toLowerCase(),ad,pct(ad,arr.length)],[tr('international')+' '+tr('departures').toLowerCase(),di,pct(di,dep.length)],[tr('domestic')+' '+tr('departures').toLowerCase(),dd,pct(dd,dep.length)]];
  return'<div class="analytics-panel"><h4>'+esc(tr('analyticsMarketMix','Cơ cấu thị trường'))+'</h4><div class="analytics-market-grid">'+data.map(([k,v,p])=>'<article><span>'+esc(k)+'</span><strong>'+v+'</strong><small>'+p+'</small></article>').join('')+'</div></div>'
}

function delayStats(rows){
  const completed=rows.filter(r=>actual(r)&&!cancelled(r)),delays=completed.map(actualDelay).filter(Number.isFinite),late=delays.filter(d=>d>15),late30=delays.filter(d=>d>30),late60=delays.filter(d=>d>60),late120=delays.filter(d=>d>120),early=delays.filter(d=>d<=-10),nonneg=delays.map(d=>Math.max(0,d));
  return{completed:delays.length,on:delays.filter(d=>d<=15).length,late:late.length,late30:late30.length,late60:late60.length,late120:late120.length,early:early.length,otp:delays.length?100*delays.filter(d=>d<=15).length/delays.length:null,avgLate:mean(late),median:quantile(delays,.5),p90:quantile(nonneg,.9)}
}
function delayCards(rows){
  const s=delayStats(rows);
  const data=[[tr('completedCol','Đã thực hiện'),s.completed],[tr('otp15Label','OTP15'),s.otp==null?'-':s.otp.toFixed(1)+'%'],[tr('late15Col',"Trễ >15'"),s.late],[tr('delayOver30','Trễ >30 phút'),s.late30],[tr('delayOver60','Trễ >60 phút'),s.late60],[tr('avgDelayCol','Trễ TB'),fmtMin(s.avgLate)],[tr('medianDelay','Median lệch giờ'),fmtMin(s.median)],[tr('p90Delay','P90 trễ'),fmtMin(s.p90)]];
  return'<div class="analytics-delay-grid">'+data.map(([k,v])=>'<article><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></article>').join('')+'</div>'
}
function perfGroups(rows,keyFn,min=2){
  const m=new Map();
  for(const r of rows){const d=actualDelay(r);if(d==null||cancelled(r))continue;const k=keyFn(r)||tr('unknown','CHƯA RÕ');if(!m.has(k))m.set(k,{name:k,total:0,on:0,late:0,sumLate:0});const x=m.get(k);x.total++;if(d<=15)x.on++;else{x.late++;x.sumLate+=d}}
  return[...m.values()].filter(x=>x.total>=min).map(x=>({...x,otp:100*x.on/x.total,avgLate:x.late?x.sumLate/x.late:0})).sort((a,b)=>b.late-a.late||a.otp-b.otp||b.avgLate-a.avgLate)
}
function perfTable(title,groups){
  const headers=[tr('analyticsGroup','Nhóm'),tr('completedCol','Đã thực hiện'),'OTP15',tr('late15Col',"Trễ >15'"),tr('avgDelayCol','Trễ TB')];
  const body=groups.length?groups.slice(0,12).map(x=>'<tr><td><strong>'+esc(x.name)+'</strong></td><td>'+x.total+'</td><td class="analytics-rate-good">'+x.otp.toFixed(1)+'%</td><td>'+x.late+'</td><td>'+esc(fmtMin(x.avgLate))+'</td></tr>').join(''):'<tr><td colspan="5">'+esc(tr('notEnoughActual','Chưa đủ chuyến có giờ thực tế để tính tỷ lệ đúng giờ.'))+'</td></tr>';
  return'<div class="analytics-panel"><h4>'+esc(title)+'</h4><div class="analytics-table-wrap"><table class="analytics-table"><thead><tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table></div></div>'
}
function timeBand(r){const m=mins(scheduled(r));if(m==null)return tr('unknown','CHƯA RÕ');const h=Math.floor(m/60),start=Math.floor(h/3)*3,end=Math.min(23,start+2);return String(start).padStart(2,'0')+':00-'+String(end).padStart(2,'0')+':59'}
function delayHtml(rows){return delayCards(rows)+perfTable(tr('delayByRoute','Độ trễ theo tuyến'),perfGroups(rows,station))+perfTable(tr('delayByTime','Độ trễ theo khung giờ'),perfGroups(rows,timeBand))+perfTable(tr('delayByAirline','Độ trễ theo hãng'),perfGroups(rows,airline))}

function validChange(ch){if(!ch)return false;const a=String(ch.from??'').trim(),b=String(ch.to??'').trim();return !!a&&!!b&&a!==b}
function operationalEventInfo(events){
  const relevant=[];
  for(const e of events){if(e.type!=='CHANGED')continue;const c=e.changes||{},fields={gate:validChange(c.gate),checkin:validChange(c.ckRow),belt:validChange(c.belt),time:validChange(c.scheduledTime)||validChange(c.estimatedTime)};if(Object.values(fields).some(Boolean))relevant.push({e,fields})}
  const flights=new Set(relevant.map(x=>(x.e._date||'')+'|'+x.e.direction+'|'+(x.e.flight_number||x.e.current?.flightNo||'')));
  return{relevant,flights,gate:relevant.filter(x=>x.fields.gate).length,checkin:relevant.filter(x=>x.fields.checkin).length,belt:relevant.filter(x=>x.fields.belt).length,time:relevant.filter(x=>x.fields.time).length}
}
function changeGroups(info,keyFn){
  const m=new Map();for(const x of info.relevant){const k=keyFn(eventPseudo(x.e))||tr('unknown','CHƯA RÕ');m.set(k,(m.get(k)||0)+1)}
  return[...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,15)
}
function changesHtml(rows,events){
  const x=operationalEventInfo(events),per=x.flights.size?x.relevant.length/x.flights.size:0;
  const cards=[[tr('affectedFlights','Chuyến có thay đổi'),x.flights.size],[tr('gateChanges','Đổi cửa'),x.gate],[tr('checkinChanges','Đổi quầy'),x.checkin],[tr('beltChanges','Đổi băng'),x.belt],[tr('timeChanges','Đổi giờ'),x.time],[tr('changesPerFlight','Thay đổi/chuyến'),x.flights.size?per.toFixed(1):'-']];
  return'<div class="analytics-delay-grid">'+cards.map(([k,v])=>'<article><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></article>').join('')+'</div>'+barsHtml(changeGroups(x,airline),'changesByAirline','Thay đổi theo hãng')+barsHtml(changeGroups(x,station),'changesByRoute','Thay đổi theo tuyến')
}
function estimateHtml(rows,events){
  const usable=rows.filter(r=>actual(r)&&estimated(r)&&!cancelled(r)),errors=usable.map(r=>Math.abs(estimateError(r))).filter(Number.isFinite),within5=errors.filter(x=>x<=5).length,within15=errors.filter(x=>x<=15).length,within30=errors.filter(x=>x<=30).length;
  const revisions=events.filter(e=>e.type==='CHANGED'&&validChange(e.changes?.estimatedTime)).length;
  const cards=[[tr('estimateSamples','Chuyến có đủ dữ liệu'),errors.length],[tr('estimateMae','Sai số TB'),fmtMin(mean(errors))],[tr('estimateMedian','Median sai số'),fmtMin(quantile(errors,.5))],[tr('estimateWithin5','Trong ±5 phút'),pct(within5,errors.length)],[tr('estimateWithin15','Trong ±15 phút'),pct(within15,errors.length)],[tr('estimateRevisions','Lần sửa dự kiến'),revisions]];
  const groups=new Map();
  for(const r of usable){const e=Math.abs(estimateError(r));if(!Number.isFinite(e))continue;const k=airline(r);if(!groups.has(k))groups.set(k,{name:k,total:0,sum:0});const g=groups.get(k);g.total++;g.sum+=e}
  const arr=[...groups.values()].filter(x=>x.total>=2).map(x=>({...x,avg:x.sum/x.total})).sort((a,b)=>b.avg-a.avg);
  const table=arr.length?'<div class="analytics-panel"><h4>'+esc(tr('estimateByAirline','Sai số dự kiến theo hãng'))+'</h4><div class="analytics-table-wrap"><table class="analytics-table"><thead><tr><th>'+esc(tr('airlineCol','Hãng'))+'</th><th>'+esc(tr('estimateSamples','Chuyến có đủ dữ liệu'))+'</th><th>'+esc(tr('estimateMae','Sai số TB'))+'</th></tr></thead><tbody>'+arr.slice(0,12).map(x=>'<tr><td><strong>'+esc(x.name)+'</strong></td><td>'+x.total+'</td><td>'+esc(fmtMin(x.avg))+'</td></tr>').join('')+'</tbody></table></div></div>':'';
  return'<div class="analytics-delay-grid">'+cards.map(([k,v])=>'<article><span>'+esc(k)+'</span><strong>'+esc(v)+'</strong></article>').join('')+'</div>'+table
}

function dailyTrendHtml(rows){
  if(A.dates.length<2)return'';
  const data=A.dates.map(date=>{const day=rows.filter(r=>r._date===date),s=delayStats(day);return{date,total:day.length,otp:s.otp,late:s.late}});
  const max=Math.max(1,...data.map(x=>x.total));
  return'<div class="analytics-panel"><h4>'+esc(tr('dailyTrend','Xu hướng theo ngày'))+'</h4><div class="analytics-daily-trend">'+data.map(x=>'<div class="analytics-day-col"><div class="analytics-day-bar" style="height:'+(x.total/max*100)+'%"></div><b>'+x.total+'</b><small>'+esc(x.date.slice(5))+'</small><span>'+(x.otp==null?'-':x.otp.toFixed(0)+'%')+' OTP</span></div>').join('')+'</div></div>'
}
function insightsHtml(rows,events){
  const completed=rows.filter(r=>actual(r)&&!cancelled(r));if(!rows.length)return'';
  const items=[];
  const arr=delayStats(rows.filter(r=>direction(r)==='arrival')),dep=delayStats(rows.filter(r=>direction(r)==='departure'));
  if(arr.completed>=2&&dep.completed>=2&&arr.otp!=null&&dep.otp!=null){
    const worse=arr.otp<dep.otp?tr('arrivals','Chuyến đến'):tr('departures','Chuyến đi'),diff=Math.abs(arr.otp-dep.otp).toFixed(1);
    if(Number(diff)>=5)items.push(tr('insightDirectionOtp','{side} có OTP15 thấp hơn {diff} điểm %.',{side:worse,diff}))
  }
  const route=perfGroups(rows,station,2)[0];if(route&&route.late>0)items.push(tr('insightRouteDelay','{route} có {late}/{total} chuyến trễ >15 phút, OTP15 {otp}%.',{route:route.name,late:route.late,total:route.total,otp:route.otp.toFixed(1)}));
  const band=perfGroups(rows,timeBand,2)[0];if(band&&band.late>0)items.push(tr('insightTimeDelay','Khung {time} có {late} chuyến trễ >15 phút, OTP15 {otp}%.',{time:band.name,late:band.late,otp:band.otp.toFixed(1)}));
  const ch=operationalEventInfo(events);if(ch.flights.size>0)items.push(tr('insightChanges','{flights} chuyến có thay đổi vận hành: {gate} cửa, {checkin} quầy, {belt} băng chuyền, {time} giờ.',{flights:ch.flights.size,gate:ch.gate,checkin:ch.checkin,belt:ch.belt,time:ch.time}));
  const estimates=completed.filter(r=>estimated(r)).map(r=>Math.abs(estimateError(r))).filter(Number.isFinite);if(estimates.length>=3)items.push(tr('insightEstimate','Sai số trung bình của giờ dự kiến cuối cùng so với thực tế là {minutes} phút trên {n} chuyến.',{minutes:Math.round(mean(estimates)),n:estimates.length}));
  if(!items.length)items.push(tr('insightInsufficient','Chưa đủ dữ liệu thực tế để rút ra nhận định đáng tin cậy cho bộ lọc này.'));
  return'<div class="analytics-insights"><div class="analytics-insights-head"><span class="section-kicker">'+esc(tr('analysisInsights','NHẬN ĐỊNH'))+'</span><h4>'+esc(tr('analysisWhatMatters','Điểm đáng chú ý'))+'</h4></div><div class="analytics-insight-list">'+items.slice(0,5).map(x=>'<div class="analytics-insight-item"><i></i><p>'+esc(x)+'</p></div>').join('')+'</div></div>'
}

function otpStats(rows,dir){
  const m=new Map();for(const r of rows){if(direction(r)!==dir)continue;const d=actualDelay(r);if(d==null||cancelled(r))continue;const name=airline(r);if(!m.has(name))m.set(name,{name,total:0,on:0,late:0,sum:0});const a=m.get(name);a.total++;if(d<=15)a.on++;else{a.late++;a.sum+=Math.max(0,d)}}
  return[...m.values()].sort((a,b)=>b.total-a.total||b.on-a.on||a.name.localeCompare(b.name))
}
function otpCard(rows,dir){
  const stats=otpStats(rows,dir),total=stats.reduce((n,a)=>n+a.total,0),on=stats.reduce((n,a)=>n+a.on,0),rate=total?(on*100/total).toFixed(1)+'%':'-';
  const title=dir==='arrival'?tr('arrivalsPqc','Đến Phú Quốc'):tr('departuresPqc','Rời Phú Quốc'),kicker=dir==='arrival'?tr('arrivalsKicker','CHUYẾN ĐẾN'):tr('departuresKicker','CHUYẾN ĐI');
  const headers=[tr('airlineCol','Hãng'),tr('completedCol','Đã thực hiện'),tr('onTimeCol','Đúng giờ'),tr('late15Col',"Trễ >15'"),'OTP15',tr('avgDelayCol','Trễ TB')];
  const body=stats.length?stats.map(a=>{const op=a.total?(a.on*100/a.total).toFixed(1)+'%':'-',avg=a.late?Math.round(a.sum/a.late)+' '+tr('minuteUnit','phút'):'-';return'<tr><td><strong>'+esc(a.name)+'</strong></td><td>'+a.total+'</td><td>'+a.on+'</td><td>'+a.late+'</td><td class="analytics-rate-good">'+op+'</td><td>'+esc(avg)+'</td></tr>').join(''):'<tr><td colspan="6">'+esc(tr('notEnoughActual','Chưa đủ chuyến có giờ thực tế để tính tỷ lệ đúng giờ.'))+'</td></tr>';
  return'<section class="analytics-otp-card"><div class="analytics-otp-head"><div><span class="section-kicker">'+esc(kicker)+'</span><h4>'+esc(title)+'</h4></div><div class="analytics-otp-summary"><b>'+rate+'</b><span>'+esc(tr('onTimeShort',"ĐÚNG GIỜ ≤15'"))+'</span><small>'+esc(total?tr('onTimeSample','{on}/{total} chuyến đúng giờ',{on,total}):tr('noCompleted','Chưa có chuyến đã thực hiện'))+'</small></div></div><div class="analytics-table-wrap"><table class="analytics-table"><thead><tr>'+headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table></div></section>'
}
function otpHtml(rows){return'<div class="analytics-panel"><h4>'+esc(tr('airlinePerfTitle','Đúng giờ / trễ theo hãng'))+'</h4><p class="analytics-panel-note">'+esc(tr('otpNote','OTP15 theo ngưỡng 15 phút, chỉ tính chuyến đã thực hiện.'))+'</p><div class="analytics-otp-stack">'+otpCard(rows,'arrival')+otpCard(rows,'departure')+'</div></div>'}

function renderLabels(){
  const head=$('#analytics .analytics-head');if(head){head.querySelector('h3').textContent=tr('analyticsExplorerTitle','Phân tích chuyến bay');head.querySelector('p').textContent=tr('analyticsExplorerDesc','Chọn khoảng thời gian và góc phân tích.')}
  const periods={yesterday:tr('yesterday','Hôm qua'),today:tr('todayShort','Hôm nay'),tomorrow:tr('tomorrow','Ngày mai'),last7:tr('analyticsLast7Short','7 ngày'),last30:tr('analyticsLast30Short','30 ngày'),custom:tr('analyticsCustom','Tùy chọn')};
  $$('#analyticsPeriods button').forEach(b=>{b.textContent=periods[b.dataset.period]||b.textContent;b.classList.toggle('active',b.dataset.period===A.period)});
  const labels=$$('.analytics-filter-grid label>span'),l=[tr('analyticsAnalysis','Phân tích'),tr('direction','Chiều bay'),tr('market','Thị trường'),tr('airlineCol','Hãng bay')];labels.forEach((el,i)=>el.textContent=l[i]||el.textContent);
  const view=$('#analyticsView');if(view){const opts={overview:tr('analyticsOverview','Tổng quan'),delay:tr('analyticsDelay','Độ trễ'),routes:tr('analyticsRoutes','Tuyến bay'),time:tr('analyticsTime','Khung giờ'),market:tr('analyticsMarket','Thị trường'),airlines:tr('analyticsAirlines','Hãng bay'),changes:tr('analyticsChanges','Thay đổi vận hành'),estimate:tr('analyticsEstimate','Dự kiến vs thực tế'),otp:tr('analyticsOtp','Đúng giờ OTP15')};[...view.options].forEach(o=>o.textContent=opts[o.value]||o.textContent);view.value=A.view}
  const dir=$('#analyticsDirection');if(dir){dir.options[0].text=tr('all','Tất cả');dir.options[1].text=tr('arrival','Chuyến đến');dir.options[2].text=tr('departure','Chuyến đi');dir.value=A.direction}
  const marketSel=$('#analyticsMarket');if(marketSel){marketSel.options[0].text=tr('all','Tất cả');marketSel.options[1].text=tr('domestic','Nội địa');marketSel.options[2].text=tr('international','Quốc tế');marketSel.value=A.market}
  const airlineSel=$('#analyticsAirline');if(airlineSel&&airlineSel.options[0])airlineSel.options[0].text=tr('allAirlines','Tất cả hãng');
  const rangeLabels=$$('#analyticsCustomRange label>span');if(rangeLabels[0])rangeLabels[0].textContent=tr('fromDate','Từ ngày');if(rangeLabels[1])rangeLabels[1].textContent=tr('toDate','Đến ngày');
  const apply=$('#analyticsApplyRange');if(apply)apply.textContent=tr('apply','Áp dụng')
}
function renderCurrent(){
  renderLabels();const host=$('#analyticsContent'),note=$('#analyticsDataNote');if(!host)return;
  if(A.loading){host.innerHTML='<div class="analytics-empty">'+esc(tr('analyticsLoading','Đang tải dữ liệu phân tích...'))+'</div>';if(note)note.textContent=tr('analyticsLoadingShort','Đang tải...');return}
  if(A.error){host.innerHTML='<div class="analytics-error">'+esc(A.error)+'</div>';if(note)note.textContent=tr('analyticsNoData','Chưa có dữ liệu phù hợp.');return}
  const rows=filtered(),events=filteredEvents();if(note)note.textContent=tr('analyticsDataLabel','{period} · {n} chuyến',{period:periodLabel(),n:rows.length});
  if(!rows.length){host.innerHTML='<div class="analytics-empty">'+esc(tr('analyticsNoData','Chưa có dữ liệu phù hợp.'))+'</div>';return}
  let html='';
  if(A.view==='overview')html=summaryHtml(rows)+insightsHtml(rows,events)+dailyTrendHtml(rows)+routesHtml(rows)+timeHtml(rows);
  else if(A.view==='delay')html=insightsHtml(rows,events)+delayHtml(rows);
  else if(A.view==='routes')html=summaryHtml(rows)+routesHtml(rows)+perfTable(tr('routePunctuality','Đúng giờ theo tuyến'),perfGroups(rows,station));
  else if(A.view==='time')html=summaryHtml(rows)+timeHtml(rows)+perfTable(tr('timePunctuality','Đúng giờ theo khung giờ'),perfGroups(rows,timeBand));
  else if(A.view==='market')html=summaryHtml(rows)+marketHtml(rows);
  else if(A.view==='airlines')html=summaryHtml(rows)+airlinesHtml(rows)+perfTable(tr('airlinePunctuality','Đúng giờ theo hãng'),perfGroups(rows,airline));
  else if(A.view==='changes')html=insightsHtml(rows,events)+changesHtml(rows,events);
  else if(A.view==='estimate')html=insightsHtml(rows,events)+estimateHtml(rows,events);
  else html=summaryHtml(rows)+otpHtml(rows);
  host.innerHTML=html
}
async function loadData(){
  A.loading=true;A.error=null;A.dates=periodDates();renderCurrent();
  try{
    const bundles=await mapLimit(A.dates,6,async date=>({rows:await fetchDate(date),events:await fetchEvents(date)}));
    A.rows=bundles.flatMap(x=>x.rows||[]);A.events=bundles.flatMap(x=>x.events||[]);
    if(!A.rows.length)A.error=tr('analyticsNoDataRange','Không có dữ liệu trong khoảng đã chọn.');
    refreshAirlines()
  }catch(e){A.rows=[];A.events=[];A.error=tr('analyticsLoadError','Không tải được dữ liệu phân tích lúc này.')}
  finally{A.loading=false;renderCurrent()}
}
function setPeriod(p){A.period=p;const custom=$('#analyticsCustomRange');custom?.classList.toggle('hidden',p!=='custom');if(p==='custom'){const t=todayVN();if(!$('#analyticsFrom').value)$('#analyticsFrom').value=t;if(!$('#analyticsTo').value)$('#analyticsTo').value=t;renderLabels();return}loadData()}
function bind(){
  $$('#analyticsPeriods button').forEach(b=>b.onclick=()=>setPeriod(b.dataset.period));
  $('#analyticsApplyRange').onclick=()=>loadData();
  $('#analyticsView').onchange=e=>{A.view=e.target.value;renderCurrent()};
  $('#analyticsDirection').onchange=e=>{A.direction=e.target.value;renderCurrent()};
  $('#analyticsMarket').onchange=e=>{A.market=e.target.value;renderCurrent()};
  $('#analyticsAirline').onchange=e=>{A.airline=e.target.value;renderCurrent()}
}
window.JT_ANALYTICS_RENDER=renderCurrent;window.JT_ANALYTICS_RELOAD=loadData;
bind();setPeriod('today');
})();