/* Pixel Quest - interacción, modal, biblioteca, carrito, reseñas por juego y persistencia localStorage */

/* --- Helpers --- */
function sanitizeId(name){
  return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}
function saveState(){
  localStorage.setItem('pq_biblioteca', JSON.stringify(biblioteca));
  localStorage.setItem('pq_carrito', JSON.stringify(carrito));
  localStorage.setItem('pq_reseñas', JSON.stringify(reseñasPorJuego));
  localStorage.setItem('pq_compras', JSON.stringify(comprasRealizadas));
}
function loadState(){
  const b = localStorage.getItem('pq_biblioteca');
  const c = localStorage.getItem('pq_carrito');
  const r = localStorage.getItem('pq_reseñas');
  const comp = localStorage.getItem('pq_compras');
  if(b) biblioteca = JSON.parse(b);
  if(c) carrito = JSON.parse(c);
  if(r) reseñasPorJuego = JSON.parse(r);
  if(comp) comprasRealizadas = JSON.parse(comp);
}
function escapeQuotes(s){ return s.replace(/'/g,"\\'").replace(/"/g,'\\"'); }

/* --- Estado --- */
let biblioteca = [];
let carrito = [];
let reseñasPorJuego = {}; // { "titulo-san": [ {puntuacion,texto,horas,dificultad,recomendada} ] }
let comprasRealizadas = 0;

/* --- Nuevo: Splash Screen --- */
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Simular tiempo de carga del juego/recursos
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 1500); // 1.5s de transición en CSS
        }
        
        // Inicializar el resto de la página después del splash
        filtrarCatalogo();
        mostrarBiblioteca();
        mostrarCarrito();
        mostrarResenasGenerales();
        actualizarStats();
    }, 2800); // Duración de la animación de carga + un pequeño retraso
});


/* --- Mostrar catálogo completo y Filtrado --- */
function mostrarCatalogo(juegosFiltrados = catalogoJuegos){
  const cont = document.getElementById('catalogo-completo');
  if(!cont) return;

  cont.innerHTML = '';
  document.getElementById('loading-message')?.remove();

  if(juegosFiltrados.length === 0){
    cont.innerHTML = '<p style="padding:12px; opacity:0.8; color:var(--mario-red); font-family:\'Press Start 2P\', cursive; font-size:12px">NO HAY RESULTADOS!</p>';
    return;
  }

  juegosFiltrados.forEach(j => {
    const div = document.createElement('div');
    div.className = 'card';
    // Importante: Hacemos que toda la tarjeta abra el detalle al hacer clic
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(j.titulo)}')`); 
    
    div.innerHTML = `
      <img src="${j.imagen}" alt="${j.titulo}">
      <div class="card-body">
        <h3>${j.titulo}</h3>
        <p>${j.genero} • ${j.plataforma}</p>
        <p style="font-weight:700; margin-top:8px">${j.precio===0 ? "<span style='color:var(--mario-green)'>¡GRATIS!</span>" : "💲"+j.precio}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()"> <button class="btn-base btn-ghost" onclick="abrirDetalle('${escapeQuotes(j.titulo)}')">INFO</button>
        <button class="btn-base btn-primary" onclick="agregarCarrito('${escapeQuotes(j.titulo)}')">COMPRAR</button>
      </div>
    `;
    cont.appendChild(div);
  });
}

function filtrarCatalogo(){
  const textoFiltro = document.getElementById('filtro-nombre').value.toLowerCase();
  const generoFiltro = document.getElementById('filtro-genero').value.toLowerCase();

  const juegosFiltrados = catalogoJuegos.filter(j => {
    const matchNombre = j.titulo.toLowerCase().includes(textoFiltro);
    const matchGenero = generoFiltro === 'todos' || j.genero.toLowerCase() === generoFiltro;
    return matchNombre && matchGenero;
  });

  mostrarCatalogo(juegosFiltrados);
}

