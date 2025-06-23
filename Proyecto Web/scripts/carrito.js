let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const listaCarrito = document.getElementById('lista-carrito');
const totalElement = document.getElementById('total');

function mostrarCarrito() {
  listaCarrito.innerHTML = '';

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
    totalElement.textContent = '0';
    return;
  }

  let total = 0;

  carrito.forEach((producto, index) => {
    const precioUnitario = producto.oferta || producto.precio;

    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${producto.imagenUrl}" alt="${producto.nombre}">
      <p class="brand">${producto.marca || ''}</p>
      <h3>${producto.nombre}</h3>
      <p>Precio unitario: $${precioUnitario}</p>
      <div class="actions">
        <div class="counter">
          <button class="btn-minum" data-index="${index}">−</button>
          <span class="quantity">${producto.cantidad}</span>
          <button class="btn-plus" data-index="${index}">+</button>
        </div>
        <button class="btn-delete" data-index="${index}">Eliminar</button>
      </div>
    `;

    listaCarrito.appendChild(card);
    total += precioUnitario * producto.cantidad;
  });

  totalElement.textContent = total.toFixed(2);

  document.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      carrito[index].cantidad++;
      actualizarCarrito();
    });
  });

  document.querySelectorAll('.btn-minum').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        actualizarCarrito();
      }
      
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });
}

function actualizarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

document.getElementById('finalizar-compra').addEventListener('click', () => {
  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  window.location.href = 'index.html';
});

mostrarCarrito();
