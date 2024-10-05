import { downloadJSON, loadJSONFile } from './functions.js';

//CLASSE WEATHER
class Weather {
    constructor(weather) {
        this.cityname = weather.name;
        this.temperature = weather.main.temp;
        this.humidity = weather.main.humidity;
        this.wind = weather.wind.speed;
        this.description = weather.weather[0].description;
    }

    // Método para formatar os dados do clima para exibição
    displayWeather() {
        return `City: ${this.cityname}, Temp: ${this.temperature}°C, Humidade: ${this.humidity}%, Vento: ${this.wind} km/h, Condições: ${this.description}`;
    }
}

class Rain {
    constructor(rain) {
        this.rain = rain.rainIntensity;
        this.probRain = rain.precipitationProbability;

    }

    // Método para formatar os dados do clima para exibição
    displayRain() {
        return `Rain: ${this.rain}mm, Preciptation Probability: ${this.probRain}%`;
    }
}

// CLASSE TIDE
class Tide {
    constructor(tides) {
        
        this.nearhour = tides.map(item => item.time); // Para calcular a hora mais próxima
        this.number_tides = tides.length;
        this.heights = tides.map(item => item.height); 
        this.types = tides.map(item => item.type); 


        // Processa cada item de tempo e extrai apenas horas e minutos
        this.hours = tides.map(item => {
            const tideTime = new Date(item.time);
            const hours = tideTime.getUTCHours().toString().padStart(2, '0');
            const minutes = tideTime.getUTCMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`; // Retorna a string já formatada
        });
    }

    // Método para encontrar a maré mais próxima
    findClosestTideTime() {
        const now = new Date();
        let closestTide = null;
        let closestTimeDiff = Infinity;

        this.nearhour.forEach((time, index) => {
            const tideTime = new Date(time);
            const timeDiff = Math.abs(tideTime - now);

            if (timeDiff < closestTimeDiff) {
                closestTimeDiff = timeDiff;
                closestTide = { 
                    height: this.heights[index], 
                    type: this.types[index],
                    time: tideTime 
                };
            }
        });

        return closestTide;
    }

    displayTide() {
        return `Nearest time: ${this.nearhour}, Ntides: ${this.number_tides}, Height: ${this.hours}, Height: ${this.heights} m, Type: ${this.types}`;
    }
}



// // Recupera os dados armazenados no localStorage 
const apiData = JSON.parse(localStorage.getItem('apiData'));
const apiDataTide = JSON.parse(localStorage.getItem('apiDataTide'));
const apiDataRain = JSON.parse(localStorage.getItem('apiDataRain'));

////PARA SALVAR OS ARQUIVOS ------------------------------------------------------------------------------------
//downloadJSON(apiData, 'climate_data.json');// DOWNLOAD
//downloadJSON(apiDataTide, 'tide_data.json');
//downloadJSON(apiDataRain, 'rain_data.json');

////PARA ABRIR ARQUIVO SALVOS ----------------------------------------------------------------------------------
////SE estiver trabalhando sem as chaves, use a função abaixo para rodar os dados:
////Usa a função passando o nome do arquivo JSON

// loadJSONFile('climate_tokyo.json')
//     .then(apiData => {
//         // Processa os dados carregados
//         localStorage.setItem('apiData', JSON.stringify(apiData));
//     })
//     .catch(error => {
//         console.error('Erro ao carregar o arquivo JSON:', error);
//     });

// loadJSONFile('tide_tokyo.json')
//     .then(apiDataTide => {
//         // Processa os dados carregados
//         localStorage.setItem('apiDataTide', JSON.stringify(apiDataTide));
//     })
//     .catch(error => {
//         console.error('Erro ao carregar o arquivo JSON:', error);
//     });

// loadJSONFile('rain_tokyo.json')
//     .then(apiDataTide => {
//         // Processa os dados carregados
//         localStorage.setItem('apiDataTide', JSON.stringify(apiDataTide));
//     })
//     .catch(error => {
//         console.error('Erro ao carregar o arquivo JSON:', error);
//     });


if (apiData) {
    const weather = new Weather(apiData);
    console.log('Dados carregados de Clima:', weather);

    if (window.location.pathname.includes('climate.html')) {
        document.querySelector('.cityname').textContent = `${weather.cityname}`;
        document.querySelector('.temperature').textContent = `${weather.temperature}°C`;
        document.querySelector('.description').textContent = weather.description;
        document.querySelector('.humidity span').textContent = `${weather.humidity}%`;
        document.querySelector('.wind span').textContent = `${weather.wind} km/h`;
    }

    if (window.location.pathname.includes('description.html')) {
        document.querySelector('.cityname').textContent = `${weather.cityname}`;
        document.querySelector('.temperature').textContent = `${weather.temperature}°C`;
        document.querySelector('.description').textContent = weather.description;
    }


    // Atualiza a imagem com base nas condições climáticas
    const weatherCondition = apiData.weather[0].main;
    let image = '';
    let backgroundImage = '';
    switch (weatherCondition) {
        case 'Clear':
            backgroundImage = "url('/static/images/clear.jpg')";
            break;
        case 'Rain':
            backgroundImage = "url('/static/images/rain.jpg')";
            break;
        case 'Snow':
            backgroundImage = "url('/static/images/snow.jpg')";
            break;
        case 'Clouds':
            backgroundImage = "url('/static/images/cloud.jpg')";
            break;
        case 'Haze':
            backgroundImage = "url('/static/images/mist.jpg')";
            break;
        default:
            image = 'static/images/default.png'; // Imagem padrão para condições desconhecidas
    }
    
    // Define o background do container específico
    document.querySelector('.flex-climate').style.backgroundImage = backgroundImage; // Mudança aqui

} else {
    console.log('Nenhum dado de Clima no localStorage');
}




// RAIN DATA TO HTML
if (apiDataRain) {
    console.log(apiDataRain)
    const rain = new Rain(apiDataRain.data.values);
    console.log('Dados carregados de Chuva:', rain);
    if (window.location.pathname.includes('climate.html')) {
        document.querySelector('.rain span').textContent = `${rain.rain} mm`;
    }
} else {
    console.log('Nenhum dado de Chuva no localStorage');
}




// // //TIDE DATA TO HTML
if (apiDataTide) {
    //const tides = apiDataTide.data.map(tide => ({ time: tide.time, height: tide.height, type: tide.type }));
    const tideData = new Tide(apiDataTide.data);
    console.log('Dados carregados de Maré:', tideData);
   
    // Verifica se está na página climate.html
    if (window.location.pathname.includes('climate.html')) {
        const closestTide = tideData.findClosestTideTime();
        document.querySelector('.tide #value').textContent = `${closestTide.height.toFixed(2)} mm`;
        document.querySelector('.tide #type').textContent = closestTide.type;
    }

    // Seleciona o contêiner onde as marés serão exibidas para adicionar n tides de acordo com o numero de dados por dia
        const tideContainer = document.querySelector('.tide-details');
    // Verifica se está na página description.html
    if (window.location.pathname.includes('description.html')) {
        // Limpa o conteúdo existente no contêiner de marés
        tideContainer.innerHTML = ''; 

        // Cria dinamicamente os elementos de maré com base no número de marés
        for (let i = 0; i < tideData.number_tides; i++) {
            // Cria uma div para cada maré
            const tideElement = document.createElement('div');
            tideElement.classList.add('tide');

            let iconClass = '';
            if (tideData.types[i] === 'low') {
                iconClass = 'fa-arrow-down'; // Classe para maré baixa
            } else if (tideData.types[i] === 'high') {
                iconClass = 'fa-arrow-up'; // Classe para maré alta
            }

            let icon = '';
            if (tideData.types[i] === 'low') {
                icon = '<i class="fa-solid fa-arrow-down"></i>'; // Ícone para maré baixas
            } else if (tideData.types[i] === 'high') {
                icon = '<i class="fa-solid fa-arrow-up"></i>'; // Ícone para maré alta
            } else {
                icon = '<i class="fa-solid fa-water"></i>'; // Ícone padrão
            }

            // Cria os elementos internos para altura e tipo
            tideElement.innerHTML = `
                <i class="fa-solid ${iconClass}"></i>
                <p class="height">${tideData.heights[i].toFixed(2)} mm </p>
                <p class="type">${tideData.types[i]}</p>
                <p class="hour">${tideData.hours[i]} </p>
            `;

            // Adiciona as novas divs
            tideContainer.appendChild(tideElement);

        }
    }

} else {
    console.log('Nenhum dado de maré no localStorage');
}


//localStorage.clear();

