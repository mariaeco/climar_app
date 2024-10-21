// plot ultimo ano
export function plotarLastYearGrafico(data, variavel) {
    
    const nomeMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
    const meses = data.dados_mensais.map(item => nomeMeses[item.mes - 1]);  // Subtrai 1 porque o array começa no índice 0
    let varname = data.dados_mensais.map(item => item[variavel]);
    
    if (variavel === "temperatura") {
        variavel = "Temperature º(C)";
    } else if (variavel === "precipitacao"){
        variavel = "Preciptation (mm)";
    } else if (variavel === "umidade"){
        variavel = "Humidity (%))";
    } else if (variavel === "mare_alta"){
        varname = (varname.map(item => item*3))
        variavel = "Wind speed (km/h)";
    }

    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses, // Todos os meses como rótulos do eixo X
            datasets: [{
                label: variavel,
                data: varname, // Todas as temperaturas mensais
                borderColor: 'rgba(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: variavel
                    }
                }
            }
        }
    });
}


//PLOT TEMPERATURA MÉDIA ANUAL
export function plotarAVERAGEGrafico(data) {
    //console.log(data)
    const anos = Object.keys(data);
    const temperaturas = anos.map(ano => {
        // Calculando a média de temperatura para cada ano
        const temperaturasAnuais = data[ano].map(mes => mes.temperatura);
        const mediaAnual = temperaturasAnuais.reduce((acc, temp) => acc + temp, 0) / temperaturasAnuais.length;
        return mediaAnual;
    });

    // Configurando o gráfico de linha
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos, // Os anos como rótulos do eixo X
            datasets: [{
                label: 'Temperatura Média Anual (°C)',
                data: temperaturas, // As temperaturas como valores no eixo Y
                borderColor: 'rgba(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192)',
                borderWidth: 2
            }]
        }
    });
}

//PLOT TODAS AS DATAS
export function plotarGrafico(data) {
    const anos = Object.keys(data);
    
    const meses = [];
    const temperaturas = [];

    anos.forEach(ano => {
        data[ano].forEach(mes => {
            meses.push(`${ano}-${mes.mes}`);
            temperaturas.push(mes.temperatura);
        });
    });
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses, // Todos os meses como rótulos do eixo X
            datasets: [{
                label: 'Temperaturas (°C)',
                data: temperaturas, // Todas as temperaturas mensais
                borderColor: 'rgba(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    }
                }
            }
        }
    });
}

