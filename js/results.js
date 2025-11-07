document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  const resultsContainer = document.getElementById('results'); // ✅ matches your HTML ID

  if (!query) {
    resultsContainer.innerHTML = "<p>No search term provided.</p>";
    return;
  }

  const apiKey = "9318949ba92e4cb6ba6155172ed55869"; // Replace with your actual key
  const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&apiKey=${apiKey}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched recipes:", data.results); 

      if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = "<p>No recipes found. Try another keyword!</p>";
        return;
      }

      resultsContainer.innerHTML = ""; 

      // Create recipe cards
      data.results.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}">
          <h3>${recipe.title}</h3>
          <button class="view-btn" onclick="location.href='recipe.html?id=${recipe.id}'">
          View Recipe
          </button>
        `;
        resultsContainer.appendChild(card);
      });

      // ✅ Animate cards with GSAP
      if (typeof gsap !== "undefined") {
        gsap.from(".card", {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out"
        });

        document.querySelectorAll('.card').forEach(card =>{
          card.addEventListener('mouseenter', () => {
            gsap.to(card, { borderColor: "#C65D2C", duration: 0.4})
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { borderColor: "#D4B59E", duration: 0.4})
          });
        })

        // Subtle accent border colour pulse
        gsap.to(".card", {
          borderColor: "#B85124",   // your terracotta accent
          duration: 1.2,
          repeat: 0,
          ease: "sine.inOut"
        });
      }
    })
    .catch(error => {
      console.error("Error fetching recipes:", error);
      resultsContainer.innerHTML = "<p>Sorry, something went wrong loading recipes.</p>";
    });
});
