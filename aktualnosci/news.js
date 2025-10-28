// === IMPORT POSTÓW ===
let newsData = []; // globalna zmienna do przechowania danych

// Funkcja główna do ładowania JSON-a
async function loadNewsData() {
  try {
    const response = await fetch('/aktualnosci/post.json');
    newsData = await response.json();

    console.log("Załadowano dane:", newsData);

    initializeNews(); // start dopiero po wczytaniu danych
  } catch (error) {
    console.error("Błąd ładowania pliku JSON:", error);
  }
}

// === Ustawienia ===
let visibleCount = 12;
let sortOrder = "newest";

// === Elementy DOM ===
const gallery = document.getElementById("newsGallery");
const postContainer = document.getElementById("singlePost");
const countInfo = document.getElementById("newsCount");
const loadMoreBtn = document.getElementById("loadMore");
const sortSelect = document.getElementById("sortSelect");
const BarInfo = document.getElementById("showedBar");

// === Odczyt parametru z URL ===
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("post");

// === Widok pojedynczego posta ===
function renderSinglePost(post) {
  document.querySelector(".news-header")?.style.setProperty("display", "none");
  document.querySelector(".news-footer")?.style.setProperty("display", "none");
  document.querySelector(".banner-short")?.style.setProperty("display", "none");
  document.getElementById("breadcrumbList")?.style.setProperty("display", "none");
  gallery.style.display = "none";

  // ======= Wybór 3 podobnych lub najnowszych postów =======
  const normalize = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const currentTitle = normalize(post.title);
  let similarPosts = newsData
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      ...p,
      similarity: currentTitle
        .split(" ")
        .filter((word) => normalize(p.title).includes(word)).length,
    }));

  similarPosts.sort((a, b) => b.similarity - a.similarity);

  if (similarPosts[0]?.similarity === 0) {
    similarPosts = newsData
      .filter((p) => p.id !== post.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const recommended = similarPosts.slice(0, 3);

  // ======= Generowanie zawartości =======
  postContainer.innerHTML = `
  <div id="top"></div>
  <section class="banner" style="margin: 0;">
      <div class="banner-image" style="background-image: url('${post.image}');"></div>
      <div class="banner-text">
          <div class="banner-text-content">
              <h1>${post.title}</h1>
              <p>${new Date(post.date).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</p>
          </div>
          <a href="#First">
            <p class="f-dArrow"><i class="fa fa-long-arrow-down" aria-hidden="true"></i></p>
            <p class="f-dText">PRZEWIŃ DALEJ</p>
          </a>
      </div>
  </section>

  <section id="First" class="post">
      <div class="breadcrumb">
          <ol class="breadcrumb_list">
              <li class="breadcrumb_item"><a href="/">Strona główna</a></li>
              <li class="breadcrumb_item breadcrumb_item--before"><a href="/aktualnosci">Aktualności</a></li>
              <li class="breadcrumb_item breadcrumb_item--before breadcrumb_item-active">
                <a href="/aktualnosci?post=${post.id}">
                  ${new Date(post.date).toLocaleDateString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </a>
              </li>
          </ol>
      </div>

      <div class="post_content">
          <header>${post.title.toUpperCase()}</header>
          ${post.content}
      </div>

      ${
        recommended.length
          ? `
      <div class="related-posts post_content" style="margin-bottom: 100px;">
          <header>TE AKTUALNOŚCI MOGĄ CIĘ ZAINTERESOWAĆ</header>
          <div class="related-posts-grid">
              ${recommended
                .map(
                  (r) => `
              <a class="related-post" href="/aktualnosci?post=${r.id}">
                <div class="related-img" style="background-image: url('${r.image}')"></div>
                <div class="related-text">
                  <h1>${r.title}</h1>
                  <div class="related-date">
                    ${new Date(r.date).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div class="related-arrow">➔</div>
                </div>
              </a>
              `
                )
                .join("")}
          </div>
          <div class="news-footer">
            <a class="more-button-color" href="/aktualnosci">Zobacz więcej postów</a>
          </div>
      </div>`
          : ""
      }
  </section>
  `;
}


// === Widok listy postów ===
function renderNews() {
  let sortedNews = [...newsData].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const visibleNews = sortedNews.slice(0, visibleCount);

  gallery.innerHTML = visibleNews
    .map(
      (news) => `
    <a class="news-galery-element" href="?post=${news.id}">
      <img src="${news.image}" alt="${news.title}">
      <div class="news-galery-element-text">
        <h1>${news.title}</h1>
        <p>${news.description}</p>
        <div class="news-galery-element-footer">
          <div class="news-galery-element-date">
            ${new Date(news.date).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div class="news-galery-element-arrow">➔</div>
        </div>
      </div>
    </a>
  `
    )
    .join("");

  countInfo.innerHTML = `<p>Wyświetlono <b style="font-weight: 600; color: #111;">${visibleNews.length} z ${newsData.length} postów</b></p>`;

  const countBar = (visibleNews.length / newsData.length) * 100;
  BarInfo.innerHTML = `
    <div class="showed-bar-S" style="width: ${countBar}%;"></div>
    <div class="showed-bar-H" style="width: calc(100% - ${countBar}%);"></div>
  `;

  loadMoreBtn.style.display =
    visibleNews.length >= newsData.length ? "none" : "inline-block";
}

// === Obsługa przycisków ===
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    visibleCount += 12;
    renderNews();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    sortOrder = e.target.value;
    visibleCount = 12;
    renderNews();
  });
}

// === Inicjalizacja po załadowaniu danych ===
function initializeNews() {
  if (postId) {
    const post = newsData.find((p) => p.id === postId);
    if (post) {
      renderSinglePost(post);
    } else {
      postContainer.innerHTML = `<p>Nie znaleziono posta.</p>`;
    }
  } else {
    renderNews();
  }
}

// === Start po załadowaniu strony ===
document.addEventListener("DOMContentLoaded", loadNewsData);
