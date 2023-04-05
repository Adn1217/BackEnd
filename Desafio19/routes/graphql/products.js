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
// let productsLocal = {id: 1, title: 'producto de prueba'}
productosGraphql.use('/', debug, graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: {
        getProducts: async () => {
            let products = await prdController.getProducts(req, res)
            return products;
        },
        getProduct: async ({id}) => {
            req.query.id = id;
            // console.log('id: ', req.query.id);
            let product = await prdController.getProducts(req, res);
            // console.log('Producto: ', prd);
            return product.producto || product.error;
        },
        saveProduct: async({data}) => {
            req.body = data;
            let savedProduct = await prdController.doSaveProduct(req, res);
            console.log(savedProduct);
            return savedProduct.Guardado || savedProduct.Error;
        },
        updateProduct: async({id, data}) => {
            req.body = data;
            req.params.id = id;
            let savedProduct = await prdController.updateProductById(req, res);
            console.log(savedProduct);
            return  savedProduct.actualizadoFirebase || savedProduct.error;
        },
        deleteProduct: async ({id}) => {
            req.params.id = id;
            // console.log('id: ', req.query.id);
            let deletedProduct = await prdController.doDeleteProductById(req, res);
            console.log('Deleted Product: ', deletedProduct);
            return deletedProduct.eliminado;
        }
    },
    graphiql: false
})));
// productosTest.use('/', isLogged);

function debug(req, res, next){
    console.log('Query: ', req.query);
    next();
}

// async function getProducts(){
//     await prdController.getProducts(request, response);
// }