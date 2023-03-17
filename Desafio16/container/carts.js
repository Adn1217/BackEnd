import ContenedorArchivo from './ContenedorArchivo.class.js';
import ContenedorMongoAtlas from './ContenedorMongoAtlas.class.js';
import ContenedorFirebase from './ContenedorFirebase.class.js';
import { cartsCollection } from '../server.js'

export async function saveCart(cart) {
    const carritoFirebase = new ContenedorFirebase(cartsCollection);
    const savedFirebase = await carritoFirebase.save(cart);
    const carritoMongoAtlas = new ContenedorMongoAtlas(cartsCollection);
    const savedMongoAtlas = await carritoMongoAtlas.save(cart);
    const carrito = new ContenedorArchivo('./cart.json');
    const saved = await carrito.save(cart);
    return savedFirebase
} 

export async function saveAllCarts(carts) {
    const allCarts = new ContenedorArchivo('./cart.json');
    const saved = await allCarts.saveAll(carts);
    return saved 
}

export async function saveProductInCartByIdFile(res, newProd, id_cart){
    const carrito = new ContenedorArchivo('./cart.json');
    const allCarts = await carrito.getAll();
    const cart = allCarts.find( (cart) => cart.id === id_cart);
    let actualizadoArchivo = {actualizadoArchivo: cart};
    if(!cart){
        // res.send({Error: `No se encuentra el carrito ${id_cart}`})
        actualizadoArchivo = {Error: `No se encuentra el carrito ${id_cart}`}
    }else{
        let newProdWithId = calculateId(newProd, cart.productos)
        newProdWithId.timestamp = new Date().toLocaleString("en-GB");
        cart.productos.push(newProd);
        const allSaved = await saveAllCarts(allCarts);
        if (allSaved === 'ok'){
            // res.send({actualizado: cart})
        }else{
            actualizadoArchivo = {error: allSaved};
            // res.send({error: allSaved})
        }
    }
    // console.log("Actualizado en Archivo: ", actualizadoArchivo)
    logger.debug(`Actualizado en Archivo: ${JSON.stringify(actualizadoArchivo)}`)
}

export async function getCarts() {
    const carrito = new ContenedorArchivo('./cart.json');
    const cart = await carrito.getAll();
    const carritoMongoAtlas = new ContenedorMongoAtlas(cartsCollection);
    const cartMongoAtlas = await carritoMongoAtlas.getAll();
    const carritoFirebase = new ContenedorFirebase(cartsCollection);
    const cartFirebase = await carritoFirebase.getAll();
    return cartFirebase
} 

export async function getCartById(id) {
    const carritosFirebase = new ContenedorFirebase(cartsCollection);
    const cartFirebase = await carritosFirebase.getById(id);
    const carritos = new ContenedorArchivo('./cart.json');
    const cart = await carritos.getById(id);
    const carritoMongoAtlas = new ContenedorMongoAtlas(cartsCollection);
    const cartMongoAtlas = await carritoMongoAtlas.getById(id);
    return cartFirebase
}

export async function deleteCartById(id_cart) {
    const cartsFirebase = new ContenedorFirebase(cartsCollection);
    const cartFirebase = await cartsFirebase.deleteById(id_cart);
    const carts = new ContenedorArchivo('./cart.json');
    const cart = await carts.deleteById(id_cart);
    const carritoMongoAtlas = new ContenedorMongoAtlas(cartsCollection);
    const cartMongoAtlas = await carritoMongoAtlas.deleteById(id_cart);
    return cartFirebase
}

export async function deleteProductInCartById(id_prod, id_cart) {
    const cartsFirebase = new ContenedorFirebase(cartsCollection);
    const cartFirebase = await cartsFirebase.deleteProductInCartById(id_prod, id_cart);
    const carts = new ContenedorArchivo('./cart.json');
    const cart = await carts.deleteProductInCartById(id_prod, id_cart);
    const cartsMongoAtlas = new ContenedorMongoAtlas(cartsCollection);
    const cartMongoAtlas = await cartsMongoAtlas.deleteProductInCartById(id_prod, id_cart);
    return cartFirebase
}