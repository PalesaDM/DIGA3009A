document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const popularContainer = document.getElementById('popularRecipes');
  const categoryBar = document.getElementById('categoryBar');

  const API_KEY = "9318949ba92e4cb6ba6155172ed55869"; // your key

  // ✅ SEARCH REDIRECT
  form.addEventListener('submit', e => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) location.href = `results.html?query=${query}`;
  });

  // ✅ FUNCTION: Fetch recipes by category or keyword
  async function fetchHealthyRecipes(query = "healthy") {
    try {
      popularContainer.innerHTML = "<p>Loading recipes...</p>";

      const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&diet=balanced&maxCalories=500&number=6&apiKey=${API_KEY}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        popularContainer.innerHTML = "<p>No recipes found. Try another category!</p>";
        return;
      }

      // ✅ Render cards only once
      popularContainer.innerHTML = data.results.map(recipe => `
        <div class="card">
          <img src="${recipe.image}" alt="${recipe.title}">
          <h3>${recipe.title}</h3>
          <p class="tag">🥗 ${query.charAt(0).toUpperCase() + query.slice(1)} Recipe</p>
          <button class="view-btn" onclick="location.href='recipe.html?id=${recipe.id}'">View Recipe</button>
        </div>
      `).join('');

      // 🪄 Animate
      if (typeof gsap !== "undefined") {
        gsap.from(".card", { opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: "power2.out" });
      }

    } catch (err) {
      console.error("Error loading recipes:", err);
      popularContainer.innerHTML = "<p>Could not load recipes right now.</p>";
    }
  }

  // ✅ CATEGORY FILTER BUTTONS
  const categories = ["healthy", "vegetarian", "high-protein", "low-carb"];
  categoryBar.innerHTML = categories.map(cat => `
    <button class="filter-btn" data-category="${cat}">
      ${cat.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
    </button>
  `).join('');

  // ✅ Listen for filter clicks
  categoryBar.addEventListener('click', e => {
    if (e.target.classList.contains('filter-btn')) {
      const selected = e.target.getAttribute('data-category');
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      fetchHealthyRecipes(selected);
    }
  });

  // ✅ Initial load (default "healthy")
  await fetchHealthyRecipes("healthy");

  // 🪄 Hero animation
  if (typeof gsap !== "undefined") {
    gsap.from(".hero h1", { opacity: 0, y: -40, duration: 0.8, ease: "power2.out" });
    gsap.from(".hero form", { opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: "power2.out" });
  }
});
