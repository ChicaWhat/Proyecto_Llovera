"use strict"

document.addEventListener('DOMContentLoaded', () => {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationInput = document.getElementById('locationInput');
    const locationResult = document.getElementById('locationResult');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    getLocationBtn.addEventListener('click', () => {
        getLocation()
            .then(position => {
                const { latitude, longitude } = position.coords;
                return reverseGeocode(latitude, longitude);
            })
            .then(locationInfo => {
                locationResult.textContent = `Ciudad: ${locationInfo.city}, País: ${locationInfo.country}`;
            })
            .catch(error => {
                console.error('Error al obtener la ubicación:', error);
                locationResult.textContent = 'Error al obtener la ubicación.';
            });
    });

    locationInput.addEventListener('input', () => {
        const query = locationInput.value.trim();

        if (query.length >= 3) {
            // Realizar una solicitud a la API de sugerencias de ciudades (puedes utilizar OpenCage o cualquier otra)
            getSuggestions(query)
                .then(suggestions => {
                    displaySuggestions(suggestions);
                })
                .catch(error => {
                    console.error('Error al obtener sugerencias:', error);
                });
        } else {
            clearSuggestions();
        }
    });

    suggestionsContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const selectedCity = event.target.textContent;
            locationInput.value = selectedCity;
            clearSuggestions();
        }
    });
});

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('La geolocalización no está soportada en este navegador.'));
        }
    });
}

function reverseGeocode(latitude, longitude) {
    const apiKey = '2707ae018f884fd184f39fa92c15f7fe'; // Reemplaza con tu clave de OpenCage Geocoding
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=es`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const result = data.results[0];
                const city = result.components.city || result.components.town || result.components.village;
                const country = result.components.country;
                return { city, country };
            } else {
                throw new Error('No se encontraron resultados de geocodificación para las coordenadas proporcionadas.');
            }
        });
}

function getSuggestions(query) {
    // Aquí deberías realizar una solicitud a la API de sugerencias de ciudades
    // Puedes utilizar OpenCage o cualquier otra API de geocodificación que ofrezca autocompletado
    const apiKey = '2707ae018f884fd184f39fa92c15f7fe'; // Reemplaza con tu clave de OpenCage Geocoding
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}&limit=5`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const suggestions = data.results.map(result => result.formatted);
            return suggestions;
        });
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.innerHTML = '';

    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion;
        suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = 'block';
}

function clearSuggestions() {
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';
}
//Al inspeccionar la web muestra mas detalles si da error de localización
getLocationBtn.addEventListener('click', () => {
    getLocation()
        .then(position => {
            const { latitude, longitude } = position.coords;
            return reverseGeocode(latitude, longitude);
        })
        .then(locationInfo => {
            locationResult.textContent = `Ciudad: ${locationInfo.city}, País: ${locationInfo.country}`;
        })
        .catch(error => {
            console.error('Error al obtener la ubicación:', error.message);
            locationResult.textContent = 'Error al obtener la ubicación. Verifica la consola para más detalles.';
        });
});
function getWeather(latitude, longitude) {
    const apiUrl = `https://open-meteo.com/en/docs/#current=apparent_temperature,is_day&hourly=temperature_2m,rain`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.daily && data.daily.weathercode && data.daily.weathercode.length > 0) {
                const weatherCode = data.daily.weathercode[0];
                return getWeatherDescription(weatherCode);
            } else {
                throw new Error('No se encontraron datos meteorológicos para las coordenadas proporcionadas.');
            }
        });
}

function getWeatherDescription(weatherCode) {
    // Puedes implementar tu propia lógica para mapear códigos meteorológicos a descripciones.
    // Este es un ejemplo básico, pero podrías necesitar un mapeo más detallado según la API que estás utilizando.
    const weatherDescriptions = {
        0: 'Despejado',
        1: 'Parcialmente nublado',
        2: 'Nublado',
        // ... Añadir más descripciones según sea necesario
    };

    const description = weatherDescriptions[weatherCode] || 'Descripción meteorológica no disponible';
    return description;
}