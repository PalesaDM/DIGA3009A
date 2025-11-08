document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  const resultsContainer = document.getElementById('results');
  const API_KEY = "974620b6d5694125bf871f0f5837436a";

  if (!query) {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  resultsContainer.innerHTML = "<p>Loading recipes… 🥄</p>";

  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultsContainer.innerHTML = "<p>No recipes found. Try another search!</p>";
      return;
    }

    resultsContainer.innerHTML = data.results.map(r => `
      <div class="card">
        <img src="${r.image}" alt="${r.title}">
        <h3>${r.title}</h3>
        <button onclick="location.href='recipe.html?id=${r.id}'">View Recipe</button>
      </div>
    `).join('');

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
