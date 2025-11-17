// --- Constantes y Funciones de Utilidad ---
const LOCAL_STORAGE_KEY = 'arsenalDatalogData';

/**
 * Genera un ID único simple.
 * @returns {string} Un ID único.
 */
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

/**
 * Carga los datos de la biblioteca desde localStorage.
 * @returns {Object} El estado de la aplicación.
 */
const loadData = () => {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : { games: [] };
    } catch (e) {
        console.error("Error al cargar datos de localStorage:", e);
        return { games: [] };
    }
};

/**
 * Guarda el estado actual de la aplicación en localStorage.
 * @param {Object} state - El estado de la aplicación.
 */
const saveData = (state) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Error al guardar datos en localStorage:", e);
    }
};

// Mapeo de estados con nombres japoneses para el renderizado
const statusMapRender = {
    'Playing': { text: 'JIKKŌ-CHŪ | 実行中', class: 'status-playing' },
    'Completed': { text: 'KANRYŌ | 完了', class: 'status-completed' },
    'Backlog': { text: 'HORYŪ | 保留', class: 'status-backlog' }
};

// Mapeo de nombres de filtro a claves de datos
const statusMapFilter = {
    'Todos': 'Todos',
    'En Ejecución': 'Playing',
    'Completado': 'Completed',
    'Pendiente': 'Backlog'
};

