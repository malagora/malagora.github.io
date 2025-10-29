// --- DANE ZDJĘĆ ---
const photos = [
  {
    id: "foto76",
    title: "Salamandra plamista",
    image: "/media/photos/MG-2025-10-29_004.jpg",
    category: ["jesien", "zwierzeta"],
    date: "2025-10-29"
  },
  {
    id: "foto75",
    title: "Salamandra plamista",
    image: "/media/photos/MG-2025-10-29_003.jpg",
    category: ["jesien", "zwierzeta"],
    date: "2025-10-29"
  },
  {
    id: "foto74",
    title: "Zmierzch na Szarych Skałkach",
    image: "/media/photos/MG-2025-10-29_002.jpg",
    category: ["jesien", "skalki"],
    date: "2025-10-29"
  },
  {
    id: "foto73",
    title: "Zmierzch znad Kaczych Skałek",
    image: "/media/photos/MG-2025-10-29_001.jpg",
    category: ["jesien"],
    date: "2025-10-29"
  },
  {
    id: "foto72",
    title: "Mleczajowiec chrząstka",
    image: "/media/photos/MG-2025-10-20_036.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto71",
    title: "Mleczajowiec chrząstka w mchu",
    image: "/media/photos/MG-2025-10-20_035.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto70",
    title: "Mleczaj siarkowy",
    image: "/media/photos/MG-2025-10-20_034.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto69",
    title: "Muchomor czerwony",
    image: "/media/photos/MG-2025-10-20_033.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto68",
    title: "Jesień z Szarych Skał",
    image: "/media/photos/MG-2025-10-20_032.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto67",
    title: "Kościół w Zawadzie na tle Beskidu Wyspowego",
    image: "/media/photos/MG-2025-10-20_031.jpg",
    category: ["jesien"],
    date: "2025-10-20"
  },
  {
    id: "foto66",
    title: "Jesienny widok z Szarych Skał",
    image: "/media/photos/MG-2025-10-20_030.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto65",
    title: "Szare Skały",
    image: "/media/photos/MG-2025-10-20_029.jpg",
    category: ["jesien", "skaly"],
    date: "2025-10-20"
  },
  {
    id: "foto64",
    title: "Łańcuchy na Szarej Próbie",
    image: "/media/photos/MG-2025-10-20_028.jpg",
    category: ["jesien", "skaly"],
    date: "2025-10-20"
  },
  {
    id: "foto63",
    title: "Szara Próba",
    image: "/media/photos/MG-2025-10-20_027.jpg",
    category: ["jesien", "skaly"],
    date: "2025-10-20"
  },
  {
    id: "foto62",
    title: "Wejście na Szarą Próbę",
    image: "/media/photos/MG-2025-10-20_026.jpg",
    category: ["jesien", "skaly"],
    date: "2025-10-20"
  },
  {
    id: "foto61",
    title: "Wiewiórka pospolita",
    image: "/media/photos/MG-2025-10-20_025.jpg",
    category: ["jesien", "zwierzeta"],
    date: "2025-10-20"
  },
  {
    id: "foto60",
    title: "Widok na Beskid Sądecki",
    image: "/media/photos/MG-2025-10-20_024.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto59",
    title: "Paproci Wierch",
    image: "/media/photos/MG-2025-10-20_023.jpg",
    category: ["jesien", "szczyty", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto58",
    title: "Paprocie w Małej Paprociej Dolince",
    image: "/media/photos/MG-2025-10-20_022.jpg",
    category: ["jesien", "rosliny", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto57",
    title: "Górne piętro Małej Paprociej Dolinki",
    image: "/media/photos/MG-2025-10-20_021.jpg",
    category: ["jesien", "rosliny", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto56",
    title: "Osuwiskowy krajobraz i paprocie z Paprociej Przełęczy",
    image: "/media/photos/MG-2025-10-20_020.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto55",
    title: "Przekwitnięte paprocie",
    image: "/media/photos/MG-2025-10-20_019.jpg",
    category: ["jesien", "rosliny", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto54",
    title: "Wierzchołek Małej Kopy",
    image: "/media/photos/MG-2025-10-20_018.jpg",
    category: ["jesien", "szczyty", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto53",
    title: "Erozja na grzbiecie Srebrnch Skał",
    image: "/media/photos/MG-2025-10-20_017.jpg",
    category: ["jesien", "skaly"],
    date: "2025-10-20"
  },
  {
    id: "foto52",
    title: "Wrzos pospolity",
    image: "/media/photos/MG-2025-10-20_016.jpg",
    category: ["jesien", "rosliny"],
    date: "2025-10-20"
  },
  {
    id: "foto51",
    title: "Polana Mrozówka",
    image: "/media/photos/MG-2025-10-20_015.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto50",
    title: "Grzybki na pniu",
    image: "/media/photos/MG-2025-10-20_014.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto49",
    title: "Grzyby",
    image: "/media/photos/MG-2025-10-20_013.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto48",
    title: "Stary pień na Mrozówce",
    image: "/media/photos/MG-2025-10-20_012.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto47",
    title: "Szczyt Małej Góry",
    image: "/media/photos/MG-2025-10-20_011.jpg",
    category: ["jesien", "szczyty", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto46",
    title: "Krowiak podwinięty",
    image: "/media/photos/MG-2025-10-20_010.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto45",
    title: "Skałki z Twarzą Pana Jezusa",
    image: "/media/photos/MG-2025-10-20_009.jpg",
    category: ["jesien", "skaly"],
    date: "2025-10-20"
  },
  {
    id: "foto44",
    title: "Wąwóz na szlaku niebieskim",
    image: "/media/photos/MG-2025-10-20_008.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto43",
    title: "Muchomor jadowity",
    image: "/media/photos/MG-2025-10-20_007.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-20"
  },
  {
    id: "foto42",
    title: "Jesienny Niżny Płaj",
    image: "/media/photos/MG-2025-10-20_006.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto41",
    title: "Jesienny Niżny Płaj",
    image: "/media/photos/MG-2025-10-20_005.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto40",
    title: "Niżna Polana",
    image: "/media/photos/MG-2025-10-20_004.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto39",
    title: "Paprocie i brzozy na Niżnej Polanie",
    image: "/media/photos/MG-2025-10-20_003.jpg",
    category: ["jesien", "rosliny", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto38",
    title: "Żleb nad Niżną Polaną",
    image: "/media/photos/MG-2025-10-20_002.jpg",
    category: ["jesien", "las"],
    date: "2025-10-20"
  },
  {
    id: "foto37",
    title: "Trzmielina pospolita",
    image: "/media/photos/MG-2025-10-20_001.jpg",
    category: ["jesien", "rosliny"],
    date: "2025-10-20"
  },
  {
    id: "foto36",
    title: "Wiewiórka pospolita",
    image: "/media/photos/MG-2025-10-17_014.jpg",
    category: ["jesien", "zwierzeta"],
    date: "2025-10-17"
  },
  {
    id: "foto35",
    title: "Samica kaczki krzyżówki",
    image: "/media/photos/MG-2025-10-17_013.jpg",
    category: ["jesien", ""],
    date: "2025-10-17"
  },
  {
    id: "foto34",
    title: "Kaczki krzyżówki",
    image: "/media/photos/MG-2025-10-17_012.jpg",
    category: ["zwierzeta"],
    date: "2025-10-17"
  },
  {
    id: "foto33",
    title: "Kaczki krzyżówki",
    image: "/media/photos/MG-2025-10-17_011.jpg",
    category: ["zwierzeta"],
    date: "2025-10-17"
  },
  {
    id: "foto32",
    title: "Pstrąg potokowy",
    image: "/media/photos/MG-2025-10-17_010.jpg",
    category: ["zwierzeta"],
    date: "2025-10-17"
  },
  {
    id: "foto31",
    title: "Trzmielina pospolita",
    image: "/media/photos/MG-2025-10-17_009.jpg",
    category: ["jesien", "rosliny"],
    date: "2025-10-17"
  },
  {
    id: "foto30",
    title: "Klon zwyczajny",
    image: "/media/photos/MG-2025-10-17_008.jpg",
    category: ["jesien", "las", "rosliny"],
    date: "2025-10-17"
  },
  {
    id: "foto29",
    title: "Jodła na tle jesieni",
    image: "/media/photos/MG-2025-10-17_007.jpg",
    category: ["jesien", "las"],
    date: "2025-10-17"
  },
  {
    id: "foto28",
    title: "Jesienne barwy",
    image: "/media/photos/MG-2025-10-17_006.jpg",
    category: ["jesien", "las"],
    date: "2025-10-17"
  },
  {
    id: "foto27",
    title: "Stożkówka delikatna",
    image: "/media/photos/MG-2025-10-17_005.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-17"
  },
  {
    id: "foto26",
    title: "Purchawka chropowata",
    image: "/media/photos/MG-2025-10-17_004.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-17"
  },
  {
    id: "foto25",
    title: "Maślak żółty",
    image: "/media/photos/MG-2025-10-17_003.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-17"
  },
  {
    id: "foto24",
    title: "Maślak żółty",
    image: "/media/photos/MG-2025-10-17_002.jpg",
    category: ["jesien", "grzyby"],
    date: "2025-10-17"
  },
  {
    id: "foto23",
    title: "Jesienna Rzeka Kamionka",
    image: "/media/photos/MG-2025-10-17_001.jpg",
    category: ["las", "jesien"],
    date: "2025-10-17"
  },
  {
    id: "foto22",
    title: "Granica Olszyny",
    image: "/media/photos/MG-2021-07-23-008.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto21",
    title: "Małogórskie Bobrowisko",
    image: "/media/photos/MG-2021-07-23-007.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto20",
    title: "Kopuła szczytowa Małej Góry",
    image: "/media/photos/MG-2021-07-23-006.jpg",
    category: ["szczyty", "las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto19",
    title: "Mrozówka z lotu ptaka",
    image: "/media/photos/MG-2021-07-23-005.jpg",
    category: ["las", "lato", "dron"],
    date: "2021-07-23"
  },
  {
    id: "foto18",
    title: "Zakręt Kamionki",
    image: "/media/photos/MG-2021-07-23-004.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto17",
    title: "Okolice wylotu Doliny Małogórskiego Potoku",
    image: "/media/photos/MG-2021-07-23-003.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto16",
    title: "Bobrowisko z lotu ptaka",
    image: "/media/photos/MG-2021-07-23-002.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto15",
    title: "Zakole Kamienicy",
    image: "/media/photos/MG-2021-07-23-001.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto14",
    title: "Dolina Małogórskiego Potoku",
    image: "/media/IndexGalery_07.jpg",
    category: ["las", "jesien"],
    date: "2022-10-01"
  },
  {
    id: "foto13",
    title: "Kacze Skałki",
    image: "/media/IndexGalery_06.jpg",
    category: ["skaly", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto12",
    title: "Julkowa Perć",
    image: "/media/IndexGalery_05.jpg",
    category: ["las", "skaly", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto11",
    title: "Widok z nad Kaczych Skałek",
    image: "/media/IndexGalery_04.jpg",
    category: ["las", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto10",
    title: "Wejście na Srebrne Skałki",
    image: "/media/IndexGalery_03.jpg",
    category: ["skaly", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto9",
    title: "Rozdroże w Złotej Dolince",
    image: "/media/IndexGalery_02.jpg",
    category: ["las", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto8",
    title: "Skałki z Twarzą Pana Jezusa",
    image: "/media/IndexGalery_01.jpg",
    category: ["skaly", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto7",
    title: "Las na Jaźwieczym Grzbiecie",
    image: "/media/IndexBG_06.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto6",
    title: "Mgliste popołudnie",
    image: "/media/IndexBG_05.png",
    category: ["las", "jesien"],
    date: "2022-11-01"
  },
  {
    id: "foto5",
    title: "Widok na kościół w Zawadzie",
    image: "/media/IndexBG_03.jpg",
    category: ["las", "jesien"],
    date: "2022-10-20"
  },
  {
    id: "foto4",
    title: "Stroma Dolinka",
    image: "/media/IndexBG_02.png",
    category: ["las", "lato"],
    date: "2023-07-11"
  },
  {
    id: "foto3",
    title: "Bobrowisko z lotu ptaka",
    image: "/media/IndexBG_04.jpg",
    category: ["las", "dron", "lato"],
    date: "2021-07-23"
  },
  {
    id: "foto2",
    title: "Październikowa mżawka",
    image: "/media/WeatherBG.jpg",
    category: ["jesien", "las"],
    date: "2025-10-10"
  },
  {
    id: "foto1",
    title: "Wiewiórka pospolita",
    image: "/media/MG-2025-10-17-Wiewiorka.jpg",
    category: ["zwierzeta", "jesien"],
    date: "2025-10-17"
  },
];

// --- ZMIENNE GLOBALNE ---
let currentCategory = "all";
let sortOrder = "newest";
let visibleCount = 12;

document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallerySection");
  galleryContainer.innerHTML = `
    <div class="gallery-header">
      <div class="gallery-filters">
        <button class="filter-btn btn-all active" data-category="all">Wszystkie</button>
        <button class="filter-btn" data-category="szczyty">Szczyty</button>
        <button class="filter-btn" data-category="skaly">Skały</button>
        <button class="filter-btn" data-category="las">Las</button>
        <button class="filter-btn" data-category="dron">Dron</button>
        <button class="filter-btn" data-category="zwierzeta">Zwierzęta</button>
        <button class="filter-btn" data-category="rosliny">Rośliny</button>
        <button class="filter-btn" data-category="grzyby">Grzyby</button>
        <button class="filter-btn" data-category="wiosna">Wiosna</button>
        <button class="filter-btn" data-category="lato">Lato</button>
        <button class="filter-btn" data-category="jesien">Jesień</button>
        <button class="filter-btn" data-category="zima">Zima</button>
      </div>
      <div class="gallery-sort">
        <label for="sortSelect">Sortuj:</label>
        <div class="custom-select-wrapper">
          <select id="sortSelect">
            <option value="newest">od najnowszych</option>
            <option value="oldest">od najstarszych</option>
          </select>
          <span class="custom-arrow"></span>
        </div>
      </div>
    </div>

    <div id="galleryGrid" class="gallery-grid"></div>

    <div class="gallery-footer">
      <p id="photoCount"></p>
      <div id="showedBarGallery"></div>
      <button id="loadMore">Pokaż więcej</button>
    </div>

    <div id="lightbox" class="lightbox">
      <span class="close-btn">&times;</span>
      <img id="lightbox-img" src="" alt="">
      <p id="lightbox-title"></p>
    </div>
  `;

  const galleryGrid = document.getElementById("galleryGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("sortSelect");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const closeBtn = document.querySelector(".close-btn");
  const loadMoreBtn = document.getElementById("loadMore");
  const photoCount = document.getElementById("photoCount");
  const showedBar = document.getElementById("showedBarGallery");

  // ====== FUNKCJE ======

  function getFilteredPhotos() {
    let filtered = photos;
    if (currentCategory !== "all") {
      filtered = photos.filter(p => p.category.includes(currentCategory));
    }
    filtered.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );
    return filtered;
  }

  function renderGallery() {
    const filtered = getFilteredPhotos();
    const visible = filtered.slice(0, visibleCount);

    galleryGrid.classList.add("fade-out");
    setTimeout(() => {
      galleryGrid.innerHTML = visible.map(photo => `
        <div class="gallery-item"
             style="background-image: url('${photo.image}')"
             data-id="${photo.id}">
          <div class="gallery-info">
            <h3>${photo.title}</h3>
            <span>${new Date(photo.date).toLocaleDateString("pl-PL", {
              day: "2-digit", month: "2-digit", year: "numeric"
            })}</span>
          </div>
        </div>
      `).join("");

      galleryGrid.classList.remove("fade-out");
      galleryGrid.classList.add("fade-in");

      document.querySelectorAll(".gallery-item").forEach(item => {
        item.addEventListener("click", () => openLightbox(item.dataset.id));
      });

      const countBar = (visible.length / filtered.length) * 100;
      showedBar.innerHTML = `<div class="showed-bar-S" style="width: ${countBar}%;"></div><div class="showed-bar-H" style="width: calc(100% - ${countBar}%);"></div>`;

      photoCount.innerHTML = `<p style="font-weight: 100; color: #555;">Wyświetlono</p> ${visible.length} z ${filtered.length} zdjęć`;
      loadMoreBtn.style.display = visible.length >= filtered.length ? "none" : "inline-block";
    }, 150);
  }

  function openLightbox(photoId) {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    lightboxImg.src = photo.image;
    lightboxTitle.textContent = `${photo.title} — ${new Date(photo.date).toLocaleDateString("pl-PL", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })}`;
    lightbox.style.display = "flex";
  }

  function closeLightbox() {
    lightbox.style.display = "none";
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      visibleCount = 12;
      renderGallery();
    });
  });

  sortSelect.addEventListener("change", e => {
    sortOrder = e.target.value;
    visibleCount = 12;
    renderGallery();
  });

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += 12;
    renderGallery();
  });

  renderGallery();
});
