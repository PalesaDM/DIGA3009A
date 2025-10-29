const API_KEY = "YOUR_SPOONACULAR_API_KEY";
const BASE_URL = "https://api.spoonacular.com/recipes";

async function fetchRecipes(query) {
    const res = await fetch(`${BASE_URL}/complexSearch?query=${query}&number=9&apiKey=${API_KEY}`);
    const data = await res.json();
    return data.results;
}