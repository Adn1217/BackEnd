import ContenedorMongoAtlas from '../container/ContenedorMongoAtlas.class.js';
import ContenedorFirebase from '../container/ContenedorFirebase.class.js';
import * as container from '../container/carts.js';
import { sendMail, sendSmsMsg, sendWappMsg } from '../server.js';
import { calculateId } from '../functions.js';
import { cartsCollection } from '../server.js';
import logger from '../logger.js';

export async function getCarts(){
    const carts = await container.getCarts(); 
    return carts;
}

export async function saveCart(cart){
    if (Object.keys(cart).length === 0){
        return({Error: "Carrito no recibido"})
    }else{
        let newCart = container.saveCart(cart);
        // console.log('Carrito: ', JSON.stringify(cart));
        return ({Guardado: newCart});
    }
}

export async function doSaveProductInCartFB(newProd, id_cart){
    const cartsFirebase = new ContenedorFirebase(cartsCollection);
    const cartFirebase = await cartsFirebase.getById(id_cart);
    // console.log('Carrito en Firebase', cartFirebase);
    logger.debug(`Carrito en Firebase ${cartFirebase}`);
    if (cartFirebase){
        let newProdWithId = calculateId(newProd, cartFirebase.productos)
        newProdWithId.timestamp = new Date().toLocaleString("en-GB");
        cartFirebase.productos.push(newProdWithId);
        cartsFirebase.updateById(cartFirebase, id_cart);
        // console.log("Se ha agregado en Firebase el producto: \n", newProdWithId);
        logger.debug(`Se ha agregado en Firebase el producto: ${newProdWithId}`);
        return({actualizadoFirebase: cartFirebase})
    }else{
        // console.log("Carrito no encontrado en Firebase.");
        logger.error(`Carrito ${id_cart} no encontrado en Firebase.`);
        return({error: "Carrito no encontrado"})
    }

}

export async function doSaveProductInCartMongo(newProd, id_cart){
    const cartsMongoAtlas = new ContenedorMongoAtlas(cartsCollection);
    const cartMongoAtlas = await cartsMongoAtlas.getById(id_cart);
    let actualizadoMongo = {actualizadoMongo: cartMongoAtlas};
    if (cartMongoAtlas){
        cartMongoAtlas.productos.push(newProd);
        let cart = await cartsMongoAtlas.updateById(cartMongoAtlas, id_cart);
        // console.log("Se ha agregado en Mongo el producto al carrito: \n", cart);
        logger.debug(`Se ha agregado en Mongo el producto al carrito: ${cart}`, cart);
        // res.send({actualizadoMongo: cartMongoAtlas})
    }else{
        // console.log("Carrito no encontrado en Mongo.");
        logger.error(`Carrito ${id_cart} no encontrado en Mongo.`);
        actualizadoMongo = {error: "Carrito no encontrado en Mongo."}
        // res.send({error: "Carrito no encontrado"})
    }
    // console.log(actualizadoMongo);
    logger.info(`${JSON.stringify(actualizadoMongo)}`);
}

export async function doSaveProductInCartFile(res, newProd, id_cart){
    await container.saveProductInCartByIdFile(res, newProd, parseInt(id_cart));
}

export async function getCartById(id){
    // console.log(cartById);
    // logger.debug(`El carrito es: ${JSON.stringify(cartById)}`)
    let cartById = await container.getCartById(id);
    if (!cartById){
        return({error:"Carrito no encontrado"});
    }else{
        // console.log(cartById.productos);
        logger.debug(`Los productos del carrito son: ${JSON.stringify(cartById.productos)}`)
        return({productosCarrito: cartById.productos});
    }
}

export async function deleteCartById(id){
    let deletedCart = await container.deleteCartById(id);
    if (!deletedCart || deletedCart?.deletedCount == 0){
        deletedCart = {
            error: "Carrito no encontrado"
        }
        return(deletedCart)
    }else{
        return({eliminado: deletedCart})
    }
    // return deletedCart;
}

export async function deleteProductInCartById(id_prod, id_cart){
    let deletedProduct = await container.deleteProductInCartById(id_prod, id_cart);
    // console.log("Producto eliminado: ", deletedProduct);
    logger.info(`Producto eliminado: ${deletedProduct}`);
    if (!deletedProduct && deletedProduct !== undefined){
        deletedProduct = {
            error: `Carrito ${id_cart} no encontrado`
        }
        return(deletedProduct)
    }else{
        if (deletedProduct === undefined){
            deletedProduct = {
                error: `Producto ${id_prod} no encontrado en el carrito ${id_cart}`
            }
            return(deletedProduct)
        }else{
            return({eliminado: deletedProduct})
        }
    }
    // return deletedProduct;
}

export async function updateCartById(updatedCart, id){
    let cartById = await container.getCartById(id);
    if (!cartById){
        logger.error(`Carrito ${id} no encontrado`);
        res.send({error: "Carrito no encontrado"});
    }else{
        const allCarts = await container.getCarts();
        const newCarts = allCarts.map((cart) => {
            if(cart.id === id){
                cart = updatedCart;
                cart.id = id;
                // console.log(cart);
            }
            return cart;
        })
        // console.log('La nueva lista de carritos es: ', newCarts);
        logger.debug(`La nueva lista de carritos es: ${JSON.stringify(newCarts)}`);
        const allSaved = await saveAllCarts(newCarts);
        if (allSaved === 'ok'){
            return({actualizado: updatedCart})
        }else{
            logger.error(`Se ha presentado error al guardar de forma local: ${allSaved}`)
            return({error: allSaved})
        }
    }
    
}

export async function buyCartById(cart, user){
    sendMail('Se ha registrado una nueva compra', cart, `Nuevo pedido de ${user?.username} - ${user?.mail}`);
    sendWappMsg('Se ha registrado una nueva compra', cart, `Nuevo pedido de ${user?.username} - ${user?.mail}`);
    sendSmsMsg('Su pedido ha sido recibido y se encuentra en proceso', user?.tel)
}