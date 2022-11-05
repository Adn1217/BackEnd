import Contenedor from './Contenedor.class.js';
import express from 'express';
// const express = require('express');
console.log('\n################INICIO DE SERVIDOR################\n')
const app = express();
const port = 8080;

async function getProducts() {
    const productos = new Contenedor('./productos.json');
    const allProducts = await productos.getAll();
    return allProducts
} 

async function getProductById(id) {
    const productos = new Contenedor('./productos.json');
    const product = await productos.getById(id);
    return product
}

function getRandId(products){
        const ids = products.map((prod) => prod.id);
        console.log("Los Ids son: ", ids);
        const randId = ids[Math.round(Math.random()*(ids.length-1))];
        console.log('El numero aleatorio es: ', randId);
        return randId
}

app.get('/', (req, res) => {
    res.send('Hola Mundo, este es mi primer servidor con Express');
})

app.get('/productos', (req, res) => {
    async function showProducts() {
        const allProducts = await getProducts(); 
        console.log('Los productos son: \n', allProducts)
        res.send(`<p><strong>Los productos son: </strong><br> ${JSON.stringify(allProducts)}</p>`);
    }
    showProducts();
})

let visitas = 0;
app.get('/Visitas', (req, res) => {
    visitas ++;
    res.send(`<h1>Renderizado desde el servidor</h1><h2>La cantidad de visitas es: ${visitas}</h2>`)
})

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', () => console.log('Se presentó error'));

app.get('/productoRandom', (req, res) => {

    async function showRandomProduct() {
        const allProducts = await getProducts(); 
        const randId = getRandId(allProducts);
        const randProduct = await getProductById(randId); 
        console.log('El producto es : \n', randProduct)
        res.send(`<p><strong>El producto aleatorio es: </strong><br> ${JSON.stringify(randProduct)}</p>`);
    }
    showRandomProduct();
})