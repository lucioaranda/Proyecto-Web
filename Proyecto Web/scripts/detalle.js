const apiUrlBase = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblrC3aTm2KIN2E9s';
const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';


async function cargarDetalleProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get('id');

  if (!idProducto) {
    alert('No se proporcionó el id del producto en la URL');
    return;
  }

  try {
    const response = await fetch(`${apiUrlBase}/${idProducto}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }

    const data = await response.json();

    if (!data.fields) {
      throw new Error('Producto no encontrado');
    }

    document.querySelector('.nombre-producto').textContent = data.fields.Nombre || 'Sin nombre';
    document.querySelector('.marca-producto').textContent = data.fields.Marca || 'Sin marca';

    const precioElement = document.querySelector('.precio-producto');
    if (data.fields.Oferta) {
      const precioOriginal = data.fields.Precio ? `$${data.fields.Precio}` : '';
      const precioOferta = `$${data.fields.Oferta}`;
      precioElement.innerHTML = `
        <span style="text-decoration: line-through; color: #999; margin-right: 10px;">${precioOriginal}</span>
        <span style="color: #E53935; font-weight: bold;">${precioOferta}</span>
      `;
    } else {
      precioElement.textContent = data.fields.Precio ? `$${data.fields.Precio}` : 'Sin precio';
    }

    document.querySelector('.descripcion-producto').textContent = data.fields.Descripcion || 'Sin descripción';
    document.querySelector('.envio-producto').textContent = data.fields.DeliveryFree ? 'Envío gratis' : '';

    if (data.fields.Imagen && data.fields.Imagen[0]?.url) {
      document.querySelector('.imagen-producto').src = data.fields.Imagen[0].url;
      document.querySelector('.imagen-producto').alt = data.fields.Nombre || 'Imagen del producto';
    } else {
      document.querySelector('.imagen-producto').src = "img's/no-image.png";
    }

  } catch (error) {
    console.error('Error al cargar detalle del producto:', error);
    alert('No se pudo cargar el detalle del producto.');
  }
}

document.addEventListener('DOMContentLoaded', cargarDetalleProducto);
