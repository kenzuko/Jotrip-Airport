(() => {
  const VISIBLE_PREFIXES = [
    'Giờ dự kiến:',
    'Giờ thực tế:',
    'Trạng thái:',
    'Gate:',
    'Băng chuyền:',
    'Vị trí đỗ:',
    'Giờ lịch:',
    'Bắt đầu boarding:',
    'Kết thúc boarding:',
    'Terminal:',
    'Quầy check-in:'
  ];

  function formatTimeValue(text) {
    return text.replace(/\b([0-2]\d)([0-5]\d)\b/g, '$1:$2');
  }

  function cleanDetail(text) {
    if (!text) return '';
    if (text.includes('Ghi nhận chuyến lần đầu')) return 'Ghi nhận chuyến lần đầu.';

    const visible = text
      .split(' · ')
      .map(x => x.trim())
      .filter(Boolean)
      .filter(part => VISIBLE_PREFIXES.some(prefix => part.startsWith(prefix)))
      .map(part => {
        const timeField = /^(Giờ dự kiến|Giờ thực tế|Giờ lịch|Bắt đầu boarding|Kết thúc boarding):/.test(part);
        return timeField ? formatTimeValue(part) : part;
      });

    return visible.join(' · ');
  }

  function polishRow(row) {
    let lang='vi';try{lang=localStorage.getItem('jotrip_airport_lang')||'vi'}catch(_){}
    if(lang!=='vi') return;
    if (row.dataset.historyPolished === '1') return;
    row.dataset.historyPolished = '1';

    let visibleChanges = 0;
    row.querySelectorAll('.event-line').forEach(line => {
      const type = line.querySelector('.event-type')?.textContent?.trim();
      const detail = line.querySelector('.event-detail');
      if (!detail) return;

      const cleaned = cleanDetail(detail.textContent.trim());
      if (!cleaned && type === 'THAY ĐỔI') {
        line.hidden = true;
        return;
      }
      if (cleaned) detail.textContent = cleaned;
      if (type === 'THAY ĐỔI' && !line.hidden) visibleChanges++;
    });

    const meta = row.querySelector('.h-route small');
    if (meta) {
      let text = meta.textContent.replace(/\s·\s\d+\s+lần thay đổi/g, '');
      if (visibleChanges > 0) text += ` · ${visibleChanges} lần thay đổi`;
      meta.textContent = text;
    }
  }

  function polishHistory() {
    document.querySelectorAll('.history-row').forEach(polishRow);
  }

  const target = document.getElementById('historyList');
  if (!target) return;

  const observer = new MutationObserver(polishHistory);
  observer.observe(target, { childList: true, subtree: true });
  polishHistory();
})();
