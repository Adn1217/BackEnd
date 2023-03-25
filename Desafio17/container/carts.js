import ContainerFactory from './DAOs/ContainerFactory.class.js';
import { calculateId } from '../functions.js';
import dotenv from 'dotenv';
import { transformToDTO } from './DTOs/carts.js';

dotenv.config({
    path: './.env'
})

const cartsCollection = process.env.DB_CARTS_COLLECTION;
const factory = new ContainerFactory();    

function createContainers(){
    const carritoFirebase = factory.createContainer('Firebase', cartsCollection);
    const carritoMongoAtlas = factory.createContainer('MongoAtlas',cartsCollection);
    const carritoFile = factory.createContainer('File','./cart.json');
    return [carritoFirebase, carritoMongoAtlas, carritoFile]
}

export async function saveCart(cart) {
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const savedFirebase = await carritoFirebase.save(cart);
    const savedMongoAtlas = await carritoMongoAtlas.save(cart);
    const savedFile = await carritoFile.save(cart);
    console.log('Carrito Firebase: ', savedFirebase);
    const cartDTO = transformToDTO(savedFirebase);
    console.log('Carritos DTO: ', JSON.stringify(cartDTO));
    return cartDTO 
} 

export async function saveAllCarts(carts) {
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const savedFile = await carritoFile.saveAll(carts);
    return savedFile
}

export async function saveProductInCartFB(newProd, id_cart){
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const cartFirebase = await carritoFirebase.getById(id_cart);
    // console.log('Carrito en Firebase', cartFirebase);
    if (cartFirebase){
        let newProdWithId = calculateId(newProd, cartFirebase.productos)
        newProdWithId.timestamp = new Date().toLocaleString("en-GB");
        cartFirebase.productos.push(newProdWithId);
        let updatedProd = await carritoFirebase.updateById(cartFirebase, id_cart);
        console.log('Carrito actualizado Firebase: ', updatedProd);
        const cartDTO = transformToDTO(updatedProd);
        console.log('Carrito actualizado DTO: ', JSON.stringify(cartDTO));
        // console.log("Se ha agregado en Firebase el producto: \n", newProdWithId);
        return({actualizadoFirebase: cartDTO})
    }else{
        // console.log("Carrito no encontrado en Firebase.");
        return({error: "Carrito no encontrado"})
    }
}

export async function saveProductInCartMongo(newProd, id_cart){
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const cartMongoAtlas = await carritoMongoAtlas.getById(id_cart);
    console.log('Carrito actualizado Mongo: ', cartMongoAtlas);
    const cartDTO = transformToDTO(cartMongoAtlas);
    console.log('Carrito actualizado DTO: ', JSON.stringify(cartDTO));
    let actualizadoMongo = {actualizadoMongo: cartDTO};
    if (cartMongoAtlas){
        cartMongoAtlas.productos.push(newProd);
        let cart = await carritoMongoAtlas.updateById(cartMongoAtlas, id_cart);
        // console.log("Se ha agregado en Mongo el producto al carrito: \n", cart);
    }else{
        actualizadoMongo = {error: "Carrito no encontrado en Mongo."}
    }
    // console.log(actualizadoMongo);
    return actualizadoMongo;
}

export async function saveProductInCartByIdFile(res, newProd, id_cart){
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const allCarts = await carritoFile.getAll();
    const cart = allCarts.find( (cart) => cart.id === id_cart);
    console.log('Carrito actualizado File: ', cart);
    const cartDTO = transformToDTO(cart);
    console.log('Carrito actualizado DTO: ', JSON.stringify(cartDTO));
    let actualizadoArchivo = {actualizadoArchivo: cartDTO};
    if(!cart){
        // res.send({Error: `No se encuentra el carrito ${id_cart}`})
        actualizadoArchivo = {Error: `No se encuentra el carrito ${id_cart}`}
    }else{
        let newProdWithId = calculateId(newProd, cart.productos)
        newProdWithId.timestamp = new Date().toLocaleString("en-GB");
        cart.productos.push(newProd);
        const allSaved = await saveAllCarts(allCarts);
        if (allSaved.error){
            actualizadoArchivo = allSaved;
        }
    }
    // console.log("Actualizado en Archivo: ", actualizadoArchivo)
    return actualizadoArchivo
}

export async function getCarts() {
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const cart = await carritoFile.getAll();
    const cartMongoAtlas = await carritoMongoAtlas.getAll();
    const cartFirebase = await carritoFirebase.getAll();
    console.log('Carritos Firebase: ', cartFirebase);
    const cartDTO = transformToDTO(cartFirebase);
    console.log('Carritos DTO: ', JSON.stringify(cartDTO));
    return cartDTO
} 

export async function getCartById(id) {
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const cartFirebase = await carritoFirebase.getById(id);
    const cart = await carritoFile.getById(id);
    const cartMongoAtlas = await carritoMongoAtlas.getById(id);
    console.log('Carrito Firebase: ', cartFirebase);
    const cartDTO = transformToDTO(cartFirebase);
    console.log('Carritos DTO: ', JSON.stringify(cartDTO));
    return cartDTO
}

export async function deleteCartById(id_cart) {
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const cartFirebase = await carritoFirebase.deleteById(id_cart);
    const cart = await carritoFile.deleteById(id_cart);
    const cartMongoAtlas = await carritoMongoAtlas.deleteById(id_cart);
    console.log('Carrito Firebase: ', cartFirebase);
    const cartDTO = transformToDTO(cartFirebase);
    console.log('Carritos DTO: ', JSON.stringify(cartDTO));
    return cartDTO
}

export async function deleteProductInCartById(id_prod, id_cart) {
    const [carritoFirebase, carritoMongoAtlas, carritoFile] = createContainers();
    const cartFirebase = await carritoFirebase.deleteProductInCartById(id_prod, id_cart);
    const cart = await carritoFile.deleteProductInCartById(id_prod, id_cart);
    const cartMongoAtlas = await carritoMongoAtlas.deleteProductInCartById(id_prod, id_cart);
    console.log('Carrito Firebase: ', cartFirebase);
    const cartDTO = transformToDTO(cartFirebase);
    console.log('Carritos DTO: ', JSON.stringify(cartDTO));
    return cartDTO
}