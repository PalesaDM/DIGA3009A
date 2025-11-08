
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";


async function fetchRecipes(query = "salad") {
  try {
    
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.meals) return [];

    // filtering
    const healthyMeals = data.meals.filter(m =>
      /(salad|chicken|soup|fish|fruit|bowl|grilled|vegetable|smoothie|healthy|low)/i.test(m.strMeal)
    );

    console.log("Fetched healthy recipes:", healthyMeals);
    return healthyMeals;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  if (form && input) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const query = input.value.trim();

      if (query) {
        
        window.location.href = `results.html?query=${encodeURIComponent(query)}`;
      } else {
        alert("Please enter a recipe name to search.");
      }
    });
  }
});
