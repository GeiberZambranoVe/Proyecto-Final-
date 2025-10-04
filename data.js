// catálogo con variedad de géneros; algunos gratuitos (precio: 0)
const catalogoJuegos = [
  // Terror
  { titulo: "Resident Evil 7", genero: "Terror", plataforma: "PC", anio: 2017, desarrollador: "Capcom", descripcion: "Survival horror en primera persona. Explora una casa inquietante y sobrevive.", precio: 39, imagen: "https://i.imgur.com/JhQqFHV.jpg" },
  { titulo: "Outlast", genero: "Terror", plataforma: "PC", anio: 2013, desarrollador: "Red Barrels", descripcion: "Explora un psiquiátrico aterrador con cámara y linterna.", precio: 19, imagen: "https://i.imgur.com/YMkhKfO.jpg" },
  { titulo: "Phasmophobia", genero: "Terror", plataforma: "PC", anio: 2020, desarrollador: "Kinetic Games", descripcion: "Investigación multijugador de actividad paranormal.", precio: 14, imagen: "https://i.imgur.com/NB2Yk8J.jpg" },

  // Acción
  { titulo: "Cyberpunk 2077", genero: "Acción", plataforma: "PC", anio: 2020, desarrollador: "CD Projekt", descripcion: "Aventuras en Night City con narrativa y acción frenética.", precio: 49, imagen: "https://i.imgur.com/kqz4ZzF.jpg" },
  { titulo: "God of War", genero: "Acción", plataforma: "PlayStation", anio: 2018, desarrollador: "Santa Monica Studio", descripcion: "Kratos y Atreus en una épica mitológica.", precio: 39, imagen: "https://i.imgur.com/NzM9iM0.jpg" },
  { titulo: "Doom Eternal", genero: "Acción", plataforma: "Multi", anio: 2020, desarrollador: "id Software", descripcion: "FPS rápido y brutal contra demonios.", precio: 29, imagen: "https://i.imgur.com/3y3kBfK.jpg" },

  // Simulación
  { titulo: "The Sims 4", genero: "Simulación", plataforma: "PC", anio: 2014, desarrollador: "EA", descripcion: "Crea y controla la vida de tus Sims.", precio: 29, imagen: "https://i.imgur.com/8ZjB9GQ.jpg" },
  { titulo: "Microsoft Flight Simulator", genero: "Simulación", plataforma: "PC", anio: 2020, desarrollador: "Asobo Studio", descripcion: "Vuelo hiperrealista con el mundo entero.", precio: 59, imagen: "https://i.imgur.com/aErwxzj.jpg" },
  { titulo: "Stardew Valley", genero: "Simulación", plataforma: "Multi", anio: 2016, desarrollador: "ConcernedApe", descripcion: "Farming y vida en pueblo con corazón.", precio: 14, imagen: "https://i.imgur.com/EPgYFi6.jpg" },

  // RPG
  { titulo: "Elden Ring", genero: "RPG", plataforma: "PC", anio: 2022, desarrollador: "FromSoftware", descripcion: "Mundo abierto con combates desafiantes.", precio: 59, imagen: "https://i.imgur.com/oXJp8Kk.jpg" },
  { titulo: "The Witcher 3", genero: "RPG", plataforma: "PC", anio: 2015, desarrollador: "CD Projekt", descripcion: "Cacería de monstruos y grandes decisiones.", precio: 29, imagen: "https://i.imgur.com/DlV2EJk.jpg" },
  { titulo: "Divinity: Original Sin 2", genero: "RPG", plataforma: "PC", anio: 2017, desarrollador: "Larian Studios", descripcion: "RPG táctico con libertad máxima.", precio: 39, imagen: "https://i.imgur.com/8sQJZ1s.jpg" },

  // Deportes
  { titulo: "FIFA 23", genero: "Deportes", plataforma: "Multi", anio: 2022, desarrollador: "EA Sports", descripcion: "Simulador de fútbol con modos online.", precio: 69, imagen: "https://i.imgur.com/9B0gVRr.jpg" },
  { titulo: "NBA 2K23", genero: "Deportes", plataforma: "Multi", anio: 2022, desarrollador: "Visual Concepts", descripcion: "Simulador de baloncesto realista.", precio: 59, imagen: "https://i.imgur.com/7kFhEoB.jpg" },

  // Shooter / Multiplayer (incluye gratuitos)
  { titulo: "Fortnite", genero: "Acción", plataforma: "Multi", anio: 2017, desarrollador: "Epic Games", descripcion: "Battle Royale con construcción.", precio: 0, imagen: "https://i.imgur.com/dVvqK6u.jpg" },
  { titulo: "Valorant", genero: "Acción", plataforma: "PC", anio: 2020, desarrollador: "Riot Games", descripcion: "Shooter táctico 5v5 gratuito.", precio: 0, imagen: "https://i.imgur.com/d1TiOvE.jpg" },
  { titulo: "Apex Legends", genero: "Acción", plataforma: "Multi", anio: 2019, desarrollador: "Respawn", descripcion: "Hero-shooter Battle Royale gratuito.", precio: 0, imagen: "https://i.imgur.com/7i6aGm3.jpg" },
  { titulo: "Overwatch 2", genero: "Acción", platform: "Multi", plataforma: "Multi", anio: 2022, desarrollador: "Blizzard", descripcion: "Hero shooter por equipos.", precio: 0, imagen: "https://i.imgur.com/wnEYtKn.jpg" },

  // Más acción / indie / variados
  { titulo: "Hades", genero: "Acción", plataforma: "Multi", anio: 2020, desarrollador: "Supergiant Games", descripcion: "Roguelike con historia y combate adictivo.", precio: 24, imagen: "https://i.imgur.com/ld5x0oJ.jpg" },
  { titulo: "Celeste", genero: "Acción", plataforma: "Multi", anio: 2018, desarrollador: "Matt Makes Games", descripcion: "Plataformas desafiante con historia emotiva.", precio: 19, imagen: "https://i.imgur.com/1yK1m6T.jpg" },
  { titulo: "Red Dead Redemption 2", genero: "Acción", plataforma: "Multi", anio: 2018, desarrollador: "Rockstar Games", descripcion: "Western épico de mundo abierto.", precio: 59, imagen: "https://i.imgur.com/PK9pO3y.jpg" },

  // Añade más juegos para acercarte a 100 si quieres (puedes duplicar y cambiar nombre/imagen)
  { titulo: "SimCity", genero: "Simulación", plataforma: "PC", anio: 2013, desarrollador: "Maxis", descripcion: "Construye y administra tu ciudad.", precio: 9, imagen: "https://i.imgur.com/9z7kP9h.jpg" },
  { titulo: "Planet Zoo", genero: "Simulación", plataforma: "PC", anio: 2019, desarrollador: "Frontier", descripcion: "Crea y administra un zoológico.", precio: 49, imagen: "https://i.imgur.com/2vQ8Y1G.jpg" },
  { titulo: "ARK: Survival", genero: "Simulación", plataforma: "Multi", anio: 2017, desarrollador: "Studio Wildcard", descripcion: "Supervivencia con dinosaurios.", precio: 29, imagen: "https://i.imgur.com/3N0rNnD.jpg" },

  // Más RPG / aventura
  { titulo: "Horizon Zero Dawn", genero: "RPG", plataforma: "PC", anio: 2020, desarrollador: "Guerrilla Games", descripcion: "Aventura postapocalíptica con máquinas.", precio: 39, imagen: "https://i.imgur.com/4a4y1MB.jpg" },
  { titulo: "Ghost of Tsushima", genero: "Acción", plataforma: "PlayStation", anio: 2020, desarrollador: "Sucker Punch", descripcion: "Samuráis y mundo abierto.", precio: 49, imagen: "https://i.imgur.com/6wGfX8v.jpg" },

  // Indies y clásicos
  { titulo: "Undertale", genero: "RPG", plataforma: "Multi", anio: 2015, desarrollador: "Toby Fox", descripcion: "RPG único con múltiples finales.", precio: 9, imagen: "https://i.imgur.com/8vQXQpL.jpg" },
  { titulo: "Hollow Knight", genero: "Acción", plataforma: "Multi", anio: 2017, desarrollador: "Team Cherry", descripcion: "Metroidvania atmosférico.", precio: 15, imagen: "https://i.imgur.com/6zWfKkZ.jpg" },

  // Algunos gratuitos adicionales
  { titulo: "Team Fortress 2", genero: "Acción", plataforma: "PC", anio: 2007, desarrollador: "Valve", descripcion: "FPS por equipos gratuito.", precio: 0, imagen: "https://i.imgur.com/0zvGkqZ.jpg" },

  // Relleno para catálogo
  { titulo: "GameX: Arena", genero: "Acción", plataforma: "PC", anio: 2023, desarrollador: "Indie Lab", descripcion: "Arena PvP competitivo.", precio: 12, imagen: "https://i.imgur.com/z6h0GJb.jpg" },
  { titulo: "Racing Pro 2021", genero: "Simulación", plataforma: "Multi", anio: 2021, desarrollador: "DriveStudios", descripcion: "Carreras realistas.", precio: 29, imagen: "https://i.imgur.com/6I3kHkS.jpg" },
  { titulo: "Space Miner", genero: "RPG", plataforma: "PC", anio: 2022, desarrollador: "SpaceWorks", descripcion: "Aventura espacial y minería.", precio: 19, imagen: "https://i.imgur.com/qQjV0p9.jpg" },
  { titulo: "Soccer Manager", genero: "Deportes", plataforma: "PC", anio: 2019, desarrollador: "SportsSoft", descripcion: "Gestiona tu equipo y gana ligas.", precio: 14, imagen: "https://i.imgur.com/3u2bJFs.jpg" },

  // Puedes duplicar y variar para aumentar catálogo hasta 100 fácilmente.
];
