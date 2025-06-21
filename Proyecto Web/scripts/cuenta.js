const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';
const apiUrl = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblKZPYEmL0TT49LJ';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.registro-form');
  const errorPassword = document.getElementById('error-password');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorPassword.textContent = ''; 

    const nombre = document.querySelector('.reg-nombre').value.trim();
    const apellido = document.querySelector('.reg-apellido').value.trim();
    const email = document.querySelector('.reg-email').value.trim();
    const password = document.querySelector('.reg-password').value.trim();
    const repetirPassword = document.querySelector('.repetir-password').value.trim();
    
    const tipoCliente = form.querySelector('input[value="cliente"]').checked;
    const tipoVendedor = form.querySelector('input[value="vendedor"]').checked;

    if (password !== repetirPassword) {
      errorPassword.textContent = '⚠️ Las contraseñas no coinciden.';
      return;
    }

    if (!tipoCliente && !tipoVendedor) {
      alert('Seleccioná al menos un tipo de usuario.');
      return;
    }

    const data = {
      fields: {
        "Nombre": nombre,
        "Apellido": apellido,
        "Mail": email,
        "Contraseña": password,
        "Cliente": tipoCliente,
        "Vendedor": tipoVendedor
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }

      form.reset();
      window.location.href = 'index.html'; 
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al crear la cuenta.');
    }
  });
});
