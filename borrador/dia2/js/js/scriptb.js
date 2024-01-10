// Obtener el botón y el elemento donde se mostrará el estado del tiempo
const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");

// Agregar un evento de clic al botón
button.addEventListener("click", () => {
  // Obtener la ubicación actual del navegador
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Extraer las coordenadas de la ubicación
      const latitud = position.coords.latitude;
      const longitud = position.coords.longitude;

      // Obtener la hora actual y formatearla a un formato específico
      const horaActual = new Date().toISOString().slice(0, 16);

      // Calcular la hora final sumando 8 horas y formatearla
      const horaFinal = new Date();
      horaFinal.setHours(horaFinal.getHours() + 8);
      const horaFinalFormateada = horaFinal.toISOString().slice(0, 16);

      // Mostrar en consola la hora actual y final
      console.log(horaActual);
      console.log(horaFinalFormateada);

      // Construir la URL de la API meteorológica con las coordenadas y el rango de tiempo
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=apparent_temperature,is_day&hourly=temperature_2m,rain&timezone=Europe%2FBerlin&start_hour=${horaActual}&end_hour=${horaFinalFormateada}`;

      // Realizar la solicitud a la API meteorológica
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Mostrar en consola la respuesta de la API
          console.log('Respuesta de la API:', data);
          console.log(data.current.time);
          console.log(data.longitude, data.latitude);

          // Llamar a la función para obtener la dirección a partir de las coordenadas
          obtenerDireccion(data.latitude, data.longitude);

          // Analizar la estructura real de la respuesta y ajustar el código en consecuencia
          // Por ejemplo, si la lluvia está en data.hourly.rain, ajustar esta línea
          const forecast = data.hourly.rain;

          // Determinar si va a llover y actualizar el contenido del estado del tiempo
          if (forecast.some(hour => hour > 0)) {
            weatherStatus.textContent = "Sí, va a llover";
          } else {
            weatherStatus.textContent = "No, no va a llover";
          }
        })
        .catch((error) => {
          // Manejar errores y mostrar un mensaje en el elemento del estado del tiempo
          console.error("Error en la solicitud a la API:", error);
          weatherStatus.textContent = "Error al obtener la predicción meteorológica";
        });
    },
    (error) => {
      // Manejar errores al obtener la ubicación y mostrar un mensaje en el elemento del estado del tiempo
      console.error("Error al obtener la ubicación:", error);
      weatherStatus.textContent = "Error al obtener la ubicación";
    }
  );
});

// Definir la función para obtener la dirección a partir de las coordenadas
function obtenerDireccion(latitud, longitud) {
  // Clave de API de OpenCage Geocoding
  const apiKey = '2707ae018f884fd184f39fa92c15f7fe';

  // Construir la URL de la API de geocodificación con las coordenadas
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=${apiKey}`;

  // Realizar la solicitud a la API de geocodificación
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Verificar si se obtuvieron resultados de dirección y mostrar en consola
      if (data.results && data.results.length > 0) {
        const direccion = data.results[0].formatted;
        console.log(data.results);
        console.log('La dirección es:', direccion);
      } else {
        console.log('No se pudo obtener la dirección');
      }
    })
    .catch(error => console.error('Hubo un error:', error));
}