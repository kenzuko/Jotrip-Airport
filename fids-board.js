
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
          '<div><span class="section-kicker">FIDS · LIVE TERMINAL INFO</span><h3>Thông tin cửa - quầy - hành lý</h3></div>'+
          '<div class="fids-head-state"><i></i><span id="fidsBoardStatus">Đang đồng bộ</span></div>'+
        '</div>'+
        '<div id="fidsTicker" class="fids-ticker" aria-live="polite"></div>'+
        '<div id="fidsGrid" class="fids-grid"></div>'+
        '<div class="fids-foot"><span>Cập nhật theo dữ liệu sân bay</span><span id="fidsUpdated"></span></div>'+
        '<div class="hidden" aria-hidden="true">'+
          '<span id="nextWindowText"></span><span id="nextArrivals"></span><span id="nextDepartures"></span><span id="nextInternational"></span><span id="nextWatch"></span>'+
        '</div>';
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
        return !past && (clean(r.gate)||clean(r.checkin_row)||clean(r.belt));
      })
      .sort(function(a,b){
        var ta=typeof mins==='function' ? mins(scheduledTime(a)) : 9999;
        var tb=typeof mins==='function' ? mins(scheduledTime(b)) : 9999;
        ta=ta==null?9999:ta; tb=tb==null?9999:tb;
        var da=ta<now-45?ta+1440:ta;
        var db=tb<now-45?tb+1440:tb;
        return da-db;
      }).slice(0,8);
  }

  function eventsFor(r,all){
    var k=rowKey(r),out={};
    all.forEach(function(e){
      if(e.flightKey===k && !out[e.field]) out[e.field]=e;
    });
    return out;
  }

  function chip(label,value,event,kind){
    var v=clean(value);
    if(!v) return '';
    var age=event ? Date.now()-new Date(event.at).getTime() : null;
    var hot=event && age>=0 && age<=60*60*1000;
    var cls=['fids-chip',kind,event?'changed':'',hot?'hot':''].filter(Boolean).join(' ');
    var prev=event ? '<small>← '+esc(event.from)+'</small>' : '';
    return '<span class="'+cls+'"><em>'+esc(label)+'</em><b>'+esc(v)+'</b>'+prev+'</span>';
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
      r:rs.map(function(r){return [rowKey(r),scheduledTime(r),r.gate,r.checkin_row,r.belt];}),
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
        var route=r.direction==='arrival' ? stationLabel(r.station)+' → PQC' : 'PQC → '+stationLabel(r.station);
        var chips=r.direction==='departure'
          ? chip('QUẦY',r.checkin_row,ev.checkin_row,'checkin')+chip('CỬA',r.gate,ev.gate,'gate')
          : chip('BĂNG',r.belt,ev.belt,'belt');
        var sched=typeof scheduledTime==='function' ? scheduledTime(r) : '--:--';
        return '<div class="fids-row" data-flight="'+esc(r.operating_flight_number)+'" data-direction="'+esc(r.direction)+'">'+
          '<div class="fids-time"><strong>'+esc(sched||'--:--')+'</strong><span>'+(r.direction==='arrival'?'ĐẾN':'ĐI')+'</span></div>'+
          '<div class="fids-flight"><strong>'+esc(r.operating_flight_number)+'</strong><span>'+esc(route)+'</span></div>'+
          '<div class="fids-values">'+(chips||'<span class="fids-pending">Đang cập nhật</span>')+'</div>'+
          '<div class="fids-open">›</div></div>';
      }).join('');
    }else{
      grid.innerHTML='<div class="empty-state">Chưa có thông tin FIDS cho các chuyến sắp tới.</div>';
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
