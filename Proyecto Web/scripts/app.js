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
      let currentValue = parseInt(quantity.textContent) || 1;
      quantity.textContent = currentValue + 1;
    });

    btnMinus.addEventListener('click', () => {
      let currentValue = parseInt(quantity.textContent) || 1;
      if (currentValue > 1) {
        quantity.textContent = currentValue - 1;
      }
    });
  });

  const sortSelect = document.getElementById('sort-select');
  const productGrid = document.querySelector('.product-grid');

  sortSelect.addEventListener('change', () => {
  const option = sortSelect.value;
  const cardsArray = Array.from(productGrid.querySelectorAll('.product-card'));

  if (option === 'relevantes') {
    cardsArray.sort((a, b) => {
      const titleA = a.querySelector('.title-product')?.textContent?.toLowerCase() || '';
      const titleB = b.querySelector('.title-product')?.textContent?.toLowerCase() || '';
      return titleA.localeCompare(titleB);
    });
  } else if (option === 'precio-desc') {
    cardsArray.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '0');
      const priceB = parseFloat(b.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '0');
      return priceA - priceB;
    });
  } else if (option === 'precio-asc') {
    cardsArray.sort((a, b) => {
      const priceA = parseFloat(a.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '0');
      const priceB = parseFloat(b.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '0');
      return priceB - priceA;
    });
  }

  productGrid.innerHTML = '';
  cardsArray.forEach(card => productGrid.appendChild(card));
});
});
