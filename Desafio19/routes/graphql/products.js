import express from 'express';
import {onlyAdmin, isLogged} from '../../functions.js';
import * as prdController from '../../controller/productsController.js';
import {graphqlHTTP} from 'express-graphql';
import {schema} from '../../models/graphql/products.js'

const { Router } = express;
export const productosGraphql = new Router();
export const productosTest = new Router();

const getProducts = prdController.getProducts;
const getProduct = prdController.getProducts;
const saveProduct = prdController.doSaveProduct;
const updateProduct = prdController.updateProductById;
const deleteProduct = prdController.doDeleteProductById;

// productosGraphql.use('/', isLogged);
productosGraphql.use('/', graphqlHTTP({
    schema: schema,
    rootValue: {
        getProducts,
        getProduct,
        saveProduct,
        updateProduct,
        deleteProduct
    },
    graphiql: true
}));
// productosTest.use('/', isLogged);

productosGraphql.get('/:id?', async(req, res) => {
    await prdController.getProducts(req, res);
    })

// productosTest.get('/', async(req, res) => {
//     prdController.getRandomProducts(res, 5);
// })

productosGraphql.post('/', (req, res) => {
    onlyAdmin(req, res, prdController.doSaveProduct, [req, res]);
})


productosGraphql.put('/:id', (req, res) => { 
    onlyAdmin(req, res, prdController.updateProductById, [req, res]);
})

productosGraphql.delete('/:id', (req, res) => {
    onlyAdmin(req, res, prdController.doDeleteProductById, [req, res]);
})