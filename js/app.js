// -----------------------------------------
// GLOBAL CONSTANTS
// -----------------------------------------
const API_KEY = "9318949ba92e4cb6ba6155172ed55869"; // 🔑 Replace this with your real API key
const BASE_URL = "https://api.spoonacular.com/recipes";

// -----------------------------------------
// FETCH RECIPES FUNCTION
// -----------------------------------------
async function fetchRecipes(query) {
  try {
    const res = await fetch(`${BASE_URL}/complexSearch?query=${query}&number=9&apiKey=${API_KEY}`);
    const data = await res.json();
    console.log("Fetched recipes:", data.results); // ✅ for debugging
    return data.results || [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

// -----------------------------------------
// HOME PAGE SEARCH FORM HANDLER
// -----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  // Only add event listener if the form exists (prevents errors on results.html)
  if (form && input) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        // Redirect to results.html with query string
        window.location.href = `results.html?query=${encodeURIComponent(query)}`;
      } else {
        alert("Please enter a recipe name to search.");
      }
    });
  }
});
