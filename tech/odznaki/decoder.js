const BADGES = {
  mala: { code: 'MKMG', name: 'Mała Korona Małej Góry' },
  wielka: { code: 'WKMG', name: 'Wielka Korona Małej Góry' },
  'sarnia-perc': { code: 'SP', name: 'Sarnia Perć' }
};

const SHIPPING = {
  'local-courier': { name: 'Kurier lokalny', price: 10 },
  'inpost-locker': { name: 'InPost Paczkomat®', price: 21.50 },
  'inpost-courier': { name: 'InPost Kurier', price: 24.50 },
  'personal-pickup': { name: 'Odbiór osobisty', price: 0 }
};

const PAYMENT = {
  blik: 'BLIK',
  cash: 'Gotówka',
  'cash-on-delivery': 'Płatność za pobraniem'
};

const BADGE_LETTERS = { mala: 'M', wielka: 'W', 'sarnia-perc': 'S' };

const MAIL_SIGNATURE = `Z poważaniem,

Zespół weryfikacyjny Małej Góry
Mała Góra | Odznaki
malagora.weryfikacja@vp.pl
https://malagora.github.io/odznaki

Wiadomość może zawierać dane osobowe przeznaczone wyłącznie dla jej adresata. Jeżeli otrzymałeś ją omyłkowo, poinformuj nadawcę i usuń wiadomość.`;

const $ = id => document.getElementById(id);
const elements = {
  app: $('decoderApp'), file: $('xmlFile'), drop: $('fileDrop'), fileName: $('selectedFileName'), source: $('xmlSource'),
  decode: $('decodeApplication'), error: $('decodeError'), importPanel: $('importPanel'), reviewPanel: $('reviewPanel'),
  responsePanel: $('responsePanel'), steps: [...document.querySelectorAll('.decoder-step')], reviewTitle: $('reviewTitle'),
  structureStatus: $('structureStatus'), validationList: $('validationList'), decodedGroups: $('decodedGroups'),
  loadAnother: $('loadAnother'), goToResponse: $('goToResponse'), backToReview: $('backToReview'), decision: $('decision'),
  issuedNumber: $('issuedBadgeNumber'), notes: $('decisionNotes'), recipient: $('responseRecipient'),
  responseAmountField: $('responseAmountField'), responseAmount: $('responseAmount'), responseAmountLabel: $('responseAmountLabel'), responseAmountHint: $('responseAmountHint'),
  blikCheckField: $('blikCheckField'), blikCheckCode: $('blikCheckCode'),
  pickupDetailsOption: $('pickupDetailsOption'), pickupAddressField: $('pickupAddressField'), pickupAddress: $('pickupAddress'),
  responseSubject: $('responseSubject'), responseBody: $('responseBody'), copySubject: $('copyResponseSubject'),
  copyBody: $('copyResponseBody'), copyFormattedEmail: $('copyFormattedEmail'), openEmail: $('openResponseEmail'), clear: $('clearDecoder'),
  saveState: $('saveEncryptedState'), stateStatus: $('stateStatus'),
  databaseGenerator: $('databaseGenerator'), reviewedAt: $('recordReviewedAt'), issuedAt: $('recordIssuedAt'),
  achievementStart: $('recordAchievementStart'), achievementEnd: $('recordAchievementEnd'), recordStatus: $('recordStatus'),
  generateRecord: $('generateDatabaseRecord'), generatedRecord: $('generatedRecord'), generatedLogin: $('generatedLogin'),
  generatedPassword: $('generatedPassword'), recordOutput: $('databaseRecordOutput'), recordMessage: $('recordMessage'),
  copyRecord: $('copyDatabaseRecord'), downloadDatabase: $('downloadUpdatedDatabase')
};

