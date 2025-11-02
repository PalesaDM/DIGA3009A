document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const res = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
  const data = await res.json();

  document.getElementById('recipeDetail').innerHTML = `
    <div class="card">
      <img src="${data.image}" alt="${data.title}">
      <h1>${data.title}</h1>
      <p><strong>Ready in:</strong> ${data.readyInMinutes} minutes</p>
      <h3>Ingredients</h3>
      <ul>${data.extendedIngredients.map(i => `<li>${i.original}</li>`).join('')}</ul>
      <h3>Instructions</h3>
      <p>${data.instructions}</p>
    </div>
  `;
  gsap.from(".card", {opacity:0, y:50, duration:.7});
});
