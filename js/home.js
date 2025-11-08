document.addEventListener("DOMContentLoaded", async () => {
  const API_KEY = "974620b6d5694125bf871f0f5837436a"; // 🔑 Replace this
  const BASE_URL = "https://api.spoonacular.com/recipes";

  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const popularContainer = document.getElementById("popularRecipes");
  const categoryBar = document.getElementById("categoryBar");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let currentCategory = "healthy";
  let currentPage = 1;

  // --------------------------------
  // Load initial recipes
  // --------------------------------
  await fetchHealthyRecipes(currentCategory, currentPage);

  // --------------------------------
  // Create category buttons
  // --------------------------------
  const categories = ["healthy", "vegetarian", "high-protein", "low-carb"];
  categoryBar.innerHTML = categories
    .map(
      (cat) => `
      <button class="filter-btn" data-category="${cat}">
        ${cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </button>
    `
    )
    .join("");

  // --------------------------------
  // Category click event
  // --------------------------------
  categoryBar.addEventListener("click", async (e) => {
    if (e.target.classList.contains("filter-btn")) {
      const selected = e.target.getAttribute("data-category");
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      currentCategory = selected;
      currentPage = 1;
      await fetchHealthyRecipes(currentCategory, currentPage, true);
    }
  });

  // --------------------------------
  // Search bar functionality
  // --------------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      location.href = `results.html?query=${encodeURIComponent(query)}`;
    }
  });

  // --------------------------------
  // Load More button
  // --------------------------------
  loadMoreBtn.addEventListener("click", async () => {
    currentPage++;
    await fetchHealthyRecipes(currentCategory, currentPage, false);
  });

  // --------------------------------
  // Fetch and render recipes
  // --------------------------------
  async function fetchHealthyRecipes(category, page = 1, reset = false) {
    try {
      loadMoreBtn.disabled = true;
      const offset = (page - 1) * 9;
      const res = await fetch(
        `${BASE_URL}/complexSearch?query=${category}&number=9&offset=${offset}&addRecipeNutrition=true&apiKey=${API_KEY}`
      );
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        if (page === 1) {
          popularContainer.innerHTML =
            "<p>No recipes found. Try another category!</p>";
        }
        loadMoreBtn.disabled = true;
        return;
      }

      if (reset) popularContainer.innerHTML = "";

      data.results.forEach((recipe) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}">
          <h3>${recipe.title}</h3>
          <span class="tag">🥗 ${category}</span>
          <div class="button-group">
            <button class="view-btn" onclick="location.href='recipe.html?id=${recipe.id}'">View Recipe</button>
            <button class="download-btn" data-id="${recipe.id}" data-title="${recipe.title}">⬇️ Download</button>
          </div>
        `;
        popularContainer.appendChild(card);
      });

      // Animate
      if (window.gsap) {
        gsap.from(".card", {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        });
      }

      // Enable button again
      loadMoreBtn.disabled = false;

      // Handle download buttons
      document.querySelectorAll(".download-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;
          const title = e.target.dataset.title;
          await downloadRecipe(id, title);
        });
      });
    } catch (err) {
      console.error("Error loading recipes:", err);
      popularContainer.innerHTML =
        "<p>Could not load recipes right now. Try refreshing.</p>";
      loadMoreBtn.disabled = false;
    }
  }

  // --------------------------------
  // Download Recipe Function
  // --------------------------------
  async function downloadRecipe(id, title) {
    try {
      const res = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
      const data = await res.json();

      const blob = new Blob(
        [
          `🍽️ ${data.title}\n\nReady in: ${data.readyInMinutes} minutes\nServings: ${data.servings}\n\nIngredients:\n${data.extendedIngredients
            .map((i) => `- ${i.original}`)
            .join("\n")}\n\nInstructions:\n${data.instructions?.replace(
            /(<([^>]+)>)/gi,
            ""
          ) || "No instructions available."}`,
        ],
        { type: "text/plain" }
      );

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${data.title.replace(/\s+/g, "_")}.txt`;
      a.click();
    } catch (err) {
      alert("Failed to download recipe.");
      console.error(err);
    }
  }
});
