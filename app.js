console.log("Script app.js chargé");

let map;
let marker;

function initMap(lat, lon) {
    console.log(`Initialisation de la carte avec lat: ${lat}, lon: ${lon}`);
    map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map);
    console.log("Carte initialisée");
}

function updatePosition(position) {
    console.log("Position mise à jour reçue");
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`Nouvelles coordonnées : lat ${lat}, lon ${lon}`);
    
    if (!map) {
        console.log("Première initialisation de la carte");
        initMap(lat, lon);
    } else {
        console.log("Mise à jour de la position sur la carte existante");
        map.setView([lat, lon], 20);
        marker.setLatLng([lat, lon]);

    }
}

document.getElementById('clearLog').addEventListener('click', function() {
    document.getElementById('logArea').innerHTML = '';
});


(function() {
    const logArea = document.getElementById('logArea');
    const originalLog = console.log;
    console.log = function() {
        // Appel à la fonction originale
        originalLog.apply(console, arguments);
        
        // Création du message pour l'affichage
        const message = Array.from(arguments).map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
        ).join(' ');
        
        // Création et ajout de l'élément de log
        const logMessage = document.createElement('div');
        logMessage.textContent = message;
        logArea.appendChild(logMessage);
        
        // Scroll vers le bas
        logArea.scrollTop = logArea.scrollHeight;
        
        // Limiter le nombre de messages (optionnel)
        while (logArea.children.length > 50) {
            logArea.removeChild(logArea.firstChild);
        }
    };
})();



function handleError(error) {
    console.error("Erreur de géolocalisation:", error.message);
}

if ("geolocation" in navigator) {
    console.log("Géolocalisation supportée, démarrage de watchPosition");
    navigator.geolocation.watchPosition(updatePosition, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
} else {
    console.error("La géolocalisation n'est pas supportée par ce navigateur.");
}

// Ajout d'un log pour vérifier si le DOM est chargé
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM entièrement chargé et analysé');
});

// Vérification de l'existence de l'élément map
window.onload = function() {
    console.log("Window chargée");
    const mapElement = document.getElementById('map');
    if (mapElement) {
        console.log("Élément 'map' trouvé dans le DOM");
    } else {
        console.error("Élément 'map' non trouvé dans le DOM");
    }
};

// Vérification de Leaflet
if (typeof L !== 'undefined') {
    console.log("Leaflet est chargé");
} else {
    console.error("Leaflet n'est pas chargé");
}
