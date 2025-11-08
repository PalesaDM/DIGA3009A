document.addEventListener("DOMContentLoaded", async () => {
  const popularContainer = document.getElementById("popularRecipes");
  const categoryBar = document.getElementById("categoryBar");
  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  // -----------------------------------------
  // FETCH POPULAR / HEALTHY RECIPES
  // -----------------------------------------
  async function fetchHealthyRecipes(query = "salad") {
    try {
      const res = await fetch(`${BASE_URL}search.php?s=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!data.meals) {
        popularContainer.innerHTML = "<p>No recipes found. Try again later.</p>";
        return;
      }

      const healthyMeals = data.meals.filter(m =>
        /(salad|chicken|fish|vegetable|soup|fruit|healthy|grilled|bowl|low)/i.test(m.strMeal)
      );

      popularContainer.innerHTML = healthyMeals
        .slice(0, 8)
        .map(
          meal => `
          <div class="card">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <button onclick="location.href='recipe.html?id=${meal.idMeal}'">View Recipe</button>
          </div>
        `
        )
        .join("");

      // Add GSAP animations
      if (typeof gsap !== "undefined") {
        gsap.from(".card", {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          stagger: 0.08,
          ease: "power1.out",
          clearProps: "transform",
        });
      }
    } catch (err) {
      console.error("Error loading recipes:", err);
      popularContainer.innerHTML = "<p>Could not load recipes right now.</p>";
    }
  }

  // -----------------------------------------
  // CATEGORY BUTTONS
  // -----------------------------------------
  const categories = [
    { name: "Healthy", query: "salad" },
    { name: "Vegetarian", query: "vegetarian" },
    { name: "High Protein", query: "chicken" },
    { name: "Low Carb", query: "fish" },
  ];

  categoryBar.innerHTML = categories
    .map(
      c => `
      <button class="filter-btn" data-query="${c.query}">
        ${c.name}
      </button>
    `
    )
    .join("");

  // Add click listeners to category buttons
  categoryBar.addEventListener("click", e => {
    if (e.target.classList.contains("filter-btn")) {
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      const query = e.target.getAttribute("data-query");
      fetchHealthyRecipes(query);
    }
  });

  // -----------------------------------------
  // INITIAL LOAD — show default popular recipes
  // -----------------------------------------
  fetchHealthyRecipes("salad");
});
