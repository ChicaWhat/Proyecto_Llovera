const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");
const weatherHours = document.getElementById("weather-hours");

button.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;
      // Obtener la hora actual en minutos
      const horaActual = new Date().toISOString().slice(0, 16);
      const horaMadrid = horaActual.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
      console.log(horaMadrid);
      // Calcular la hora final sumando 8 horas
      const horaFinal = new Date();
      horaFinal.setHours(horaFinal.getHours() + 8);
      const horaFinalFormateada = horaFinal.toISOString().slice(0, 16);
      const horaDeLluvia = horaFinal.getHours();

      console.log(horaActual);
      console.log(horaFinalFormateada);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=apparent_temperature,is_day&hourly=temperature_2m,rain&daily=weather_code&timezone=auto&start_hour=${horaMadrid}&end_hour=${horaFinalFormateada}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Respuesta de la API:', data); // Agrega esta línea para imprimir la respuesta en la consola
          console.log(data.current.time);

          // const direccionObtenida = obtenerDireccion(data.latitude, data.longitude);
          // console.log('La dirección obtenida es:', direccionObtenida);

          obtenerDireccion(data.latitude, data.longitude)
            .then(direccionObtenida => {
              console.log('La dirección obtenida es:', direccionObtenida);
              // Por ejemplo, si la lluvia está en data.hourly.rain, ajusta esta línea
              const forecast = data.hourly.rain;
              const tiempoPorHoras = data.hourly.time
              console.log(tiempoPorHoras);
              if (forecast.some(hour => hour > 0)) {
                weatherStatus.textContent = `Sí, va a llover en ${direccionObtenida}`;
              } else {
                weatherStatus.textContent = `No, no va a llover en ${direccionObtenida}`;
              }
              for (let i = 0; i < tiempoPorHoras.length; i++) {
                // Mostrar el índice y el valor del primer array
                if (forecast[i] > 0) {
                  console.log(`Sí, a las ${tiempoPorHoras[i]} va a llover `);
                  const nuevoParrafo = document.createElement('li');
                  nuevoParrafo.textContent = `A las ${tiempoPorHoras[i]} hay ${forecast[i] * 100} probabilidades de lluvia`;

                  // Agregar el nuevo elemento <li> al elemento seleccionado
                  weatherHours.appendChild(nuevoParrafo);
                }
                else {
                  // Crear un objeto Date con la cadena de fecha proporcionada
                  let fechaObjeto = new Date(tiempoPorHoras[i]);

                  // Obtener las horas y minutos de la fecha
                  let horas = fechaObjeto.getHours();
                  let minutos = fechaObjeto.getMinutes();

                  // Formatear las horas y minutos según tu requisito (agregando ceros a la izquierda si es necesario)
                  let horaFormateada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
                  const nuevoParrafo = document.createElement('li');
                  nuevoParrafo.textContent = `A las ${horaFormateada} hay ${forecast[i] * 100} probabilidades de lluvias `;
                  console.log(`No,a las ${tiempoPorHoras[i]} no va a llover `);
                  weatherHours.appendChild(nuevoParrafo);

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
});

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