/* --- Modal detalle del juego --- */
function abrirDetalle(nombre){
  const juego = catalogoJuegos.find(j => j.titulo === nombre);
  if(!juego) return;
  const detalle = document.getElementById('detalle-juego');
  const idSafe = sanitizeId(juego.titulo);

  // Determinar el botón de biblioteca (si está o no)
  const enBiblioteca = biblioteca.some(j=>j.titulo===nombre);
  const btnBiblioteca = enBiblioteca 
    ? `<button class="btn-base btn-ghost" disabled>✔ EN BIBLIOTECA</button>`
    : `<button class="btn-base primary" onclick="agregarBiblioteca('${escapeQuotes(juego.titulo)}')">+ BIBLIOTECA</button>`;

  detalle.innerHTML = `
    <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap">
      <img src="${juego.imagen}" alt="${juego.titulo}" style="width:280px; border-radius:4px; object-fit:cover;">
      <div style="flex:1; min-width:280px">
        <h2 style="margin-top:0">${juego.titulo}</h2>
        <p><b>GÉNERO:</b> ${juego.genero}</p>
        <p><b>PLATAFORMA:</b> ${juego.plataforma}</p>
        <p><b>AÑO:</b> ${juego.anio || 'N/A'}</p>
        <p><b>DESARROLLADOR:</b> ${juego.desarrollador || 'N/A'}</p>
        <p style="margin-top:10px; font-size:15px; color:var(--text-light); font-family: 'IBM Plex Mono', monospace;">${juego.descripcion || ''}</p>
        <p style="font-size:24px; font-weight:700; color:var(--mario-red); margin-top:15px; text-shadow:2px 2px 0 var(--mario-yellow);">${juego.precio===0 ? "GRATIS" : "PRECIO: $"+juego.precio}</p>
        <div style="display:flex; gap:10px; margin-top:20px">
          ${btnBiblioteca}
          <button class="btn-base btn-ghost" onclick="agregarCarrito('${escapeQuotes(juego.titulo)}')">🛒 COMPRAR</button>
        </div>
      </div>
    </div>

    <hr style="margin:20px 0; border-color:var(--mario-yellow); border-style:dashed;">

    <div>
      <h3 style="font-size:16px;">RESEÑAS DE ESTE JUEGO</h3>
      <div id="resenas-${idSafe}" style="max-height: 250px; overflow-y: auto; padding-right: 10px;"></div>

      <form id="form-resena-${idSafe}" style="margin-top:20px; background-color:var(--card-bg); padding:15px; border:2px solid var(--mario-red); border-radius:4px;">
        <h4 style="font-size:12px; color:var(--mario-yellow); margin-top:0;">DEJA TU RESEÑA:</h4>
        <div style="display:flex; gap:8px; margin-bottom:10px; align-items:center; flex-wrap:wrap">
          <input required id="puntuacion-${idSafe}" type="number" min="1" max="5" placeholder="PUNTUACIÓN (1-5)" style="flex:1; min-width:120px;">
          <input id="horas-${idSafe}" type="number" min="0" placeholder="HORAS JUGADAS" style="flex:1; min-width:120px;">
          <select id="dificultad-${idSafe}" style="flex:1; min-width:120px; text-transform:uppercase;">
            <option>FÁCIL</option><option>NORMAL</option><option>DIFÍCIL</option><option>EXTREMA</option>
          </select>
        </div>
        <textarea id="texto-${idSafe}" placeholder="ESCRIBE TU RESEÑA..." style="width:100%; margin-top:8px;"></textarea>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px">
          <label style="display:flex; align-items:center; gap:6px; font-weight:500; color:var(--mario-yellow)"><input id="recomendada-${idSafe}" type="checkbox"> RECOMENDARÍA</label>
          <button class="btn-base primary" type="button" onclick="agregarResenaModal('${escapeQuotes(juego.titulo)}')">PUBLICAR</button>
        </div>
      </form>
    </div>
  `;
  mostrarResenas(juego.titulo);
  openModal();
}

/* modal open/close */
const modalEl = document.getElementById('modal');
function openModal(){ modalEl.style.display = 'flex'; modalEl.setAttribute('aria-hidden','false'); }
function closeModal(){ modalEl.style.display = 'none'; modalEl.setAttribute('aria-hidden','true'); }

/* cerrar con botón o clic fuera */
document.getElementById('cerrarModal').addEventListener('click', closeModal);
window.addEventListener('click', (ev)=>{
  if(ev.target === modalEl) closeModal();
});

