var city = document.getElementById('city');
var show = document.getElementById('values');
var main = document.getElementById('mainval');
var error = document.getElementById('error');

const apikey = `9731a2f57e866c6fc2be659c1fa5ab1f`;

// Current Location

document.getElementById('getlocal').addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(currentlocation,geoerror);
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser.');
    }
  });
  

async function currentlocation(data){
    let lat = data.coords.latitude;
    let lon = data.coords.longitude;
    console.log('latitude:'+lat);
    console.log('longitude:'+lon);

    var apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

    try{
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log(data);
        displaydata(data);
    }catch(error){
        console.log('e:'+error)
    }
    
}
function geoerror(e){
    error.innerHTML = 'please enable location manually';
    show.innerHTML = null;
}

//City Name

document.getElementById('getcity').addEventListener('click',async () => {
    if(city.value){
        var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apikey}`;
        main.style.display = 'none';

    try{
        const response = await fetch(apiURL);
        const data = await response.json();
        console.log(data);
        if(data.name){
            displaydata(data);
        }else{
            displayerror(data);
        }
    }catch(e){
        console.log(e)
        show.innerHTML = null;
    }
    }else{
        error.innerHTML = null;
        error.innerHTML = 'Enter the city name to get weather report';
        show.innerHTML = null;
        main.style.display = 'block';
    }
});

function displaydata(data){
    var place = textchange(data.name);

    show.innerHTML = null;
    error.innerHTML = null;

    if(data){
        main.style.display = 'none';

        show.innerHTML += 
    `
                <div class="weather text-center mt-4">
                    <p class="place m-0 text-capitalize" id="place">${place} , ${data.sys.country}</p>
                    <p class="temp m-0" id="temp">${Math.round((data.main.temp - 273.15))}°</p>
                    <p class="con m-0 text-capitalize" id="con">${data.weather[0].description}</p>
                </div>
                <div class="box mt-4">
                    <div class="humidity">
                        <p class="ms-2 mt-2 fw-semibold text">Humidity</p>
                        <p class="text-center mt-3 m-0 shap"><i class="fa-solid fa-droplet"></i></p>
                        <p class="text-center h4">${data.main.humidity}%</p>
                    </div>
                    <div class="wind">
                        <p class="ms-2 mt-2 fw-semibold text">Wind Speed</p>
                        <p class="text-center mt-3 m-0 shap"><i class="fa-duotone fa-solid fa-wind"></i></p>
                        <p class="text-center h4">${data.wind.speed} m/s</p>
                    </div>
                    <div class="pressure">
                        <p class="ms-2 mt-2 fw-semibold text">Pressure</p>
                        <p class="text-center mt-3 m-0 shap"><i class="fa-duotone fa-solid fa-arrow-down-to-line"></i></p>
                        <p class="text-center h4">${data.main.pressure} mbar</p>
                    </div>
                    <div class="real">
                        <p class="ms-2 mt-2 fw-semibold text">Real Feel</p>
                        <p class="text-center mt-3 m-0 shap"><i class="fa-duotone fa-solid fa-temperature-sun"></i></p>
                        <p class="text-center h4">${Math.round(data.main.feels_like - 273.15)}°</p>
                    </div>
                </div>
    `
    ;
    }else{
        error.innerHTML = null;
        error.innerHTML += data.message;
    }
}
function displayerror(data){
    error.innerHTML = null;
    show.innerHTML = null;
    main.style.display = 'block';
    error.innerHTML += data.message;
}

function textchange(namedata){
    let place = namedata;

    const words = {
        'ā' : 'a',
        'ē' : 'e',
        'ī' : 'i',
        'ō' : 'o',
        'ū' : 'u'
    }
    for(let i=0;i<place.length;i++){
        if(words[place[i]]){
            place = place.replace(place[i],words[place[i]])
        }
    }
    return place;
}