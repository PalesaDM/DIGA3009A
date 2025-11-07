document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const detailContainer = document.getElementById('recipeDetail');

  if (!id) {
    detailContainer.innerHTML = "<p>No recipe found.</p>";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/${id}/information?apiKey=${API_KEY}`);
    const data = await res.json();

    console.log("Recipe details:", data); // ✅ Debug check

    // Handle missing data safely
    const ingredients = data.extendedIngredients
      ? data.extendedIngredients.map(i => `<li>${i.original}</li>`).join('')
      : "<li>No ingredients listed.</li>";

    const instructions = data.instructions
      ? data.instructions
      : "No instructions available.";

    // Render recipe detail content
    detailContainer.innerHTML = `
      <div class="recipe-card">
        <img src="${data.image}" alt="${data.title}" class="recipe-image">
        <h1 class="recipe-title">${data.title}</h1>
        <p><strong>Ready in:</strong> ${data.readyInMinutes} minutes</p>

        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>

        <h3>Instructions</h3>
        <p>${instructions}</p>

        <button class="back-btn" onclick="history.back()">← Back to Results</button>
      </div>
    `;

    // 🪄 GSAP Animations
    if (typeof gsap !== "undefined") {
      gsap.from(".recipe-card", { opacity: 0, y: 50, duration: 0.7, ease: "power2.out" });
      gsap.from(".recipe-card h1", { opacity: 0, y: -20, duration: 0.5, delay: 0.2 });
      gsap.from(".recipe-card li", { opacity: 0, x: -20, duration: 0.3, stagger: 0.05, delay: 0.4 });
    }

  } catch (error) {
    console.error("Error loading recipe:", error);
    detailContainer.innerHTML = "<p>Failed to load recipe details. Please try again later.</p>";
  }
});
