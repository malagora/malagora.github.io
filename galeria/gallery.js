// --- DANE ZDJĘĆ ---
const photos = [
  {
    id: "foto1",
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
    id: "foto3",
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
