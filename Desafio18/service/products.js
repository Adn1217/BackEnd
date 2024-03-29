import * as container from '../container/products.js';
import * as msgController from '../controller/messagesController.js';
import logger from '../logger.js';

export async function saveProduct(product){
    if (Object.keys(product).length === 0){
        logger.error('Producto no recibido');
        return({Error: "Producto no recibido"})
    }else{
        let newProd = await container.saveProduct(product);
        // console.log('ProductoFront', product);
        return({Guardado: newProd})
    }
}

export async function getProducts(req, res){
    if(Object.keys(req.query).length > 0 || req.params.id){
        const id = req.query.id || req.params.id;
        await showProductById(res, id);
    }else{
        const allProducts = await container.getProducts();
        res.send(allProducts);
    }
}

export async function showProducts(req) {
    const allProducts = await container.getProducts(); 
    const allMessages = await msgController.getMsgs();
    // console.log('Los productos son: \n', allProducts);
    const user = req.user.username;
    let renderData = {user: user, products: allProducts, msgs: allMessages};
    return renderData;
}

async function showProductById(res, id) {
    let productById = await container.getProductById(id);
    if (!productById || Object.keys(productById).length === 0){
        logger.error(`Producto ${id} no encontrado`);
        res.send({error:"Producto no encontrado"});
    }else{
        // console.log(productById);
        logger.debug(`productById: ${JSON.stringify(productById)}`);
        res.send({producto: productById});
    }
}

export async function updateProductByIdFB(updatedProd, id){
    const updatedProductFB = await container.updateProductByIdFB(updatedProd, id);
    if(!('error' in updatedProductFB)){
        // console.log("Se ha actualizado el producto: \n", updatedProductFB);
        logger.info(`Se ha actualizado en FB el producto: ${JSON.stringify(updatedProductFB.actualizadoFirebase)}`);
    }else{
        // console.log("Producto no actualizado");
        logger.warn('Producto no actualizado');
        logger.error(`Producto ${id} no encontrado`);
    }
    return updatedProductFB;
}

export async function updateProductByIdMongo(updatedProd, id){
    const updatedProdMongo = await container.updateProductByIdMongo(updatedProd, id);
    if (!('error' in updatedProdMongo)){
        // console.log("Se ha actualizado en Mongo el producto: \n", productMongoAtlas);
        logger.info(`Se ha actualizado en Mongo el producto: ${JSON.stringify(updatedProdMongo)}`);
    }else{
        // console.log("Producto no actualizado en Mongo");
        logger.warn(`Producto no actualizado en Mongo: ${JSON.stringify(updatedProdMongo)}`);
    }
    return updatedProdMongo;
}

export async function saveProductByIdFile(updatedProd, id){
    const updatedProdFile = await container.saveProductByIdFile(updatedProd, id);
    if('error' in updatedProdFile){
        logger.warn(`Producto no actualizado en File: ${JSON.stringify(updatedProdFile)}`);
    }else{
        logger.debug(`Actualizado en Archivo: ${JSON.stringify(updatedProdFile)}`);
    }
    return updatedProdFile;
}

export async function deleteProductById(id){
    let deletedProduct = await container.deleteProductById(id);
    if (!deletedProduct || Object.keys(deletedProduct).length === 0){
        deletedProduct = {
            error: "Producto no encontrado"
        }
        logger.error(`Producto ${id} no encontrado.`)
        return(deletedProduct)
    }else{
        return({eliminado: deletedProduct})
    }
}