document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();

  const guardado = localStorage.getItem('usuario');
  if (guardado) {
    const usr = JSON.parse(guardado);
    mostrarMenuUsuarioLogueado(usr);
  } else {
    mostrarMenuUsuarioLogueado(null);
  }

  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const pass = document.getElementById('password').value.trim();
      if (!email || !pass) return;

      const u = await autenticarUsuario(email, pass);
      if (u) {
        localStorage.setItem('usuario', JSON.stringify(u));
        mostrarMenuUsuarioLogueado(u);
        form.reset();
      } else {
        alert('Email o contraseña incorrecta');
      }
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  btnLogout?.addEventListener('click', () => {
    localStorage.removeItem('usuario');
    mostrarMenuUsuarioLogueado(null);
  });

 
});

const apiUrl = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblrC3aTm2KIN2E9s';
const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';

async function cargarDatos() {
  try {
    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const data = await res.json();

    if (!data.records) throw new Error('No se recibieron registros');
    mostrarDatos(data.records);
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

function mostrarDatos(records) {
  const tbody = document.querySelector('#tabla-productos tbody');
  tbody.innerHTML = '';

  records.forEach(record => {
    const f = record.fields;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><input type="text" value="${f.Marca || ''}" data-field="Marca" /></td>
      <td><input type="text" value="${f.Nombre || ''}" data-field="Nombre" /></td>
      <td><input type="number" value="${f.Precio || ''}" data-field="Precio" /></td>
      <td><input type="checkbox" ${f.DeliveryFree ? 'checked' : ''} data-field="DeliveryFree" /></td>
      <td><input type="text" value="${f.Descripcion || ''}" data-field="Descripcion" /></td>
      <td><input type="number" value="${f.Oferta || ''}" data-field="Oferta" /></td>
      <td>
        <button class="btn-guardar" data-id="${record.id}">Guardar</button>
        <button class="btn-eliminar" data-id="${record.id}">Eliminar</button>
      </td>
    `;

  
    tr.querySelector('.btn-guardar').addEventListener('click', () => {
      const inputs = tr.querySelectorAll('input');
      const updateData = {};

      inputs.forEach(input => {
        const key = input.getAttribute('data-field');
        if (input.type === 'checkbox') {
          updateData[key] = input.checked;
        } else if (input.type === 'number') {
          const val = input.value.trim();
          updateData[key] = val === '' ? null : Number(val);
        } else {
          updateData[key] = input.value.trim();
        }
      });

      actualizarRegistro(record.id, updateData);
    });

   
  tr.querySelector('.btn-eliminar').addEventListener('click', () => {
  eliminarRegistro(record.id);
});

    tbody.appendChild(tr);
  });
}

async function actualizarRegistro(recordId, data) {
  try {
    const res = await fetch(`${apiUrl}/${recordId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: data })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Error desconocido al actualizar');
    }

    cargarDatos(); 
  } catch (error) {
    console.error('Error al actualizar:', error);
    alert('Error al actualizar el producto: ' + error.message);
  }
}

async function eliminarRegistro(recordId) {
  try {
    const res = await fetch(`${apiUrl}/${recordId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || 'Error desconocido al eliminar');
    }

 
    cargarDatos(); 
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar el producto: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', cargarDatos);
