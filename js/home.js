document.addEventListener("DOMContentLoaded", async () => {
  const popularContainer = document.getElementById("popularRecipes");
  const categoryBar = document.getElementById("categoryBar");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const BASE_URL = "https://www.themealdb.com/api/json/v1/1/";

  let currentQuery = "salad";
  let currentPage = 0;
  const RESULTS_PER_PAGE = 8;
  let allMeals = [];

  
  async function fetchHealthyRecipes(query = "salad") {
    try {
      popularContainer.innerHTML = "<p>Loading recipes... 🥄</p>";
      const res = await fetch(`${BASE_URL}search.php?s=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!data.meals) {
        popularContainer.innerHTML = "<p>No recipes found. Try again later.</p>";
        loadMoreBtn.style.display = "none";
        return;
      }

      allMeals = data.meals.filter(m =>
        /(salad|chicken|fish|vegetable|soup|fruit|healthy|grilled|bowl|low)/i.test(m.strMeal)
      );

      if (allMeals.length === 0) {
        popularContainer.innerHTML = "<p>No healthy recipes found for this category.</p>";
        loadMoreBtn.style.display = "none";
        return;
      }

      currentPage = 0;
      renderRecipes();

      loadMoreBtn.style.display = allMeals.length > RESULTS_PER_PAGE ? "block" : "none";
    } catch (err) {
      console.error("Error loading recipes:", err);
      popularContainer.innerHTML = "<p>Could not load recipes right now.</p>";
    }
  }

 
  function renderRecipes() {
    const start = currentPage * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    const recipesToShow = allMeals.slice(start, end);

    if (currentPage === 0) popularContainer.innerHTML = "";

    popularContainer.innerHTML += recipesToShow
      .map(
        meal => `
        <div class="card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <button onclick="location.href='recipe.html?id=${meal.idMeal}'">View Recipe</button>
        </div>
      `
      )
      .join("");

    if (end >= allMeals.length) loadMoreBtn.style.display = "none";

    
    setTimeout(initScrollAnimations, 200);
  }


  const categories = [
    { name: "Healthy", query: "salad" },
    { name: "Vegetarian", query: "vegetarian" },
    { name: "High Protein", query: "chicken" },
    { name: "Low Carb", query: "fish" }
  ];

  categoryBar.innerHTML = categories
    .map(c => `<button class="filter-btn" data-query="${c.query}">${c.name}</button>`)
    .join("");

  categoryBar.addEventListener("click", e => {
    if (e.target.classList.contains("filter-btn")) {
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      currentQuery = e.target.getAttribute("data-query");
      fetchHealthyRecipes(currentQuery);
    }
  });

  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    renderRecipes();
  });

  // scroll trigger
  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    gsap.utils.toArray(".card").forEach(card => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
      });
    });

    gsap.from(".category-bar button", {
      scrollTrigger: {
        trigger: ".category-bar",
        start: "top 95%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 0, 
      duration: 0.7,
      stagger: 0.1,
      ease: "power1.out",
    });

    gsap.from("#categories h2", {
      scrollTrigger: {
        trigger: "#categories h2",
        start: "top 90%",
      },
      opacity: 0,
      y: 15,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  
  await fetchHealthyRecipes(currentQuery);
});
