document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("postMenuList");
  const btn = document.getElementById("toggleMenuBtn");

  btn.addEventListener("click", () => {
    list.classList.toggle("expanded");
    btn.textContent = list.classList.contains("expanded")
      ? "Pokaż mniej"
      : "Zobacz więcej";
  });

  // Dynamiczne dzielenie na kolumny dla komputerów
  const resizeHandler = () => {
    if (window.innerWidth >= 800) {
      const items = list.querySelectorAll("li");
      const half = Math.ceil(items.length / 2);
      items.forEach((li, i) => {
        li.style.order = i < half ? i * 2 : (i - half) * 2 + 1; // rozkłada równomiernie
      });
    } else {
      list.querySelectorAll("li").forEach((li) => (li.style.order = ""));
    }
  };

  window.addEventListener("resize", resizeHandler);
  resizeHandler();
});
