let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const total = carrito.reduce((a, p) => a + p.cantidad, 0);
  const contador = document.getElementById('carrito-cantidad');
  if (contador) contador.textContent = total;
}

function agregarAlCarrito(prodNuevo) {
  const idx = carrito.findIndex(p => p.nombre === prodNuevo.nombre);
  if (idx !== -1) carrito[idx].cantidad += prodNuevo.cantidad;
  else carrito.push(prodNuevo);
  guardarCarrito();
}

async function autenticarUsuario(email, contraseña) {
  const apiUrl = 'https://api.airtable.com/v0/appPMktlLjM6I2FCD/tblKZPYEmL0TT49LJ';
  const apiKey = 'patU5qeiI8CO9vDSJ.257a51187209cb32dc01fdcf2e9960e72b8a7a472d49511bff61b5b736c77862';
  try {
    const resp = await fetch(apiUrl, { headers: { Authorization: `Bearer ${apiKey}` } });
    const data = await resp.json();
    const user = data.records.map(r => r.fields).find(u => u.Mail === email && u.Contraseña === contraseña);
    return user || null;
  } catch (e) {
    console.error('Error auth:', e);
    return null;
  }
}

function mostrarMenuUsuarioLogueado(usuario) {
  const loginBoxOut = document.querySelector('.login-box-logged-out');
  const loginBoxIn = document.querySelector('.login-box-logged-in');
  const nombreDiv = document.getElementById('nombre-usuario');
  const menuIcon = document.querySelector('.menu-hover');

  if (loginBoxOut) loginBoxOut.style.display = 'none';
  if (loginBoxIn) loginBoxIn.style.display = 'none';

  if (usuario) {
    if (nombreDiv) nombreDiv.textContent = usuario.Nombre || '';
    if (usuario.Vendedor === true) {
      if (menuIcon) menuIcon.style.display = 'inline-block';
    } else {
      if (menuIcon) menuIcon.style.display = 'none';
    }

  } else {
    if (nombreDiv) nombreDiv.textContent = '';
    if (menuIcon) menuIcon.style.display = 'none';
  
  }
}

function cerrarSesion() {
  localStorage.removeItem('usuario');
  mostrarMenuUsuarioLogueado(null);
}

function inicializarLogin() {
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
  if (btnLogout) btnLogout.addEventListener('click', cerrarSesion);

  const loginHover = document.querySelector('.login-hover');
  const loginBoxOut = document.querySelector('.login-box-logged-out');
  const loginBoxIn = document.querySelector('.login-box-logged-in');

  loginHover?.addEventListener('click', e => {
    e.stopPropagation();

    if (loginBoxIn?.style.display === 'block') {
      loginBoxIn.style.display = 'none';
    } else if (loginBoxOut?.style.display === 'block') {
      loginBoxOut.style.display = 'none';
    } else {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        loginBoxIn.style.display = 'block';
        loginBoxOut.style.display = 'none';
      } else {
        loginBoxOut.style.display = 'block';
        loginBoxIn.style.display = 'none';
      }
    }
  });

  loginBoxOut?.addEventListener('click', e => e.stopPropagation());
  loginBoxIn?.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', e => {
    if (!loginHover?.contains(e.target)) {
      if (loginBoxOut) loginBoxOut.style.display = 'none';
      if (loginBoxIn) loginBoxIn.style.display = 'none';
    }
  });
}

function inicializarMenuVendedor() {
  const menuHover = document.querySelector('.menu-hover');
  const menuBox = document.querySelector('.menu-box');

  menuHover?.addEventListener('click', e => {
    e.stopPropagation();
    if (menuBox) {
      menuBox.style.display = menuBox.style.display === 'block' ? 'none' : 'block';
    }
  });

  menuBox?.addEventListener('click', e => e.stopPropagation());

  document.addEventListener('click', e => {
    if (!menuHover?.contains(e.target)) {
      if (menuBox) menuBox.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const guardado = localStorage.getItem('usuario');
  if (guardado) {
    mostrarMenuUsuarioLogueado(JSON.parse(guardado));
  } else {
    mostrarMenuUsuarioLogueado(null);
  }

  inicializarLogin();
  inicializarMenuVendedor();
  actualizarContadorCarrito();
});
