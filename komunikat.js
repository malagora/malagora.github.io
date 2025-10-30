// === WYBÓR TEKSTU ===
const selectedText = 8; // 1-słońce 2-wiatr 3-deszcz 4-śnieg 5-błoto 6-deszcz&wiatr 7-śnieżyca 8-błoto&wiatr
const moreTxt = "<br>Wezbrana woda porwała kładkę do parku. Przejście tym sposobem NIE JEST MOŻLIWE!<br>"; //<br>...<br>

// ⛔ ZAMKNIĘTE SZLAKI
const zamknieteSzlaki = [
  "<p>Od 23 października do 31 października, z powodu remontu – szlak czerwony – „Sarnia Perć”, na odcinku Kacze Skałki – Szare Skałki – Białe Skałki – Sosnowe Skałki.</p>",
  "<p>Od 1 września do odwołania, z powodu remontu – szlak żółty, na odcinku Złote Skałki – Kopa pod Mrozówką – Stara Mrozówka.</p>",
  "<p>Od 1 marca do odwołania, z powodu ochrony przyrody – szlak czerwony – Ścieżka wokół Bobrowiska, na całym odcinku.</p>"
];

// ⚠ UTRUDNIENIA
const utrudnienia = [
  "<p><b style='font-weight: 600;'>Powódź porwała kładkę do Małej Góry.</b> Przejście do parku tym wariantem jest obecnie niemożliwe!</p>",
  "<p>Podczas wiatru na szlaki mogą spadać gałęzie – zachowaj czujność!</p>",
  "<p>Szlaki przebiegające od południowej strony prowadzą po terenach osuwiskowych, co może powodować samoistne osuwanie się szlaków.</p>",
  "<p>Na odcinkach ubezpieczonych w łańcuchy stosuj <a href='#zalecenia'>zalecenia</a> dotyczące korzystania z nich.</p>",
  "<p>Na szlaku żółtym – ścieżka łącznikowa przy Bobrowisku, mogą występować utrudnienia z powodu złego stanu technicznego szlaku.</p>",
  "<p>Na szlaku żółtym odejściowym – Punkt Widokowy „Dolina Kamionki”, mogą występować utrudnienia z powodu złego stanu technicznego szlaku.</p>",
  "<p>Na szlaku czerwonym – „Sarnia Perć”, mogą występować utrudnienia z powodu złego stanu oznaczeń szlaku, co może powodować zabłądzenie oraz powalonych drzew.</p>",
  "<p><i>Mapę z aktualnymi zamknięciami i utrudnieniami znajdziesz <a href='/mapa'>tutaj</a>.</i></p>"
];

// ℹ Informacje dodatkowe:
const informacje = [
  "<p>Przejście przez rzekę możliwe jest tylko przy niskim stanie wody. W takim przypadku możliwe jest wejście od strony Kamionki Małej.</p>",
  "<p>Na szlaku zielonym od strony Jamnicy zalega błoto, które może utrudniać przejście.</p>",
  "<p>Na Sarniej Perci obowiązuje ruch jednokierunkowy!</p>",
  "<p>Zwróć uwagę na <b style='font-weight: 600;'>nowy przebieg „Sarniej Perci”</b>: Srebrne Skałki – <b style='font-weight: 600;'>Małe Skałki</b> – Kacze Skałki</p>"
];

// === LISTA TEKSTÓW ===
const texts = [
  "Pogoda zachęca do pieszych wędrówek.",
  "Silny wiatr – uwaga na spadające gałęzie.",
  "Na szlakach mokro i ślisko.",
  "Spadł śnieg – zachowaj ostrożność!",
  "Na szlakach zalega błoto.",
  "Na szlakach mokro i ślisko. Wieje silny wiatr.",
  "Intensywne opady śniegu.",
  "Na szlakach zalega błoto. Wieje silny wiatr.",
];