let application = null;
let currentView = 'import';
let currentDatabaseRecord = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function buildHtmlEmail() {
  const plainBody = elements.responseBody.value.trim();
  const signaturePosition = plainBody.lastIndexOf(`\n\n${MAIL_SIGNATURE}`);
  const messageBodyWithSummary = signaturePosition >= 0 ? plainBody.slice(0, signaturePosition) : plainBody;
  const messageBody = messageBodyWithSummary.replace(/\n\nPODSUMOWANIE PŁATNOŚCI\n[\s\S]*?\nSUMA DO ZAPŁATY: [^\n]+/, '');
  let formattedBody = escapeHtml(messageBody).replace(/\r?\n/g, '<br>');
  if (application?.payment === 'blik' && ['payment', 'voucher-price'].includes(elements.decision.value)) {
    const blikNumber = escapeHtml(blikPhoneForMessage());
    const plainBlikBlock = `Numer do przelewu na telefon BLIK: ${blikNumber}.<br>Nie podawaj tego numeru dalej ani nie udostępniaj go osobom trzecim.<br>Prosimy o przesłanie należności na powyższy numer.`;
    const htmlBlikBlock = `<div style="margin:20px 0;text-align:left"><span style="display:block;margin-bottom:7px;font-size:13px;font-weight:bold">Numer do przelewu na telefon BLIK</span><strong style="display:inline-block;width:auto;padding:11px 15px;border:2px solid #ff0000;border-radius:9px;background:#ffffff;color:#000000;font-size:20px;line-height:1.2;letter-spacing:.08em">${blikNumber}</strong><span style="display:block;margin-top:8px;color:#b00000;font-size:12px;font-weight:bold">Nie podawaj tego numeru dalej ani nie udostępniaj go osobom trzecim.</span><span style="display:block;margin-top:5px;font-size:13px">Prosimy o przesłanie należności na powyższy numer.</span></div>`;
    formattedBody = formattedBody.replace(plainBlikBlock, htmlBlikBlock);
  }
  const paymentSummary = buildPaymentSummaryHtml();

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#171717;font-size:15px;line-height:1.6;text-align:left">${formattedBody}</div>${paymentSummary}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:28px;background:#00aaaa;color:#ffffff;font-family:Arial,Helvetica,sans-serif;text-align:left">
  <tr>
    <td style="padding:24px 28px;width:170px;vertical-align:middle;text-align:left">
      <img src="https://malagora.github.io/media/LOGO_FLAT_BLACK.png" width="150" alt="Mała Góra" style="display:block;width:150px;max-width:100%;height:auto;border:0">
    </td>
    <td style="padding:24px 28px 24px 0;vertical-align:middle;text-align:left;font-size:14px;line-height:1.45">
      <strong style="font-size:16px">Zespół weryfikacyjny Małej Góry</strong><br>
      Mała Góra | Odznaki<br>
      <a href="mailto:malagora.weryfikacja@vp.pl" style="color:#ffffff;text-decoration:underline">malagora.weryfikacja@vp.pl</a><br>
      <a href="https://malagora.github.io/odznaki" style="color:#ffffff;text-decoration:underline">malagora.github.io/odznaki</a>
    </td>
  </tr>
</table>
<p style="margin:10px 2px 0;color:#777777;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.45;text-align:left">Wiadomość może zawierać dane osobowe przeznaczone wyłącznie dla jej adresata. Jeżeli otrzymałeś ją omyłkowo, poinformuj nadawcę i usuń wiadomość.</p>`;
}

function mailPrice(value) {
  return `${Number(value || 0).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}

function formatBlikPhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('48')) digits = digits.slice(2);
  digits = digits.slice(0, 9);
  if (!digits) return '';
  return `+48 ${digits.match(/.{1,3}/g).join(' ')}`;
}

function blikPhoneForMessage() {
  const number = formatBlikPhone(elements.blikCheckCode.value);
  return /^\+48 \d{3} \d{3} \d{3}$/.test(number) ? number : '[UZUPEŁNIJ NUMER TELEFONU]';
}

