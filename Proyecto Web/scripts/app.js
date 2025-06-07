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

  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const btnMinus = counter.querySelector('.btn-minum'); 
    const btnPlus = counter.querySelector('.btn-plus');
    const quantity = counter.querySelector('.quantity');

    if (!btnMinus || !btnPlus || !quantity) {
      console.warn('Faltan elementos en counter:', counter);
      return; 
    }

    btnPlus.addEventListener('click', () => {
      let currentValue = parseInt(quantity.textContent) || 0;
      quantity.textContent = currentValue + 1;
    });

    btnMinus.addEventListener('click', () => {
      let currentValue = parseInt(quantity.textContent) || 0;
      if (currentValue > 1) {
        quantity.textContent = currentValue - 1;
      }
    });
  });
});