const komunikaty = [
  "Warunki na szlakach zachęcają do aktywnego wypoczynku. Szlaki są suche, świeci słońce. Należy jednak pamiętać o zachowaniu bezpieczeństwa.",
  "Warunki nie są bezpieczne – wieje silny wiatr, który może powodować łamanie się gałęzi. Jeśli nie musisz wyjść – zostań w domu.",
  "Na szlakach jest mokro i ślisko. W skutek opadu deszczu tworzy się błoto, które w eksponowanym terenie może prowadzić do upadku z wysokości.<br>Poruszanie się w takich warunkach wymaga zachowania ostrożności.",
  "Szlaki pokrywa warstwa śniegu, co może zmniejszać przyczepność do podłoża, zaś w niektórych miejscach mogą tworzyć się oblodzenia.<br>Poruszanie się w takich warunkach wymaga stosowania szczególnej ostrożności. Zachęcamy do zabrania ze sobą odpowiedzniego sprzętu lub korzystanie z bezpieczniejszych tras.",
  "Po opadach deszczu na szlakach zalega błoto, które w eksponowanym terenie może spowodować upadek z wysokości.<br>Poruszanie się w takich warunkach wymaga zachowania ostrożności.",
  "Na szlakach jest mokro i ślisko. W skutek opadu deszczu tworzy się błoto, które w eksponowanym terenie może prowadzić do upadku z wysokości.<br>Dodatkowo występują silne podmuchy wiatru, które mogą powodować łamanie się gałęzi.<br>Poruszanie się w takich warunkach wymaga zachowania ostrożności.",
  "Intensywne opady śniegu. Nie wychodź na szlak podczas śnieżycy!<br>Warunki są bardzo wymagające, zaś długotrwała ekspozycja na zimno może powodować utratę świadomości. W takich warunkach lepiej pozostać na kwaterze.<br>Dodatkowo występują silne podmuchy wiatru, które mogą powodować łamanie się gałęzi.<br>Poruszanie się w takich warunkach wymaga stosowania szczególnej ostrożności. Zachęcamy do zabrania ze sobą odpowiedzniego sprzętu, jednakże <b style='font-weight: 600;'>ODRADZAMY wyjście w takich warunkach!</b>",
  "Po opadach deszczu na szlakach zalega błoto, które w eksponowanym terenie może spowodować upadek z wysokości.<br>Dodatkowo występują silne podmuchy wiatru, które mogą powodować łamanie się gałęzi.<br>Poruszanie się w takich warunkach wymaga zachowania ostrożności.",
];

const standardTxt = "<br>Poruszając się po szlakach stosuj się do niżej wymienionych zasad i zaleceń.<br>";
const endTxt = "<br>Przed wyjściem na szlak dowiedz się, gdzie aktualnie prowadzone są prace remontowe lub występują zamknięcia szlaków oraz utrudnienia.";

// === AUTOMATYCZNE WYŚWIETLANIE DATY ===
const months = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia"
];

const today = new Date();
const day = today.getDate();
const month = months[today.getMonth()];
const year = today.getFullYear();
const dateText = `${day} ${month} ${year}`;

// === GENEROWANIE TREŚCI ===
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("current-conditions");
  if (!container) return;

  const chosenText = texts[selectedText - 1] || "Error 500";

  const information = document.getElementById("current-conditions");
  if (!information) return;

  const komunikatC = komunikaty[selectedText - 1] || "Error 500";

  const komunikat = `${komunikatC}${standardTxt}${moreTxt}${endTxt}`;


  document.getElementById("current-conditions").innerHTML = `${chosenText}`;
  document.getElementById("current-date").innerHTML = `${dateText}`;
  document.getElementById("komunikat").innerHTML = `${komunikat}`;
});


document.addEventListener("DOMContentLoaded", () => {
    const lClosed = document.getElementById("list-closed");

    // Wyczyść poprzednią zawartość
    lClosed.innerHTML = "";

    if (!Array.isArray(zamknieteSzlaki) || zamknieteSzlaki.length === 0) {
      // Brak danych
      lClosed.innerHTML = "<li><i>Brak aktualnych zamknięć szlaków.</i></li>";
    } else {
      // Dodaj każdy element do listy
      zamknieteSzlaki.forEach(szlak => {
        const li = document.createElement("li");
        li.innerHTML = szlak; // zachowuje formatowanie HTML z <p>
        lClosed.appendChild(li);
      });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const lWarning = document.getElementById("list-warning");

    // Wyczyść poprzednią zawartość
    lWarning.innerHTML = "";

    if (!Array.isArray(utrudnienia) || utrudnienia.length === 0) {
      // Brak danych
      lWarning.innerHTML = "<li><i>Brak aktualnych zamknięć szlaków.</i></li>";
    } else {
      // Dodaj każdy element do listy
      utrudnienia.forEach(szlakB => {
        const li = document.createElement("li");
        li.innerHTML = szlakB;
        lWarning.appendChild(li);
      });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const lInformacje = document.getElementById("list-informacje");

    // Wyczyść poprzednią zawartość
    lInformacje.innerHTML = "";

    if (!Array.isArray(informacje) || informacje.length === 0) {
      // Brak danych
      lInformacje.innerHTML = "<li><i>Brak aktualnych zamknięć szlaków.</i></li>";
    } else {
      // Dodaj każdy element do listy
      informacje.forEach(szlakB => {
        const li = document.createElement("li");
        li.innerHTML = szlakB;
        lInformacje.appendChild(li);
      });
    }
});
