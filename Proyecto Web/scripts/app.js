let productos = []; 
let productosFiltrados = []; 
let paginaActual = 1;
const productosPorPagina = 16;

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

    productos = data.records.map(record => {
      const fields = record.fields;
<<<<<<< HEAD
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
=======
      return {
        nombre: fields.Nombre || 'Sin nombre',
        marca: fields.Marca || 'Sin marca',
        precio: typeof fields.Precio === 'number' ? fields.Precio.toFixed(0) : 'N/A',
        imagenUrl: (fields.Imagen && fields.Imagen[0]?.url) || "img/s/no-image.png"
      };
>>>>>>> 6b81187 (update_pagination)
    });

    
    productosFiltrados = [...productos];

    crearControlesPaginacion();
    mostrarPagina(paginaActual);
  } catch (error) {
    console.error('Error al cargar productos desde Airtable:', error);
  }
}

function mostrarPagina(numeroPagina) {
  const productGrid = document.querySelector('.product-grid');
  productGrid.innerHTML = '';

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;

  if (numeroPagina > totalPaginas) {
    paginaActual = totalPaginas;
    numeroPagina = totalPaginas;
  }

  const inicio = (numeroPagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, fin);

  productosPagina.forEach(producto => {
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${producto.imagenUrl}" alt="${producto.nombre}">
      <h4 class="brand">${producto.marca}</h4>
      <h3 class="title-product">${producto.nombre}</h3>
      <p class="price">Precio: $${producto.precio}</p>
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
  actualizarControlesPaginacion();
}

function crearControlesPaginacion() {
  let contenedor = document.querySelector('.pagination-controls');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.className = 'pagination-controls';
    contenedor.style.display = 'flex';
    contenedor.style.justifyContent = 'center';
    contenedor.style.alignItems = 'center';
    contenedor.style.gap = '10px';
    contenedor.style.marginTop = '20px';

    const container = document.querySelector('.product-grid').parentElement;
    container.appendChild(contenedor);

    const btnPrev = document.createElement('button');
    btnPrev.textContent = '⬅ Anterior';
    btnPrev.id = 'btn-prev';
    btnPrev.style.cursor = 'pointer';

    const btnNext = document.createElement('button');
    btnNext.textContent = 'Siguiente ➡';
    btnNext.id = 'btn-next';
    btnNext.style.cursor = 'pointer';

    const spanPagina = document.createElement('span');
    spanPagina.id = 'pagina-actual';

    contenedor.appendChild(btnPrev);
    contenedor.appendChild(spanPagina);
    contenedor.appendChild(btnNext);

    btnPrev.addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        mostrarPagina(paginaActual);
      }
    });

    btnNext.addEventListener('click', () => {
      const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
      if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarPagina(paginaActual);
      }
    });
  }
  actualizarControlesPaginacion();
}

function actualizarControlesPaginacion() {
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const spanPagina = document.getElementById('pagina-actual');

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;

  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  if (spanPagina) {
    spanPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }
  if (btnPrev) {
    btnPrev.disabled = paginaActual === 1;
  }
  if (btnNext) {
    btnNext.disabled = paginaActual === totalPaginas;
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


function aplicarFiltrosYOrden() {
  const searchInput = document.querySelector('.search-filter input[type="text"]');
  const filter = searchInput ? searchInput.value.toLowerCase() : '';

  productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(filter)
  );

  paginaActual = 1;
  mostrarPagina(paginaActual);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDesdeAirtable();

  
  const searchInput = document.querySelector('.search-filter input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      aplicarFiltrosYOrden();
    });
  }

 
  const sortSelect = document.getElementById('sort-select');
  const productGrid = document.querySelector('.product-grid');

  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const option = sortSelect.value;

      if (option === 'relevantes') {
        productosFiltrados.sort((a, b) =>
          a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase())
        );
      } else if (option === 'precio-desc') {
        productosFiltrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
      } else if (option === 'precio-asc') {
        productosFiltrados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
      }

      paginaActual = 1;
      mostrarPagina(paginaActual);
    });
  }
});
