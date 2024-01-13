'use strict'

const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");
const weatherHours = document.getElementById("weather-hours");

button.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;


      // MAPA
      let map = L.map('map').setView([latitud, longitud], 20);

      //Agregar tilelAyer mapa base desde openstreetmap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // url API con los parámetros que necesitamos para obtener los datos requeridos
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=precipitation&hourly=temperature_2m,precipitation_probability,rain&daily=precipitation_hours&timezone=auto&forecast_hours=9`

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Respuesta de la API:', data);
          console.log(data.current.time);

          // Ejecuta la función para obtener la dirección real a través de longitud y latitud
          obtenerDireccion(data.latitude, data.longitude) 
            .then(direccionObtenida => {
              console.log('La dirección obtenida es:', direccionObtenida);
              // Array con la probabilidad de lluvia
              const forecast = data.hourly.precipitation_probability;
              // Array con las horas seleccionadas (de la actual hasta 8 horas más)
              const tiempoPorHoras = data.hourly.time

              // Condicional para que nos diga si va a llover o no durante esas 8 horas
              if (forecast.some(hour => hour > 0)) {
                weatherStatus.textContent = `Sí, va a llover en las próximas 8 horas en ${direccionObtenida}`;
              } else {
                weatherStatus.textContent = `No, no va a llover en las próximas 8 horas en ${direccionObtenida}`;
              }

              // Bucle para iterar las 8 horas y decirme la probalidad de lluvia de cada hora
              for (let i = 1; i < tiempoPorHoras.length; i++) {

                // Formato de hora para el front (HH:mm)
                let fechaObjeto = new Date(tiempoPorHoras[i]);
                let horas = fechaObjeto.getHours();
                let minutos = fechaObjeto.getMinutes();
                let horaFormateada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;

                // Creamos elementos HTML para pintar los datos (hora, imagen, probabilidad)
                const imagenGif = document.createElement('img');
                const containerPorHoras = document.createElement('li');
                const horaVisual = document.createElement('p');
                const probabilidadVisual = document.createElement('p');

                horaVisual.textContent = `${horaFormateada} `;
                probabilidadVisual.textContent = `${forecast[i]}% probabilidad lluvia`;

                // No Lluvia
                if (forecast[i] < 1) {
                  imagenGif.src = "./imagenes/day.svg";                
                }
                // Lluvia Moderada
                else if (forecast[i] > 1 && forecast[i] <= 50) {
                  imagenGif.src = "./imagenes/lluvia.jpeg";
                }
                // Lluvia intensa
                else {
                  imagenGif.src = "./imagenes/lluvia2.jpeg";
                }
                //

                // Ordenamos esto li<img<p<p 
                weatherHours.appendChild(containerPorHoras);
                containerPorHoras.appendChild(imagenGif);
                containerPorHoras.appendChild(horaVisual);
                containerPorHoras.appendChild(probabilidadVisual);
               
              }
            })
            .catch(error => {
              console.error('Error:', error.message);
            });
        })
        .catch((error) => {
          console.error("Error en la solicitud a la API:", error);
          weatherStatus.textContent = "Error al obtener la predicción meteorológica";
        });
    },
    (error) => {
      console.error("Error al obtener la ubicación:", error);
      weatherStatus.textContent = "Error al obtener la ubicación";
    }
  );
});

// Función para convertir latitud y longitud en dirección legible a través de una API
function obtenerDireccion(latitud, longitud) {
  const apiKey = '2707ae018f884fd184f39fa92c15f7fe';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=${apiKey}`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const direccion = data.results[0].formatted;
        // console.log('La dirección es:', direccion);
        return direccion;
      } else {
        console.log('No se pudo obtener la dirección');
        throw new Error('No se pudo obtener la dirección');
      }
    })
    .catch(error => {
      console.error('Hubo un error:', error);
      throw new Error('Error al obtener la dirección');
    });
}
//Función para mostrar el mapa cuando pulsamos el botón

function toggleMap() {
  var mapDiv = document.getElementById("map");
  mapDiv.style.display = (mapDiv.style.display === "none") ? "block" : "none";
  // Oculta el texto y el botón después de hacer clic
  document.getElementById("check-weather").style.display = "none";
  document.getElementById("titulo2").style.display = "none";
  document.getElementById("parrafo1").style.display = "none";
}

