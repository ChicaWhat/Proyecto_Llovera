'use strick'
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log("Latitude: " + position.coords.latitude);
        console.log("Longitude: " + position.coords.longitude);
    });
 } else {
    console.log("Geolocation is not supported by this browser.");
 }
 
document.getElementById('geoButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m,precipitation`)
            .then(response => response.json())
            .then(data => {
                let dia= document.getElementById("p1")
                let tiempo= document.getElementById("p2")
                // dia.textContent= JSON.stringify(data)
                for (let i = 0; i < data.hourly.time.length; i++) {
                   dia.textContent=JSON.stringify(data.hourly.time[i])
                    console.log(data.hourly.time[i])}
                    
           
                for (let i = 0; i < data.hourly.temperature_2m.length; x++) {
                    tiempo.textContent=`${JSON.stringify(data.hourly.temperature_2m[i])}ºC`
                    console.log(data.hourly.    temperature_2m[i]) 
                    
                }
            
                

            })
            .catch(error=>console.error('Error', error))
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
 });