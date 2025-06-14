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
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${producto.imagenUrl}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Precio unitario: $${producto.precio}</p>
      <p>Cantidad: ${producto.cantidad}</p>
      <button class="btn-eliminar" data-index="${index}">Eliminar</button>
    `;

    listaCarrito.appendChild(card);
    total += producto.precio * producto.cantidad;
  });

  totalElement.textContent = total.toFixed(2);

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      eliminarProducto(index);
    });
  });
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

document.getElementById('finalizar-compra').addEventListener('click', () => {
  alert('¡Gracias por tu compra!');
  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
});

mostrarCarrito();
