const apiUrlBase = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblrC3aTm2KIN2E9s';
const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';

async function cargarDetalleProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const idProducto = urlParams.get('id');

  if (!idProducto) {
    alert('No se proporcionó el ID del producto en la URL');
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
        <span>${precioOriginal}</span>
        <span>${precioOferta}</span>
      `;
    } else {
      precioElement.textContent = data.fields.Precio ? `$${data.fields.Precio}` : 'Sin precio';
    }

   
    document.querySelector('.descripcion-producto').textContent =
      data.fields.Descripcion || 'Sin descripción';

   
    const envioElement = document.querySelector('.envio-producto');
    if (data.fields.DeliveryFree) {
      envioElement.textContent = 'Envío gratis';
      envioElement.style.color = '#2e8132'; 
    } else {
      envioElement.textContent = '';
    }

   
    const imagen = document.querySelector('.imagen-producto');
    if (data.fields.Imagen && data.fields.Imagen[0]?.url) {
      imagen.src = data.fields.Imagen[0].url;
      imagen.alt = data.fields.Nombre || 'Imagen del producto';
    } else {
      imagen.src = "img's/no-image.png";
      imagen.alt = "Imagen no disponible";
    }

  } catch (error) {
    console.error('Error al cargar detalle del producto:', error);
    alert('No se pudo cargar el detalle del producto.');
  }
}

document.addEventListener('DOMContentLoaded', cargarDetalleProducto);
