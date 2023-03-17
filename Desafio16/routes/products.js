import express from 'express';
import {onlyAdmin, isLogged} from '../functions.js';
import * as prdController from '../controller/productsController.js';
import logger from '../logger.js';

const { Router } = express;
export const productos = new Router();
export const productosTest = new Router();

productos.use('/', isLogged);
productosTest.use('/', isLogged);

productos.get('/:id?', async(req, res) => {
    await prdController.getProducts(req, res);
    })

productosTest.get('/', async(req, res) => {
    prdController.getRandomProducts(5);
})

productos.post('/', (req, res) => {
    onlyAdmin(req, res, prdController.doSaveProduct, [req, res]);
})


productos.put('/:id', (req, res) => { 
    onlyAdmin(req, res, prdController.updateProductById, [req, res]);
})

productos.delete('/:id', (req, res) => {
    onlyAdmin(req, res, prdController.doDeleteProductById, [req, res]);
})