/* --- Biblioteca --- */
function agregarBiblioteca(nombre){
  const juego = catalogoJuegos.find(j=>j.titulo===nombre);
  if(!juego) return;
  if(!biblioteca.some(j=>j.titulo===nombre)){
    biblioteca.push(juego);
    mostrarBiblioteca();
    actualizarStats();
    saveState();
    toast(`✅ ${juego.titulo} ADQUIRIDO!`);
    const modalJuegoTitulo = document.querySelector('#detalle-juego h2')?.textContent;
    if(modalJuegoTitulo === nombre) abrirDetalle(nombre); 
  } else {
    toast(`⚠️ ${juego.titulo} YA ES TUYO!`);
  }
}
function mostrarBiblioteca(){
  const cont = document.getElementById('lista-juegos');
  cont.innerHTML = '';
  if(biblioteca.length === 0){
    cont.innerHTML = '<p style="padding:12px; opacity:0.8; color:var(--mario-green)">BIBLIOTECA VACÍA. ¡A JUGAR!</p>';
    return;
  }
  biblioteca.forEach(j=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(j.titulo)}')`);
    div.innerHTML = `
      <img src="${j.imagen}" alt="${j.titulo}">
      <div class="card-body">
        <h3>${j.titulo}</h3>
        <p>${j.genero} • ${j.plataforma}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn-base btn-ghost" onclick="abrirDetalle('${escapeQuotes(j.titulo)}')">JUGAR</button>
        <button class="btn-base btn-primary" onclick="quitarBiblioteca('${escapeQuotes(j.titulo)}')">QUITAR</button>
      </div>
    `;
    cont.appendChild(div);
  });
}
function quitarBiblioteca(nombre){
  biblioteca = biblioteca.filter(j=>j.titulo!==nombre);
  mostrarBiblioteca();
  actualizarStats();
  saveState();
  toast('🗑️ JUEGO DESINSTALADO');
}

/* --- Carrito --- */
function agregarCarrito(nombre){
  const juego = catalogoJuegos.find(j=>j.titulo===nombre);
  if(!juego) return;
  carrito.push(juego);
  mostrarCarrito();
  actualizarStats();
  saveState();
  document.getElementById('carrito-count').textContent = `(${carrito.length})`;
  toast(`🛒 ${juego.titulo} AL CARRITO!`);
}
function mostrarCarrito(){
  const cont = document.getElementById('lista-carrito');
  cont.innerHTML = '';
  if(carrito.length === 0){
    cont.innerHTML = '<p style="padding:12px; opacity:0.8">CARRITO VACÍO. NO GASTES!</p>';
    document.getElementById('total').textContent = 'TOTAL: $0';
    document.getElementById('carrito-count').textContent = '(0)';
    document.getElementById('comprar-btn').disabled = true;
    return;
  }
  document.getElementById('comprar-btn').disabled = false;
  let total = 0;
  carrito.forEach((j, idx)=>{
    total += (j.precio || 0);
    const div = document.createElement('div');
    div.className = 'card';
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(j.titulo)}')`);
    div.innerHTML = `
      <img src="${j.imagen}" alt="${j.titulo}">
      <div class="card-body">
        <h3>${j.titulo}</h3>
        <p style="font-weight:700; color:var(--mario-red)">${j.precio===0 ? "¡GRATIS!" : "💲"+j.precio}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn-base btn-ghost" onclick="abrirDetalle('${escapeQuotes(j.titulo)}')">VER</button>
        <button class="btn-base btn-primary" onclick="removerCarrito(${idx})">BORRAR</button>
      </div>
    `;
    cont.appendChild(div);
  });
  document.getElementById('total').textContent = `TOTAL: $${total}`;
  document.getElementById('carrito-count').textContent = `(${carrito.length})`;
}
function removerCarrito(index){
  carrito.splice(index,1);
  mostrarCarrito();
  actualizarStats();
  saveState();
}

/* Checkout */
document.getElementById('comprar-btn').addEventListener('click', ()=>{
  if(carrito.length === 0){ toast('CARRITO VACÍO'); return; }
  comprasRealizadas++;
  carrito.filter(j=>j.precio > 0).forEach(j=>{
    if(!biblioteca.some(b=>b.titulo===j.titulo)){
      biblioteca.push(j);
    }
  });
  
  carrito = [];
  mostrarCarrito();
  mostrarBiblioteca();
  actualizarStats();
  saveState();
  toast('🎉 COMPRA EXITOSA! GRACIAS!');
});

