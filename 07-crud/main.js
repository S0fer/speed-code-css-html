'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocal = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //Read local
const setLocal = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient)) //Push local (create)


const createClient = (client) =>{
    const dbClient = getLocal()
    dbClient.push(client)
    setLocal(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = getLocal()
    dbClient[index] = client
    setLocal(dbClient)
}

const deleteClient = (index) =>{
    const dbClient = getLocal()
    dbClient.splice(index, 1)
    setLocal(dbClient)
}

const isValidField = () =>{
    return document.getElementById('form').reportValidity()
}

const clearFields = () =>{
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field=> field.value='')
}

const saveClient = () => {
    if (isValidField()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new'){
            createClient(client)
            updateTable()
            closeModal()
        }
        else{
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) =>{
    const newRow = document.createElement('tr')
    newRow.innerHTML=`
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () =>{
    const dbClient = getLocal()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) =>{
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) =>{
    const client = getLocal()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) =>{
    if (event.target.type == 'button'){

    const [action, index] = event.target.id.split('-')
    if (action == 'edit'){
        editClient(index)
    }
    else{
        const client = getLocal()[index]
        const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
        if (response){
            deleteClient(index)
            updateTable()
        }
    }
    }
}



updateTable()

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)