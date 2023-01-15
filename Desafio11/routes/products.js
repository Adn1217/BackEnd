import express from 'express';
import * as prdController from '../controller/productsController.js';

const { Router } = express;
export const productos = new Router();
export const productosTest = new Router();

async function onlyAdmin(req, res, next, params) {
    const isAdmin = req.headers.auth; //Solo para poder probarlo desde el Front.
    // console.log(String(isAdmin).toLowerCase() == "true");
    if (String(isAdmin).toLowerCase() == "true") { 
        next(...params);
    } else { 
        res.status(401).json({error:-1,descripcion:`Ruta ${req.originalUrl} metodo ${req.method} no autorizado`});
    }
}

productos.get('/:id?', async(req, res) => {
    if(Object.keys(req.query).length > 0 || req.params.id){
        const id = req.query.id || req.params.id
        prdController.showProductById(res, id);
    }else{
        let allProducts = await prdController.getProducts()
        res.send(allProducts);
    }
})

productosTest.get('/', async(req, res) => {
    let allRandomProducts = prdController.getRandomProducts(5);
    res.send(allRandomProducts);
})

productos.post('/', (req, res) => {
    onlyAdmin(req, res, prdController.doSaveProduct, [req.body, res]);
})


productos.put('/:id', (req, res) => { 
    const prod = req.body;
    const id = req.params.id;
    onlyAdmin(req, res, prdController.updateProductById, [res, prod, id]);
})

productos.delete('/:id', (req, res) => {
    const {id} = req.params;
    onlyAdmin(req, res, prdController.doDeleteProductById, [res, id]);
})