document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  const resultsContainer = document.getElementById('results');

  // 🥗 TheMealDB base URL (no API key required)
  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  if (!query) {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  resultsContainer.innerHTML = "<p>Loading healthy recipes… 🥄</p>";

  try {
    // 🍏 Only fetch recipes that sound healthy
    // TheMealDB doesn't have a 'healthy' flag, so we filter by search term
    const res = await fetch(`${BASE_URL}search.php?s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.meals) {
      resultsContainer.innerHTML = "<p>No healthy recipes found. Try another search!</p>";
      return;
    }

    // 🍅 Filter meals with words like salad, chicken, vegetable, soup, etc.
    const healthyMeals = data.meals.filter(m =>
      /(salad|chicken|soup|vegetable|grilled|fruit|yogurt|healthy|fish|low|bowl|smoothie)/i.test(m.strMeal)
    );

    if (healthyMeals.length === 0) {
      resultsContainer.innerHTML = "<p>No healthy results found. Try another search!</p>";
      return;
    }

    // 🎨 Render recipe cards
    resultsContainer.innerHTML = healthyMeals.map(meal => `
      <div class="card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <button onclick="location.href='recipe.html?id=${meal.idMeal}'">View Recipe</button>
      </div>
    `).join('');

    // ✨ Keep your GSAP animation
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
    console.error("Error fetching recipes:", err);
    resultsContainer.innerHTML = "<p>Sorry, could not load recipes right now.</p>";
  }
});
