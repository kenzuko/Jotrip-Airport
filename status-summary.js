(() => {
  function fold(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toUpperCase();
  }

  function isCancelled(r) {
    return String(r?.status_code || '').toUpperCase() === 'CANCELLED' || /HUY|CANCEL/.test(fold(r?.status || r?.raw_status));
  }

  function classifyArrival(r) {
    const label = typeof displayStatusLabel === 'function' ? displayStatusLabel(r) : (r?.status || '');
    const s = fold(label);
    if (isCancelled(r)) return 'Hủy chuyến';
    if (r?.actual_time || /DA HA CANH/.test(s)) return 'Đã hạ cánh';
    if (/TRE|DELAY|HOAN|DOI GIO/.test(s)) return 'Trễ / đổi giờ';
    if (/DANG BAY DEN PHU QUOC/.test(s)) return 'Đang bay đến Phú Quốc';
    if (/CHO GIO HA CANH/.test(s)) return 'Chờ xác nhận hạ cánh';
    return 'Chưa hạ cánh · theo lịch';
  }

  function classifyDeparture(r) {
    const label = typeof displayStatusLabel === 'function' ? displayStatusLabel(r) : (r?.status || '');
    const s = fold(label);
    if (isCancelled(r)) return 'Hủy chuyến';
    if (r?.actual_time || /DA CAT CANH/.test(s)) return 'Đã cất cánh';
    if (/TRE|DELAY|HOAN|DOI GIO/.test(s)) return 'Trễ / đổi giờ';
    if (/CHO GIO CAT CANH/.test(s)) return 'Chờ xác nhận cất cánh';
    if (/DANG CHECK.?IN|CHECK.?IN DA DONG|DANG LEN MAY BAY|BOARDING|CUA KHOI HANH DA DONG/.test(s)) return 'Đang phục vụ tại sân bay';
    if (/SAP MO CHECK.?IN|CHECK.?IN TU/.test(s)) return 'Sắp làm thủ tục';
    return 'Theo lịch · chưa cất cánh';
  }

  function countBy(records, direction, classify) {
    const m = new Map();
    for (const r of records || []) {
      if (r?.direction !== direction) continue;
      const key = classify(r);
      m.set(key, (m.get(key) || 0) + 1);
    }
    return m;
  }

  const ARRIVAL_ORDER = ['Đã hạ cánh','Đang bay đến Phú Quốc','Trễ / đổi giờ','Chờ xác nhận hạ cánh','Chưa hạ cánh · theo lịch','Hủy chuyến'];
  const DEPARTURE_ORDER = ['Đã cất cánh','Đang phục vụ tại sân bay','Sắp làm thủ tục','Trễ / đổi giờ','Chờ xác nhận cất cánh','Theo lịch · chưa cất cánh','Hủy chuyến'];

  function groupHtml(title, map, order) {
    const rows = order.filter(k => map.get(k)).map(k => `<div class="status-line"><span>${k}</span><b>${map.get(k)}</b></div>`).join('');
    return `<div class="flight-status-group"><div class="flight-status-group-title">${title}</div>${rows || '<div class="status-line"><span>Không có chuyến</span><b>0</b></div>'}</div>`;
  }

  function renderOperationalStatus() {
    const host = document.getElementById('statusSummary');
    if (!host || typeof state === 'undefined' || !state?.latest?.records) return;
    const records = state.latest.records;
    const arrivals = countBy(records, 'arrival', classifyArrival);
    const departures = countBy(records, 'departure', classifyDeparture);
    host.innerHTML = groupHtml('CHUYẾN ĐẾN', arrivals, ARRIVAL_ORDER) + groupHtml('CHUYẾN ĐI', departures, DEPARTURE_ORDER);
  }

  if (!document.getElementById('operationalStatusStyle')) {
    const style = document.createElement('style');
    style.id = 'operationalStatusStyle';
    style.textContent = `.flight-status-group+.flight-status-group{margin-top:14px;padding-top:12px;border-top:1px solid #e7eef3}.flight-status-group-title{font-size:10px;font-weight:850;letter-spacing:.08em;color:#1680aa;margin:0 0 4px}.status-summary .status-line span{text-transform:none}`;
    document.head.appendChild(style);
  }

  if (typeof renderAnalytics === 'function') {
    const baseRenderAnalytics = renderAnalytics;
    renderAnalytics = function() {
      baseRenderAnalytics();
      renderOperationalStatus();
    };
  }

  window.addEventListener('jotrip:board-date', renderOperationalStatus);
  window.addEventListener('load', renderOperationalStatus);
  setTimeout(renderOperationalStatus, 0);
})();
