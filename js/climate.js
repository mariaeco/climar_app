import { Weather, Rain, Tide} from './classes.js';
import { downloadJSON, loadJSONFile, fetchFraseAleatoria } from './functions.js';
import { plotarGrafico, plotarLastYearGrafico } from './plots.js';


// // Recupera os dados armazenados no localStorage 
const apiData = JSON.parse(localStorage.getItem('apiData'));
const apiDataTide = JSON.parse(localStorage.getItem('apiDataTide'));
const apiDataRain = JSON.parse(localStorage.getItem('apiDataRain'));

////PARA SALVAR OS ARQUIVOS ------------------------------------------------------------------------------------
// downloadJSON(apiData, 'climate_data.json');// DOWNLOAD
// downloadJSON(apiDataTide, 'tide_data.json');
// downloadJSON(apiDataRain, 'rain_data.json');

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

    if (window.location.pathname.includes('tide_description.html')) {
        document.querySelector('.cityname').textContent = `${weather.cityname}`;
        document.querySelector('.temperature').textContent = `${weather.temperature}°C`;
        document.querySelector('.description').textContent = weather.description;
    }

    // Atualiza a imagem com base nas condições climáticas
    const weatherCondition = weather.main;
    const warning = document.querySelector('.warning-message'); // adicionando o warning

    let image = '';
    let backgroundImage = '';
    switch (weatherCondition) {
        case 'Clear':
            backgroundImage = "url('/static/images/clear.jpg')";
            break;
        case 'Rain':
            backgroundImage = "url('/static/images/rain.jpg')";
            break;
        case 'Drizzle':
            backgroundImage = "url('/static/images/rain.jpg')";
            break;
        case 'Mist':
            backgroundImage = "url('/static/images/mist.jpg')";
        break;
        case 'Snow':
            backgroundImage = "url('/static/images/snow.jpg')";
            fetchFraseAleatoria("neve").then(fraseAleatoria => {
                warning.innerHTML = fraseAleatoria;
                warning.style.display = 'block';  // Exibe a mensagem
            });
            break;
        case 'Clouds':
            backgroundImage = "url('/static/images/cloud.jpg')";
            break;
        case 'Haze':
            backgroundImage = "url('/static/images/mist.jpg')";
            break;
        case 'Mist':
            backgroundImage = "url('/static/images/mist.jpg')";
            break;
        case 'Fog':
                backgroundImage = "url('/static/images/fog.jpg')";
                fetchFraseAleatoria("nevoa").then(fraseAleatoria => {
                    warning.innerHTML = fraseAleatoria;
                    warning.style.display = 'block';  // Exibe a mensagem
                });
            break;
        case 'Thundestorm':
                backgroundImage = "url('/static/images/thundestorm.jpg')";
                fetchFraseAleatoria("trovoada").then(fraseAleatoria => {
                    warning.innerHTML = fraseAleatoria;
                    warning.style.display = 'block';  // Exibe a mensagem
                });
            break;
        default:
            image = 'static/images/default.png'; // Imagem padrão para condições desconhecidas
    }
    // Define o background do container específico
    document.querySelector('.flex-climate').style.backgroundImage = backgroundImage; // Mudança aqui

    //NEW
    if (weather.temperature > 28) {  // Verifica se a velocidade é maior que 10 Km/h
        fetchFraseAleatoria("calor").then(fraseAleatoria => {
            warning.innerHTML = fraseAleatoria;
            warning.style.display = 'block';  // Exibe a mensagem
            warning.classList.add('warning-hot'); 
        });
    }
    if (weather.temperature < 10) {  // Verifica se a velocidade é maior que 10 Km/h
        fetchFraseAleatoria("frio").then(fraseAleatoria => {
            warning.innerHTML = fraseAleatoria;
            warning.style.display = 'block';  // Exibe a mensagem
            warning.classList.add('warning-cold'); 
        });
    }
    if (weather.temperature >15 && weather.temperature <20) {  // Verifica se a velocidade é maior que 10 Km/h
        fetchFraseAleatoria("ameno").then(fraseAleatoria => {
            warning.innerHTML = fraseAleatoria;
            warning.style.display = 'block';  // Exibe a mensagem
            warning.classList.add('warning-cold'); 
        });
    }
    if (weather.temperature >15 && weather.temperature <20) {  // Verifica se a velocidade é maior que 10 Km/h
        fetchFraseAleatoria("ameno").then(fraseAleatoria => {
            warning.innerHTML = fraseAleatoria;
            warning.style.display = 'block';  // Exibe a mensagem
            warning.classList.add('warning-cold'); 
        });
    }

    //INCLUINDO AQUI OS DADOS HISTÓRICOS DE TEMPERATURA, VC PODE MUDAR A CIDADE ABAIXO - 
    //OS DADOS ESTAO ARMAZENADOS NA PASTA DE DADOS
    //SAO DADOS CRIADOS POIS OS HISTÓRICOS SÃO PAGOS

    // Captura o clique nos links com a classe 'link-grafico'
    let links = document.querySelectorAll('.link-grafico');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evita o comportamento padrão do link
            localStorage.setItem('grafico', this.id); // Salva o ID no localStorage
            window.location.href = 'historical.html'; // Redireciona para a página
        });
    });

    // Dentro da página historical.html
    if (window.location.pathname.includes('historical.html')) {
        document.querySelector('.cityname').textContent = `${weather.cityname}`;
        document.querySelector('.temperature').textContent = `${weather.temperature}°C`;
        document.querySelector('.description').textContent = weather.description;

        // Substitua 'Tokyo' pela cidade desejada
        let city = 'Dubai'; 
        loadJSONFile(`historic_last_year_${city}.json`)
            .then(data => {
                localStorage.setItem('data', JSON.stringify(data));
                let temp_yearData = data;
                
                // Obtém o ID salvo no localStorage
                let graficoId = localStorage.getItem('grafico');
            
                // Verifica qual gráfico deve ser plotado com base no ID
                if (graficoId === 'rain') {
                    // Lógica para plotar o gráfico de chuva
                    plotarLastYearGrafico(data, "precipitacao");
                } else if (graficoId === 'umid') {
                    // Lógica para plotar o gráfico de umidade
                    plotarLastYearGrafico(data, "umidade");
                } else if (graficoId === 'temp') {
                    // Lógica para plotar o gráfico de temperatura
                    plotarLastYearGrafico(data, "temperatura");
                } else if (graficoId === 'wind') {
                    // Lógica para plotar o gráfico de vento
                    plotarLastYearGrafico(temp_yearData, "mare_alta");
                }
            })
            .catch(error => {
                console.error('Erro ao carregar o arquivo JSON:', error);
            });
    }
} else {
    console.log('Nenhum dado de Clima no localStorage');
}

//para gerar vaalores aleatorios de chuva ja que a api não me dá de graça
function getRandomFloat(rain) {
    let raindescripton = rain
    if (raindescripton=="light rain"){
        let randomFloat = Math.random() * 5;
        return randomFloat.toFixed(1); 
    }
    if (raindescripton=="moderate rain"){
        let randomFloat = Math.random() * (15 - 6) + 6; 
        return randomFloat.toFixed(1); 
        
    }
    else{
        let randomFloat = Math.random() * (50 - 15) + 15; 
    }
    return randomFloat.toFixed(1); 
}

// RAIN DATA TO HTML
if (apiDataRain) {
    const rain = new Rain(apiDataRain.data.values);
    const weather = new Weather(apiData); //fazendo uma bagunca aqui para mostrar os dados de chuva, pois a app é paga
    console.log('Dados carregados de Chuva:', rain);
    if (window.location.pathname.includes('climate.html')) {
        if (weather.main=="Rain"){
            document.querySelector('.rain span').textContent = `${ getRandomFloat(weather.description)} mm`;
        }
        else{
            document.querySelector('.rain span').textContent = `${rain.rain} mm`;
        }
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
    if (window.location.pathname.includes('tide_description.html')) {
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