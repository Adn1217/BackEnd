import Contenedor from './Contenedor.class.js';
import express from 'express';
// const express = require('express');
console.log('\n################INICIO DE SERVIDOR################\n')
const app = express();
const port = parseInt(process.env.PORT, 10) || 8080;
app.use(express.urlencoded({extended: true}))
app.use(express.json());

async function saveProduct(prod) {
    const productos = new Contenedor('./productos.json');
    const newProductId = await productos.save(prod);
    return newProductId
} 

async function saveAllProducts(prods) {
    const productos = new Contenedor('./productos.json');
    const saved = await productos.saveAll(prods);
    return saved 
} 

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

async function deleteProductById(id) {
    const productos = new Contenedor('./productos.json');
    const product = await productos.deleteById(id);
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

app.post('/productos', (req, res) => {
    async function doSaveProduct(prod) {
        const newProdId = await saveProduct(prod); 
        console.log('Se ha guardado el nuevo producto con el id: \n', newProdId)
        res.send(`<p><strong>Se ha guardado el nuevo producto con el id: </strong><br> ${newProdId}</p>`);
    }
    const product = req.body;
    if (Object.keys(product).length === 0){
        res.send('<p><strong>No se recibió producto</strong></p>');
    }else{
        console.log('Producto', product);
        doSaveProduct(product);
    }
})

app.get('/productos/:id', (req, res) => {
    async function showProductById(id) {
        let productById = await getProductById(id);
        if (!productById){
            productById = {
                error: "Producto no encontrado"
            }
            res.send(`<p><strong>Error: </p></strong> ${JSON.stringify(productById)}`)
        }else{
            console.log('El producto es: \n', productById); 
            res.send(`<p><strong>El producto es: </strong><br> ${JSON.stringify(productById)}</p>`);
        }
    }
    const id = req.params.id;
    console.log(id);
    showProductById(parseInt(id));
    
})

app.put('/productos/:id', (req, res) => {
    async function updateProductById(updatedProd, id) {
        let productById = await getProductById(id);
        if (!productById){
            productById = {
                error: "Producto no encontrado"
            }
            res.send(`<p><strong>Error: </p></strong> ${JSON.stringify(productById)}`)
        }else{
            const allProducts = await getProducts();
            const newAllProducts = allProducts.map((prod) => {
                if(prod.id === id){
                    prod = updatedProd;
                    prod.id = id;
                    console.log(prod);
                }
                return prod;
            })
            console.log('La nueva lista es: ', newAllProducts);
            const allSaved = await saveAllProducts(newAllProducts);
            if (allSaved === 'ok'){
                res.send(`<p><strong>Se ha actualizado exitosamente el producto. La nueva lista de productos es: </strong><br> ${JSON.stringify(newAllProducts)}</p>`);
            }else{
                res.send(`<p><strong>Se ha presentado error: </strong><br> ${saveAll}</p>`);
            }
        }
    }
    const prod = req.body;
    const id = req.params.id;
    // console.log(prod);
    updateProductById(prod, parseInt(id));
})

app.delete('/productos/:id', (req, res) => {

    async function doDeleteProductById(id) {
        let deletedProduct = await deleteProductById(id);
        if (!deletedProduct){
            deletedProduct = {
                error: "Producto no encontrado"
            }
            res.send(`<p><strong>Error: </p></strong> ${JSON.stringify(deletedProduct)}`)
        }else{
            // console.log('Se ha eliminado el producto: \n', deletedProduct); 
            res.send(`<p><strong>Se ha eliminado el producto: </strong><br> ${JSON.stringify(deletedProduct)}</p>`);
        }
            return deletedProduct;
        }

    const {id} = req.params;
    console.log(id);
    doDeleteProductById(parseInt(id));
})

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error));