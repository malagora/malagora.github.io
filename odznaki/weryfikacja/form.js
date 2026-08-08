const BADGES = {
  mala: {
    id: 'mala', code: 'MKMG', name: 'Mała KMG', fullName: 'Mała Korona Małej Góry',
    description: 'Formularz zgłoszenia do Małej Korony Małej Góry.',
    image: 'https://malagora.github.io/media/awards/MG-MKMG.png', initial: 'M', color: '#0a0', dark: '#070', soft: '#e5f8e5',
    fields: [
      { id: 'startDate', label: 'Data rozpoczęcia', type: 'date', required: true },
      { id: 'endDate', label: 'Data zakończenia', type: 'date', required: true }
    ]
  },
  wielka: {
    id: 'wielka', code: 'WKMG', name: 'Wielka KMG', fullName: 'Wielka Korona Małej Góry',
    description: 'Formularz zgłoszenia do Wielkiej Korony Małej Góry.',
    image: 'https://malagora.github.io/media/awards/MG-WKMG.png', initial: 'W', color: '#0aa', dark: '#077', soft: '#e3f7f7',
    fields: [
      { id: 'startDate', label: 'Data rozpoczęcia', type: 'date', required: true },
      { id: 'endDate', label: 'Data zakończenia', type: 'date', required: true }
    ]
  },
  'sarnia-perc': {
    id: 'sarnia-perc', code: 'SP', name: 'Sarnia Perć', fullName: 'Sarnia Perć',
    description: 'Formularz zgłoszenia do odznaki Sarnia Perć.',
    image: 'https://malagora.github.io/media/awards/MG-SP.png', initial: 'SP', color: '#f00', dark: '#b00', soft: '#ffe7e7',
    fields: [
      { id: 'startDateTime', label: 'Data i godzina rozpoczęcia', type: 'datetime-local', required: true },
      { id: 'endDateTime', label: 'Data i godzina zakończenia', type: 'datetime-local', required: true }
    ]
  }
};

const BADGE_PRICE = 20;
const CASH_ON_DELIVERY_PRICE = 5;
const BADGE_DATE_MIN = '2026-06-01';
const VERIFICATION_EMAIL = 'malagora.weryfikacja@vp.pl';

// UZUPEŁNIJ DANE ADMINISTRATORA WYŁĄCZNIE W TYM MIEJSCU.
const PRIVACY_CONFIG = {
  administrator: 'Kacper M',
  contactEmail: VERIFICATION_EMAIL,
  retentionDays: 28,
  publicRecordRetention: 'przez okres prowadzenia oficjalnej bazy odznak i istnienia projektu Mała Góra albo do czasu usunięcia lub unieważnienia wpisu'
};
const REQUIRED_FILES = {
  mala: ['Zdjęcia weryfikacyjne w formacie .jpg, .png, .zip lub .rar', 'Karta zdobywcy w formacie .pdf, .jpg lub .png'],
  wielka: ['Zdjęcia weryfikacyjne w formacie .jpg, .png, .zip lub .rar', 'Karta zdobywcy w formacie .pdf, .jpg lub .png'],
  'sarnia-perc': ['Zdjęcia weryfikacyjne w formacie .jpg, .png, .zip lub .rar', 'Plik .gpx przebytej trasy']
};

const SHIPPING = [
  { id: 'local-courier', name: 'Kurier lokalny', description: 'Nowy Sącz, Kamionka Wielka i Nawojowa', price: 10 },
  { id: 'inpost-locker', name: 'InPost Paczkomat®', description: 'Odbiór w wybranym punkcie', price: 21.50 },
  { id: 'inpost-courier', name: 'InPost Kurier', description: 'Dostawa pod wskazany adres', price: 24.50 },
  { id: 'personal-pickup', name: 'Odbiór osobisty', description: 'Termin ustalany po weryfikacji', price: 0 }
];

const LOCAL_DELIVERY_AREAS = {
  '33-334': ['Kamionka Wielka', 'Bogusza', 'Kamionka Mała', 'Królowa Górna', 'Królowa Polska', 'Mszalnica', 'Mystków'],
  '33-335': ['Nawojowa', 'Bącza-Kunina', 'Frycowa', 'Homrzyska', 'Popardowa', 'Złotne', 'Żeleźnikowa Mała', 'Żeleźnikowa Wielka']
};

for (let code = 300; code <= 308; code += 1) {
  LOCAL_DELIVERY_AREAS[`33-${code}`] = ['Nowy Sącz'];
}

const LEGAL_INFO = {
  verification: {
    title: 'Potwierdzenie zapoznania się z informacją',
    text: 'Zaznaczenie pola potwierdza zapoznanie się z informacją o przetwarzaniu danych. Dane niezbędne do obsługi zgłoszenia są przetwarzane na podstawie art. 6 ust. 1 lit. b RODO. Pole nie stanowi odrębnej zgody na przetwarzanie danych.'
  },
  inpost: {
    title: 'Przekazanie danych przewoźnikowi',
    text: 'W przypadku wyboru dostawy InPost dane niezbędne do doręczenia, w szczególności imię, nazwisko, numer telefonu i dane punktu lub adresu odbioru, zostaną przekazane przewoźnikowi wyłącznie w celu realizacji wybranej dostawy, na podstawie art. 6 ust. 1 lit. b RODO.'
  },
  'required-data': {
    title: 'Dobrowolność podania danych',
    text: 'Podanie danych jest dobrowolne, lecz niezbędne do przeprowadzenia weryfikacji. Dane będą przechowywane maksymalnie przez 28 dni od otrzymania zgłoszenia. Wcześniejsze żądanie ich usunięcia spowoduje anulowanie procesu weryfikacji.'
  }
};

