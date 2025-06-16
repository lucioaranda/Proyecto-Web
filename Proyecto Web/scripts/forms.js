async function subirImagenAImgBB(file) {
  const imgbbApiKey = '560472bdaaf1bd190ee960f3a9858b82';
  const formData = new FormData();
  formData.append('image', await convertirA_Base64(file));

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      console.error('Error subiendo imagen a ImgBB:', data);
      alert('Error al subir la imagen a ImgBB');
      return null;
    }
  } catch (error) {
    console.error('Error de red o subida:', error);
    alert('Error de red al subir la imagen');
    return null;
  }
}

async function convertirA_Base64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function guardarProductoEnAirtable(producto) {
  const apiUrl = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblrC3aTm2KIN2E9s';
  const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: producto })
    });

    const data = await response.json();

    if (data.error) {
      console.error('Error Airtable:', data.error);
      alert('Error al guardar producto en Airtable');
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error guardando en Airtable:', error);
    alert('Error de red al guardar producto');
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');

  if (!form) {
    console.error('Formulario no encontrado. ¿El id es correcto?');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputFile = document.getElementById('imagen');
    const file = inputFile.files[0];
    if (!file) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const urlImagen = await subirImagenAImgBB(file);
    if (!urlImagen) return;

    const nombre = document.getElementById('nombre').value.trim();
    const productName = document.getElementById('product-name').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);

    const producto = {
      Nombre: productName,
      Marca: nombre,
      Precio: precio,
      Imagen: [{ url: urlImagen }]
    };

    const exito = await guardarProductoEnAirtable(producto);
    if (exito) {
      alert('Producto cargado con éxito');
      e.target.reset();
    }
  });
});
