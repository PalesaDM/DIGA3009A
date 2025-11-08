document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const popularContainer = document.getElementById('popularRecipes');
  const categoryBar = document.getElementById('categoryBar');

  const API_KEY = "974620b6d5694125bf871f0f5837436a"; // your key

  // SEARCH REDIRECT
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (query) {
        window.location.href = `results.html?query=${encodeURIComponent(query)}`;
    }
  });

  // Fetch healthy recipes by category/keyword
  async function fetchHealthyRecipes(category = "healthy") {
    try {
      popularContainer.innerHTML = "<p>Loading recipes… 🥄</p>";

      // broader pool to avoid repeats
      const subtopics = {
        healthy: ["healthy", "low-fat", "nutritious", "salad", "balanced"],
        vegetarian: ["vegetarian", "vegan", "plant-based", "greens", "veggie bowl"],
        "high-protein": ["high-protein", "chicken", "egg", "lean meat", "protein meal"],
        "low-carb": ["low-carb", "keto", "paleo", "cauliflower rice", "zucchini noodles"]
      };

      const key = subtopics[category] ? category : "healthy";
      const randomQuery = subtopics[key][Math.floor(Math.random() * subtopics[key].length)];

      const url =
        `https://api.spoonacular.com/recipes/complexSearch` +
        `?query=${encodeURIComponent(randomQuery)}` +
        `&diet=balanced&maxCalories=500&number=12&apiKey=${API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        popularContainer.innerHTML = "<p>No recipes found. Try another category!</p>";
        return;
      }

      // randomize and show 6
      data.results.sort(() => 0.5 - Math.random());
      const six = data.results.slice(0, 6);

      popularContainer.innerHTML = six.map(r => `
        <div class="card">
          <img src="${r.image}" alt="${r.title}">
          <h3>${r.title}</h3>
          <p class="tag">🥗 ${key.replace('-', ' ')}</p>
          <button class="view-btn" onclick="location.href='recipe.html?id=${r.id}'">View Recipe</button>
        </div>
      `).join('');

      // GSAP: use scale (not y-translate) to avoid grid shift; note clearProps (spelled correctly)
      if (window.gsap) {
        gsap.from(".card", {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          stagger: 0.08,
          ease: "power1.out",
          clearProps: "transform"
        });
      }
    } catch (err) {
      console.error("Error loading recipes:", err);
      popularContainer.innerHTML = "<p>Could not load recipes right now.</p>";
    }
  }

  // Category buttons
  const categories = ["healthy", "vegetarian", "high-protein", "low-carb"];
  categoryBar.innerHTML = categories.map(cat => `
    <button class="filter-btn" data-category="${cat}">
      ${cat.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
    </button>
  `).join("");

  categoryBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    fetchHealthyRecipes(btn.dataset.category);
  });

  // Initial load + hero/category animations
  fetchHealthyRecipes("healthy");

  if (window.gsap) {
    gsap.from(".hero h1", { opacity: 0, y: -40, duration: 0.8, ease: "power2.out" });
    gsap.from(".hero form", { opacity: 0, y: 40, duration: 0.8, delay: 0.3, ease: "power2.out" });
    gsap.from(".filter-btn", { opacity: 0, y: 20, duration: 0.6, stagger: 0.08, delay: 0.3, ease: "power2.out" });
  }
});