// --- Objeto Principal de la Aplicación (Kiroku App) ---
const app = {
    state: loadData(),
    currentView: 'library', 

    /**
     * Inicializa la aplicación y renderiza la vista inicial.
     */
    init() {
        this.renderLibrary();
        document.getElementById('appModal').addEventListener('click', this.handleModalClick);
    },

    /**
     * Maneja la interacción con los datos.
     * @param {Object} newState - El nuevo estado (parcial) a fusionar.
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        saveData(this.state);
        this.renderLibrary();
    },

    // --- Renderizado de Componentes ---

    /**
     * Renderiza las estrellas de puntuación.
     * @param {number} rating - La puntuación (0-5).
     * @returns {string} HTML de las estrellas.
     */
    renderStars(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const cls = i <= rating ? 'star-filled' : 'star-empty';
            html += `<svg class="w-5 h-5 inline-block ${cls}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.373 2.45c-.307.223-.466.594-.466.965l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.373-2.45c-.307-.223-.68-.223-.987 0l-3.373 2.45c-.784.57-1.84-.197-1.54-1.118l1.287-3.96c0-.371-.159-.742-.466-.965l-3.373-2.45c-.784-.57-.382-1.81.588-1.81h4.17c.365 0 .708-.182.95-.69l1.286-3.96z"></path></svg>`;
        }
        return html;
    },

    /**
     * Renderiza la vista principal de la biblioteca.
     */
    renderLibrary(games = this.state.games) {
        const content = document.getElementById('appContent');
        content.innerHTML = `
            <div class="mb-6 border-b border-gray-700 pb-4">
                <h2 class="text-xl sm:text-2xl font-bold text-white mb-4 card-title">KIROKU ACTIVO: ${games.length} REGISTROS DISPONIBLES</h2>
                <div class="flex flex-wrap gap-3 text-sm font-medium">
                    ${this.renderStatusFilter()}
                </div>
            </div>
            <div id="gameList" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                ${games.map(game => this.renderGameCard(game)).join('')}
            </div>
            ${games.length === 0 ? '<p class="text-center text-gray-400 mt-12 font-semibold">| KIROKU VACÍO | INICIA UN NUEVO REGISTRO.</p>' : ''}
        `;
    },

    /**
     * Renderiza los botones de filtro por estado.
     */
    renderStatusFilter() {
        const statuses = ['Todos', 'En Ejecución', 'Completado', 'Pendiente'];
        return statuses.map(status => {
            const isActive = this.state.filterStatus === status;
            const baseCls = 'py-2 px-4 rounded-full cursor-pointer transition duration-200 border';
            const activeCls = 'filter-active text-white shadow-lg border-none';
            const inactiveCls = 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border-gray-600';

            return `<span 
                        class="${baseCls} ${isActive ? activeCls : inactiveCls}" 
                        onclick="app.filterByStatus('${status}')">
                        ${status}
                    </span>`;
        }).join('');
    },

    /**
     * Aplica el filtro de estado a la lista de juegos.
     */
    filterByStatus(status) {
        this.state.filterStatus = status;
        const search = document.getElementById('searchInput').value.toLowerCase();
        this.searchGames(search, status);
    },

    /**
     * Renderiza una tarjeta individual de juego.
     */
    renderGameCard(game) {
        const status = statusMapRender[game.status] || statusMapRender['Backlog'];
        
        const cover = game.coverUrl || `https://placehold.co/200x300/1A1A1A/${encodeURIComponent('FF004D')}/?text=${encodeURIComponent(game.title.substring(0, 10))}&font=Michroma`;

        return `
            <div class="game-card rounded-lg flex flex-col cursor-pointer" onclick="app.showGameDetails('${game.id}')">
                <div class="relative w-full h-44 sm:h-56 md:h-64 lg:h-72">
                    <img src="${cover}" alt="Portada de ${game.title}" 
                         onerror="this.onerror=null;this.src='https://placehold.co/200x300/1A1A1A/${encodeURIComponent('FF004D')}/?text=${encodeURIComponent(game.title.substring(0, 10))}&font=Michroma'"
                         class="w-full h-full object-cover rounded-t-lg">
                    <span class="absolute top-2 right-2 text-xs font-bold px-3 py-1 rounded-sm ${status.class} shadow-lg card-platform">
                        ${status.text}
                    </span>
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="text-base font-bold truncate text-white mb-1 card-title">${game.title}</h3>
                    <p class="text-xs text-gray-400 mb-2 card-platform">${game.platform}</p>
                    <div class="flex items-center space-x-1 mt-auto">
                        ${this.renderStars(game.rating)}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Muestra los detalles de un juego en un modal.
     */
    showGameDetails(id) {
        const game = this.state.games.find(g => g.id === id);
        if (!game) return;

        const content = document.getElementById('modalContent');
        const cover = game.coverUrl || `https://placehold.co/250x350/1A1A1A/${encodeURIComponent('FF004D')}/?text=KIROKU+FILE&font=Michroma`;
        const status = statusMapRender[game.status] || statusMapRender['Backlog'];

        content.innerHTML = `
            <div class="flex justify-between items-start mb-6 border-b-2 pb-3" style="border-color: var(--color-primary-kanji);">
                <h2 class="text-3xl font-bold text-white uppercase card-title" style="color: var(--color-primary-kanji);">${game.title}</h2>
                <button onclick="app.hideModal()" class="text-gray-400 hover:text-white transition duration-150">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 font-inter">
                <div class="md:col-span-1 flex flex-col items-center">
                    <img src="${cover}" alt="Portada" class="w-full h-auto rounded-lg shadow-xl mb-4 border" style="border-color: var(--color-secondary-neon);">
                    <div class="mt-4 flex space-x-3 w-full">
                        <button onclick="app.showGameForm('${game.id}')" class="flex-1 btn-primary py-2 rounded-lg text-sm">EDITAR KIROKU</button>
                        <button onclick="app.deleteGame('${game.id}')" class="flex-1 btn-danger py-2 rounded-lg text-sm">ELIMINAR ARCHIVO</button>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <h3 class="text-xl font-bold mb-3 uppercase details-title" style="color: var(--color-secondary-neon);">ESPECIFICACIONES DE REGISTRO</h3>
                    <div class="space-y-3 text-sm text-gray-300 mb-6 card-platform">
                        <p><strong>Plataforma:</strong> <span class="text-white">${game.platform}</span></p>
                        <p><strong>Estado:</strong> <span class="font-bold text-lg ${status.class}">${status.text}</span></p>
                        <p><strong>Tiempo Jugado:</strong> <span class="text-white">${game.hoursPlayed} HRS.</span></p>
                    </div>
                    
                    <h3 class="text-xl font-bold mb-3 uppercase details-title" style="color: var(--color-secondary-neon);">INFORME TÉCNICO</h3>
                    <div class="flex items-center space-x-3 mb-4">
                        ${this.renderStars(game.rating)}
                        <span class="text-3xl font-bold card-title" style="color: var(--color-primary-kanji);">${game.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <p class="text-gray-400 whitespace-pre-wrap leading-relaxed card-platform">
                        ${game.review || 'Sin informe detallado en el archivo. Actualiza este registro para completar el Datalog.'}
                    </p>
                </div>
            </div>
        `;
        this.showModal();
    },

    // --- Funciones de Gestión de Datos (CRUD) ---

    /**
     * Muestra el formulario para agregar o editar un juego.
     */
    showGameForm(id = null) {
        const game = id ? this.state.games.find(g => g.id === id) : {};
        const isEdit = !!id;
        
        const title = isEdit ? `MODIFICAR KIROKU: ${game.title}` : 'NUEVO REGISTRO';
        const buttonText = isEdit ? 'SOBREESCRIBIR ARCHIVO' : 'GENERAR KIROKU';

        const content = document.getElementById('modalContent');
        content.innerHTML = `
            <div class="flex justify-between items-start mb-6 border-b-2 pb-3" style="border-color: var(--color-primary-kanji);">
                <h2 class="text-2xl font-bold text-white uppercase card-title">${title}</h2>
                <button onclick="app.hideModal()" class="text-gray-400 hover:text-white transition duration-150">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <form id="gameForm" onsubmit="event.preventDefault(); app.saveGame(this, '${id || ''}')" class="space-y-5 font-inter">
                <input type="hidden" name="id" value="${id || ''}">
                
                <!-- Título -->
                <div>
                    <label for="title" class="block text-sm font-medium text-gray-300 mb-1">TÍTULO DEL ARCHIVO</label>
                    <input type="text" id="title" name="title" value="${game.title || ''}" required class="w-full p-3 rounded-lg">
                </div>
                
                <!-- Plataforma y Horas Jugadas -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="platform" class="block text-sm font-medium text-gray-300 mb-1">PLATAFORMA</label>
                        <input type="text" id="platform" name="platform" value="${game.platform || ''}" required class="w-full p-3 rounded-lg">
                    </div>
                    <div>
                        <label for="hoursPlayed" class="block text-sm font-medium text-gray-300 mb-1">HORAS DE JUEGO (HRS)</label>
                        <input type="number" id="hoursPlayed" name="hoursPlayed" value="${game.hoursPlayed || 0}" min="0" required class="w-full p-3 rounded-lg">
                    </div>
                </div>

                <!-- Estado y Portada -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="status" class="block text-sm font-medium text-gray-300 mb-1">ESTADO DEL JUEGO</label>
                        <select id="status" name="status" required class="w-full p-3 rounded-lg">
                            <option value="Playing" ${game.status === 'Playing' ? 'selected' : ''}>JIKKŌ-CHŪ | 実行中 (En Ejecución)</option>
                            <option value="Completed" ${game.status === 'Completed' ? 'selected' : ''}>KANRYŌ | 完了 (Completado)</option>
                            <option value="Backlog" ${game.status === 'Backlog' || !game.status ? 'selected' : ''}>HORYŪ | 保留 (Pendiente)</option>
                        </select>
                    </div>
                    <div>
                        <label for="coverUrl" class="block text-sm font-medium text-gray-300 mb-1">URL DE IMAGEN (OPCIONAL)</label>
                        <input type="url" id="coverUrl" name="coverUrl" value="${game.coverUrl || ''}" class="w-full p-3 rounded-lg">
                    </div>
                </div>

                <!-- Puntuación -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">EVALUACIÓN (HOSHII | 星)</label>
                    <div id="ratingInput" class="flex items-center space-x-2">
                        ${this.renderRatingInputs(game.rating || 0)}
                    </div>
                    <input type="hidden" name="rating" id="hiddenRating" value="${game.rating || 0}">
                </div>

                <!-- Reseña -->
                <div>
                    <label for="review" class="block text-sm font-medium text-gray-300 mb-1">INFORME DE RENDIMIENTO</label>
                    <textarea id="review" name="review" rows="5" class="w-full p-3 rounded-lg">${game.review || ''}</textarea>
                </div>

                <button type="submit" class="w-full btn-primary font-bold py-3 rounded-lg shadow-lg text-lg card-title">${buttonText}</button>
            </form>
        `;
        this.showModal();
    },

    /**
     * Renderiza los inputs de rating para el formulario.
     */
    renderRatingInputs(currentRating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const cls = i <= currentRating ? 'star-filled' : 'star-empty';
            html += `<svg 
                        class="w-8 h-8 cursor-pointer transition duration-150 hover:scale-110" 
                        data-rating="${i}"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        onclick="app.setRating(${i})"
                        onmouseover="app.previewRating(${i})"
                        onmouseout="app.clearPreviewRating()">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.373 2.45c-.307.223-.466.594-.466.965l1.287 3.96c0.3.921-.755 1.688-1.54 1.118l-3.373-2.45c-.307-.223-.68-.223-.987 0l-3.373 2.45c-.784.57-1.84-.197-1.54-1.118l1.287-3.96c0-.371-.159-.742-.466-.965l-3.373-2.45c-.784-.57-.382-1.81.588-1.81h4.17c.365 0 .708-.182.95-.69l1.286-3.96z"></path>
                     </svg>`;
        }
        return html;
    },

    /**
     * Establece la puntuación final.
     */
    setRating(rating) {
        document.getElementById('hiddenRating').value = rating;
        this.updateStarVisuals(rating);
    },
    
    /**
     * Previsualiza la puntuación.
     */
    previewRating(rating) {
        this.updateStarVisuals(rating, true);
    },

    /**
     * Limpia la previsualización del rating.
     */
    clearPreviewRating() {
        const currentRating = parseInt(document.getElementById('hiddenRating').value);
        this.updateStarVisuals(currentRating);
    },
    
    /**
     * Actualiza el color de las estrellas en el formulario.
     */
    updateStarVisuals(rating, isPreview = false) {
        const stars = document.getElementById('ratingInput').querySelectorAll('svg');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('star-filled');
                star.classList.remove('star-empty');
            } else {
                star.classList.add('star-empty');
                star.classList.remove('star-filled');
            }
        });
    },

    /**
     * Guarda un juego nuevo o editado.
     */
    saveGame(form, id) {
        const formData = new FormData(form);
        const isEdit = !!id; 
        
        const gameData = {
            title: formData.get('title'),
            platform: formData.get('platform'),
            status: formData.get('status'),
            hoursPlayed: parseInt(formData.get('hoursPlayed')) || 0,
            coverUrl: formData.get('coverUrl') || null,
            rating: parseInt(formData.get('rating')) || 0,
            review: formData.get('review'),
        };
        
        if (isEdit) {
            this.state.games = this.state.games.map(g => 
                g.id === id ? { ...g, ...gameData } : g
            );
        } else {
            gameData.id = generateId();
            this.state.games.push(gameData);
        }
        
        this.setState({ games: this.state.games });
        this.hideModal();
    },

    /**
     * Elimina un juego.
     */
    deleteGame(id) {
        const deleteConfirmed = confirm('¡ADVERTENCIA! Esta acción eliminará el archivo de KIROKU de forma permanente.'); 
        if (deleteConfirmed) {
            this.state.games = this.state.games.filter(g => g.id !== id);
            this.setState({ games: this.state.games });
            this.hideModal();
        }
    },
    
    /**
     * Busca juegos en la biblioteca.
     */
    searchGames(query, statusFilter = this.state.filterStatus || 'Todos') {
        const q = query.toLowerCase().trim();
        
        let filteredGames = this.state.games;

        if (statusFilter !== 'Todos') {
            const statusKey = statusMapFilter[statusFilter];
            filteredGames = filteredGames.filter(game => game.status === statusKey);
        }
        
        if (q.length > 0) {
            filteredGames = filteredGames.filter(game =>
                game.title.toLowerCase().includes(q) ||
                game.platform.toLowerCase().includes(q)
            );
        }

        this.renderLibrary(filteredGames);
    },

    // --- Modal ---

    showModal() {
        const modal = document.getElementById('appModal');
        const content = document.getElementById('modalContent');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    },
    
    hideModal() {
        const modal = document.getElementById('appModal');
        const content = document.getElementById('modalContent');
        
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            content.innerHTML = ''; 
        }, 300); 
    }
};

// Inicializa la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (app.state.games.length === 0) {
        app.state.games = [
            { id: generateId(), title: "Ghost of Tsushima", platform: "PS5", status: "Completed", hoursPlayed: 85, rating: 5, review: "Una oda a los samuráis. El combate y el mundo son impresionantes. KANRYŌ.", coverUrl: "https://placehold.co/200x300/1A1A1A/FF004D/?text=Tsushima" },
            { id: generateId(), title: "Persona 5 Royal", platform: "Switch", status: "Playing", hoursPlayed: 120, rating: 4, review: "Estilo puro y una historia cautivadora. Larga duración, JIKKŌ-CHŪ.", coverUrl: "https://placehold.co/200x300/1A1A1A/FF00FF/?text=Persona+5" },
            { id: generateId(), title: "Final Fantasy XVI", platform: "PC", status: "Backlog", hoursPlayed: 0, rating: 0, review: "Esperando la hora de la descarga. HORYŪ.", coverUrl: "https://placehold.co/200x300/1A1A1A/FFFFFF/?text=FF16" },
        ];
        saveData(app.state);
    }
    app.init();
});
