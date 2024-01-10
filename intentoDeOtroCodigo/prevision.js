'use strict'

// Creamos las constantes con sus respectivos eventos
const button = document.getElementById("check-weather");
const weatherStatus = document.getElementById("weather-status");


//Creo los callbacks de position y geoError.
    const position = (localizacion) => {
            const latitud = localizacion.coords.latitude;
            const longitud = localizacion.coords.longitude;

            console.log(`Tus coordenadas son: ${latitud}, ${longitud}`);

// Aquí sería calcular, como hizo Iván, la hora actual, pasarla al formato que la API lee y sumar las 8 horas para luego hacer el bucle.
    const horaActual = new Date().toISOString();
    // console.log(horaActual);
// el método .slice(0, 16) te quita los segundos y un dato más que no conozco con una letra Z al final. No te calcula la hora en minutos.
// Comparad el console.log de la línea 17 y 21 y vais a ver que solamente quita los últimos datos. No lo termino de comprender, pero os lo dejo por aquí por si os llama también la atención como a mí.
    const hourActual = new Date().toISOString().slice(0, 16);
    // console.log(hourActual)

// Copio código de Iván! Pero no termino de entender este código... y no se vosotros, pero a mi me gusta entender el código.
// Calcular la hora final sumando 8 horas
    const horaFinal = new Date();
    horaFinal.setHours(horaFinal.getHours() + 8);
    const horaFinalFormateada = horaFinal.toISOString().slice(0, 16);

// NO COMPRENDO porque el console.log de horaActual te lanza una hora menos con respecto a la nuestra... Con esto deja claro que no tenía nada que ver con la API weather... va por otro lado 
    console.log(horaActual);
    console.log(horaFinalFormateada);

    // const horaConFecha = new Date();
    // const horaDeLluvia = horaConFecha.getHours();

//Como esta vez he creado funciones callbacks, el fetch tiene que ir dentro de position, ya que si consigue leer la localización debe de seguir buscando en la API weather (creo yo, no estoy segura)
            
     fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&minutely_15=temperature_2m,rain&hourly=temperature_2m,rain&daily=weather_code&timezone=auto&start_hour=${horaActual}&end_hour=${horaFinalFormateada}`)

        .then((response) => {
            if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
            })
        .then((data) =>
            console.log(`Respuesta de la API: ${data}`)
            )
        .catch((err) => console.error("Error", err))
        };


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

// Estas opciones las he copiado tal cual viene en uno de los enlaces que os he pasado.
/* 
enableHighAccuracy: te consigue una posición lo más exacta posible
timeout: lo máximo que tarda la aplicación en esperar recibir la respuesta
maximumAge: no me ha terminado de quedar claro jajaj pero tiene algo que ver con el caché creo. Lo único que me ha quedado claro es que predeterminado viene 0, por eso lo he dejado tal cual.
*/
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
     };

// En este caso el botón está al final del todo, porque primero voy a definir los callbacks de los parámetros de la función navigator
// Función flecha con la API navigator para llamar a los parámetros position (true), geoError (false), options (aquí podemos añadir más contenido a la función, como el que puede ser más rápida, x ejemplo)// El parámetro OPTIONS lo he creado porque la función tiene esos 3 parámetros ya existentes y se pueden usar. Le podeis echar un vistazo al enlace que dejo en el documentp README.TXT con el enlace donde sale toda esta info: enlace(1).
// Le decimos al botón lo que queremos que nos muestre

button.addEventListener('click', () => {;
    navigator.geolocation.getCurrentPosition(position, geoError, options);
});


// NO ME SALE LA INFO DE LA API EN CONSOLA Y ME ESTÁ DANDO ALGO!!
// No sé qué le pasa a mi navegador con este código, pero me prohibe leer mi posición y me ha dificultado unnnn montonnnn poder hacer este código. Para que me saliera ALGO le tenía que dar un montón de veces al botón para ver por 1 milisegundo algo. Horrible! A ver si a vosotros os lee bien en consola todo. Espero que más o menos se lea claro lo que he hecho. 
// He copiado lo de la hora