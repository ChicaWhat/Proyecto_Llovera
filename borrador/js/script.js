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

      const horaConFecha = new Date();
      const horaDeLluvia = horaConFecha.getHours();
      

      /* 
      https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,rain
      
      https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=apparent_temperature,is_day&hourly=temperature_2m,rain&timezone=Europe%2FBerlin&start_hour=${horaActual}&end_hour=${horaFinalFormateada}`
      */

      // Se ha cambiado la URL de la api weather y en vez de ser el TimeZone Berlin/Europa, es automatico. La cosa es que ahora no lanza la dirección de la calle, solo la latitud y la longitud
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&minutely_15=temperature_2m,rain&hourly=temperature_2m,rain&daily=weather_code&timezone=auto&start_hour=${horaActual}&end_hour=${horaFinalFormateada}`)

        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Respuesta de la API:', data); // Agrega esta línea para imprimir la respuesta en la consola
          console.log( data.longitude, data.latitude);

         
          // Ahora, analiza la estructura real de la respuesta y ajusta tu código en consecuencia
          // Por ejemplo, si la lluvia está en data.hourly.rain, ajusta esta línea
          const forecast = data.hourly.rain;

        // Bucle para conseguir si en las próximas 8 horas llueve o no
          for( lluviaPorHoras of forecast )
          // console.log(lluviaPorHoras)
            if(lluviaPorHoras > 0){
              weatherStatus.textContent = `Sí, a las ${horaDeLluvia} va a llover `;
            }
            else {
              weatherStatus.textContent = `No, no va a llover `;
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

// No está funcionando esta función
function obtenerDireccion(latitud, longitud) {
  const apiKey = '494e5582127d4e7794cdd64046a88078'; // Reemplaza con tu clave de OpenCage Geocoding
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitud}+${longitud}&key=${apiKey}`;
   fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
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
obtenerDireccion()