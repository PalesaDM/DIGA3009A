document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  // Inject navigation bar into header
  header.innerHTML = `
    <nav class="navbar">
      <a href="./index.html">Home</a>
      <a href="./results.html">Recipes</a>
      <a href="./contact.html">Contact</a>
    </nav>
  `;

  // Inject footer
  footer.innerHTML = `
    <p>&copy; ${new Date().getFullYear()} Recipe Finder</p>
  `;

  // Optional GSAP animation for smooth entry
  if (typeof gsap !== "undefined") {
    gsap.from(".navbar a", {
      opacity: 0,
      y: -10,
      stagger: 0.1,
      duration: 0.5,
      ease: "power1.out"
    });
  }
});
