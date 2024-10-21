import { openweatherKEY, stormKEY, tomorowwKEY } from './keys.js'; 


export function fetchWeatherData(city) {
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
    const key = tomorowwKEY
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
            'Authorization': stormKEY//
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