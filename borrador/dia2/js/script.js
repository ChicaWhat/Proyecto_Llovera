'use strict'

const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");
const weatherHours = document.getElementById("weather-hours");

button.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;


const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=precipitation&hourly=temperature_2m,precipitation_probability,rain&daily=precipitation_hours&timezone=auto&forecast_hours=8`


fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
  })

  .catch(err => console.error(err))

  .then((data) => {
    console.log('Respuesta de la API:', data);

// Se buscan los datos necesarios para el botón. En este caso la lluvia, las 8 horas y las probabilidades de lluvia x hora.
      // const previsionLluvia = data.hourly.rain;
      const intervalo8H = data.hourly.time;
      const probabilidadDePrecipitaciones = data.hourly.precipitation_probability;

      console.log(intervalo8H);
      console.log(probabilidadDePrecipitaciones);

// Esta parte sigo sin comprenderla y necesito que se explique
  obtenerDireccion(data.latitude, data.longitude)
    .then(direccionObtenida => {
    console.log('La dirección obtenida es:', direccionObtenida);
        
      if (intervalo8H.some(hour => hour > 0)) {
      weatherStatus.textContent = `Sí, va a llover en ${direccionObtenida}`;
      } else {
       weatherStatus.textContent = `No, no va a llover en ${direccionObtenida}`;
      }

// Realizo cambios en el bucle y condicional
        for (let i = 0; i < intervalo8H.length; i++) {

          let fechaYHoraActual = new Date(intervalo8H[i]);
          let soloHoras = fechaYHoraActual.getHours();
          
        if (probabilidadDePrecipitaciones[i] >= 0 && probabilidadDePrecipitaciones[i] < 50) {
            
        const nuevaLista = document.createElement('li');
        nuevaLista.textContent = `A las ${soloHoras}:00 hay ${probabilidadDePrecipitaciones[i]}% probabilidades de lluvias `;
        // console.log(`A las ${intervalo8H[i]} no va a llover `);
        weatherHours.appendChild(nuevaLista);               
        } else {      
                  // let fechaObjeto = new Date(intervalo8H[i]);
                  // let horas = fechaObjeto.getHours();
                  // let minutos = fechaObjeto.getMinutes();
                  // let horaFormateada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;               
            const nuevaLista1 = document.createElement('li');
            nuevaLista1.textContent = `A las ${soloHoras}:00 hay ${probabilidadDePrecipitaciones[i]}% probabilidades de lluvias `;
            console.log(`No,a las ${intervalo8H[i]} no va a llover `);
            weatherHours.appendChild(nuevaLista1);
          }
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
},{once:true});


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
        throw new Error('No se pudo obtener la dirección');
      }
    })
    .catch(error => {
      console.error('Hubo un error:', error);
    });
}