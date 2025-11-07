document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const popularContainer = document.getElementById('popularRecipes');

  const API_KEY = "9318949ba92e4cb6ba6155172ed55869"; // your Spoonacular key

  // ✅ Handle Search Redirect
  form.addEventListener('submit', e => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
      location.href = `results.html?query=${query}`;
    }
  });

  // ✅ Fetch healthy recipes (balanced, <500 kcal)
  const healthyKeywords = ["healthy", "salad", "grilled", "low-fat", "vegetarian", "protein"];
  const randomKeyword = healthyKeywords[Math.floor(Math.random() * healthyKeywords.length)];
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${randomKeyword}&diet=balanced&maxCalories=500&number=6&apiKey=${API_KEY}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    console.log("Healthy recipes fetched:", data.results);

    if (!data.results || data.results.length === 0) {
      popularContainer.innerHTML = "<p>No healthy recipes found. Try refreshing!</p>";
      return;
    }

    // ✅ Render recipe cards
    popularContainer.innerHTML = data.results.map(recipe => `
      <div class="card">
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p class="tag">🥗 Healthy Recipe</p>
        <button class="view-btn" onclick="location.href='recipe.html?id=${recipe.id}'">View Recipe</button>
      </div>
    `).join('');

    // ✅ GSAP Animations
    if (typeof gsap !== "undefined") {
      gsap.from(".hero h1", { opacity: 0, y: -40, duration: 0.8, ease: "power2.out" });
      gsap.from(".hero form", { opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: "power2.out" });
      gsap.from(".card", { opacity: 0, y: 50, duration: 0.7, stagger: 0.1, delay: 0.6, ease: "power2.out" });
    }

  } catch (error) {
    console.error("Error loading healthy recipes:", error);
    popularContainer.innerHTML = "<p>Oops! Could not load healthy recipes right now.</p>";
  }
});