const $ = id => document.getElementById(id);
const elements = {
  shell: $('badgeFormShell'), chooser: $('badgeChooser'), cards: $('badgeCards'), view: $('badgeFormView'),
  tabs: $('badgeTabs'), transition: $('formTransition'), title: $('selectedBadgeTitle'),
  description: $('selectedBadgeDescription'), form: $('applicationForm'), dynamicFields: $('dynamicFields'),
  panels: [...document.querySelectorAll('.step-panel')], steps: [...document.querySelectorAll('.form-step')],
  previous: $('previousStep'), next: $('nextStep'), address: $('deliveryAddress'), locker: $('parcelLockerSection'),
  inpostConsentRow: $('inpostConsentRow'),
  summary: $('applicationSummary'), result: $('applicationResult'), output: $('applicationOutput'),
  download: $('downloadApplication'), edit: $('editApplication'), continueToFiles: $('continueToFiles'),
  emailStage: $('emailStage'), emailSubject: $('emailSubject'), requiredFiles: $('requiredFilesList'),
  copyEmailSubject: $('copyEmailSubject'), backToApplication: $('backToApplication'), openEmail: $('openEmail'),
  continueToContent: $('continueToContent'), filesStage: $('filesStage'), editFromEmail: $('editApplicationFromEmail'),
  voucherToggle: $('voucherToggle'), voucherPanel: $('voucherPanel'), applyVoucher: $('applyVoucher'),
  voucherMessage: $('voucherMessage'), finishApplication: $('finishApplication'),
  completionStage: $('completionStage'), closeCountdown: $('closeCountdown'), clearAndClose: $('clearAndCloseForm'),
  cancelAutoClose: $('cancelAutoClose'), completionCountdown: $('completionCountdown'),
  countdownCancelled: $('countdownCancelled'), attachmentGuidelines: $('attachmentGuidelines'),
  attachmentNameExample: $('attachmentNameExample'), localDeliveryStatus: $('localDeliveryStatus'),
  localCitiesList: $('localCitiesList')
};

let selectedBadgeId = null;
let currentStep = 0;
let closeTimer = null;
const badgeValues = {};

function cardTemplate(badge) {
  return `<button class="badge-card" type="button" data-select-badge="${badge.id}" style="--card-color:${badge.color};--card-soft:${badge.soft}">
    <span class="badge-card-image"><img src="${badge.image}" alt="Odznaka ${badge.name}"><span class="badge-image-placeholder" aria-hidden="true">${badge.initial}</span></span>
    <span class="badge-card-content"><span>${badge.name}</span><span class="ui-arrow" aria-hidden="true">➔</span></span>
  </button>`;
}

function tabTemplate(badge) {
  return `<button class="badge-tab" type="button" role="tab" data-select-badge="${badge.id}" style="--tab-color:${badge.color};--tab-dark:${badge.dark}" aria-selected="false">
    <span class="badge-tab-image" data-initial="${badge.initial}"><img src="${badge.image}" alt=""></span><span>${badge.name}</span>
  </button>`;
}

function optionTemplate(option, group) {
  const price = option.price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `<label class="option-card"><input type="radio" name="${group}" value="${option.id}" required>
    <span><span class="option-name">${option.name}</span><span class="option-description">${option.description}</span></span>
    <span class="option-price">+${price} zł</span></label>`;
}

function renderNavigation() {
  const badges = Object.values(BADGES);
  elements.cards.innerHTML = badges.map(cardTemplate).join('');
  elements.tabs.innerHTML = badges.map(tabTemplate).join('');
  $('shippingOptions').innerHTML = SHIPPING.map(option => optionTemplate(option, 'shipping')).join('');
  renderPayments();

  document.querySelectorAll('[data-select-badge]').forEach(button => button.addEventListener('click', () => selectBadge(button.dataset.selectBadge)));
  document.querySelectorAll('.badge-card-image img, .badge-tab-image img').forEach(image => {
    image.addEventListener('error', () => image.parentElement.classList.add('is-placeholder'));
    if (image.complete && image.naturalWidth === 0) image.parentElement.classList.add('is-placeholder');
  });
}

