
(function(){
  var lastSignature = '';

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>'"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c];
    });
  }

  function clean(v){
    var s=String(v == null ? '' : v).trim();
    return s && s !== '-' && s.toLowerCase() !== 'null' ? s : '';
  }

  function ensureBoard(){
    var oldAnchor=document.getElementById('nextWindowText');
    var card=oldAnchor ? oldAnchor.closest('section.card') : document.getElementById('fidsBoard');
    var flightBoard=document.getElementById('flightBoard');
    if(!card || !flightBoard) return null;

    if(card.id !== 'fidsBoard'){
      card.id='fidsBoard';
      card.classList.add('fids-card');
      card.innerHTML=
        '<div class="card-head fids-head">'+
          '<div><span class="section-kicker">FIDS · LIVE TERMINAL INFO</span><h3>Bảng thông tin chuyến bay</h3><p>Giờ bay, dự kiến - thực tế, trạng thái, cửa, quầy và băng chuyền.</p></div>'+
          '<div class="fids-head-state"><i></i><span id="fidsBoardStatus">Đang đồng bộ</span></div>'+
        '</div>'+
        '<div id="fidsTicker" class="fids-ticker" aria-live="polite"></div>'+
        '<div class="fids-table-wrap">'+
          '<div class="fids-columns" aria-hidden="true">'+
            '<span>LỊCH</span><span>DỰ KIẾN / THỰC TẾ</span><span>CHUYẾN</span><span>HÀNH TRÌNH</span><span>TRẠNG THÁI</span><span>CỬA</span><span>QUẦY / BĂNG</span><span>THAY ĐỔI</span>'+
          '</div>'+
          '<div id="fidsGrid" class="fids-grid"></div>'+
        '</div>'+
        '<div class="fids-foot"><span>Cập nhật theo dữ liệu sân bay</span><span id="fidsUpdated"></span></div>'+
        '<div class="hidden" aria-hidden="true">'+
          '<span id="nextWindowText"></span><span id="nextArrivals"></span><span id="nextDepartures"></span><span id="nextInternational"></span><span id="nextWatch"></span>'+
        '</div>';
    }else{
      var title=card.querySelector('.fids-head h3');
      var desc=card.querySelector('.fids-head p');
      if(title) title.textContent='Bảng thông tin chuyến bay';
      if(!desc){
        var holder=card.querySelector('.fids-head>div:first-child');
        if(holder) holder.insertAdjacentHTML('beforeend','<p>Giờ bay, dự kiến - thực tế, trạng thái, cửa, quầy và băng chuyền.</p>');
      }
      if(!card.querySelector('.fids-columns')){
        var grid=card.querySelector('#fidsGrid');
        if(grid){
          var wrap=document.createElement('div');
          wrap.className='fids-table-wrap';
          wrap.innerHTML='<div class="fids-columns" aria-hidden="true"><span>LỊCH</span><span>DỰ KIẾN / THỰC TẾ</span><span>CHUYẾN</span><span>HÀNH TRÌNH</span><span>TRẠNG THÁI</span><span>CỬA</span><span>QUẦY / BĂNG</span><span>THAY ĐỔI</span></div>';
          grid.parentNode.insertBefore(wrap,grid);
          wrap.appendChild(grid);
        }
      }
    }

    if(card.nextElementSibling !== flightBoard){
      flightBoard.parentNode.insertBefore(card,flightBoard);
    }

    var mobileFlights=document.getElementById('mobileFlights');
    if(mobileFlights && !mobileFlights.dataset.fidsScrollFixed){
      mobileFlights.dataset.fidsScrollFixed='1';
      mobileFlights.onclick=function(){
        if(typeof setMode==='function') setMode('live');
        var fb=document.getElementById('flightBoard');
        if(fb) fb.scrollIntoView({behavior:'smooth',block:'start'});
        setTimeout(function(){
          var input=document.getElementById('flightSearch');
          if(input) input.focus();
        },350);
      };
    }
    return card;
  }

  function currentEvents(){
    try{
      return typeof activeFidsEvents==='function' ? activeFidsEvents() : [];
    }catch(e){
      return [];
    }
  }

  function rowKey(r){
    return String(r.direction||'')+'|'+String(r.operating_flight_number||'');
  }

  function rows(){
    if(typeof state==='undefined' || !state.latest) return [];
    var now=typeof nowMinutes==='function' ? nowMinutes() : 0;
    return (state.latest.records||[])
      .filter(function(r){
        var past=typeof isPastRecord==='function' ? isPastRecord(r) : false;
        return !past;
      })
      .sort(function(a,b){
        var ta=typeof mins==='function' ? mins(scheduledTime(a)) : 9999;
        var tb=typeof mins==='function' ? mins(scheduledTime(b)) : 9999;
        ta=ta==null?9999:ta; tb=tb==null?9999:tb;
        var da=ta<now-45?ta+1440:ta;
        var db=tb<now-45?tb+1440:tb;
        return da-db;
      }).slice(0,10);
  }

  function eventsFor(r,all){
    var k=rowKey(r),out={};
    all.forEach(function(e){
      if(e.flightKey===k && !out[e.field]) out[e.field]=e;
    });
    return out;
  }

  function statusTone(label){
    try{
      return typeof statusClass==='function' ? statusClass(label) : 'gray';
    }catch(_){
      return 'gray';
    }
  }

  function timingCell(r){
    var actual=clean(r.actual_time);
    var expected='';
    try{
      expected=clean(typeof expectedTime==='function' ? expectedTime(r) : r.estimated_time);
    }catch(_){
      expected=clean(r.estimated_time);
    }
    var scheduled=clean(typeof scheduledTime==='function' ? scheduledTime(r) : r.scheduled_time);
    var value=actual || expected || scheduled || '--:--';
    var kind=actual ? 'ACTUAL' : (expected ? 'EST' : 'SCHED');
    var cls=actual ? 'actual' : 'estimated';
    var delta=null;
    try{
      if(typeof signedTimeDiff==='function' && scheduled && value) delta=signedTimeDiff(scheduled,value);
    }catch(_){}
    var deltaText='';
    if(delta!=null && delta>=10) deltaText='+'+delta+'m';
    if(delta!=null && delta<=-10) deltaText=delta+'m';
    return {value:value,kind:kind,cls:cls,delta:deltaText};
  }

  function changeSummary(ev){
    var parts=[];
    if(ev.gate) parts.push('CỬA '+ev.gate.from+'→'+ev.gate.to);
    if(ev.checkin_row) parts.push('QUẦY '+ev.checkin_row.from+'→'+ev.checkin_row.to);
    if(ev.belt) parts.push('BĂNG '+ev.belt.from+'→'+ev.belt.to);
    return parts.join(' · ');
  }

  function serviceValue(r){
    if(r.direction==='departure') return clean(r.checkin_row) || '—';
    return clean(r.belt) || '—';
  }

  function serviceLabel(r){
    return r.direction==='departure' ? 'QUẦY' : 'BĂNG';
  }

  function statusText(events){
    if(events.length) return events.length+' thay đổi đang hiệu lực';
    return 'FIDS đang ổn định';
  }

  function render(){
    var card=ensureBoard();
    if(!card || typeof state==='undefined' || !state.latest) return;

    var ticker=document.getElementById('fidsTicker');
    var grid=document.getElementById('fidsGrid');
    var status=document.getElementById('fidsBoardStatus');
    var updated=document.getElementById('fidsUpdated');
    if(!ticker || !grid || !status) return;

    var evs=currentEvents();
    var rs=rows();
    var sig=JSON.stringify({
      e:evs.map(function(e){return [e.flightKey,e.field,e.from,e.to,e.at];}),
      r:rs.map(function(r){return [rowKey(r),scheduledTime(r),r.estimated_time,r.actual_time,r.status_code,r.status,r.gate,r.checkin_row,r.belt];}),
      c:state.latest.collected_at_vn
    });
    if(sig===lastSignature) return;
    lastSignature=sig;

    status.textContent=statusText(evs);

    if(updated){
      try{
        updated.textContent='Nguồn '+new Date(state.latest.collected_at_vn).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Ho_Chi_Minh'});
      }catch(_){
        updated.textContent='';
      }
    }

    if(evs.length){
      ticker.innerHTML=evs.slice(0,5).map(function(e){
        var age=Date.now()-new Date(e.at).getTime();
        var hot=age>=0 && age<=60*60*1000;
        var label=typeof fidsAlertText==='function' ? fidsAlertText(e) : ('ĐỔI '+String(e.field).toUpperCase()+' '+e.from+' → '+e.to);
        return '<div class="fids-tape '+esc(e.field)+' '+(hot?'hot':'')+'" data-flight="'+esc(e.flightNumber)+'" data-direction="'+esc(e.direction)+'">'+
          '<span class="fids-tape-dot"></span><strong>'+esc(e.flightNumber)+'</strong><span>'+esc(label)+'</span></div>';
      }).join('');
    }else{
      ticker.innerHTML='<div class="fids-steady"><span>●</span> Chưa ghi nhận đổi cửa, đổi quầy hoặc đổi băng chuyền đang hiệu lực.</div>';
    }

    if(rs.length){
      grid.innerHTML=rs.map(function(r){
        var ev=eventsFor(r,evs);
        var sched=clean(typeof scheduledTime==='function' ? scheduledTime(r) : r.scheduled_time) || '--:--';
        var live=timingCell(r);
        var route=r.direction==='arrival' ? stationLabel(r.station)+' → PQC' : 'PQC → '+stationLabel(r.station);
        var air=typeof airlineFor==='function' ? airlineFor(r) : (r.airline_name||'');
        var stat='';
        try{stat=typeof displayStatusLabel==='function' ? displayStatusLabel(r) : (r.status||'');}catch(_){stat=r.status||'';}
        var tone=statusTone(stat);
        var gate=clean(r.gate)||'—';
        var service=serviceValue(r);
        var change=changeSummary(ev);
        var changed=!!change;
        var changedHot=false;
        Object.keys(ev).forEach(function(k){
          var age=Date.now()-new Date(ev[k].at).getTime();
          if(age>=0 && age<=60*60*1000) changedHot=true;
        });

        return '<div class="fids-row '+(changed?'has-change ':'')+(changedHot?'hot-change':'')+'" data-flight="'+esc(r.operating_flight_number)+'" data-direction="'+esc(r.direction)+'">'+
          '<div class="fids-cell fids-scheduled" data-label="LỊCH"><strong>'+esc(sched)+'</strong><span class="fids-dir '+esc(r.direction)+'">'+(r.direction==='arrival'?'ĐẾN':'ĐI')+'</span></div>'+
          '<div class="fids-cell fids-live-time '+esc(live.cls)+'" data-label="DỰ KIẾN / THỰC TẾ"><strong>'+esc(live.value)+'</strong><span>'+esc(live.kind)+(live.delta?' · '+esc(live.delta):'')+'</span></div>'+
          '<div class="fids-cell fids-flight" data-label="CHUYẾN"><strong>'+esc(r.operating_flight_number)+'</strong><span>'+esc(air)+'</span></div>'+
          '<div class="fids-cell fids-route" data-label="HÀNH TRÌNH"><strong>'+esc(route)+'</strong><span>'+esc(r.market==='international'?'QUỐC TẾ':'NỘI ĐỊA')+'</span></div>'+
          '<div class="fids-cell fids-status" data-label="TRẠNG THÁI"><span class="fids-status-pill '+esc(tone)+'">'+esc(stat||'CHƯA RÕ')+'</span></div>'+
          '<div class="fids-cell fids-gate '+(ev.gate?'changed':'')+'" data-label="CỬA"><strong>'+esc(gate)+'</strong>'+(ev.gate?'<span>← '+esc(ev.gate.from)+'</span>':'')+'</div>'+
          '<div class="fids-cell fids-service '+((r.direction==='departure'&&ev.checkin_row)||(r.direction==='arrival'&&ev.belt)?'changed':'')+'" data-label="'+esc(serviceLabel(r))+'"><strong>'+esc(service)+'</strong><span>'+(((r.direction==='departure'&&ev.checkin_row)||(r.direction==='arrival'&&ev.belt))?'ĐÃ ĐỔI':'')+'</span></div>'+
          '<div class="fids-cell fids-change" data-label="THAY ĐỔI">'+(change?'<span class="fids-change-badge">'+esc(change)+'</span>':'<span class="fids-no-change">—</span>')+'</div>'+
        '</div>';
      }).join('');
    }else{
      grid.innerHTML='<div class="empty-state">Chưa có chuyến sắp tới trong dữ liệu FIDS.</div>';
    }

    card.querySelectorAll('.fids-row,.fids-tape[data-flight]').forEach(function(el){
      el.onclick=function(){
        if(typeof openDrawer==='function') openDrawer(el.dataset.flight,el.dataset.direction);
      };
    });
  }

  ensureBoard();
  setTimeout(render,300);
  setTimeout(render,1200);
  setInterval(render,5000);
})();
