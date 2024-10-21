import { openweatherKEY, stormKEY, tomorowKEY } from './keys.js'; 
import { fetchFraseAleatoria } from './functions.js';

//using click
const search = document.querySelector('.search-box button');
search.addEventListener('click', () => {
    fetchWeatherData();
    //window.location.href = 'climate.html';
});

//using enter
const searchBoxInput = document.querySelector('.search-box input')
searchBoxInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchWeatherData();
    }
});


// document.getElementById('loginBtn').addEventListener('click', function() {
//     window.location.href = 'login.html';
// });

let latitude // declarando elas aqui para poder pegar abaixo
let longitude
//to get location
window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Localização atual:",`Latitude: ${latitude}, Longitude: ${longitude}`); //teste pra saber se ta dando certo
           
            // Exemplo: Enviar para uma API de clima (remova o comentário e adicione sua função se necessário)
            fetchWeatherDataLocal(latitude, longitude);
            

        }, function (error) {
            console.error("Erro para obter a localização: ", error);
        });
    } else {
        console.log("Erro no navegador.");
    }
};


const favbutton = document.querySelector('#fav-button');
favbutton.addEventListener('click', function() {
    addLocalFav(latitude, longitude); // Certifique-se que latitude e longitude estão definidos
    window.location.href = 'favorites.html';
});


// caso queira adicionar a localiacao atual
function addLocalFav(){
    const apiKey = openweatherKEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {


            const sCity = data.city.name;         // Nome da cidade
            const sLat = data.city.coord.lat;     // Latitude
            const sLon = data.city.coord.lon;     // Longitude

            // Criando um objeto com as informações
            const datalocal = {
                name: sCity,
                coord: {
                    lat: sLat,
                    lon: sLon
                }
            };

            localStorage.setItem('apiDataAtualLocation', JSON.stringify(datalocal))

        })
        .catch(error => {
            console.error("Erro ao buscar os dados de clima:", error);
            document.getElementById('temperature').innerText = "Unable to fetch temperature";
        });
}



function fetchWeatherDataLocal(lat, lon) {
    const apiKey = openweatherKEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //Pegando os dados locais
            
            const currentWeather = data.list[0];
            const temperature = currentWeather.main.temp;
            const iconCode = currentWeather.weather[0].icon;
            const iconUrl = `static/icons/${iconCode}.png`;
            
            
            const tempLocal = document.getElementById('temperature');
            const iconClima = document.getElementById('weather-icon');
            const warning = document.querySelector('.warning-message'); // adicionando o warning

            //NEW
            warning.classList.remove('warning-hot', 'warning-cold'); 
            if (temperature > 25) {  // Verifica se a velocidade é maior que 10 Km/h
                fetchFraseAleatoria("calor").then(fraseAleatoria => {
                    warning.innerHTML = fraseAleatoria;
                    warning.style.display = 'block';  // Exibe a mensagem
                    warning.classList.add('warning-hot'); 
                });
            }
            if (temperature < 10) {  // Verifica se a velocidade é maior que 10 Km/h
                fetchFraseAleatoria("frio").then(fraseAleatoria => {
                    warning.innerHTML = fraseAleatoria;
                    warning.style.display = 'block';  // Exibe a mensagem
                    warning.classList.add('warning-cold'); 
                });
            }


            if (tempLocal && iconClima) {
                iconClima.src = iconUrl;
                iconClima.style.display = 'inline';
                tempLocal.innerText = `${temperature}°C`;
            } else {
                console.error('Elemento não encontrado no DOM.');
            }
            //chamando as funções para previsões
            const dailyTemperatures = getDailyTemperatures(data.list);
            renderForecast(dailyTemperatures);
        })
        .catch(error => {
            console.error("Erro ao buscar os dados de clima:", error);
            document.getElementById('temperature').innerText = "Unable to fetch temperature";
        });
}

