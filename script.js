// Next Level - script.js
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
function money(v){ return `$${v.toFixed(2)}` }
function sanitizeId(s){ return String(s).replace(/[^a-z0-9]/gi,'-').toLowerCase(); }


// LocalStorage keys
const LS_CART = 'nl_cart';
const LS_FAVS = 'nl_favs';
const LS_REV = 'nl_reviews';


let cart = JSON.parse(localStorage.getItem(LS_CART) || '[]');
let favs = JSON.parse(localStorage.getItem(LS_FAVS) || '[]');
let reviews = JSON.parse(localStorage.getItem(LS_REV) || '{}');


// DOM refs
const grid = $('#games-grid');
const search = $('#search');
const filterPlatform = $('#filter-platform');
const filterGenre = $('#filter-genre');
const cartCount = $('#cart-count');
const cartPanel = $('#cart-panel');
const favsPanel = $('#favs-panel');


const modal = $('#game-modal');
const modalImg = $('#modal-img');
const modalTitle = $('#modal-title');
const modalMeta = $('#modal-meta');
const modalDesc = $('#modal-desc');
const modalPrice = $('#modal-price');
const addCartBtn = $('#add-cart');
const toggleFavBtn = $('#toggle-fav');
const reviewForm = $('#review-form');
const reviewsList = $('#reviews-list');


let currentGameId = null;


// Init
function init(){
populateFilters();
renderGames(games);
updateCartUI();
attachListeners();
}


function populateFilters(){
const platforms = [...new Set(games.map(g=>g.platform))].sort();
platforms.forEach(p=>{
const opt = document.createElement('option'); opt.value=p; opt.textContent=p; filterPlatform.appendChild(opt);
});
const genres = [...new Set(games.map(g=>g.genre))].sort();
genres.forEach(g=>{const opt=document.createElement('option'); opt.value=g; opt.textContent=g; filterGenre.appendChild(opt)});
}


function renderGames(list){
grid.innerHTML='';
list.forEach(game=>{
const card = document.createElement('article'); card.className='card';
card.innerHTML = `
<img src="${game.image}" alt="${game.title}">
<h4>${game.title}</h4>
<p class="meta">${game.year} • ${game.platform}</p>
<p>${game.genre}</p>
<div class="actions">
<button data-id="${game.id}" class="open">Ver</button>
<button data-id="${game.id}" class="add">+Carrito</button>
</div>`;
grid.appendChild(card);
});
// attach open listeners
$$('.card .open').forEach(b=>b.addEventListener('click',e=>openModal(e.target.dataset.id)));
$$('.card .add').forEach(b=>b.addEventListener('click',e=>addToCart(Number(e.target.dataset.id))));
}


ul.appendChi