import express from 'express';
import * as prdController from './controller/productsController.js';

const { Router } = express;
const app = express();
const productos = new Router();

app.use('/productos', productos);


productos.get('/:id?', async(req, res) => {
    if(Object.keys(req.query).length > 0 || req.params.id){
        const id = req.query.id || req.params.id
        prdController.showProductById(res, id);
    }else{
        let allProducts = await prdController.getProducts()
        res.send(allProducts);
    }
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

module.exports = productos;