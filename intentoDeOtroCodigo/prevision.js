'use strict'

const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");
const weatherHours = document.getElementById("weather-hours");


// Con esto consigo SOLAMENTE las coordenadas GPS.
const position = (localizacion) => {
    const latitud = localizacion.coords.latitude;
    const longitud = localizacion.coords.longitude;

    console.log(`Tus coordenadas son: ${latitud}, ${longitud}`);

const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,rain&daily=precipitation_hours&timezone=auto&forecast_hours=8`

    fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error(`Error en la solicitud ${response.status}`)
        }
        return response.json();
    })

    .catch(err => console.error(err))

    .then(data => {
        console.log(data);
        // console.log(data.hourly.time);
        // console.log(data.hourly.rain);

// Se buscan los datos necesarios para el botón. En este caso la lluvia, las 8 horas y las probabilidades de lluvia x hora.
        // const previsionLluvia = data.hourly.rain;
        const intervalo8H = data.hourly.time;
        const probabilidadDePrecipitaciones = data.daily.precipitation_hours;

        console.log(intervalo8H);
        console.log(probabilidadDePrecipitaciones);
    
// Se crea el bucle que vaya a iterar en cada una de las 8 horas que queremos analizar
            for(let i = 0; i < intervalo8H.length; i++){
// Como queremos señalar SOLO a la hora, hay que jugar un poco con el método new Date y crear una constante donde nos saque SOLO la hora
                let fechaYHoraActual = new Date(intervalo8H[i]);
                // console.log(fechaYHoraActual);
                let soloHoras = fechaYHoraActual.getHours();
                // console.log(soloHoras);

// Se crea el condicional donde nos diga que, si las probabilidades son entre 1 y 50, no va a llover
               if (probabilidadDePrecipitaciones[i] >= 0 && probabilidadDePrecipitaciones[i] < 50){

                const nuevaLista = document.createElement('li');
                // nuevaLista.textContent = `A las ${soloHoras}:00 hay un ${probabilidadDePrecipitaciones[i]}% de probabilidades de llover, por lo tanto no va a llover `;
                nuevaLista.textContent = `A las ${soloHoras}:00 no va a llover`
                weatherHours.appendChild(nuevaLista);               
               }
// En el else se debe de crear una nueva lista que contenga este mensaje??? 
               else {
                const nuevaLista1 = document.createElement('li');
                nuevaLista1.textContent = `A las ${soloHoras}:00 va a llover`
                weatherHours.appendChild(nuevaLista1); 
               }
            }
        })
}

// Aquí creo la función del callback geoError con sus 3 posibilidades de error que viene en el enlace(2).
const geoError = (error) => {

    // error.code es un término que YA EXISTE! No me lo he inventado. De igual forma, los code que añado en cada case también existen ya!
        switch(error.code){
            case error.PERMISSION_DENIED:
                console.error("Lo sentimos, no nos ha permitido acceder a su posición");
            break;
            case error.POSITION_UNAVAILABLE:
                console.error("En estos momentos tu posición no está disponible");
            break;
            case error.TIMEOUT:
                console.error("Hemos tardado mucho para obtener tu posición")
            break;
            
            default:
                console.error("Error desconocido");
               };
            };


button.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition
    (position, geoError);
}, {once:true});
