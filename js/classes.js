//CLASSE WEATHER
export class Weather {
    constructor(weather) {
        this.cityname = weather.name;
        this.temperature = weather.main.temp;
        this.humidity = weather.main.humidity;
        this.wind = weather.wind.speed;
        this.description = weather.weather[0].description;
        this.main = weather.weather[0].main;
    }

    // Método para formatar os dados do clima para exibição
    displayWeather() {
        return `City: ${this.cityname}, Temp: ${this.temperature}°C, Humidade: ${this.humidity}%, Vento: ${this.wind} km/h, Condições: ${this.description}`;
    }
}

export class Rain {
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
export class Tide {
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

