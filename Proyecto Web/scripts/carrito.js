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
    const item = document.createElement('div');
    item.className = 'item-carrito';
    item.innerHTML = `
      <p><strong>${producto.nombre}</strong></p>
      <p>Precio: $${producto.precio}</p>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;

    listaCarrito.appendChild(item);
    total += producto.precio;
  });

  totalElement.textContent = total.toFixed(2);
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
