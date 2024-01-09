const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");

button.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitud = position.coords.latitude;
     const longitud = position.coords.longitude;
       // Obtener la hora actual en minutos
       const horaActual = new Date().toISOString().slice(0, 16);
      
       // Calcular la hora final sumando 8 horas
       const horaFinal = new Date();
       horaFinal.setHours(horaFinal.getHours() + 8);
       const horaFinalFormateada = horaFinal.toISOString().slice(0, 16);

       console.log(horaActual);
       console.log(horaFinalFormateada);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=apparent_temperature,is_day&hourly=temperature_2m,rain&timezone=Europe%2FBerlin&start_hour=${horaActual}&end_hour=${horaFinalFormateada}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Respuesta de la API:', data); // Agrega esta línea para imprimir la respuesta en la consola
          console.log( data.current.time);
          console.log( data.longitude, data.latitude);
          obtenerDireccion(data.latitude, data.longitude);
          // Ahora, analiza la estructura real de la respuesta y ajusta tu código en consecuencia
          // Por ejemplo, si la lluvia está en data.hourly.rain, ajusta esta línea
          const forecast = data.hourly.rain;

          if (forecast.some(hour => hour > 0)) {
            weatherStatus.textContent = "Sí, va a llover";
          } else {
            weatherStatus.textContent = "No, no va a llover";
          }
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
  const apiKey = '2707ae018f884fd184f39fa92c15f7fe'; // Reemplaza con tu clave de OpenCage Geocoding
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        const direccion = data.results[0].formatted;
        console.log(data.results)
        console.log('La dirección es:', direccion);
      } else {
        console.log('No se pudo obtener la dirección');
      }
    })
    .catch(error => console.error('Hubo un error:', error));
}