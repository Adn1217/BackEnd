import { Injectable } from '@nestjs/common';
import {ProductsContainer as container} from './container/products.container'
import { Request } from 'express';
import { updateProductDto } from './dto/update-product.dto';
// import * as container from '../container/products.js';
// import * as msgController from '../controller/messagesController.js';
// import logger from '../logger.js';

@Injectable()
export class ProductsService {
    constructor(private readonly productsContainer: container){}

async saveProduct(product){
    if (Object.keys(product).length === 0){
        console.log('Producto no recibido');
        // logger.error('Producto no recibido');
        return({Error: "Producto no recibido"})
    }else{
        let newProd = await this.productsContainer.saveProduct(product);
        console.log('ProductoFront', product);
        return({Guardado: newProd})
    }
}

async getProducts(req: Request){
    console.log('Request params: ', req.params)
    let graphqlQuery = JSON.stringify(req.query?.query);
    let graphqlBool = graphqlQuery?.search('getProducts') > 0 || false;
    console.log('¿Consulta graphql de todos los productos? ', graphqlBool);
    if((Object.keys(req.query).length > 0 || req.params.id) && !(graphqlBool)){
        const id = req.query.id || req.params.id;
        let product = await this.productsContainer.getProductById(id as string);
        // console.log('Producto encontrados service: ', product);
        return product;
    }else{
        const allProducts = await this.productsContainer.getProducts();
        return allProducts;
    }
}

// async showProducts(req) {
//     const allProducts = await container.getProducts(); 
//     // const allMessages = await msgController.getMsgs();
//     // console.log('Los productos son: \n', allProducts);
//     const user = req.user.username;
//     // let renderData = {user: user, products: allProducts, msgs: allMessages};
//     let renderData = {user: user, products: allProducts};
//     return renderData;
// }

private async getProductById(id: string) {
    let productById = await this.productsContainer.getProductById(id);
    if (!productById || Object.keys(productById).length === 0){
        // logger.error(`Producto ${id} no encontrado`);
        return({error:"Producto no encontrado"});
    }else{
        console.log(productById);
        // logger.debug(`productById: ${JSON.stringify(productById)}`);
        return({producto: productById});
    }
}

async updateProductByIdFB(updatedProd: updateProductDto, id: string){
    console.log('Id en service: ', id);
    const updatedProductFB = await this.productsContainer.updateProductById(id, updatedProd);
    if(!('error' in updatedProductFB)){
        console.log("Se ha actualizado el producto: \n", updatedProductFB);
        // logger.info(`Se ha actualizado en FB el producto: ${JSON.stringify(updatedProductFB.actualizadoFirebase)}`);
    }else{
        console.log("Producto no actualizado");
        // logger.warn('Producto no actualizado');
        // logger.error(`Producto ${id} no encontrado`);
    }
    return updatedProductFB;
}

// async updateProductByIdMongo(updatedProd, id){
//     const updatedProdMongo = await container.updateProductByIdMongo(updatedProd, id);
//     if (!('error' in updatedProdMongo)){
//         // console.log("Se ha actualizado en Mongo el producto: \n", productMongoAtlas);
//         logger.info(`Se ha actualizado en Mongo el producto: ${JSON.stringify(updatedProdMongo)}`);
//     }else{
//         // console.log("Producto no actualizado en Mongo");
//         logger.warn(`Producto no actualizado en Mongo: ${JSON.stringify(updatedProdMongo)}`);
//     }
//     return updatedProdMongo;
// }

// async saveProductByIdFile(updatedProd, id){
//     const updatedProdFile = await container.saveProductByIdFile(updatedProd, id);
//     if('error' in updatedProdFile){
//         logger.warn(`Producto no actualizado en File: ${JSON.stringify(updatedProdFile)}`);
//     }else{
//         logger.debug(`Actualizado en Archivo: ${JSON.stringify(updatedProdFile)}`);
//     }
//     return updatedProdFile;
// }

async deleteProductById(id: string){
    type deletedPrd = {[key: string] : string};
    let deletedProduct = await this.productsContainer.deleteProductById(id);
    let deletedProductObj: deletedPrd = {} 
    if (!deletedProduct || Object.keys(deletedProduct).length === 0){
        deletedProductObj.error = "Producto no encontrado"
        // logger.error(`Producto ${id} no encontrado.`)
        return({...deletedProduct, id: deletedProductObj.error})
    }else{
        return({eliminado: deletedProduct})
    }
}
}
