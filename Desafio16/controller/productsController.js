import * as msgController from './messagesController.js';
import { faker } from '@faker-js/faker';
import logger from '../logger.js';
import * as service from '../service/products.js';

function createRandomProducts(n){
    const randomProducts = [];
    for(let i=0; i<n; i++){
        const randomProduct = {};
        randomProduct.title = faker.commerce.product();
        randomProduct.id = i+1;
        randomProduct.code = `Prd0${Math.round(Math.random()*100)}`;
        // randomProduct.price = (Math.random()*5000).toFixed(2);
        randomProduct.price = faker.commerce.price(100, 5000, 2);
        randomProduct.stock = Math.round((Math.random()*100));
        randomProduct.description = faker.commerce.productDescription();
        randomProduct.thumbnail = faker.image.imageUrl(720, 720, randomProduct.title);
        randomProducts.push(randomProduct);
    }
    return randomProducts;
}

export async function getProducts(req, res) {
    await service.getProducts(req, res);
} 

export function getRandomProducts(res, n) {
    const allProductsRandom = createRandomProducts(n);
    // console.log(allProductsRandom);
    logger.debug(`${JSON.stringify(allProductsRandom)}`);
    res.send(allProductsRandom);
} 

export async function showProducts(req, res) {
    let renderData = await service.showProducts(req);
    res.render('pages/index', renderData);
}

export async function showProductsRandom(res) {
    const allProducts = await getProductsRandom(); 
    const allMessages = await msgController.getMessages();
    // console.log('Los productos son: \n', allProducts);
    // res.send({products: allProducts})
    const user = req.session.user;
    res.render('pages/index', {user: user, products: allProducts, msgs: allMessages});
}

export async function doSaveProduct(req, res) {
    let product = req.body;
    let savedProd = await service.saveProduct(product);
    res.send(savedProd);
}


export async function updateProductById(req, res) {
    const updatedProd = req.body;
    const id = req.params.id;
    let updatedFB = await service.updateProductByIdFB(updatedProd, id);
    let updatedMongo = await service.updateProductByIdMongo(updatedProd, id);
    let updatedFile = await service.saveProductByIdFile(updatedProd, id);
    res.send(updatedFB);
}

export async function doDeleteProductById(req, res) {
    const {id} = req.params;
    let deletedProduct = await service.deleteProductById(id);
    res.send(deletedProduct);
}