document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const query = params.get('query');
  const results = document.getElementById('results');

  const recipes = await fetchRecipes(query);
  results.innerHTML = recipes.map(r => `
    <div class="card">
      <img src="${r.image}" alt="${r.title}">
      <h3>${r.title}</h3>
      <button onclick="location.href='recipe.html?id=${r.id}'">View Recipe</button>
    </div>
  `).join('');

  gsap.from(".card", {opacity: 0, y: 20, duration: 0.5, stagger: 0.1});
});
