let productos = [];
let productosFiltrados = [];
let paginaActual = 1;
const productosPorPagina = 12;

async function cargarProductosDesdeAirtable() {
  const apiUrl = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblrC3aTm2KIN2E9s';
  const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';

  try {
    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const data = await response.json();
    if (!data.records || !Array.isArray(data.records)) throw new Error('Formato inesperado');

    productos = data.records.map(record => {
      const f = record.fields;
      return {
        id: record.id,
        nombre: f.Nombre || 'Sin nombre',
        marca: f.Marca || 'Sin marca',
        precio: typeof f.Precio === 'number' ? f.Precio.toFixed(0) : 'N/A',
        imagenUrl: (f.Imagen && f.Imagen[0]?.url) || "img's/no-image.png",
        envioGratis: Boolean(f.DeliveryFree),
        oferta: f.Oferta || null
      };
    });
    productosFiltrados = [...productos];
    crearControlesPaginacion();
    mostrarPagina(paginaActual);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function mostrarPagina(numPag) {
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = '';
  const total = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
  paginaActual = Math.min(numPag, total);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;

  productosFiltrados.slice(inicio, fin).forEach(prod => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      ${prod.envioGratis ? '<div class="envio-gratis-label">DeliveryFree</div>' : ''}
      <img src="${prod.imagenUrl}" alt="${prod.nombre}">
      <h4 class="brand">${prod.marca}</h4>
      <h3 class="title-product">${prod.nombre}</h3>
      <p class="price">
        ${prod.oferta
          ? `<span class="antes">Antes: <span class="tachado">$${prod.precio}</span></span>
             <span class="ahora">Ahora: $${prod.oferta}</span>`
          : `Precio: $${prod.precio}`
        }
      </p>
      <div class="actions">
        <button class="btn-buy">Comprar</button>
      </div>`;
    card.addEventListener('click', e => {
      if (!e.target.closest('button')) window.location.href = `detalle.html?id=${prod.id}`;
    });
    card.querySelector('.btn-buy').addEventListener('click', () => {
      agregarAlCarrito({ nombre: prod.nombre, marca: prod.marca, precio: prod.oferta || prod.precio, cantidad: 1, imagenUrl: prod.imagenUrl });
    });
    grid.appendChild(card);
  });

  actualizarControlesPaginacion();
}

function crearControlesPaginacion() {
  let cont = document.querySelector('.pagination-controls');
  if (!cont) {
    cont = document.createElement('div');
    cont.className = 'pagination-controls';
    const parent = document.querySelector('.product-grid').parentElement;
    const btnPrev = document.createElement('button');
    btnPrev.id = 'btn-prev'; btnPrev.textContent = '⬅';
    const span = document.createElement('span'); span.id = 'pagina-actual';
    const btnNext = document.createElement('button');
    btnNext.id = 'btn-next'; btnNext.textContent = '➡';
    cont.append(btnPrev, span, btnNext);
    parent.appendChild(cont);

    btnPrev.addEventListener('click', () => mostrarPagina(paginaActual - 1));
    btnNext.addEventListener('click', () => mostrarPagina(paginaActual + 1));
  }
  actualizarControlesPaginacion();
}

function actualizarControlesPaginacion() {
  const total = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;
  paginaActual = Math.min(paginaActual, total);
  document.getElementById('pagina-actual').textContent = `Página ${paginaActual} de ${total}`;
  document.getElementById('btn-prev').disabled = paginaActual === 1;
  document.getElementById('btn-next').disabled = paginaActual === total;
}

function aplicarFiltrosYOrden() {
  const texto = document.getElementById('input-search-products')?.value.toLowerCase() || '';
  const gratis = document.getElementById('filtro-envio-gratis')?.checked;
  const oferta = document.getElementById('filtro-oferta')?.checked;

  productosFiltrados = productos.filter(p =>
    (p.nombre.toLowerCase().includes(texto) || p.marca.toLowerCase().includes(texto)) &&
    (!gratis || p.envioGratis) &&
    (!oferta || p.oferta)
  );
  paginaActual = 1;
  mostrarPagina(paginaActual);
}

document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDesdeAirtable();
  actualizarContadorCarrito();

  ['filtro-envio-gratis','filtro-oferta','input-search-products'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(id === 'input-search-products' ? 'input' : 'change', aplicarFiltrosYOrden);
  });

  document.getElementById('sort-select')?.addEventListener('change', () => {
    const opt = document.getElementById('sort-select').value;
    if (opt === 'precio-desc') productosFiltrados.sort((a, b) => a.precio - b.precio);
    else if (opt === 'precio-asc') productosFiltrados.sort((a, b) => b.precio - a.precio);
    else if (opt === 'relevantes') productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    paginaActual = 1;
    mostrarPagina(paginaActual);
  });
});
