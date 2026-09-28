(function () {
  var CATS = [
    { key: 'education', label: 'Education', hue: 280 },
    { key: 'experience', label: 'Experience', hue: 232 },
    { key: 'publications', label: 'Publications', hue: 190 },
    { key: 'projects', label: 'Projects', hue: 148 },
    { key: 'awards', label: 'Awards', hue: 48 },
    { key: 'skills', label: 'Skills', hue: 320 }
  ];
  var catByKey = {};
  CATS.forEach(function (c) { catByKey[c.key] = c; });

  /* ---------- Parse templates into entry records ---------- */
  var templates = Array.prototype.slice.call(document.querySelectorAll('.archive-entry'));
  var entries = templates.map(function (tpl, i) {
    return {
      id: 'e' + i,
      category: tpl.dataset.category,
      date: tpl.dataset.date, // "YYYY-MM" or "now": start date, drives sorting
      dateEnd: tpl.dataset.dateEnd || null, // optional "YYYY-MM" end date
      title: tpl.dataset.title,
      summary: tpl.dataset.summary || '',
      tpl: tpl
    };
  });

  function formatDate(dateStr) {
    if (dateStr === 'now') return 'Current';
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var y = dateStr.slice(0, 4);
    var m = parseInt(dateStr.slice(5, 7), 10) - 1;
    return MONTHS[m] + ' ' + y;
  }

  function formatDateRange(entry) {
    var start = formatDate(entry.date);
    if (!entry.dateEnd) return start;
    return start + ' – ' + formatDate(entry.dateEnd);
  }

  /* ---------- Build board columns ---------- */
  var board = document.getElementById('board');

  CATS.forEach(function (cat) {
    var group = entries.filter(function (e) { return e.category === cat.key; })
      .sort(function (a, b) { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; });
    if (!group.length) return;

    var col = document.createElement('div');
    col.className = 'board-col';
    col.style.setProperty('--hue', cat.hue);
    col.setAttribute('role', 'listitem');

    var head = document.createElement('div');
    head.className = 'board-col-head';
    var title = document.createElement('span');
    title.className = 'board-col-title';
    title.textContent = cat.label;
    var count = document.createElement('span');
    count.className = 'board-col-count';
    count.textContent = group.length;
    head.appendChild(title);
    head.appendChild(count);
    col.appendChild(head);

    var cardList = document.createElement('div');
    cardList.className = 'board-cards';

    group.forEach(function (entry) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'board-card';
      card.style.setProperty('--hue', cat.hue);
      card.setAttribute('aria-label', cat.label + ': ' + entry.title);
      card.dataset.entryId = entry.id;
      card.addEventListener('click', function () { openEntry(entry); });

      var date = document.createElement('span');
      date.className = 'board-card-date';
      date.textContent = formatDateRange(entry);

      var cardTitle = document.createElement('span');
      cardTitle.className = 'board-card-title';
      cardTitle.textContent = entry.title;

      card.appendChild(date);
      card.appendChild(cardTitle);

      if (entry.summary) {
        var summary = document.createElement('span');
        summary.className = 'board-card-summary';
        summary.textContent = entry.summary;
        card.appendChild(summary);
      }

      cardList.appendChild(card);
    });

    col.appendChild(cardList);
    board.appendChild(col);
  });

  /* ---------- Entry detail panel ---------- */
  var overlay = document.getElementById('entry-panel');
  var panel = overlay.querySelector('.entry-panel');
  var panelBody = document.getElementById('entry-panel-body');
  var panelCat = document.getElementById('entry-panel-cat');
  var panelDate = document.getElementById('entry-panel-date');
  var closeBtn = overlay.querySelector('.entry-close');
  var lastFocused = null;

  function openEntry(entry) {
    lastFocused = document.activeElement;
    panelCat.textContent = catByKey[entry.category].label;
    panelCat.style.setProperty('--hue', catByKey[entry.category].hue);
    panelDate.textContent = formatDateRange(entry);
    panelBody.innerHTML = '';
    panelBody.appendChild(entry.tpl.content.cloneNode(true));
    overlay.hidden = false;
    if (window.initProjDetails) window.initProjDetails(panelBody);
    document.addEventListener('keydown', onPanelKeydown);
    closeBtn.focus();
  }

  function closeEntry() {
    overlay.hidden = true;
    document.removeEventListener('keydown', onPanelKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function onPanelKeydown(e) {
    if (e.key === 'Escape') { closeEntry(); return; }
    if (e.key === 'Tab') {
      var focusables = panel.querySelectorAll('button, a[href], input, [tabindex]');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  closeBtn.addEventListener('click', closeEntry);
  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) closeEntry();
  });

})();
