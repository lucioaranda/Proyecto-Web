document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-filter input[type="text"]');
  const productCards = document.querySelectorAll('.product-card');

  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();

    productCards.forEach(card => {
      
      const title = card.querySelector('.title-product').textContent.toLowerCase();

      if (title.includes(filter)) {
        card.style.display = ''; 
      } else {
        card.style.display = 'none'; 
      }
    });
  });
});
