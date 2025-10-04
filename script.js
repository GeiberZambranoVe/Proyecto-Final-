let juegos = [];
let resenas = [];

// Formulario de juegos
document.getElementById("form-juego").addEventListener("submit", (e)=>{
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const genero = document.getElementById("genero").value;
  const plataforma = document.getElementById("plataforma").value;

  const juego = { titulo, genero, plataforma };
  juegos.push(juego);

  mostrarJuegos();
  actualizarStats();

  e.target.reset();
});

// Mostrar juegos
function mostrarJuegos(){
  const contenedor = document.getElementById("lista-juegos");
  contenedor.innerHTML = "";
  juegos.forEach(j => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h3>${j.titulo}</h3><p>${j.genero} • ${j.plataforma}</p>`;
    contenedor.appendChild(div);
  });
}

// Formulario de reseñas
document.getElementById("form-resena").addEventListener("submit", (e)=>{
  e.preventDefault();
  const juego = document.getElementById("juegoResena").value;
  const texto = document.getElementById("textoResena").value;

  const resena = { juego, texto };
  resenas.push(resena);

  mostrarResenas();
  actualizarStats();

  e.target.reset();
});

// Mostrar reseñas
function mostrarResenas(){
  const contenedor = document.getElementById("lista-resenas");
  contenedor.innerHTML = "";
  resenas.forEach(r => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h4>${r.juego}</h4><p>${r.texto}</p>`;
    contenedor.appendChild(div);
  });
}

// Actualizar estadísticas
function actualizarStats(){
  document.getElementById("stats").textContent = 
    `Juegos: ${juegos.length} | Reseñas: ${resenas.length}`;
}