//função para pegar as máximas e minimas de cada dia
function getDailyTemperatures(forecastList) {
    const dailyTemperatures = {};

    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('pt-BR')
        
        //se ainda não tem dados para aquele dia pega a primeira
        if (!dailyTemperatures[day]) {
            dailyTemperatures[day] = {
                temp_min: forecast.main.temp_min,
                temp_max: forecast.main.temp_max,
                icon: null,
                weekday: date.toLocaleDateString('pt-BR', { weekday: 'short' })
            };
        } else { //compara os dados guardados com os novos
            dailyTemperatures[day].temp_min = Math.min(dailyTemperatures[day].temp_min, forecast.main.temp_min);
            dailyTemperatures[day].temp_max = Math.max(dailyTemperatures[day].temp_max, forecast.main.temp_max);
        }

        //para não ficar muito complexo optei em pegar o icone do meio dia
        if (date.getHours() === 12) {
            dailyTemperatures[day].icon = forecast.weather[0].icon;
        }
    });

    return dailyTemperatures;
}

//função para pegar as previsões no arquivo
function renderForecast(dailyTemperatures) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    const days = Object.keys(dailyTemperatures);

    //optamos para mostrar apenas as informações dos próximos 4 dias
    for (let i = 1; i <= 4; i++) {//for para pegar apenas dos 4 dias seguintes
        const day = days[i];
        if (!day) break;

        const tempMin = Math.round(dailyTemperatures[day].temp_min);
        const tempMax = Math.round(dailyTemperatures[day].temp_max);
        const iconCode = dailyTemperatures[day].icon;
        const iconUrl = `static/icons/${iconCode}.png`;
        const weekday = dailyTemperatures[day].weekday;

        //reduzindo a informação da data para apenas DD/MM
        const dateParts = day.split('/');
        const dayMonth = `${dateParts[0]}/${dateParts[1]}`;

        const dayHTML = `
            <div class="forecast-day">
                <h4>${weekday}, ${dayMonth}</h4> <!-- Exibe o dia da semana e o dia/mês -->
                <img class="icon" src="${iconUrl}" alt="Weather icon">
                <p><span class="temp-min">${tempMin}°C</span> <span class="temp-max">${tempMax}°C</span></p>
            </div>
        `;

        forecastContainer.innerHTML += dayHTML;
    }
}


function fetchWeatherData() {
    const city = document.querySelector('.search-box input').value;
    const apiKey = openweatherKEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) { // Verifica se o código da resposta é sucesso (200)
                // Armazena os dados do clima no localStorage
                localStorage.setItem('apiData', JSON.stringify(data));

                // Chama as funções para buscar os dados da maré e precipitação
                fetchPrecpData(city);
                fetchTideData(data.coord.lat, data.coord.lon);
            } else {
                alert('Cidade não encontrada!');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados de clima:', error);
        });
}


function fetchPrecpData(city){
    const options = {method: 'GET', headers: {accept: 'application/json'}};
    const key = tomorowKEY
    fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${key}`, options)
    .then(response => response.json())
    .then(data => {
        console.log("CHUVAA",data);
        localStorage.setItem('apiDataRain', JSON.stringify(data));
    })
    .catch((error) => {
        console.error('Erro ao buscar os dados da Chuva:', error);
    });
}



function fetchTideData(lat, lng) {
    const today = new Date();
    const todayISO = today.toISOString().substring(0, 10);
    const yesterday = new Date();
    const timedecrease = -1;
    yesterday.setUTCDate(today.getUTCDate() + timedecrease);
    const yesterdayISO = yesterday.toISOString().substring(0, 10);

    fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${yesterdayISO}&end=${todayISO}`, {
        headers: {
            'Authorization': stormKEY//'ec3f2ef6-81cd-11ef-a0d5-0242ac130003-ec3f2f5a-81cd-11ef-a0d5-0242ac130003'
        }
    })
    .then((response) => response.json())
    .then((data) => {

        localStorage.setItem('apiDataTide', JSON.stringify(data));
        window.location.href = 'climate.html';
    })
    .catch((error) => {
        console.error('Erro ao buscar os dados da maré:', error);
    });
}