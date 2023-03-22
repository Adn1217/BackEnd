import ContenedorArchivo from '../container/DAOs/ContenedorArchivo.class.js';
import ContenedorMongoAtlas from '../container/DAOs/ContenedorMongoAtlas.class.js';
import { ContenedorFirebase } from '../container/DAOs/ContenedorFirebase.class.js';
import * as container from '../container/products.js';
import { productsCollection } from '../server.js'
import * as msgController from '../controller/messagesController.js';
import logger from '../logger.js';

export async function saveProduct(product){
    if (Object.keys(product).length === 0){
        logger.error('Producto no recibido');
        return({Error: "Producto no recibido"})
    }else{
        let newProd = container.saveProduct(product);
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
    if (!productById){
        logger.error(`Producto ${id} no encontrado`);
        res.send({error:"Producto no encontrado"});
    }else{
        // console.log(productById);
        logger.debug(`productById: ${JSON.stringify(productById)}`);
        res.send({producto: productById});
    }
}

export async function updateProductByIdFB(updatedProd, id){
    const productosFirebase = new ContenedorFirebase(productsCollection);
    const productFirebase = await productosFirebase.updateById(updatedProd, id);
    if (productFirebase){
        // console.log("Se ha actualizado el producto: \n", productFirebase);
        logger.info(`Se ha actualizado el producto: ${productFirebase}`);
        return({actualizadoFirebase: productFirebase})
    }else{
        // console.log("Producto no actualizado");
        logger.warn('Producto no actualizado');
        logger.error(`Producto ${id} no encontrado`);
        return({error: "Producto no encontrado"});
    }
}

export async function updateProductByIdMongo(updatedProd, id){
    const productosMongoAtlas = new ContenedorMongoAtlas(productsCollection);
    const productMongoAtlas = await productosMongoAtlas.updateById(updatedProd,id);
    if (productMongoAtlas){
        // console.log("Se ha actualizado en Mongo el producto: \n", productMongoAtlas);
        logger.info(`Se ha actualizado en Mongo el producto: ${JSON.stringify(productMongoAtlas)}`);
        return({actualizadoMongo: productMongoAtlas})
    }else{
        // console.log("Producto no actualizado en Mongo");
        logger.warn("Producto no actualizado en Mongo");
        return({error: "Producto no encontrado"})
    }
}

export async function saveProductByIdFile(updatedProd, id){
    id = parseInt(id);
    const productos = new ContenedorArchivo('./productos.json');
    const allProducts = await productos.getAll();
    let actualizadoArchivo = {actualizadoArchivo: updatedProd};
    let productById = allProducts.find((product) => product.id === id) 
    if (!productById){
        actualizadoArchivo = {error: "Producto no encontrado"};
    }else{
        let newAllProducts = allProducts.map((prod) => {
            if(prod.id === id){
                prod = updatedProd;
                prod.id = id;
                // console.log(prod);
            }
            return prod;
        })
        // console.log('La nueva lista es: ', newAllProducts);
        logger.debug(`La nueva lista es: ${JSON.stringify(newAllProducts)}`);
        const allSaved = await container.saveAllProducts(newAllProducts);
        if (allSaved === 'ok'){
            // return({actualizado: updatedProd})
        }else{
            actualizadoArchivo = {error: allSaved};
        }
    }
    // console.log("Actualizado en Archivo: ", actualizadoArchivo)
    if('error' in actualizadoArchivo){
        logger.error(`${JSON.stringify(actualizadoArchivo)}`);
    }else{
        logger.debug(`Actualizado en Archivo: ${JSON.stringify(actualizadoArchivo)}`);
    }
    return({actualizadoArchivo});
}

export async function deleteProductById(id){
    let deletedProduct = container.deleteProductById(id);
    if (!deletedProduct){
        deletedProduct = {
            error: "Producto no encontrado"
        }
        logger.error(`Producto ${id} no encontrado.`)
        return(deletedProduct)
    }else{
        return({eliminado: deletedProduct})
    }
}