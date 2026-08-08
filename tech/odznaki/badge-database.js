(() => {
  const BADGE_TYPES = {
    mala: 'Mała Korona Małej Góry',
    wielka: 'Wielka Korona Małej Góry',
    'sarnia-perc': 'Sarnia Perć'
  };
  const STATUS_LABELS = { valid: 'Odznaka ważna', revoked: 'Odznaka unieważniona', pending: 'Wpis w trakcie aktualizacji' };
  const form = document.getElementById('verificationForm');
  const message = document.getElementById('badgeLoginMessage');
  const view = document.getElementById('badgeDatabaseView');
  const close = document.getElementById('closeBadgeDatabase');
  const moduleBaseUrl = new URL('.', document.currentScript?.src || window.location.href);
  const databaseUrl = new URL('badges.json', moduleBaseUrl);
  let databasePromise = null;

  function loadDatabase() {
    if (!databasePromise) {
      databasePromise = fetch(databaseUrl, { cache: 'no-store' }).then(response => {
        if (!response.ok) throw new Error('Nie udało się pobrać bazy odznak.');
        return response.json();
      });
    }
    return databasePromise;
  }

  function maskedPart(initial, length) {
    const safeLength = Math.max(1, Math.min(Number(length) || 1, 40));
    return `${String(initial || '').charAt(0).toLocaleUpperCase('pl-PL')}${'*'.repeat(safeLength - 1)}`;
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'long', timeStyle: 'short' }).format(date);
  }

  function addDetail(label, value) {
    const row = document.createElement('div'); row.className = 'database-detail';
    const term = document.createElement('dt'); term.textContent = label;
    const description = document.createElement('dd'); description.textContent = value;
    row.append(term, description); document.getElementById('databaseDetails').append(row);
  }

  function openRecord(record) {
    const holder = `${maskedPart(record.holder.firstInitial, record.holder.firstLength)} ${maskedPart(record.holder.lastInitial, record.holder.lastLength)}`;
    view.dataset.badge = record.badgeType;
    document.getElementById('databaseBreadcrumbId').textContent = record.id;
    document.getElementById('databaseBadgeName').textContent = BADGE_TYPES[record.badgeType] || record.badgeType;
    document.getElementById('databaseBadgeId').textContent = record.id;
    document.getElementById('databaseHolder').textContent = holder;
    const status = document.getElementById('databaseStatus');
    status.textContent = STATUS_LABELS[record.status] || record.status;
    status.dataset.status = record.status;
    const details = document.getElementById('databaseDetails'); details.replaceChildren();
    addDetail('Data wydania odznaki', formatDate(record.issuedAt));
    addDetail('Data rozpatrzenia weryfikacji', formatDate(record.reviewedAt));
    addDetail('Rozpoczęcie zdobywania', formatDate(record.achievementStart));
    addDetail('Zakończenie zdobywania', formatDate(record.achievementEnd));
    addDetail('Ostatnia aktualizacja wpisu', formatDate(record.updatedAt));
    view.hidden = false; document.body.classList.add('database-open');
    history.replaceState(null, '', `#odznaka/${record.id}`);
    view.scrollTop = 0; close.focus();
  }

  function closeView() {
    view.hidden = true; document.body.classList.remove('database-open');
    history.replaceState(null, '', '#sprawdz-odznake');
    form.elements.badgeLogin.focus();
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const login = form.elements.badgeLogin.value.trim().toUpperCase();
    const password = form.elements.badgePassword.value.trim().toUpperCase();
    form.elements.badgeLogin.value = login;
    message.hidden = true;
    if (!/^MG-[MWS]\d{4}$/.test(login) || !/^[MWS]\d{4}$/.test(password)) {
      message.textContent = 'Nieprawidłowy format loginu lub hasła.'; message.hidden = false; return;
    }
    if (password !== login.slice(3)) {
      message.textContent = 'Login lub hasło są nieprawidłowe.'; message.hidden = false; return;
    }
    try {
      const database = await loadDatabase();
      const record = database.badges.find(item => item.id === login);
      if (!record) throw new Error('Nie znaleziono odznaki o podanych danych.');
      form.elements.badgePassword.value = '';
      openRecord(record);
    } catch (error) {
      message.textContent = error.message || 'Nie udało się otworzyć bazy odznaki.'; message.hidden = false;
    }
  });
  close.addEventListener('click', closeView);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !view.hidden) closeView(); });
})();
