import { fetchWeatherData } from './fetch_fav.js';


const datafav = JSON.parse(localStorage.getItem('apiData')); // Dados da página index
const datalocal = JSON.parse(localStorage.getItem('apiDataAtualLocation')); // Dados da página climate

const origin = sessionStorage.getItem('origin'); // Obtém a origem armazenada

let apiData; // Declare a variável antes do bloco condicional

if (origin === "climate.html") { // Verifique se a origem é "index" (não inclua ".html")
    apiData = datafav; // Atribua os dados da página index
} else if (origin === "index.html") { // Verifique se a origem é "climate" (não inclua ".html")
    apiData = datalocal; // Atribua os dados da página climate
}

const sCity = apiData.name;      // Nome da cidade
const sLat = apiData.coord.lat;  // Latitude
const sLon = apiData.coord.lon;  // Longitude






const tbody = document.querySelector('tbody')


let itens
let id

function insertItem(item, index) {
    let tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td><a class="fav-city">${item.city}</a></td>
      <td class="acao">
        <button class="delete-btn" data-index="${index}"><i class='bx bx-trash'></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  }
  
  // Adicione o event listener para os botões de delete
tbody.addEventListener('click', (event) => {
    if (event.target.closest('.delete-btn')) {
      const index = event.target.closest('.delete-btn').dataset.index;
      deleteItem(index);
    }
  });


function deleteItem(index) {
    itens = getItensBD(); // Certifique-se de pegar a lista atualizada
    itens.splice(index, 1); // Remove o item no índice especificado
    setItensBD(); // Salva as alterações
    loadItens(); // Atualiza a tabela
  }


function loadItens() {
    
    itens = getItensBD()
  
    tbody.innerHTML = ''
    itens.forEach((item, index) => {
        insertItem(item, index)
    })
}



document.addEventListener("DOMContentLoaded", function() {
    const favLinks = document.querySelectorAll('.fav-city');

    favLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link

            const city = link.textContent; // Obtém o nome da cidade do link
            fetchWeatherData(city); // Chama a função FETCHTEMPO com o nome da cidade

            // Aqui você pode redirecionar para a página do clima, se necessário
            setTimeout(() => {
                window.location.href = 'climate.html'; // Redireciona para a página do clima após um pequeno atraso
            }, 1000); // Ajuste o tempo conforme necessário (em milissegundos)
        });
    });
});




const getItensBD = () => JSON.parse(localStorage.getItem('dbfavorites')) ?? []
const setItensBD = () => localStorage.setItem('dbfavorites', JSON.stringify(itens))


// Adiciona o item da API à lista de favoritos e carrega os itens
if (!getItensBD().some(item => item.city === sCity)) {
    itens = getItensBD();
    itens.push({ 'city': sCity, 'lat': sLat, 'lon': sLon });
    setItensBD();
}

loadItens()


