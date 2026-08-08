(() => {
  const LOCAL_DB_NAME = 'mala-gora-badge-workspace';
  const LOCAL_DB_VERSION = 1;
  const moduleBaseUrl = new URL('.', document.currentScript?.src || window.location.href);
  const badgesUrl = new URL('badges.json', moduleBaseUrl);
  const badgeNames = {
    mala: 'Mała Korona Małej Góry',
    wielka: 'Wielka Korona Małej Góry',
    'sarnia-perc': 'Sarnia Perć'
  };
  const statusNames = { valid: 'Ważna', revoked: 'Unieważniona', pending: 'Aktualizowana' };
  const workspaceHome = document.getElementById('workspaceHome');
  const decoderWorkspace = document.getElementById('decoderWorkspace');
  const databaseWorkspace = document.getElementById('databaseWorkspace');
  const savedWorkspace = document.getElementById('savedWorkspace');
  const homeNotice = document.getElementById('workspaceNotice');
  const databaseStatus = document.getElementById('databaseWorkspaceStatus');
  const databaseBody = document.getElementById('workspaceDatabaseBody');
  const databaseSearch = document.getElementById('databaseSearch');
  const savedStatus = document.getElementById('savedWorkspaceStatus');
  const savedList = document.getElementById('savedCasesList');
  let activeCaseId = null;
  let publicDatabase = null;
  let databaseSort = { key: 'issuedAt', direction: 'desc' };

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function transactionDone(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  function openLocalDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains('meta')) database.createObjectStore('meta');
        if (!database.objectStoreNames.contains('cases')) database.createObjectStore('cases', { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function workspaceKey(database) {
    let transaction = database.transaction('meta', 'readonly');
    let key = await requestResult(transaction.objectStore('meta').get('encryption-key'));
    if (key) return key;
    key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    transaction = database.transaction('meta', 'readwrite');
    transaction.objectStore('meta').put(key, 'encryption-key');
    await transactionDone(transaction);
    return key;
  }

  async function encryptStateLocally(state) {
    const database = await openLocalDatabase();
    const key = await workspaceKey(database);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(state));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
    return { database, iv: iv.buffer, ciphertext };
  }

  async function decryptLocalCase(record) {
    const database = await openLocalDatabase();
    const key = await workspaceKey(database);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(record.iv) }, key, record.ciphertext);
    return JSON.parse(new TextDecoder().decode(plaintext));
  }

  function showWorkspace(name, shouldScroll = true) {
    workspaceHome.hidden = name !== 'home';
    decoderWorkspace.hidden = name !== 'decoder';
    databaseWorkspace.hidden = name !== 'database';
    savedWorkspace.hidden = name !== 'saved';
    homeNotice.hidden = true;
    if (name === 'database') renderDatabase();
    if (name === 'saved') renderSavedCases();
    if (shouldScroll) document.getElementById('decoderApp').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function maskedPart(initial, length) {
    const safeLength = Math.max(1, Math.min(Number(length) || 1, 40));
    return `${String(initial || '').charAt(0).toLocaleUpperCase('pl-PL')}${'*'.repeat(safeLength - 1)}`;
  }

  function shortDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  }

  function cell(row, value) {
    const td = document.createElement('td'); td.textContent = value; row.append(td); return td;
  }

  async function renderDatabase() {
    databaseStatus.hidden = true;
    try {
      if (!publicDatabase) {
        const response = await fetch(badgesUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error('Nie udało się pobrać bazy odznak.');
        publicDatabase = await response.json();
      }
      renderDatabaseRows();
    } catch (error) {
      databaseStatus.textContent = error.message; databaseStatus.className = 'workspace-notice is-error'; databaseStatus.hidden = false;
    }
  }

  function renderDatabaseRows() {
      databaseBody.replaceChildren();
      const records = [...publicDatabase.badges].sort((left, right) => {
        const leftValue = databaseSort.key === 'badgeType' ? (badgeNames[left.badgeType] || left.badgeType) : (left[databaseSort.key] || '');
        const rightValue = databaseSort.key === 'badgeType' ? (badgeNames[right.badgeType] || right.badgeType) : (right[databaseSort.key] || '');
        return leftValue.localeCompare(rightValue, 'pl-PL') * (databaseSort.direction === 'asc' ? 1 : -1);
      });
      records.forEach(record => {
        const row = document.createElement('tr');
        const holder = `${maskedPart(record.holder.firstInitial, record.holder.firstLength)} ${maskedPart(record.holder.lastInitial, record.holder.lastLength)}`;
        cell(row, record.id); cell(row, badgeNames[record.badgeType] || record.badgeType); cell(row, holder);
        cell(row, shortDate(record.issuedAt)); cell(row, shortDate(record.reviewedAt));
        cell(row, shortDate(record.achievementStart)); cell(row, shortDate(record.achievementEnd));
        const statusCell = document.createElement('td');
        const status = document.createElement('span'); status.className = `workspace-status is-${record.status}`; status.textContent = statusNames[record.status] || record.status;
        statusCell.append(status); row.append(statusCell); cell(row, shortDate(record.updatedAt));
        row.dataset.search = `${record.id} ${badgeNames[record.badgeType]} ${holder} ${statusNames[record.status]}`.toLocaleLowerCase('pl-PL');
        databaseBody.append(row);
      });
      document.querySelectorAll('.table-sort').forEach(button => {
        const active = button.dataset.sort === databaseSort.key;
        button.classList.toggle('is-active', active);
        button.querySelector('span').textContent = active ? (databaseSort.direction === 'asc' ? '↑' : '↓') : '↕';
        button.closest('th').setAttribute('aria-sort', active ? (databaseSort.direction === 'asc' ? 'ascending' : 'descending') : 'none');
      });
      filterDatabase();
  }

  function filterDatabase() {
    const query = databaseSearch.value.trim().toLocaleLowerCase('pl-PL');
    [...databaseBody.rows].forEach(row => { row.hidden = Boolean(query) && !row.dataset.search.includes(query); });
  }

  async function saveCase() {
    if (!application) return;
    try {
      const state = collectState();
      const encrypted = await encryptStateLocally(state);
      const id = activeCaseId || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
      const record = {
        id, savedAt: new Date().toISOString(), badgeType: application.badgeId,
        label: BADGES[application.badgeId]?.code || application.badgeId,
        iv: encrypted.iv, ciphertext: encrypted.ciphertext
      };
      const transaction = encrypted.database.transaction('cases', 'readwrite');
      transaction.objectStore('cases').put(record);
      await transactionDone(transaction);
      activeCaseId = id;
      showStateStatus('Stan sprawy został zaszyfrowany i zapisany lokalnie w tej przeglądarce.');
    } catch (error) {
      console.error(error);
      showStateStatus('Nie udało się zapisać stanu lokalnego. Sprawdź, czy przeglądarka zezwala na pamięć witryny.', true);
    }
  }

  async function allCases() {
    const database = await openLocalDatabase();
    const transaction = database.transaction('cases', 'readonly');
    return requestResult(transaction.objectStore('cases').getAll());
  }

  async function renderSavedCases() {
    savedStatus.hidden = true;
    savedList.replaceChildren();
    try {
      const cases = (await allCases()).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
      if (!cases.length) {
        savedStatus.textContent = 'Nie ma jeszcze żadnych zapisanych spraw w tej przeglądarce.';
        savedStatus.className = 'workspace-notice'; savedStatus.hidden = false; return;
      }
      cases.forEach(record => {
        const card = document.createElement('article'); card.className = 'saved-case';
        const info = document.createElement('div'); info.className = 'saved-case-info';
        const title = document.createElement('strong'); title.textContent = `${record.label} — ${badgeNames[record.badgeType] || record.badgeType}`;
        const date = document.createElement('span'); date.textContent = `Zapisano: ${new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(record.savedAt))}`;
        info.append(title, date);
        const actions = document.createElement('div'); actions.className = 'saved-case-actions';
        const open = document.createElement('button'); open.className = 'primary-button'; open.type = 'button'; open.textContent = 'Wczytaj';
        open.addEventListener('click', async () => {
          try {
            const state = await decryptLocalCase(record);
            activeCaseId = record.id;
            showWorkspace('decoder');
            restoreState(state);
            showStateStatus('Wczytano lokalny, zaszyfrowany stan sprawy.');
          } catch (error) {
            savedStatus.textContent = 'Nie udało się odszyfrować zapisu. Lokalny klucz mógł zostać usunięty.';
            savedStatus.className = 'workspace-notice is-error'; savedStatus.hidden = false;
          }
        });
        const remove = document.createElement('button'); remove.className = 'secondary-button danger-button'; remove.type = 'button'; remove.textContent = 'Usuń';
        remove.addEventListener('click', async () => {
          if (!confirm('Usunąć ten lokalny zapis? Tej operacji nie można cofnąć.')) return;
          const database = await openLocalDatabase(); const transaction = database.transaction('cases', 'readwrite');
          transaction.objectStore('cases').delete(record.id); await transactionDone(transaction);
          if (activeCaseId === record.id) activeCaseId = null;
          renderSavedCases();
        });
        actions.append(open, remove); card.append(info, actions); savedList.append(card);
      });
    } catch (error) {
      savedStatus.textContent = 'Nie udało się otworzyć pamięci lokalnej workspace’u.';
      savedStatus.className = 'workspace-notice is-error'; savedStatus.hidden = false;
    }
  }

  function openCurrentGenerator(kind) {
    if (!application) {
      homeNotice.textContent = 'Najpierw odczytaj plik XML albo wczytaj zapisaną sprawę.';
      homeNotice.className = 'workspace-notice is-error'; homeNotice.hidden = false; return;
    }
    showWorkspace('decoder');
    elements.steps[2].disabled = false;
    responseTemplate(); initializeDatabaseGenerator(); showStep('response');
    if (kind === 'record') setTimeout(() => elements.databaseGenerator.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  document.querySelectorAll('[data-workspace]').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.workspace;
    if (target === 'mail' || target === 'record') openCurrentGenerator(target);
    else showWorkspace(target);
  }));
  databaseSearch.addEventListener('input', filterDatabase);
  document.querySelectorAll('.table-sort').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.sort;
    databaseSort = databaseSort.key === key
      ? { key, direction: databaseSort.direction === 'asc' ? 'desc' : 'asc' }
      : { key, direction: key === 'badgeType' ? 'asc' : 'desc' };
    if (publicDatabase) renderDatabaseRows();
  }));
  document.addEventListener('workspace:new-case', () => { activeCaseId = null; });
  window.MGWorkspace = { saveCase, showWorkspace };
  showWorkspace('home', false);
})();
