/* VeGames - interacción, modal, biblioteca, carrito, reseñas por juego y persistencia localStorage */

/* --- Helpers --- */
function sanitizeId(name){
  return name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}
function saveState(){
  localStorage.setItem('veg_biblioteca', JSON.stringify(biblioteca));
  localStorage.setItem('veg_carrito', JSON.stringify(carrito));
  localStorage.setItem('veg_reseñas', JSON.stringify(reseñasPorJuego));
  localStorage.setItem('veg_compras', JSON.stringify(comprasRealizadas));
}
function loadState(){
  const b = localStorage.getItem('veg_biblioteca');
  const c = localStorage.getItem('veg_carrito');
  const r = localStorage.getItem('veg_reseñas');
  const comp = localStorage.getItem('veg_compras');
  if(b) biblioteca = JSON.parse(b);
  if(c) carrito = JSON.parse(c);
  if(r) reseñasPorJuego = JSON.parse(r);
  if(comp) comprasRealizadas = JSON.parse(comp);
}

/* --- Estado --- */
let biblioteca = [];
let carrito = [];
let reseñasPorJuego = {}; // { "titulo-san": [ {puntuacion,texto,horas,dificultad,recomendada} ] }
let comprasRealizadas = 0;

/* --- Mostrar catálogo por género --- */
function mostrarCatalogo(){
  const generos = ["Terror","Acción","Simulación","RPG","Deportes","Acción","Acción","Acción","Acción","Shooter","Acción"];
  // We'll explicitly map relevant containers we created
  const contMap = {
    "Terror": document.getElementById('terror'),
    "Acción": document.getElementById('accion'),
    "Simulación": document.getElementById('simulacion'),
    "RPG": document.getElementById('rpg'),
    "Deportes": document.getElementById('deportes'),
    "Shooter": document.getElementById('shooter')
  };

  // clear all
  Object.values(contMap).forEach(c=>{ if(c) c.innerHTML = ''; });

  catalogoJuegos.forEach(j => {
    // decide which container: try exact match to contMap keys; fallback to 'accion'
    const key = contMap[j.genero] ? j.genero : (j.genero === "Acción" ? "Acción" : (contMap[j.genero] ? j.genero : "Acción"));
    const cont = contMap[j.genero] || contMap["Acción"];
    if(!cont) return;
    const div = document.createElement('div');
    div.className = 'card';
    // FIX: Ahora toda la tarjeta abre el detalle
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(j.titulo)}')`);
    div.innerHTML = `
      <img src="${j.imagen}" alt="${j.titulo}">
      <div class="card-body">
        <h3>${j.titulo}</h3>
        <p>${j.genero} • ${j.plataforma}</p>
        <p style="font-weight:700; margin-top:6px">${j.precio===0 ? "Gratis" : "💲"+j.precio}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()"> <button class="btn-ghost" onclick="abrirDetalle('${escapeQuotes(j.titulo)}')">Ver más</button>
        <button class="btn-primary" onclick="agregarCarrito('${escapeQuotes(j.titulo)}')">🛒</button>
      </div>
    `;
    cont.appendChild(div);
  });
}
function escapeQuotes(s){ return s.replace(/'/g,"\\'").replace(/"/g,'\\"'); }

