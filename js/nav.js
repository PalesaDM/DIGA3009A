document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  header.innerHTML =
  <nav>
    <a href="./index.html">Home</a>
    <a href="./results.html">Recipes</a>
    <a herf="./contact.html">Contact</a>
  </nav>
  
  ;

  footer.innerHTML =
  <p>&copy; ${new Date ().getFullYear()} Recipe Finder | Designed by Palesa M</p>
  
  ;
});
