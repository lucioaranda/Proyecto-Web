async function cargarProductosDesdeAirtable() {
  const apiUrl = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblrC3aTm2KIN2E9s';
  const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (!data.records || !Array.isArray(data.records)) {
      console.error('Formato de respuesta inesperado:', data);
      return;
    }

    const productGrid = document.querySelector('.product-grid');

    data.records.forEach(record => {
      const fields = record.fields;
      const nombre = fields.Nombre || 'Sin nombre';
      const marca = fields.Marca || 'Sin marca';
      const precio = typeof fields.Precio === 'number' ? fields.Precio.toFixed(0) : 'N/A';
      const imagenUrl = (fields.Imagen && fields.Imagen[0]?.url) || 'img\'s/no-image.png';

      const card = document.createElement('article');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${imagenUrl}" alt="${nombre}">
        <h4 class="brand">${marca}</h4>
        <h3 class="title-product">${nombre}</h3>
        <p class="price">Precio: $${precio}</p>
        <div class="actions">
          <div class="counter">
            <button class="btn-minum">-</button>
            <span class="quantity">1</span>
            <button class="btn-plus">+</button>
          </div>
          <button class="btn-buy">Comprar</button>
        </div>
      `;

      productGrid.appendChild(card);
    });

    aplicarEventosContadores();

  } catch (error) {
    console.error('Error al cargar productos desde Airtable:', error);
  }
}

function aplicarEventosContadores() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const btnMinus = counter.querySelector('.btn-minum'); 
    const btnPlus = counter.querySelector('.btn-plus');
    const quantity = counter.querySelector('.quantity');

    if (!btnMinus || !btnPlus || !quantity) return;

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
}

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
cargarProductosDesdeAirtable();
});
// Recordar subir las img´s a la nube para que se carguen desde ahi.