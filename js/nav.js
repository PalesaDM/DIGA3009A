document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  
  header.innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
  <img src="./assets/images/chef-hat.png" alt="Wholesome Bites Logo" class="nav-logo">
  <span class="site-name">Wholesome Bites</span>
</div>

      <div class="nav-links">
        <a href="./index.html" class="nav-link">Home</a>
        <a href="./results.html" class="nav-link">Recipes</a>
        <a href="./contact.html" class="nav-link">Contact</a>
      </div>
    </nav>
  `;

  
  // Injects footer to all pages
document.getElementById("site-footer").innerHTML = `
  <footer>
    <p>🍳 Wholesome Bites | © 2025</p>
    <p class="api-credit">
      Powered by <a href="https://www.themealdb.com/api.php" target="_blank" rel="noopener">TheMealDB API</a>
    </p>
  </footer>
`;

  
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href").includes(currentPage)) {
      link.classList.add("active");
    }
  });

  
  if (typeof gsap !== "undefined") {
    gsap.from(".navbar", {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.from(".nav-link", {
      opacity: 0,
      y: -10,
      stagger: 0.1,
      delay: 0.2,
      duration: 0.4,
      ease: "power1.out",
    });
  }
});
