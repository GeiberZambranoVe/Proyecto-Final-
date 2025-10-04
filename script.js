let juegos = [];
let resenas = [];

const tiendaJuegos = [
  { titulo: "Cyberpunk 2077", precio: 59, imagen: "https://i.imgur.com/kqz4ZzF.jpg" },
  { titulo: "Elden Ring", precio: 69, imagen: "https://i.imgur.com/oXJp8Kk.jpg" },
  { titulo: "God of War", precio: 49, imagen: "https://i.imgur.com/NzM9iM0.jpg" }
];

// Mostrar juegos de tienda
function cargarTienda(){
  const cont = document.getElementById("tienda");
  cont.innerHTML = "";
  tiendaJuegos.forEach(j => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${j.imagen}" style="width:100%; border-radius:8px;">
      <h3>${j.titulo}</h3>
      <p>Precio: $${j.precio}</p>
      <button onclick="comprar('${j.titulo}')">Comprar</button>
    `;
    cont.appendChild(div);
  });
}
cargarTienda();

function comprar(nombre){
  alert(`¡Has comprado ${nombre}!`);
}

// Formulario de juegos
document.getElementById("form-juego").addEventListener("submit", (e)=>{
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const genero = document.getElementById("genero").value;
  const plataforma = document.getElementById("plataforma").value;
  const anio = document.getElementById("anio").value;

  const juego = { titulo, genero, plataforma, anio };
  juegos.push(juego);

  mostrarJuegos();
  actualizarStats();

  e.target.reset();
});

function mostrarJuegos(){
  const cont = document.getElementById("lista-juegos");
  cont.innerHTML = "";
  juegos.forEach(j => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${j.titulo}</h3>
      <p>${j.genero} - ${j.plataforma}</p>
      <small>Año: ${j.anio}</small>
    `;
    cont.appendChild(div);
  });
}

// Formulario reseñas
document.getElementById("form-resena").addEventListener("submit", (e)=>{
  e.preventDefault();
  const juego = document.getElementById("juegoResena").value;
  const puntuacion = document.getElementById("puntuacion").value;
  const texto = document.getElementById("textoResena").value;

  const resena = { juego, puntuacion, texto };
  resenas.push(resena);

  mostrarResenas();
  actualizarStats();

  e.target.reset();
});

function mostrarResenas(){
  const cont = document.getElementById("lista-resenas");
  cont.innerHTML = "";
  resenas.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${r.juego}</h3>
      <p>⭐ ${r.puntuacion}/5</p>
      <p>${r.texto}</p>
    `;
    cont.appendChild(div);
  });
}

// Estadísticas
function actualizarStats(){
  document.getElementById("stats").textContent = 
    `Juegos: ${juegos.length} | Reseñas: ${resenas.length}`;
}
