const search = document.querySelector('.search-box button');
search.addEventListener('click', () => {
    fetchWeatherData();
    //window.location.href = 'climate.html';
});

const input = document.querySelector('.search-box input');
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchWeatherData();
        //window.location.href = 'climate.html';
    }
});

function fetchWeatherData() {
    const city = document.querySelector('.search-box input').value;
    const apiKey = 'MY_KEY';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) { // Verifica se o código da resposta é sucesso (200)
                // Armazena os dados do clima no localStorage
                localStorage.setItem('apiData', JSON.stringify(data));

                // Chama a função para buscar os dados da maré
                fetchTideData(data.coord.lat, data.coord.lon);
            } else {
                alert('Cidade não encontrada!');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
        });
}


function fetchTideData(lat, lng) {
    const today = new Date();
    const todayISO = today.toISOString().substring(0, 10);
    console.log('hoje:', todayISO);
    
    const yesterday = new Date();
    const timedecrease = -1;
    yesterday.setUTCDate(today.getUTCDate() + timedecrease)
    console.log('yes:', yesterday);
    const yesterdayISO = yesterday.toISOString().substring(0, 10)

    fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${yesterdayISO}&end=${todayISO}`, {
        headers: {
            'Authorization': 'MY_KEY'
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

