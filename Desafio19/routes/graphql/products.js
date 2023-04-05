import express from 'express';
import {onlyAdmin, isLogged} from '../../functions.js';
import * as prdController from '../../controller/productsController.js';
import {graphqlHTTP} from 'express-graphql';
import {schema} from '../../models/graphql/products.js';

const { Router } = express;
export const productosGraphql = new Router();
// export const productosTest = new Router();

// const getProducts = prdController.getProducts;
// const getProduct = prdController.getProducts;
const saveProduct = prdController.doSaveProduct;
const updateProduct = prdController.updateProductById;
const deleteProduct = prdController.doDeleteProductById;

// productosGraphql.use('/', isLogged);
productosGraphql.use('/', debug, graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: {
        getProducts: async () => {
            await prdController.getProducts(req, res);
        },
        getProduct: async() => {
            // await prdController.getProducts(req, res);
        },
        // saveProduct,
        // updateProduct,
        // deleteProduct
    },
    graphiql: false
})));
// productosTest.use('/', isLogged);

function debug(req, res){
    console.log('Query: ', req.query);
}

// async function getProducts(){
//     await prdController.getProducts(request, response);
// }