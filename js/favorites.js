
const apiData = JSON.parse(localStorage.getItem('apiData'));

const sCity = apiData.name
const sLat = apiData.coord.lat
const sLon = apiData.coord.lon

console.log(sCity)

const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sCity = itens[index].city
    sLat = itens[index].lat
    sLon.value = itens[index].lon
    id = index
  } 
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.city}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sCity == '' || sLat == '' || sLon == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].city = sCity
    itens[id].lat = sLat
    itens[id].lon = sLon
  } else {
    itens.push({'city': sCity, 'lat':sLat, 'lon': sLon})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfavorites')) ?? []
const setItensBD = () => localStorage.setItem('dbfavorites', JSON.stringify(itens))

loadItens()