/* --- Modal detalle del juego --- */
function abrirDetalle(nombre){
  const juego = catalogoJuegos.find(j => j.titulo === nombre);
  if(!juego) return;
  const detalle = document.getElementById('detalle-juego');
  const idSafe = sanitizeId(juego.titulo);

  // Determinar si el juego ya está en la biblioteca para mostrar el botón correcto
  const enBiblioteca = biblioteca.some(j=>j.titulo===nombre);
  const btnBiblioteca = enBiblioteca 
    ? `<button class="btn-ghost" disabled>✔ En Biblioteca</button>`
    : `<button class="primary" onclick="agregarBiblioteca('${escapeQuotes(juego.titulo)}')">+ Biblioteca</button>`;

  detalle.innerHTML = `
    <div style="display:flex; gap:18px; align-items:flex-start; flex-wrap:wrap">
      <img src="${juego.imagen}" alt="${juego.titulo}" style="width:260px; border-radius:10px; object-fit:cover;">
      <div style="flex:1; min-width:260px">
        <h2 style="margin-top:0">${juego.titulo}</h2>
        <p><b>Género:</b> ${juego.genero}</p>
        <p><b>Plataforma:</b> ${juego.plataforma}</p>
        <p><b>Año:</b> ${juego.anio || 'N/A'}</p>
        <p><b>Desarrollador:</b> ${juego.desarrollador || 'N/A'}</p>
        <p style="margin-top:8px">${juego.descripcion || ''}</p>
        <p style="font-weight:700">${juego.precio===0 ? "Gratis" : "Precio: $"+juego.precio}</p>
        <div style="display:flex; gap:8px; margin-top:10px">
          ${btnBiblioteca} <button class="btn-ghost" onclick="agregarCarrito('${escapeQuotes(juego.titulo)}')">🛒 Añadir al carrito</button>
        </div>
      </div>
    </div>

    <hr style="margin:14px 0; border-color: rgba(255,255,255,0.06)">

    <div>
      <h3>Reseñas de ${juego.titulo}</h3>
      <div id="resenas-${idSafe}"></div>

      <form id="form-resena-${idSafe}" style="margin-top:12px">
        <input required id="puntuacion-${idSafe}" type="number" min="1" max="5" placeholder="⭐ Puntuación (1-5)" style="width:40%; padding:8px; margin-right:8px; display:inline-block">
        <input id="horas-${idSafe}" type="number" min="0" placeholder="Horas jugadas" style="width:30%; padding:8px; margin-right:8px; display:inline-block">
        <select id="dificultad-${idSafe}" style="width:28%; padding:8px; display:inline-block">
          <option>Fácil</option><option>Normal</option><option>Difícil</option>
        </select>
        <textarea id="texto-${idSafe}" placeholder="Escribe tu reseña..." style="width:100%; margin-top:8px; padding:8px"></textarea>
        <div style="display:flex; gap:8px; margin-top:8px">
          <label style="display:flex; align-items:center; gap:6px"><input id="recomendada-${idSafe}" type="checkbox"> Recomendaría</label>
          <button class="primary" type="button" onclick="agregarResenaModal('${escapeQuotes(juego.titulo)}')">Publicar reseña</button>
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
    toast(`${juego.titulo} añadido a tu biblioteca`);
    // Si se añade desde el modal de detalle, actualiza el botón
    const modalJuegoTitulo = document.querySelector('#detalle-juego h2')?.textContent;
    if(modalJuegoTitulo === nombre) abrirDetalle(nombre);
  } else {
    toast(`${juego.titulo} ya está en tu biblioteca`);
  }
}
function mostrarBiblioteca(){
  const cont = document.getElementById('lista-juegos');
  cont.innerHTML = '';
  if(biblioteca.length === 0){
    cont.innerHTML = '<p style="padding:12px; opacity:0.8">Tu biblioteca está vacía. Añade juegos desde Explorar.</p>';
    return;
  }
  biblioteca.forEach(j=>{
    const div = document.createElement('div');
    div.className = 'card';
    // FIX: Ahora toda la tarjeta abre el detalle
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(j.titulo)}')`);
    div.innerHTML = `
      <img src="${j.imagen}" alt="${j.titulo}">
      <div class="card-body">
        <h3>${j.titulo}</h3>
        <p>${j.genero} • ${j.plataforma}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()"> <button class="btn-ghost" onclick="abrirDetalle('${escapeQuotes(j.titulo)}')">Ver</button>
        <button class="btn-primary" onclick="quitarBiblioteca('${escapeQuotes(j.titulo)}')">Quitar</button>
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
  toast('Juego eliminado de la biblioteca');
}

/* --- Carrito --- */
function agregarCarrito(nombre){
  const juego = catalogoJuegos.find(j=>j.titulo===nombre);
  if(!juego) return;
  carrito.push(juego);
  mostrarCarrito();
  actualizarStats();
  saveState();
  document.getElementById('carrito-count').textContent = carrito.length;
  toast(`${juego.titulo} añadido al carrito`);
}
function mostrarCarrito(){
  const cont = document.getElementById('lista-carrito');
  cont.innerHTML = '';
  if(carrito.length === 0){
    cont.innerHTML = '<p style="padding:12px; opacity:0.8">Tu carrito está vacío.</p>';
    document.getElementById('total').textContent = 'Total: $0';
    document.getElementById('carrito-count').textContent = '0';
    document.getElementById('comprar-btn').disabled = true; // Deshabilita si está vacío
    return;
  }
  document.getElementById('comprar-btn').disabled = false; // Habilita si hay items
  let total = 0;
  carrito.forEach((j, idx)=>{
    total += (j.precio || 0);
    const div = document.createElement('div');
    div.className = 'card';
    // FIX: Ahora toda la tarjeta abre el detalle
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(j.titulo)}')`);
    div.innerHTML = `
      <img src="${j.imagen}" alt="${j.titulo}">
      <div class="card-body">
        <h3>${j.titulo}</h3>
        <p>${j.precio===0 ? "Gratis" : "💲"+j.precio}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()"> <button class="btn-ghost" onclick="abrirDetalle('${escapeQuotes(j.titulo)}')">Ver</button>
        <button class="btn-primary" onclick="removerCarrito(${idx})">Eliminar</button>
      </div>
    `;
    cont.appendChild(div);
  });
  document.getElementById('total').textContent = `Total: $${total}`;
  document.getElementById('carrito-count').textContent = carrito.length;
}
function removerCarrito(index){
  carrito.splice(index,1);
  mostrarCarrito();
  actualizarStats();
  saveState();
}