function buildPaymentSummaryHtml() {
  if (!application || !['payment', 'voucher-price', 'pickup-details'].includes(elements.decision.value)) return '';
  const badgeCost = numeric(application.costs.badge) ?? 0;
  const shippingCost = numeric(application.costs.shipping) ?? 0;
  const codCost = numeric(application.costs.cod) ?? 0;
  const finalTotal = Number(elements.responseAmount.value || 0);
  const baseTotal = badgeCost + shippingCost + codCost;
  const adjustment = finalTotal - baseTotal;
  const rows = [
    ['Odznaka', badgeCost],
    [SHIPPING[application.shippingId]?.name || 'Dostawa', shippingCost]
  ];
  if (codCost) rows.push(['Płatność za pobraniem', codCost]);
  if (Math.abs(adjustment) >= 0.005) rows.push([elements.decision.value === 'voucher-price' ? 'Voucher / kod rabatowy' : 'Korekta ceny', adjustment]);
  const tableRows = rows.map(([label, value]) => `<tr><td style="padding:9px 12px;border-bottom:1px solid #dddddd;text-align:left">${escapeHtml(label)}</td><td style="padding:9px 12px;border-bottom:1px solid #dddddd;text-align:right;white-space:nowrap">${mailPrice(value)}</td></tr>`).join('');
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:24px;border:1px solid #dddddd;border-collapse:collapse;background:#ffffff;color:#171717;font-family:Arial,Helvetica,sans-serif;font-size:14px">
  <tr><th colspan="2" style="padding:12px;background:#eeeeee;text-align:left;font-size:15px">Podsumowanie płatności</th></tr>
  ${tableRows}
  <tr><td style="padding:12px;text-align:left;font-weight:bold">Suma do zapłaty</td><td style="padding:12px;text-align:right;font-weight:bold;white-space:nowrap">${mailPrice(finalTotal)}</td></tr>
</table>`;
}

async function copyFormattedEmail() {
  const button = elements.copyFormattedEmail;
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('HTML clipboard unavailable');
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([buildHtmlEmail()], { type: 'text/html' }),
      'text/plain': new Blob([elements.responseBody.value], { type: 'text/plain' })
    })]);
    const original = button.textContent;
    button.textContent = 'Skopiowano z formatowaniem';
    setTimeout(() => { button.textContent = original; }, 1800);
  } catch (error) {
    await copyText(elements.responseBody.value, button);
    window.alert('Przeglądarka nie pozwoliła skopiować wersji HTML. Skopiowano wiadomość w formie zwykłego tekstu.');
  }
}

function nodeText(parent, selector) {
  return parent?.querySelector(selector)?.textContent?.trim() || '-';
}

function childRows(parent, labels = {}) {
  if (!parent) return [];
  return [...parent.children].map(child => [labels[child.tagName.toLowerCase()] || child.tagName.toLowerCase(), child.textContent.trim() || '-']);
}

function parseXml(source) {
  const documentXml = new DOMParser().parseFromString(source, 'application/xml');
  if (documentXml.querySelector('parsererror')) throw new Error('Plik nie jest poprawnym dokumentem XML. Sprawdź, czy skopiowano całą treść zgłoszenia.');
  const root = documentXml.documentElement;
  if (root.tagName !== 'MALA-GORA-ZGLOSZENIE') throw new Error('Nie rozpoznano formatu. Oczekiwany element główny: MALA-GORA-ZGLOSZENIE.');

  const badgeNode = root.querySelector(':scope > odznaka');
  const winner = root.querySelector(':scope > zdobywca');
  const badgeData = root.querySelector(':scope > dane-odznaki');
  const shipping = root.querySelector(':scope > wysylka');
  const costs = root.querySelector(':scope > koszty');
  const consents = root.querySelector(':scope > zgody');
  const badgeId = badgeNode?.getAttribute('id') || '';

  return {
    version: root.getAttribute('wersja') || '-', badgeId, badgeName: badgeNode?.textContent.trim() || '-',
    winner: {
      firstName: nodeText(winner, 'imie'), lastName: nodeText(winner, 'nazwisko'), birthDate: nodeText(winner, 'data-urodzenia'),
      email: nodeText(winner, 'email'), phone: nodeText(winner, 'telefon')
    },
    badgeRows: childRows(badgeData, {
      startdate: 'Data rozpoczęcia', enddate: 'Data zakończenia',
      startdatetime: 'Data i godzina rozpoczęcia', enddatetime: 'Data i godzina zakończenia'
    }),
    shippingId: shipping?.getAttribute('metoda') || '-',
    shippingRows: childRows(shipping, {
      'kod-pocztowy': 'Kod pocztowy', miejscowosc: 'Miejscowość', ulica: 'Ulica', 'nr-domu': 'Nr domu',
      'nr-mieszkania': 'Nr mieszkania', paczkomat: 'Paczkomat', 'adres-paczkomatu': 'Adres Paczkomatu'
    }),
    payment: nodeText(root, ':scope > platnosc'), voucher: nodeText(root, ':scope > voucher-lub-kod-rabatowy'),
    costs: {
      badge: nodeText(costs, 'odznaka'), shipping: nodeText(costs, 'wysylka'), cod: nodeText(costs, 'pobranie'), total: nodeText(costs, 'razem')
    },
    consentRows: childRows(consents, {
      weryfikacja: 'Weryfikacja', 'informacja-rodo': 'Informacja RODO', inpost: 'InPost', 'niezbednosc-danych': 'Niezbędność danych'
    })
  };
}

function numeric(value) {
  const result = Number(String(value).replace(',', '.'));
  return Number.isFinite(result) ? result : null;
}

function validateApplication(data) {
  const results = [];
  const add = (type, text) => results.push({ type, text });
  if (data.version !== '1') add('warning', `Wersja formatu to „${data.version}”, a dekoder obsługuje wersję 1.`);
  if (!BADGES[data.badgeId]) add('error', 'Nie rozpoznano rodzaju odznaki.');
  ['firstName', 'lastName', 'birthDate', 'email', 'phone'].forEach(key => {
    if (!data.winner[key] || data.winner[key] === '-') add('error', `Brakuje wymaganej danej zdobywcy: ${key}.`);
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.winner.email)) add('error', 'Adres e-mail ma nieprawidłowy format.');
  if (!/^\+\d{1,3}(?: \d{3}){3}$/.test(data.winner.phone)) add('warning', 'Numer telefonu nie ma oczekiwanego formatu z numerem kierunkowym.');
  if (data.badgeRows.length < 2 || data.badgeRows.some(([, value]) => value === '-')) add('error', 'Brakuje dat rozpoczęcia lub zakończenia zdobywania odznaki.');
  if (data.badgeRows.length >= 2 && data.badgeRows[1][1] < data.badgeRows[0][1]) add('error', 'Data zakończenia jest wcześniejsza niż data rozpoczęcia.');
  if (!SHIPPING[data.shippingId]) add('error', 'Nie rozpoznano metody wysyłki.');
  if (!PAYMENT[data.payment]) add('error', 'Nie rozpoznano metody płatności.');

  const expectedShipping = SHIPPING[data.shippingId]?.price;
  const expectedCod = data.payment === 'cash-on-delivery' ? 5 : 0;
  const expectedTotal = expectedShipping === undefined ? null : 20 + expectedShipping + expectedCod;
  if (numeric(data.costs.badge) !== 20) add('warning', 'Koszt odznaki w zgłoszeniu różni się od ceny 20,00 zł.');
  if (expectedShipping !== undefined && numeric(data.costs.shipping) !== expectedShipping) add('warning', 'Koszt wysyłki nie zgadza się z wybraną metodą.');
  if (numeric(data.costs.cod) !== expectedCod) add('warning', 'Opłata za pobranie nie zgadza się z metodą płatności.');
  if (expectedTotal !== null && Math.abs((numeric(data.costs.total) ?? -1) - expectedTotal) > .001) add('warning', 'Suma w zgłoszeniu nie zgadza się z wyliczeniem dekodera.');
  if (!data.consentRows.some(([label, value]) => label === 'Informacja RODO' ? value === 'tak' : label === 'Weryfikacja' && value === 'tak')) add('warning', 'Brakuje potwierdzenia zapoznania się z informacją RODO.');
  if (!results.length) add('success', 'Struktura i podstawowe dane zgłoszenia są poprawne.');
  return results;
}

function formatPrice(value) {
  const number = numeric(value);
  return number === null ? value : `${number.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}

function showStep(name) {
  const order = ['import', 'review', 'response'];
  const index = order.indexOf(name);
  currentView = name;
  elements.importPanel.hidden = name !== 'import';
  elements.reviewPanel.hidden = name !== 'review';
  elements.responsePanel.hidden = name !== 'response';
  elements.steps.forEach((step, stepIndex) => {
    step.classList.toggle('is-active', stepIndex === index);
    step.classList.toggle('is-complete', stepIndex < index);
  });
  elements.app.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function appendGroup(title, rows) {
  const section = document.createElement('section');
  section.className = 'decoded-group';
  const heading = document.createElement('h4');
  heading.textContent = title;
  const list = document.createElement('dl');
  rows.forEach(([label, value]) => {
    const row = document.createElement('div'); row.className = 'decoded-row';
    const term = document.createElement('dt'); term.textContent = label;
    const description = document.createElement('dd'); description.textContent = value || '-';
    row.append(term, description); list.append(row);
  });
  section.append(heading, list); elements.decodedGroups.append(section);
}

function renderReview(data) {
  const validation = validateApplication(data);
  const errors = validation.filter(item => item.type === 'error').length;
  const warnings = validation.filter(item => item.type === 'warning').length;
  elements.app.dataset.badge = data.badgeId;
  elements.reviewTitle.textContent = BADGES[data.badgeId]?.name || data.badgeName;
  elements.structureStatus.className = `structure-status ${errors ? 'is-invalid' : warnings ? 'has-warnings' : 'is-valid'}`;
  elements.structureStatus.textContent = errors ? `${errors} błędów` : warnings ? `${warnings} ostrzeżeń` : 'Struktura poprawna';
  elements.validationList.replaceChildren(...validation.map(item => {
    const li = document.createElement('li'); li.className = item.type; li.textContent = item.text; return li;
  }));
  elements.decodedGroups.replaceChildren();
  appendGroup('Dane zdobywcy', [
    ['Imię i nazwisko', `${data.winner.firstName} ${data.winner.lastName}`], ['Data urodzenia', data.winner.birthDate],
    ['E-mail', data.winner.email], ['Telefon', data.winner.phone]
  ]);
  appendGroup('Dane odznaki', [['Rodzaj', BADGES[data.badgeId]?.name || data.badgeName], ...data.badgeRows]);
  appendGroup('Wysyłka', [['Metoda', SHIPPING[data.shippingId]?.name || data.shippingId], ...data.shippingRows.filter(([, value]) => value !== '-')]);
  appendGroup('Płatność i koszty', [
    ['Płatność', PAYMENT[data.payment] || data.payment], ['Voucher/kod', data.voucher], ['Odznaka', formatPrice(data.costs.badge)],
    ['Wysyłka', formatPrice(data.costs.shipping)], ['Pobranie', formatPrice(data.costs.cod)], ['Razem', formatPrice(data.costs.total)]
  ]);
  appendGroup('Zgody i potwierdzenia', data.consentRows);
  elements.steps[1].disabled = false;
  elements.saveState.disabled = false;
  showStep('review');
}

async function readFile(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) throw new Error('Plik jest zbyt duży. Maksymalny rozmiar zgłoszenia to 2 MB.');
  elements.fileName.textContent = file.name;
  elements.source.value = await file.text();
}

function decode() {
  elements.error.hidden = true;
  try {
    const source = elements.source.value.trim();
    if (!source) throw new Error('Wybierz plik albo wklej treść zgłoszenia.');
    application = parseXml(source);
    document.dispatchEvent(new Event('workspace:new-case'));
    renderReview(application);
  } catch (error) {
    elements.error.textContent = error.message;
    elements.error.hidden = false;
  }
}

function responseTemplate() {
  if (!application) return;
  const pickupEligible = application.shippingId === 'personal-pickup' && application.payment === 'cash';
  elements.pickupDetailsOption.disabled = !pickupEligible;
  elements.pickupDetailsOption.hidden = !pickupEligible;
  if (elements.decision.value === 'pickup-details' && !pickupEligible) elements.decision.value = 'accepted';
  const badge = BADGES[application.badgeId] || { code: application.badgeId, name: application.badgeName };
  const greeting = `Witaj, ${application.winner.firstName}!`;
  const notes = elements.notes.value.trim();
  const number = elements.issuedNumber.value.trim();
  const paymentMessage = elements.decision.value === 'payment';
  const voucherMessage = elements.decision.value === 'voucher-price';
  const pickupMessage = elements.decision.value === 'pickup-details';
  elements.responseAmountField.hidden = !paymentMessage && !voucherMessage && !pickupMessage;
  elements.pickupAddressField.hidden = !pickupMessage;
  const isBlikMessage = (paymentMessage || voucherMessage) && application.payment === 'blik';
  elements.blikCheckField.hidden = !isBlikMessage;
  if (isBlikMessage && !elements.blikCheckCode.value) elements.blikCheckCode.value = '+48 ';
  const originalTotal = numeric(application.costs.total) ?? 0;
  if ((paymentMessage || voucherMessage || pickupMessage) && !elements.responseAmount.value) elements.responseAmount.value = originalTotal.toFixed(2);
  elements.responseAmountLabel.textContent = voucherMessage ? 'Nowa kwota do zapłaty' : 'Kwota do zapłaty';
  elements.responseAmountHint.textContent = voucherMessage
    ? `Kod/voucher ze zgłoszenia: ${application.voucher || '—'}. Cena pierwotna: ${formatPrice(application.costs.total)}.`
    : pickupMessage ? 'Kwota należna gotówką podczas odbioru osobistego.' : `Metoda wybrana w zgłoszeniu: ${PAYMENT[application.payment] || application.payment}.`;
  const amount = Number(elements.responseAmount.value || 0).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const extraInformation = notes ? `\n\n${notes}` : '';
  const badgeCost = numeric(application.costs.badge) ?? 0;
  const shippingCost = numeric(application.costs.shipping) ?? 0;
  const codCost = numeric(application.costs.cod) ?? 0;
  const finalAmount = Number(elements.responseAmount.value || 0);
  const adjustment = finalAmount - badgeCost - shippingCost - codCost;
  const paymentRows = [
    `Odznaka: ${mailPrice(badgeCost)}`,
    `${SHIPPING[application.shippingId]?.name || 'Dostawa'}: ${mailPrice(shippingCost)}`,
    ...(codCost ? [`Płatność za pobraniem: ${mailPrice(codCost)}`] : []),
    ...(Math.abs(adjustment) >= 0.005 ? [`${voucherMessage ? 'Voucher / kod rabatowy' : 'Korekta ceny'}: ${mailPrice(adjustment)}`] : []),
    `SUMA DO ZAPŁATY: ${mailPrice(finalAmount)}`
  ].join('\n');
  const paymentInstruction = application.payment === 'blik'
    ? `\n\nNumer do przelewu na telefon BLIK: ${blikPhoneForMessage()}.\nNie podawaj tego numeru dalej ani nie udostępniaj go osobom trzecim.\nProsimy o przesłanie należności na powyższy numer.`
    : application.payment === 'cash-on-delivery'
      ? `\n\nŁączna suma do zapłaty przy odbiorze wynosi ${amount} zł. Należność należy przekazać kurierowi.`
      : '';
  const fulfillmentInformation = application.shippingId === 'personal-pickup'
    ? 'W kolejnej wiadomości skontaktujemy się w sprawie miejsca i terminu odbioru odznaki.'
    : application.payment === 'cash-on-delivery'
      ? 'Odznaka zostanie wysłana zgodnie z wybraną formą dostawy, a płatność zostanie pobrana przy doręczeniu.'
      : 'Po zaksięgowaniu opłaty odznaka zostanie wysłana zgodnie z wybraną formą dostawy.';
  const pickupInformation = elements.pickupAddress.value.trim() || '[UZUPEŁNIJ ADRES, MIEJSCE LUB TERMIN ODBIORU]';
  const templates = {
    accepted: `${greeting}\n\nZgłoszenie dotyczące odznaki ${badge.name} zostało pozytywnie zweryfikowane.${number ? `\nNumer przyznanej odznaki: ${number}.` : ''}\n\n${notes || 'Dalsze informacje dotyczące płatności i przekazania odznaki prześlemy w osobnej wiadomości.'}\n\n${MAIL_SIGNATURE}`,
    supplement: `${greeting}\n\nDo zakończenia weryfikacji zgłoszenia dotyczącego odznaki ${badge.name} potrzebujemy uzupełnienia danych lub materiałów.\n\n${notes || '[Wpisz, co należy uzupełnić.]'}\n\nProsimy o odpowiedź na tę wiadomość i przesłanie brakujących informacji.\n\n${MAIL_SIGNATURE}`,
    rejected: `${greeting}\n\nZgłoszenie dotyczące odznaki ${badge.name} nie mogło zostać pozytywnie zweryfikowane.\n\n${notes || '[Wpisz uzasadnienie decyzji.]'}\n\nW razie pytań prosimy o odpowiedź na tę wiadomość.\n\n${MAIL_SIGNATURE}`,
    payment: `${greeting}\n\nZgłoszenie dotyczące odznaki ${badge.name} zostało rozpatrzone. Poniżej przedstawiamy informacje dotyczące płatności.\n\nWybrana metoda płatności: ${PAYMENT[application.payment] || application.payment}.\nWybrana forma dostawy: ${SHIPPING[application.shippingId]?.name || application.shippingName}.\n\nPODSUMOWANIE PŁATNOŚCI\n${paymentRows}${paymentInstruction}${extraInformation}\n\n${fulfillmentInformation} W razie pytań prosimy o odpowiedź na tę wiadomość.\n\n${MAIL_SIGNATURE}`,
    'voucher-price': `${greeting}\n\nKod rabatowy lub voucher podany w zgłoszeniu dotyczącym odznaki ${badge.name} został rozpatrzony. Nowa kwota do zapłaty wynosi ${amount} zł.\n\nKod/voucher: ${application.voucher || '—'}\nWybrana metoda płatności: ${PAYMENT[application.payment] || application.payment}.\n\nPODSUMOWANIE PŁATNOŚCI\n${paymentRows}${paymentInstruction}${extraInformation}\n\n${fulfillmentInformation} W razie pytań prosimy o odpowiedź na tę wiadomość.\n\n${MAIL_SIGNATURE}`,
    'pickup-details': `${greeting}\n\nOdznaka ${badge.name} jest gotowa do odbioru osobistego. Poniżej przekazujemy informacje dotyczące odbioru:\n\n${pickupInformation}\n\nPłatność zostanie przyjęta gotówką podczas odbioru.\n\nPODSUMOWANIE PŁATNOŚCI\n${paymentRows}${extraInformation}\n\nW razie pytań lub potrzeby zmiany terminu prosimy o odpowiedź na tę wiadomość.\n\n${MAIL_SIGNATURE}`
  };
  const labels = { accepted: 'zaakceptowane', supplement: 'wymaga uzupełnienia', rejected: 'odrzucone', payment: 'informacja o płatności', 'voucher-price': 'nowa cena', 'pickup-details': 'odbiór osobisty' };
  elements.recipient.value = application.winner.email;
  elements.responseSubject.value = `Mała Góra – ${badge.code} – zgłoszenie ${labels[elements.decision.value]}`;
  elements.responseBody.value = templates[elements.decision.value];
  elements.openEmail.href = `mailto:${encodeURIComponent(application.winner.email)}?subject=${encodeURIComponent(elements.responseSubject.value)}&body=${encodeURIComponent(elements.responseBody.value)}`;
  elements.databaseGenerator.hidden = elements.decision.value !== 'accepted';
}

function localDateTimeValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function normalizeAchievementDate(value) {
  if (!value || value === '-') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00`;
  return value.slice(0, 16);
}

function initializeDatabaseGenerator() {
  if (!elements.reviewedAt.value) elements.reviewedAt.value = localDateTimeValue();
  if (!elements.issuedAt.value) elements.issuedAt.value = localDateTimeValue();
  if (!elements.achievementStart.value) elements.achievementStart.value = normalizeAchievementDate(application.badgeRows[0]?.[1]);
  if (!elements.achievementEnd.value) elements.achievementEnd.value = normalizeAchievementDate(application.badgeRows[1]?.[1]);
  if (!elements.issuedNumber.value && BADGE_LETTERS[application.badgeId]) {
    const letter = BADGE_LETTERS[application.badgeId];
    const responseBeforeSuggestion = elements.responseBody.value;
    fetch('badges.json', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(database => {
        if (elements.issuedNumber.value) return;
        const highest = database.badges
          .filter(record => record.id.startsWith(`MG-${letter}`))
          .reduce((maximum, record) => Math.max(maximum, Number(record.id.slice(-4)) || 0), 0);
        elements.issuedNumber.value = `MG-${letter}${String(highest + 1).padStart(4, '0')}`;
        if (elements.responseBody.value === responseBeforeSuggestion) responseTemplate();
      })
      .catch(() => {});
  }
}

function isoDate(localValue) {
  const date = new Date(localValue);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function generateDatabaseRecord() {
  elements.recordMessage.hidden = true;
  const expectedLetter = BADGE_LETTERS[application.badgeId];
  const id = elements.issuedNumber.value.trim().toUpperCase();
  elements.issuedNumber.value = id;
  elements.issuedNumber.setCustomValidity('');
  if (!expectedLetter || !new RegExp(`^MG-${expectedLetter}\\d{4}$`).test(id)) {
    elements.issuedNumber.setCustomValidity(`Wpisz identyfikator w formacie MG-${expectedLetter || 'X'}####.`);
    elements.issuedNumber.reportValidity();
    elements.issuedNumber.focus();
    return;
  }

  const requiredDates = [elements.reviewedAt, elements.issuedAt, elements.achievementStart, elements.achievementEnd];
  const invalidDate = requiredDates.find(field => !field.value);
  if (invalidDate) { invalidDate.reportValidity(); invalidDate.focus(); return; }
  elements.achievementEnd.setCustomValidity('');
  if (elements.achievementEnd.value < elements.achievementStart.value) {
    elements.achievementEnd.setCustomValidity('Zakończenie nie może być wcześniejsze niż rozpoczęcie.');
    elements.achievementEnd.reportValidity(); elements.achievementEnd.focus(); return;
  }
  elements.issuedAt.setCustomValidity('');
  if (elements.issuedAt.value < elements.reviewedAt.value) {
    elements.issuedAt.setCustomValidity('Data wydania nie może być wcześniejsza niż rozpatrzenie weryfikacji.');
    elements.issuedAt.reportValidity(); elements.issuedAt.focus(); return;
  }

  currentDatabaseRecord = {
    id,
    badgeType: application.badgeId,
    holder: {
      firstInitial: Array.from(application.winner.firstName.trim())[0]?.toLocaleUpperCase('pl-PL') || '',
      firstLength: Array.from(application.winner.firstName.trim()).length,
      lastInitial: Array.from(application.winner.lastName.trim())[0]?.toLocaleUpperCase('pl-PL') || '',
      lastLength: Array.from(application.winner.lastName.trim()).length
    },
    issuedAt: isoDate(elements.issuedAt.value),
    reviewedAt: isoDate(elements.reviewedAt.value),
    achievementStart: isoDate(elements.achievementStart.value),
    achievementEnd: isoDate(elements.achievementEnd.value),
    status: elements.recordStatus.value,
    updatedAt: new Date().toISOString()
  };
  elements.generatedLogin.value = id;
  elements.generatedPassword.value = id.slice(3);
  elements.recordOutput.value = JSON.stringify(currentDatabaseRecord, null, 2);
  elements.generatedRecord.hidden = false;
  elements.generatedRecord.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function databaseDraft() {
  return {
    reviewedAt: elements.reviewedAt.value, issuedAt: elements.issuedAt.value,
    achievementStart: elements.achievementStart.value, achievementEnd: elements.achievementEnd.value,
    status: elements.recordStatus.value, record: currentDatabaseRecord
  };
}

function collectState() {
  return {
    format: 'MALA-GORA-CASE-STATE', version: 1, savedAt: new Date().toISOString(),
    xmlSource: elements.source.value, currentView,
    decision: elements.decision.value, issuedNumber: elements.issuedNumber.value, notes: elements.notes.value, responseAmount: elements.responseAmount.value, blikCheckCode: elements.blikCheckCode.value, pickupAddress: elements.pickupAddress.value,
    responseSubject: elements.responseSubject.value, responseBody: elements.responseBody.value,
    databaseDraft: databaseDraft()
  };
}

function showStateStatus(message, isError = false) {
  elements.stateStatus.textContent = message;
  elements.stateStatus.className = `state-status${isError ? ' is-error' : ''}`;
  elements.stateStatus.hidden = false;
}

function restoreState(state) {
  elements.source.value = state.xmlSource;
  application = parseXml(state.xmlSource);
  renderReview(application);
  elements.decision.value = ['accepted', 'supplement', 'rejected', 'payment', 'voucher-price', 'pickup-details'].includes(state.decision) ? state.decision : 'accepted';
  elements.issuedNumber.value = state.issuedNumber || '';
  elements.notes.value = state.notes || '';
  elements.responseAmount.value = state.responseAmount || '';
  elements.blikCheckCode.value = formatBlikPhone(state.blikCheckCode || '');
  elements.pickupAddress.value = state.pickupAddress || '';
  elements.steps[2].disabled = false;
  responseTemplate();
  initializeDatabaseGenerator();
  if (state.databaseDraft) {
    elements.reviewedAt.value = state.databaseDraft.reviewedAt || elements.reviewedAt.value;
    elements.issuedAt.value = state.databaseDraft.issuedAt || elements.issuedAt.value;
    elements.achievementStart.value = state.databaseDraft.achievementStart || elements.achievementStart.value;
    elements.achievementEnd.value = state.databaseDraft.achievementEnd || elements.achievementEnd.value;
    elements.recordStatus.value = state.databaseDraft.status || 'valid';
    currentDatabaseRecord = state.databaseDraft.record || null;
    if (currentDatabaseRecord) {
      elements.generatedLogin.value = currentDatabaseRecord.id;
      elements.generatedPassword.value = currentDatabaseRecord.id.slice(3);
      elements.recordOutput.value = JSON.stringify(currentDatabaseRecord, null, 2);
      elements.generatedRecord.hidden = false;
    }
  }
  if (state.responseSubject) elements.responseSubject.value = state.responseSubject;
  if (state.responseBody) elements.responseBody.value = state.responseBody;
  elements.openEmail.href = `mailto:${encodeURIComponent(elements.recipient.value)}?subject=${encodeURIComponent(elements.responseSubject.value)}&body=${encodeURIComponent(elements.responseBody.value)}`;
  showStep(state.currentView === 'response' ? 'response' : 'review');
}

async function copyText(value, button) {
  try { await navigator.clipboard.writeText(value); }
  catch { const area = document.createElement('textarea'); area.value = value; document.body.append(area); area.select(); document.execCommand('copy'); area.remove(); }
  const old = button.textContent; button.textContent = 'Skopiowano'; setTimeout(() => { button.textContent = old; }, 1500);
}

elements.file.addEventListener('change', async () => {
  try { await readFile(elements.file.files[0]); elements.error.hidden = true; }
  catch (error) { elements.error.textContent = error.message; elements.error.hidden = false; }
});
['dragenter', 'dragover'].forEach(type => elements.drop.addEventListener(type, event => { event.preventDefault(); elements.drop.classList.add('is-dragging'); }));
['dragleave', 'drop'].forEach(type => elements.drop.addEventListener(type, event => { event.preventDefault(); elements.drop.classList.remove('is-dragging'); }));
elements.drop.addEventListener('drop', async event => { try { await readFile(event.dataTransfer.files[0]); } catch (error) { elements.error.textContent = error.message; elements.error.hidden = false; } });
elements.decode.addEventListener('click', decode);
elements.loadAnother.addEventListener('click', () => showStep('import'));
elements.goToResponse.addEventListener('click', () => { elements.steps[2].disabled = false; responseTemplate(); initializeDatabaseGenerator(); showStep('response'); });
elements.backToReview.addEventListener('click', () => showStep('review'));
[elements.decision, elements.issuedNumber, elements.notes, elements.responseAmount, elements.pickupAddress].forEach(field => field.addEventListener('input', responseTemplate));
elements.blikCheckCode.addEventListener('input', () => {
  elements.blikCheckCode.value = formatBlikPhone(elements.blikCheckCode.value);
  responseTemplate();
});
elements.copySubject.addEventListener('click', () => copyText(elements.responseSubject.value, elements.copySubject));
elements.copyBody.addEventListener('click', () => copyText(elements.responseBody.value, elements.copyBody));
elements.copyFormattedEmail.addEventListener('click', copyFormattedEmail);
elements.responseBody.addEventListener('input', () => {
  elements.openEmail.href = `mailto:${encodeURIComponent(elements.recipient.value)}?subject=${encodeURIComponent(elements.responseSubject.value)}&body=${encodeURIComponent(elements.responseBody.value)}`;
});
elements.issuedNumber.addEventListener('input', () => {
  elements.issuedNumber.value = elements.issuedNumber.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 8);
  elements.issuedNumber.setCustomValidity('');
  currentDatabaseRecord = null;
  elements.generatedRecord.hidden = true;
});
[elements.reviewedAt, elements.issuedAt, elements.achievementStart, elements.achievementEnd, elements.recordStatus].forEach(field => {
  field.addEventListener('input', () => { currentDatabaseRecord = null; elements.generatedRecord.hidden = true; field.setCustomValidity(''); });
});
elements.generateRecord.addEventListener('click', generateDatabaseRecord);
elements.copyRecord.addEventListener('click', () => copyText(elements.recordOutput.value, elements.copyRecord));
elements.downloadDatabase.addEventListener('click', async () => {
  elements.recordMessage.hidden = true;
  if (!currentDatabaseRecord) generateDatabaseRecord();
  if (!currentDatabaseRecord) return;
  try {
    const response = await fetch('badges.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Nie udało się pobrać bieżącej bazy.');
    const database = await response.json();
    if (database.badges.some(record => record.id === currentDatabaseRecord.id)) throw new Error('W bazie istnieje już odznaka o tym identyfikatorze.');
    database.badges.push(currentDatabaseRecord);
    database.updatedAt = new Date().toISOString();
    const url = URL.createObjectURL(new Blob([JSON.stringify(database, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'badges.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    elements.recordMessage.textContent = 'Pobrano nową wersję badges.json. Zastąp nią plik w folderze tech.';
    elements.recordMessage.className = 'record-message'; elements.recordMessage.hidden = false;
  } catch (error) {
    elements.recordMessage.textContent = error.message;
    elements.recordMessage.className = 'record-message is-error'; elements.recordMessage.hidden = false;
  }
});
elements.saveState.addEventListener('click', () => {
  if (application && window.MGWorkspace) window.MGWorkspace.saveCase();
});
elements.steps.forEach(step => step.addEventListener('click', () => { if (!step.disabled) showStep(step.dataset.openStep); }));
elements.clear.addEventListener('click', () => {
  application = null; elements.file.value = ''; elements.source.value = ''; elements.fileName.textContent = 'Obsługiwane pliki: .xml i .txt';
  elements.error.hidden = true; elements.decodedGroups.replaceChildren(); elements.validationList.replaceChildren(); elements.notes.value = ''; elements.issuedNumber.value = '';
  elements.recipient.value = ''; elements.responseSubject.value = ''; elements.responseBody.value = ''; elements.responseAmount.value = ''; elements.responseAmountField.hidden = true; elements.blikCheckCode.value = ''; elements.blikCheckField.hidden = true; elements.pickupAddress.value = ''; elements.pickupAddressField.hidden = true; elements.app.dataset.badge = '';
  elements.reviewedAt.value = ''; elements.issuedAt.value = ''; elements.achievementStart.value = ''; elements.achievementEnd.value = '';
  elements.recordStatus.value = 'valid'; elements.generatedRecord.hidden = true; elements.recordOutput.value = ''; currentDatabaseRecord = null;
  elements.steps[1].disabled = true; elements.steps[2].disabled = true; elements.saveState.disabled = true;
  elements.stateStatus.hidden = true; showStep('import');
  document.dispatchEvent(new Event('workspace:new-case'));
});
