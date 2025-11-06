document.addEventListener('DOMContentLoaded', async () => {
  const featured = document.getElementById('featuredRecipes');
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');

  // Load random recipes
  const res = await fetch(`https://api.spoonacular.com/recipes/random?number=6&apiKey=${API_KEY}`);
  const data = await res.json();
  featured.innerHTML = data.recipes.map(recipe => `
    <div class="card">
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="location.href='recipe.html?id=${recipe.id}'">View Recipe</button>
    </div>
  `).join('');

  // Search redirect
  form.addEventListener('submit', e => {
    e.preventDefault();
    location.href = `results.html?query=${input.value}`;
  });

  gsap.from(".card", {opacity: 0, y: 30, duration: 0.6, stagger: 0.2});
});