/* Checkout */
document.getElementById('comprar-btn').addEventListener('click', ()=>{
  if(carrito.length === 0){ toast('Carrito vacío'); return; }
  // Simula compra
  comprasRealizadas++;
  // Tras la compra, añade los juegos a la biblioteca si no son gratuitos
  carrito.forEach(j=>{
    if(!biblioteca.some(b=>b.titulo===j.titulo)){
      biblioteca.push(j);
    }
  });
  
  carrito = [];
  mostrarCarrito();
  mostrarBiblioteca(); // Actualiza la biblioteca tras la compra
  actualizarStats();
  saveState();
  toast('🎉 Compra realizada con éxito');
});

/* --- Reseñas por juego (modal) --- */
function agregarResenaModal(titulo){
  const idSafe = sanitizeId(titulo);
  const puntuacion = document.getElementById(`puntuacion-${idSafe}`).value;
  const texto = document.getElementById(`texto-${idSafe}`).value;
  const horas = document.getElementById(`horas-${idSafe}`) ? document.getElementById(`horas-${idSafe}`).value : 0;
  const dificultad = document.getElementById(`dificultad-${idSafe}`) ? document.getElementById(`dificultad-${idSafe}`).value : 'Normal';
  const recomendada = document.getElementById(`recomendada-${idSafe}`) ? document.getElementById(`recomendada-${idSafe}`).checked : false;

  if(!puntuacion){ toast('Pon una puntuación (1-5)'); return; }
  if(!reseñasPorJuego[titulo]) reseñasPorJuego[titulo] = [];
  reseñasPorJuego[titulo].unshift({ puntuacion: Number(puntuacion), texto, horas: Number(horas||0), dificultad, recomendada, fecha: new Date().toISOString() });
  mostrarResenas(titulo);
  actualizarStats();
  saveState();
  // Actualizar reseñas generales
  mostrarResenasGenerales();
  toast('Reseña publicada');
  // limpiar campos
  document.getElementById(`puntuacion-${idSafe}`).value = '';
  document.getElementById(`texto-${idSafe}`).value = '';
}
function mostrarResenas(titulo){
  const idSafe = sanitizeId(titulo);
  const cont = document.getElementById(`resenas-${idSafe}`);
  if(!cont) return;
  cont.innerHTML = '';
  const lista = reseñasPorJuego[titulo] || [];
  if(lista.length === 0){
    cont.innerHTML = '<p style="opacity:0.8">No hay reseñas aún. Sé el primero en escribir una.</p>';
    return;
  }
  lista.forEach(r=>{
    const node = document.createElement('div');
    node.style.padding = '8px 0';
    node.innerHTML = `<strong>⭐ ${r.puntuacion}/5</strong> • ${r.horas}h • ${r.dificultad} ${r.recomendada ? ' • 👍 Recomendada' : ''}
      <div style="margin-top:6px; color:#dfe9ff">${escapeHtml(r.texto)}</div>
      <hr style="border-color: rgba(255,255,255,0.04); margin:8px 0">`;
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
  // ordenar por fecha
  all.sort((a,b)=> new Date(b.fecha) - new Date(a.fecha));
  all.slice(0,24).forEach(r=>{
    const div = document.createElement('div');
    div.className = 'card';
    // FIX: Ahora toda la tarjeta abre el detalle
    div.setAttribute('onclick', `abrirDetalle('${escapeQuotes(r.titulo)}')`);
    div.innerHTML = `
      <div class="card-body">
        <h3 style="font-size:15px">${r.titulo}</h3>
        <p style="margin:6px 0">⭐ ${r.puntuacion}/5 • ${r.horas}h • ${r.dificultad}</p>
        <p style="color:#dfe9ff; font-size:13px">${escapeHtml(r.texto)}</p>
      </div>
      <div class="card-actions" onclick="event.stopPropagation()"> <button class="btn-ghost" onclick="abrirDetalle('${escapeQuotes(r.titulo)}')">Ver juego</button>
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
  // simple toast (alert-lite)
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.right = '16px';
  t.style.bottom = '16px';
  t.style.background = 'linear-gradient(90deg, #00f0ff, #9b59ff)';
  t.style.color = '#001';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '10px';
  t.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
  t.style.zIndex = 3000;
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity = '0.0', 2300);
  setTimeout(()=> t.remove(), 2600);
}

/* --- Init: carga estado, muestra catálogo y datos --- */
loadState();
mostrarCatalogo();
mostrarBiblioteca();
mostrarCarrito();
mostrarResenasGenerales();
actualizarStats();