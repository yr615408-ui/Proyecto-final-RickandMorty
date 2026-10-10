//==============================================
// 1. FIRMA DEL DESARROLLADOR Y VARIABLES GLOBALES
//================================================
// Escribe tu nombre y documento exactos. Esto personalizará la aplicación.
const developerName = "YEISON RAMIREZ";
const developerId = "68709";
const baseUrl = "https://rickandmortyapi.com/api";

// Arreglo para guardar los favoritos (lo usaremos más adelante)
let favoritesArray = [];

//==================================
// 2. SELECCIÓN DE ELEMENTOS DEL DOM
//==================================
const dataContainer = document.getElementById('dataContainer');
const btnCharacters = document.getElementById('btnCharacters');
const btnLocations = document.getElementById('btnLocations');
const btnEpisodes = document.getElementById('btnEpisodes');
const btnFavorites = document.getElementById('btnFavorites');
const mainFooter = document.getElementById('mainFooter');

//================================================
// 3. INYECCION DINAMICA DE LA FIRMA (FOOTER)
//===============================================
// Modificamos el contenidos del footer en tiempo real
mainFooter.innerHTML = `<p>Developed with 💻 by <strong>${developerName}</strong> - ID: ${developerId}</p>`;


//====================================
//4. FUNCION PARA OBTENER DATOS (ASINCRONIA)
//============================================
//Recibe el 'endpoint'para saber que datos buscar (/characters, /location /episode)
async function fetchData(endpoint) {
    try {
        //Mostramos un mensaje de carga,mientras llegan los datos
        dataContainer.innerHTML = '<p class="loading-text">Loading multiverse data...</p>';
        const response = await fetch(`${baseUrl}${endpoint}`);
        const data = await response.json();
        //La api de rick and morty guarda los items dentro de una propiedad llamada resulta
        return data.results;
    } catch (error) {
        console.error("Error: ", error);
        dataContainer.innerHTML = '<p class="loading-text" styles="color: red;">Connection error</p>';
    }
}

//=========================================================
//5. FUNCIONES DE RENDERIZADO
//=========================================================

//Funcion para pintar personajes (Incluye el boton de favoritos)
function renderCharacters(charactersData) {
    dataContainer.innerHTML = ' '; //Limpiamos la pantalla

    charactersData.forEach(character => {
        //Determinamos el color del estado (Alive = verde, Dead= rojo)
        const statusColor = character.status === 'Alive' ? 'lime' :
            (character.status === 'Dead' ? 'red' : 'gray');

        const cardHtml = `
       <article class= "data-card">
        <img src = "${character.image}" alt="${character.name}">
        <div class="card-info">
            <h2>${character.name}</h2>
            <p class= "info-label">Status: <span style= "color ${statusColor}">${character.status}</span></p>
            <p class= "info-label">Species: ${character.species}</p>
            
                    <!--Botón para guardar favorito. le pasamos el nombre del personaje en una funcion onclick-->
                    <button class="btn-add-fav" onclick="addToFavorites('${character.name}', '${character.image}')">
                         ⭐ Add to Favorites
                    </button>
                 </div>
            </article>
            `;
        dataContainer.innerHTML += cardHtml;
    });
}

//Función para pintar ubicaciones (locations)
function renderLocations(locationsData) {
    dataContainer.innerHTML = '';
    locationsData.forEach(location => {
        dataContainer.innerHTML += `
            <article class= "data-card">
                <div class="card-info">
                    <h2>🌎 ${location.name}</h2>
                    <p class= "info-label">Type: <span style="color:white;">${location.type}</span></p>
                    <p class= "info-label">Dimension: ${location.dimension}</p>
                </div>
            </article>
        `;
    });
}
//Funcion para pintar episodios 
function renderEpisodes(episodesData) {
    dataContainer.innerHTML = ' ';
    episodesData.forEach(episode => {
        dataContainer.innerHTML += `
            <article class="data-card">
                <div class="card-info">
                    <h2>📺 ${episode.name}</h2>
                    <p class="info-label">Code: <span Style="color; lime;">${episode.episode}</span></p>
                    <p class="info-label">Air Date: ${episode.air_date}</p>
                </div>
            </article>
        `;
    });
}

//=========================================
// 6. LOGICA DE FAVORITOS (LOCALSTORAGE)
//=========================================
//Esta funcion se ejecuta cuando damos clic en el boton "Add to favorites" de una tarjeta
function addToFavorites(name, image) {
    //Creamos un objeto con los datos del personaje
    const newFavorite = { name: name, image: image };

    //Agregamos el objeto a nuestro arreglo de favoritos
    favoritesArray.push(newFavorite);

    //Serializamos el arreglo en texto JSON y lo guaramos en la memoria del navegador
    localStorage.setItem('myFavCharacters', JSON.stringify(favoritesArray));

    alert(`"${name}"Se ha agregado a tus favoritos!`);
}
function renderFavorites() {
    dataContainer.innerHTML = '';
    const savedData = localStorage.getItem('myFavCharacters');

    if (savedData) {
        // Si hay datos, los deserializamos y los mostramos
        favoritesArray = JSON.parse(savedData);

        if (favoritesArray.length === 0) {
            dataContainer.innerHTML = '<p class="loading-text">No favorites added yet.</p>';
            return;
        }

        //pintamos cada favorito guardado
        favoritesArray.forEach(fav => {
            dataContainer.innerHTML += `
                <article class="data-card">
                        <img src="${fav.image}" alt="${fav.name}">
                        <div class="card-info">
                            <h2>⭐ ${fav.name}</h2>
                        </div>
                </article>
            `;

        })
    }else{
        //Si la memoria está vacía
        dataContainer.innerHTML = '<p class="loading-text">No favorites added yet</p>';
    }

}

//========================================
// 7. MANEJO DE EVENTOS DEL MENU
//=======================================

//Funcion auxiliar para resaltar visualmente el boton seleccionado
function setActiveButton(activeBtn) {
    btnCharacters.classList.remove('active');
    btnLocations.classList.remove('active');
    btnEpisodes.classList.remove('active');
    btnFavorites.classList.remove('active');

    activeBtn.classList.add('active');
}

//Evento clic en personajes 
btnCharacters.addEventListener('click', async () => {
    setActiveButton(btnCharacters);
    const data = await fetchData('/character');
    renderCharacters(data);
});

//Evento clic en ubicaciones 
btnLocations.addEventListener('click', async () => {
    setActiveButton(btnLocations);
    const data = await fetchData('/location');
    renderLocations(data);
});

//Evento clic en episodios 
btnEpisodes.addEventListener('click', async () => {
    setActiveButton(btnEpisodes);
    const data = await fetchData('/episode');
    renderEpisodes(data);
});

//Evento clic en favoritos 
btnFavorites.addEventListener('click', async () => {
    setActiveButton(btnFavorites);
    renderFavorites();
});

// ==========================================
// 8. INICIO AUTOMATICO
// ==========================================

// Recuperamos los favoritos al arrancar la pagina por si habia guardado
const previousFavs = localStorage.getItem('myFavCharacters');

if (previousFavs) {
    favoritesArray = JSON.parse(previousFavs);
}   

btnCharacters.click();