/* --- Reseñas por juego (modal) --- */
function agregarResenaModal(titulo){
  const idSafe = sanitizeId(titulo);
  const puntuacionEl = document.getElementById(`puntuacion-${idSafe}`);
  const textoEl = document.getElementById(`texto-${idSafe}`);
  const horasEl = document.getElementById(`horas-${idSafe}`);
  const dificultadEl = document.getElementById(`dificultad-${idSafe}`);
  const recomendadaEl = document.getElementById(`recomendada-${idSafe}`);
  
  const puntuacion = puntuacionEl.value;
  const texto = textoEl.value;
  const horas = horasEl ? horasEl.value : 0;
  const dificultad = dificultadEl ? dificultadEl.value : 'NORMAL';
  const recomendada = recomendadaEl ? recomendadaEl.checked : false;

  if(!puntuacion){ toast('🚨 PUNTUACIÓN REQUERIDA (1-5)'); return; }
  if(!reseñasPorJuego[titulo]) reseñasPorJuego[titulo] = [];
  reseñasPorJuego[titulo].unshift({ puntuacion: Number(puntuacion), texto, horas: Number(horas||0), dificultad, recomendada, fecha: new Date().toISOString() });
  
  mostrarResenas(titulo);
  actualizarStats();
  saveState();
  mostrarResenasGenerales();
  toast('⭐ RESEÑA PUBLICADA!');
  
  puntuacionEl.value = '';
  textoEl.value = '';
  if(horasEl) horasEl.value = '';
  if(recomendadaEl) recomendadaEl.checked = false;
}
function mostrarResenas(titulo){
  const idSafe = sanitizeId(titulo);
  const cont = document.getElementById(`resenas-${idSafe}`);
  if(!cont) return;
  cont.innerHTML = '';
  const lista = reseñasPorJuego[titulo] || [];
  if(lista.length === 0){
    cont.innerHTML = '<p style="opacity:0.8; margin:10px 0; color:var(--text-muted);">SIN RESEÑAS. ESCRIBE LA PRIMERA!</p>';
    return;
  }
  lista.forEach(r=>{
    const node = document.createElement('div');
    node.style.padding = '10px 0';
    node.innerHTML = `<strong>⭐ ${r.puntuacion}/5</strong> <span style="font-size:13px; color:var(--text-muted)">• ${r.horas}h • ${r.dificultad.toUpperCase()} ${r.recomendada ? ' • <span style="color:var(--mario-green)">👍 RECOMENDADA</span>' : ''}</span>
      <div style="margin-top:4px; font-size:14px; font-family: 'IBM Plex Mono', monospace;">${escapeHtml(r.texto)}</div>
      <hr style="border-color: rgba(255,255,255,0.08); margin:10px 0">`;
    cont.appendChild(node);
  });
}

/* --- Reseñas generales (panel principal) --- */
function mostrarResenasGenerales(){
  const cont = document.getElementById('lista-resenas');
  cont.innerHTML = '';
  const all = [];
  Object.keys(reseñasPorJuego).forEach(t=>{
    reseñasPorJuego[t].forEach(r=> all.push({ titulo: t, ...r }));
  });
  all.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));
  
  if(all.length === 0){
     cont.innerHTML = '<p style="padding:12px; opacity:0.8; color:var(--mario-yellow)">AÚN NO HAY RESEÑAS.</p>';
     return;
  }

  all.slice(0,24).forEach(r=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(r.titulo)}')`);
    div.innerHTML = `
      <div class="card-body">
        <h3 style="font-size:14px">${r.titulo}</h3>
        <p style="margin:4px 0">⭐ ${r.puntuacion}/5 • ${r.horas}h</p>
        <p style="color:var(--text-light); font-size:13px; margin-top:6px; opacity:0.9; max-height:40px; overflow:hidden;">"${escapeHtml(r.texto)}"</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="btn-base btn-ghost" onclick="abrirDetalle('${escapeQuotes(r.titulo)}')">VER JUEGO</button>
      </div>
    `;
    cont.appendChild(div);
  });
}

/* --- Estadísticas --- */
function actualizarStats(){
  document.getElementById('stats').textContent = `Juegos en biblioteca: ${biblioteca.length} | Reseñas: ${Object.values(reseñasPorJuego).reduce((acc,a)=>acc+a.length,0)} | Compras realizadas: ${comprasRealizadas}`;
}

/* --- Utilidades --- */
function escapeHtml(text){
  if(!text) return '';
  return String(text).replace(/[&<>"]/g, function (s) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s]; });
}
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.right = '20px';
  t.style.bottom = '20px';
  t.style.background = 'var(--mario-red)';
  t.style.color = 'var(--text-light)';
  t.style.padding = '12px 18px';
  t.style.borderRadius = '4px';
  t.style.border = '2px solid var(--mario-yellow)';
  t.style.boxShadow = '3px 3px 0px #000';
  t.style.zIndex = 3000;
  t.style.transition = 'all 0.3s ease-out';
  t.style.fontFamily = `'Press Start 2P', cursive`; 
  t.style.fontSize = '10px';
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '0', 3000);
  setTimeout(()=> t.remove(), 3300);
}

// Ya no se llama a init al final, sino en el DOMContentLoaded para esperar al splash screen
// loadState();
// filtrarCatalogo(); 
// mostrarBiblioteca();
// mostrarCarrito();
// mostrarResenasGenerales();
// actualizarStats();