function fieldTemplate(field) {
  const required = field.required ? 'required' : '';
  const asterisk = field.required ? ' <b>*</b>' : '';
  return `<label class="field"><span>${field.label}${asterisk}</span><input type="${field.type}" name="badge_${field.id}" ${required}></label>`;
}

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localDateTime(date) {
  return `${localDate(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function applyDateLimits() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  elements.form.elements.birthDate.max = localDate(yesterday);

  elements.dynamicFields.querySelectorAll('input[type="date"]').forEach(field => {
    field.min = BADGE_DATE_MIN;
    field.max = localDate(now);
  });
  elements.dynamicFields.querySelectorAll('input[type="datetime-local"]').forEach(field => {
    field.min = `${BADGE_DATE_MIN}T00:00`;
    field.max = localDateTime(now);
  });
  updateEndDateLimits();
}

function updateEndDateLimits() {
  const badge = BADGES[selectedBadgeId];
  if (!badge) return;
  const start = elements.form.elements[`badge_${badge.fields[0].id}`];
  const end = elements.form.elements[`badge_${badge.fields[1].id}`];
  const now = new Date();
  const maximum = end.type === 'datetime-local' ? localDateTime(now) : localDate(now);

  end.disabled = !start.value;
  end.min = start.value || (end.type === 'datetime-local' ? `${BADGE_DATE_MIN}T00:00` : BADGE_DATE_MIN);
  end.max = maximum;

  if (!start.value) end.value = '';
  if (end.value && (end.value < end.min || end.value > maximum)) end.value = '';
  end.setCustomValidity('');
}

function saveBadgeFields() {
  if (!selectedBadgeId) return;
  badgeValues[selectedBadgeId] = {};
  elements.dynamicFields.querySelectorAll('input').forEach(field => { badgeValues[selectedBadgeId][field.name] = field.value; });
}

function restoreBadgeFields(id) {
  Object.entries(badgeValues[id] || {}).forEach(([name, value]) => {
    const field = elements.dynamicFields.querySelector(`[name="${name}"]`);
    if (field) field.value = value;
  });
}

function applyBadge(id) {
  const badge = BADGES[id];
  elements.shell.dataset.badge = id;
  elements.title.textContent = badge.fullName;
  elements.description.textContent = badge.description;
  elements.dynamicFields.innerHTML = badge.fields.map(fieldTemplate).join('');
  elements.tabs.querySelectorAll('.badge-tab').forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.selectBadge === id)));
  restoreBadgeFields(id);
  selectedBadgeId = id;
  applyDateLimits();
  const start = elements.form.elements[`badge_${badge.fields[0].id}`];
  start.addEventListener('input', updateEndDateLimits);
  start.addEventListener('change', updateEndDateLimits);
  updateEndDateLimits();
}

function selectBadge(id) {
  if (!BADGES[id] || id === selectedBadgeId) return;
  if (closeTimer) {
    clearInterval(closeTimer);
    closeTimer = null;
  }
  saveBadgeFields();
  if (elements.view.hidden) {
    elements.chooser.hidden = true;
    elements.view.hidden = false;
    applyBadge(id);
    showStep(0, false);
    return;
  }
  elements.transition.classList.add('is-changing');
  setTimeout(() => {
    elements.result.hidden = true;
    elements.emailStage.hidden = true;
    elements.filesStage.hidden = true;
    elements.completionStage.hidden = true;
    elements.form.hidden = false;
    applyBadge(id);
    showStep(Math.min(currentStep, 1), false);
    requestAnimationFrame(() => elements.transition.classList.remove('is-changing'));
  }, 300);
}

function fieldsInPanel(index) {
  return [...elements.panels[index].querySelectorAll('input, select, textarea')].filter(field => !field.disabled && !field.closest('[hidden]'));
}

function validatePanel(index) {
  for (const field of fieldsInPanel(index)) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
  }
  return true;
}

function showStep(index, validateForward = true) {
  if (index > currentStep && validateForward && !validatePanel(currentStep)) return;
  currentStep = Math.max(0, Math.min(index, elements.panels.length - 1));
  if (currentStep === 4) renderSummary();
  elements.panels.forEach((panel, i) => { panel.hidden = i !== currentStep; panel.classList.toggle('is-active', i === currentStep); });
  elements.steps.forEach((step, i) => {
    step.classList.toggle('is-active', i === currentStep);
    step.classList.toggle('is-complete', i < currentStep);
    step.setAttribute('aria-current', i === currentStep ? 'step' : 'false');
  });
  elements.previous.hidden = currentStep === 0;
  elements.next.hidden = currentStep === elements.panels.length - 1;
}

function selectedShipping() {
  return elements.form.elements.shipping?.value || '';
}

function validateLocalDeliveryCity() {
  const cityField = elements.form.elements.city;
  cityField.setCustomValidity('');
  if (selectedShipping() !== 'local-courier') return;
  const cities = LOCAL_DELIVERY_AREAS[elements.form.elements.postalCode.value.trim()];
  if (cities && cityField.value.trim()) {
    const matchingCity = cities.find(city => city.localeCompare(cityField.value.trim(), 'pl', { sensitivity: 'base' }) === 0);
    if (matchingCity) cityField.value = matchingCity;
    else cityField.setCustomValidity('Wybierz miejscowość przypisaną do podanego kodu pocztowego.');
  }
}

function updateLocalDeliveryEligibility() {
  const postalField = elements.form.elements.postalCode;
  const cityField = elements.form.elements.city;
  const isLocalCourier = selectedShipping() === 'local-courier';

  postalField.setCustomValidity('');
  cityField.setCustomValidity('');
  elements.localCitiesList.replaceChildren();

  if (!isLocalCourier) {
    elements.localDeliveryStatus.hidden = true;
    elements.localDeliveryStatus.className = 'local-delivery-status';
    cityField.removeAttribute('list');
    return;
  }

  const code = postalField.value.trim();
  const cities = LOCAL_DELIVERY_AREAS[code];
  elements.localDeliveryStatus.hidden = false;

  if (!/^\d{2}-\d{3}$/.test(code)) {
    elements.localDeliveryStatus.className = 'local-delivery-status';
    elements.localDeliveryStatus.textContent = 'Wpisz pełny kod pocztowy, aby sprawdzić dostępność kuriera lokalnego.';
    return;
  }

  if (!cities) {
    const message = 'Adres nie kwalifikuje się do tego typu dostawy.';
    postalField.setCustomValidity(message);
    elements.localDeliveryStatus.className = 'local-delivery-status is-error';
    elements.localDeliveryStatus.textContent = message;
    cityField.removeAttribute('list');
    return;
  }

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    elements.localCitiesList.append(option);
  });
  cityField.setAttribute('list', 'localCitiesList');

  if (cities.length === 1) cityField.value = cities[0];
  else if (!cities.includes(cityField.value.trim())) cityField.value = '';

  elements.localDeliveryStatus.className = 'local-delivery-status is-success';
  elements.localDeliveryStatus.textContent = `Kurier lokalny jest dostępny. Miejscowości przypisane do kodu ${code}: ${cities.join(', ')}.`;
  validateLocalDeliveryCity();
}

function updateShippingDependencies() {
  const shipping = selectedShipping();
  const needsAddress = shipping === 'local-courier' || shipping === 'inpost-courier';
  const needsLocker = shipping === 'inpost-locker';
  const isInpost = shipping === 'inpost-locker' || shipping === 'inpost-courier';
  elements.address.hidden = !needsAddress;
  elements.locker.hidden = !needsLocker;
  elements.inpostConsentRow.hidden = !isInpost;
  elements.address.querySelectorAll('input').forEach(input => { input.required = needsAddress && input.name !== 'apartmentNumber'; });
  elements.form.elements.parcelLocker.required = needsLocker;
  elements.form.elements.inpostConsent.required = isInpost;
  if (!isInpost) elements.form.elements.inpostConsent.checked = false;
  renderPayments();
  updateLocalDeliveryEligibility();
}

function renderPayments() {
  const pickup = selectedShipping() === 'personal-pickup';
  const inpostCourier = selectedShipping() === 'inpost-courier';
  const current = elements.form?.querySelector('input[name="payment"]:checked')?.value || '';
  const options = [
    { id: 'blik', name: 'BLIK', description: 'Dane do płatności otrzymasz po zatwierdzeniu zgłoszenia', price: 0 },
    ...(pickup ? [{ id: 'cash', name: 'Gotówka', description: 'Dostępna tylko przy odbiorze osobistym', price: 0 }] : []),
    ...(inpostCourier ? [{ id: 'cash-on-delivery', name: 'Płatność za pobraniem', description: 'Zapłacisz kurierowi przy odbiorze', price: CASH_ON_DELIVERY_PRICE }] : [])
  ];
  $('paymentOptions').innerHTML = options.map(option => optionTemplate(option, 'payment')).join('');
  const preserved = elements.form.querySelector(`input[name="payment"][value="${current}"]`);
  if (preserved) preserved.checked = true;
}

function value(name) {
  const field = elements.form.elements[name];
  const raw = field?.value?.trim?.() ?? '';
  return raw || '-';
}

function phonePrefix() {
  return value('phonePrefixMode') === 'custom' ? value('customPhonePrefix').replace(/\D/g, '') : '48';
}

function formattedPhone() {
  const digits = value('phone').replace(/\D/g, '');
  if (digits === '-') return '-';
  return `+${phonePrefix()} ${digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim()}`;
}

function shippingName() {
  return SHIPPING.find(item => item.id === selectedShipping())?.name || '-';
}

function paymentName() {
  const names = { cash: 'Gotówka', blik: 'BLIK', 'cash-on-delivery': 'Płatność za pobraniem' };
  return names[value('payment')] || '-';
}

function voucherCode() {
  return value('voucherCode');
}

function shippingPrice() {
  return SHIPPING.find(item => item.id === selectedShipping())?.price || 0;
}

function paymentSurcharge() {
  return value('payment') === 'cash-on-delivery' ? CASH_ON_DELIVERY_PRICE : 0;
}

function totalPrice() {
  return BADGE_PRICE + shippingPrice() + paymentSurcharge();
}

function price(valueToFormat) {
  return `${valueToFormat.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}

function renderSummary() {
  const badge = BADGES[selectedBadgeId];
  const addressRows = elements.address.hidden ? [] : [
    ['Kod pocztowy', value('postalCode')], ['Miejscowość', value('city')], ['Ulica', value('street')],
    ['Nr domu', value('houseNumber')], ['Nr mieszkania', value('apartmentNumber')]
  ];
  const lockerRows = elements.locker.hidden ? [] : [
    ['Kod Paczkomatu', value('parcelLocker')], ['Adres Paczkomatu', value('parcelLockerAddress')]
  ];
  const groups = [
    ['Zdobywca', [['Imię', value('firstName')], ['Nazwisko', value('lastName')], ['Data urodzenia', value('birthDate')], ['E-mail', value('email')], ['Nr telefonu', formattedPhone()]]],
    ['Odznaka', [['Rodzaj', badge.fullName], ...badge.fields.map(field => [field.label, value(`badge_${field.id}`)])]],
    ['Dostawa i płatność', [['Wysyłka', shippingName()], ...addressRows, ...lockerRows, ['Płatność', paymentName()], ['Voucher/kod rabatowy', voucherCode()]]]
  ];
  elements.summary.innerHTML = groups.map(([title, rows]) => `<section class="summary-group"><h4>${title}</h4><dl>${rows.map(([label, item]) => `<div class="summary-row"><dt>${label}</dt><dd>${escapeHtml(item)}</dd></div>`).join('')}</dl></section>`).join('');
  elements.summary.insertAdjacentHTML('beforeend', `<section class="price-summary">
    <h4>Do zapłaty</h4>
    <div><span>Odznaka</span><strong>${price(BADGE_PRICE)}</strong></div>
    <div><span>Wysyłka</span><strong>${price(shippingPrice())}</strong></div>
    ${paymentSurcharge() ? `<div><span>Pobranie</span><strong>${price(paymentSurcharge())}</strong></div>` : ''}
    <div class="price-total"><span>Razem</span><strong>${price(totalPrice())}</strong></div>
    ${voucherCode() !== '-' ? '<p class="price-voucher-note">Kwota przed sprawdzeniem vouchera lub kodu rabatowego.</p>' : ''}
  </section>`);
}

function escapeXml(input) {
  return String(input ?? '-').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}
const escapeHtml = escapeXml;
const xml = (name, content, indent = '    ') => `${indent}<${name}>${escapeXml(content || '-')}</${name}>`;

function renderPrivacyInformation() {
  const administrator = escapeHtml(PRIVACY_CONFIG.administrator);
  const contactEmail = escapeHtml(PRIVACY_CONFIG.contactEmail);
  const retentionDays = Number(PRIVACY_CONFIG.retentionDays) || 28;
  const publicRecordRetention = escapeHtml(PRIVACY_CONFIG.publicRecordRetention);
  $('privacyInformationContent').innerHTML = `
    <p><strong>Administrator danych:</strong> właściciel projektu Mała Góra — ${administrator}. Kontakt w sprawach dotyczących danych osobowych: <a href="mailto:${contactEmail}">${contactEmail}</a>.</p>
    <p><strong>Cele przetwarzania:</strong> przyjęcie i rozpatrzenie zgłoszenia, weryfikacja spełnienia warunków zdobycia odznaki, kontakt ze zdobywcą, przygotowanie odpowiedzi, obsługa płatności oraz realizacja wybranej dostawy.</p>
    <p><strong>Zakres danych:</strong> dane wpisane w formularzu oraz informacje zawarte w materiałach weryfikacyjnych, w tym na zdjęciach, karcie zdobywcy lub w pliku GPX.</p>
    <p><strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. b RODO — przetwarzanie jest niezbędne do podjęcia działań na żądanie osoby składającej zgłoszenie oraz obsługi procesu przyznania odznaki.</p>
    <p><strong>Odbiorcy danych:</strong> dostawca poczty elektronicznej wykorzystywanej do obsługi zgłoszeń oraz, w przypadku wyboru wysyłki, właściwy podmiot realizujący doręczenie, w tym InPost. Dane są przekazywane wyłącznie w zakresie niezbędnym do realizacji usługi.</p>
    <p><strong>Okres przechowywania:</strong> dane są przechowywane do zakończenia albo anulowania procesu weryfikacji, jednak nie dłużej niż przez ${retentionDays} dni od dnia otrzymania zgłoszenia. Po tym terminie zostaną usunięte bez zbędnej zwłoki.</p>
    <p><strong>Publiczna baza wydanych odznak:</strong> po pozytywnym zakończeniu weryfikacji w publicznej bazie mogą zostać zapisane: identyfikator i rodzaj odznaki, pierwsza litera imienia, liczba znaków imienia, pierwsza litera nazwiska, liczba znaków nazwiska, status odznaki oraz daty jej zdobywania, rozpatrzenia, wydania i aktualizacji. Na tej podstawie imię i nazwisko są wyświetlane w postaci zamaskowanej, np. K*** M******. Pełne imię, pełne nazwisko, adres, e-mail i numer telefonu nie są umieszczane w publicznym pliku bazy.</p>
    <p><strong>Cel i podstawa publicznego wpisu:</strong> potwierdzanie autentyczności wydanej odznaki oraz ochrona przed posługiwaniem się nieprawdziwym potwierdzeniem. Podstawą jest prawnie uzasadniony interes administratora, o którym mowa w art. 6 ust. 1 lit. f RODO. W związku z tym wpisem można wnieść sprzeciw z przyczyn związanych ze szczególną sytuacją osoby.</p>
    <p><strong>Okres przechowywania publicznego wpisu:</strong> ${publicRecordRetention}. Okres ten jest niezależny od ${retentionDays}-dniowego okresu przechowywania pełnego zgłoszenia i materiałów weryfikacyjnych.</p>
    <p><strong>Wcześniejsze usunięcie:</strong> można w dowolnym momencie zażądać usunięcia danych przed zakończeniem procesu. Ponieważ dane są konieczne do przeprowadzenia weryfikacji, ich usunięcie będzie równoznaczne z anulowaniem zgłoszenia.</p>
    <p><strong>Prawa osoby:</strong> prawo dostępu do danych i uzyskania ich kopii, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych — gdy ma zastosowanie — oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</p>
    <p><strong>Dobrowolność:</strong> podanie danych jest dobrowolne, ale dane oznaczone gwiazdką są niezbędne do rozpoczęcia i przeprowadzenia procesu weryfikacji.</p>
    <p>Dane nie będą wykorzystywane do zautomatyzowanego podejmowania decyzji ani profilowania. Materiały weryfikacyjne i wizerunek nie będą publikowane ani wykorzystywane promocyjnie bez odrębnej, dobrowolnej zgody.</p>`;
}

function generateApplication() {
  const badge = BADGES[selectedBadgeId];
  const badgeXml = badge.fields.map(field => xml(field.id, value(`badge_${field.id}`))).join('\n');
  const addressValue = name => elements.address.hidden ? '-' : value(name);
  const lockerValue = name => elements.locker.hidden ? '-' : value(name);
  return `<?xml version="1.0" encoding="UTF-8"?>
<MALA-GORA-ZGLOSZENIE wersja="1">
  <odznaka id="${badge.id}">${escapeXml(badge.fullName)}</odznaka>
  <zdobywca>
${xml('imie', value('firstName'))}
${xml('nazwisko', value('lastName'))}
${xml('data-urodzenia', value('birthDate'))}
${xml('email', value('email'))}
${xml('telefon', formattedPhone())}
  </zdobywca>
  <dane-odznaki>
${badgeXml}
  </dane-odznaki>
  <wysylka metoda="${escapeXml(value('shipping'))}">
${xml('kod-pocztowy', addressValue('postalCode'))}
${xml('miejscowosc', addressValue('city'))}
${xml('ulica', addressValue('street'))}
${xml('nr-domu', addressValue('houseNumber'))}
${xml('nr-mieszkania', addressValue('apartmentNumber'))}
${xml('paczkomat', lockerValue('parcelLocker'))}
${xml('adres-paczkomatu', lockerValue('parcelLockerAddress'))}
  </wysylka>
  <platnosc>${escapeXml(value('payment'))}</platnosc>
  <voucher-lub-kod-rabatowy>${escapeXml(voucherCode())}</voucher-lub-kod-rabatowy>
  <koszty waluta="PLN">
${xml('odznaka', BADGE_PRICE.toFixed(2))}
${xml('wysylka', shippingPrice().toFixed(2))}
${xml('pobranie', paymentSurcharge().toFixed(2))}
${xml('razem', totalPrice().toFixed(2))}
  </koszty>
  <zgody>
${xml('informacja-rodo', elements.form.elements.privacyAcknowledgement.checked ? 'tak' : 'nie')}
${xml('inpost', elements.form.elements.inpostConsent.checked ? 'tak' : 'nie')}
${xml('niezbednosc-danych', elements.form.elements.requiredDataAcknowledgement.checked ? 'tak' : 'nie')}
  </zgody>
</MALA-GORA-ZGLOSZENIE>`;
}

function prepareEmailStage() {
  const badge = BADGES[selectedBadgeId];
  const initials = `${value('firstName').charAt(0)}${value('lastName').charAt(0)}`.toLocaleUpperCase('pl-PL');
  const today = new Date();
  const xmlFileName = `MG_${badge.code}_${initials}_${localDate(today)}.xml`;
  const shortDate = `${String(today.getFullYear()).slice(-2)}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const subject = `Weryfikacja – ${badge.code} – ${initials}/${shortDate}`;
  elements.emailSubject.value = subject;
  elements.requiredFiles.innerHTML = ['Wygenerowany plik zgłoszenia w formacie .xml', ...REQUIRED_FILES[selectedBadgeId]].map(file => `<li>${file}</li>`).join('');
  const guidelines = [
    'Dla bezpieczeństwa łączny rozmiar jednej wiadomości nie powinien przekraczać 20 MB.',
    'Jeśli pliki są większe, wyślij je w kilku wiadomościach, zachowując ten sam tytuł.',
    'Zdjęcia możesz przesłać osobno albo w jednym lub kilku archiwach .zip lub .rar.',
    'Plik zgłoszenia .xml dołącz oddzielnie — nie umieszczaj go w archiwum.'
  ];
  if (selectedBadgeId === 'sarnia-perc') {
    guidelines.push('Plik .gpx dołącz oddzielnie — nie umieszczaj go w archiwum ze zdjęciami.');
    elements.attachmentNameExample.textContent = `${xmlFileName}, ${initials}_${badge.code}_foto_01.jpg, ${initials}_${badge.code}_zdjecia.zip, ${initials}_${badge.code}_trasa.gpx`;
  } else {
    guidelines.push('Karty zdobywcy nie umieszczaj w archiwum .zip ani .rar — dołącz ją jako osobny plik .pdf, .jpg lub .png.');
    elements.attachmentNameExample.textContent = `${xmlFileName}, ${initials}_${badge.code}_foto_01.jpg, ${initials}_${badge.code}_zdjecia.zip, ${initials}_${badge.code}_karta.pdf`;
  }
  elements.attachmentGuidelines.innerHTML = guidelines.map(item => `<li>${item}</li>`).join('');
  elements.openEmail.href = `mailto:${VERIFICATION_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

async function copyText(text, fallbackField) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    fallbackField.focus();
    fallbackField.select();
    return document.execCommand('copy');
  }
}

elements.steps.forEach(step => step.addEventListener('click', () => showStep(Number(step.dataset.step))));
elements.previous.addEventListener('click', () => showStep(currentStep - 1, false));
elements.next.addEventListener('click', () => showStep(currentStep + 1));
elements.form.addEventListener('change', event => { if (event.target.name === 'shipping') updateShippingDependencies(); });
elements.form.elements.parcelLocker.addEventListener('input', event => {
  event.target.value = event.target.value.toUpperCase().replace(/\s+/g, '');
});

const phoneField = elements.form.elements.phone;
const phonePrefixMode = elements.form.elements.phonePrefixMode;
const customPhonePrefixField = elements.form.elements.customPhonePrefix;
const customPhonePrefix = $('customPhonePrefix');
const phonePrefixSelect = phonePrefixMode.closest('.phone-prefix-select');

function validatePhone() {
  const digits = phoneField.value.replace(/\D/g, '');
  phoneField.setCustomValidity(digits.length === 9 ? '' : 'Wpisz 9 cyfr numeru telefonu bez numeru kierunkowego kraju.');
}

phoneField.addEventListener('input', () => {
  const digits = phoneField.value.replace(/\D/g, '').slice(0, 9);
  phoneField.value = digits.replace(/(\d{3})(?=\d)/g, '$1 ');
  validatePhone();
});

phonePrefixMode.addEventListener('change', () => {
  const usesCustomPrefix = phonePrefixMode.value === 'custom';
  phonePrefixSelect.classList.toggle('is-custom', usesCustomPrefix);
  customPhonePrefix.hidden = !usesCustomPrefix;
  customPhonePrefixField.required = usesCustomPrefix;
  if (usesCustomPrefix) customPhonePrefixField.focus();
  else {
    customPhonePrefixField.value = '';
    customPhonePrefixField.setCustomValidity('');
  }
});

customPhonePrefixField.addEventListener('input', () => {
  customPhonePrefixField.value = customPhonePrefixField.value.replace(/\D/g, '').slice(0, 3);
});

const postalCodeField = elements.form.elements.postalCode;
postalCodeField.addEventListener('input', () => {
  const digits = postalCodeField.value.replace(/\D/g, '').slice(0, 5);
  postalCodeField.value = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
  updateLocalDeliveryEligibility();
});

elements.form.elements.city.addEventListener('input', validateLocalDeliveryCity);

elements.voucherToggle.addEventListener('click', () => {
  const willOpen = elements.voucherPanel.hidden;
  elements.voucherPanel.hidden = !willOpen;
  elements.voucherToggle.setAttribute('aria-expanded', String(willOpen));
  elements.voucherToggle.textContent = willOpen ? 'Ukryj voucher/kod rabatowy' : 'Posiadam voucher/kod rabatowy';

  const field = elements.form.elements.voucherCode;
  if (willOpen) field.focus();
  else field.setCustomValidity('');
});

elements.form.elements.voucherCode.addEventListener('input', event => {
  event.target.setCustomValidity('');
  elements.voucherMessage.hidden = true;
});

elements.applyVoucher.addEventListener('click', () => {
  const field = elements.form.elements.voucherCode;
  if (!field.value.trim()) {
    field.setCustomValidity('Wpisz voucher lub kod rabatowy.');
    field.reportValidity();
    field.focus();
    return;
  }
  field.setCustomValidity('');
  elements.voucherMessage.hidden = false;
  elements.voucherMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

elements.form.addEventListener('submit', event => {
  event.preventDefault();
  for (let i = 0; i < elements.panels.length - 1; i += 1) {
    if (!validatePanel(i)) { showStep(i, false); return; }
  }
  saveBadgeFields();
  elements.output.value = generateApplication();
  prepareEmailStage();
  elements.continueToContent.disabled = true;
  elements.continueToFiles.disabled = true;
  elements.form.hidden = true;
  elements.result.hidden = true;
  elements.filesStage.hidden = true;
  elements.emailStage.hidden = false;
  elements.emailStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

elements.download.addEventListener('click', () => {
  const badge = BADGES[selectedBadgeId];
  const initials = `${value('firstName').charAt(0)}${value('lastName').charAt(0)}`.toLocaleUpperCase('pl-PL');
  const fileName = `MG_${badge.code}_${initials}_${localDate(new Date())}.xml`;
  const url = URL.createObjectURL(new Blob([elements.output.value], { type: 'application/xml;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  elements.continueToFiles.disabled = false;
  const label = elements.download.querySelector('span');
  label.textContent = 'Pobrano plik XML';
  setTimeout(() => { label.textContent = 'Pobierz plik XML'; }, 1800);
});

elements.openEmail.addEventListener('click', () => {
  elements.continueToContent.disabled = false;
});

elements.continueToContent.addEventListener('click', () => {
  elements.emailStage.hidden = true;
  elements.filesStage.hidden = true;
  elements.result.hidden = false;
  elements.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

elements.continueToFiles.addEventListener('click', () => {
  elements.result.hidden = true;
  elements.emailStage.hidden = true;
  elements.filesStage.hidden = false;
  elements.filesStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

elements.copyEmailSubject.addEventListener('click', async () => {
  const copied = await copyText(elements.emailSubject.value, elements.emailSubject);
  if (!copied) return;
  elements.continueToContent.disabled = false;
  const label = elements.copyEmailSubject.querySelector('span');
  label.textContent = 'Skopiowano';
  setTimeout(() => { label.textContent = 'Kopiuj tytuł'; }, 1800);
});

elements.backToApplication.addEventListener('click', () => {
  elements.filesStage.hidden = true;
  elements.emailStage.hidden = true;
  elements.result.hidden = false;
  elements.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function resetAndCloseForm() {
  if (closeTimer) {
    clearInterval(closeTimer);
    closeTimer = null;
  }

  elements.form.reset();
  phoneField.setCustomValidity('');
  customPhonePrefixField.setCustomValidity('');
  customPhonePrefix.hidden = true;
  customPhonePrefixField.required = false;
  phonePrefixSelect.classList.remove('is-custom');
  Object.keys(badgeValues).forEach(key => delete badgeValues[key]);
  selectedBadgeId = null;
  currentStep = 0;

  elements.shell.dataset.badge = '';
  elements.chooser.hidden = false;
  elements.view.hidden = true;
  elements.form.hidden = false;
  elements.result.hidden = true;
  elements.emailStage.hidden = true;
  elements.filesStage.hidden = true;
  elements.completionStage.hidden = true;
  elements.address.hidden = true;
  elements.locker.hidden = true;
  elements.inpostConsentRow.hidden = true;
  updateLocalDeliveryEligibility();
  elements.voucherPanel.hidden = true;
  elements.voucherMessage.hidden = true;
  elements.voucherToggle.setAttribute('aria-expanded', 'false');
  elements.voucherToggle.textContent = 'Posiadam voucher/kod rabatowy';
  elements.dynamicFields.innerHTML = '';
  elements.output.value = '';
  elements.emailSubject.value = '';
  elements.requiredFiles.innerHTML = '';
  elements.attachmentGuidelines.innerHTML = '';
  elements.attachmentNameExample.textContent = '';
  elements.continueToContent.disabled = true;
  elements.continueToFiles.disabled = true;
  elements.closeCountdown.textContent = '15';
  elements.completionCountdown.hidden = false;
  elements.countdownCancelled.hidden = true;
  elements.cancelAutoClose.hidden = false;

  elements.tabs.querySelectorAll('.badge-tab').forEach(tab => tab.setAttribute('aria-selected', 'false'));
  renderPayments();
  showStep(0, false);
  elements.chooser.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showCompletion() {
  elements.filesStage.hidden = true;
  elements.result.hidden = true;
  elements.emailStage.hidden = true;
  elements.completionStage.hidden = false;

  let secondsLeft = 15;
  elements.closeCountdown.textContent = String(secondsLeft);
  elements.completionCountdown.hidden = false;
  elements.countdownCancelled.hidden = true;
  elements.cancelAutoClose.hidden = false;
  elements.completionStage.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (closeTimer) clearInterval(closeTimer);
  closeTimer = setInterval(() => {
    secondsLeft -= 1;
    elements.closeCountdown.textContent = String(Math.max(secondsLeft, 0));
    if (secondsLeft <= 0) resetAndCloseForm();
  }, 1000);
}

elements.finishApplication.addEventListener('click', showCompletion);
elements.clearAndClose.addEventListener('click', resetAndCloseForm);
elements.cancelAutoClose.addEventListener('click', () => {
  if (closeTimer) {
    clearInterval(closeTimer);
    closeTimer = null;
  }
  elements.completionStage.hidden = true;
  elements.filesStage.hidden = false;
  elements.filesStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function returnToForm() {
  elements.result.hidden = true;
  elements.emailStage.hidden = true;
  elements.filesStage.hidden = true;
  elements.completionStage.hidden = true;
  elements.form.hidden = false;
  showStep(4, false);
}

elements.edit.addEventListener('click', returnToForm);
elements.editFromEmail.addEventListener('click', returnToForm);

document.querySelectorAll('[data-legal]').forEach(button => {
  const info = LEGAL_INFO[button.dataset.legal];
  button.dataset.tooltip = `${info.title}. ${info.text}`;
  button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    button.focus();
  });
});
$('verificationForm').addEventListener('submit', event => event.preventDefault());

renderNavigation();
renderPrivacyInformation();
applyDateLimits();
showStep(0, false);
