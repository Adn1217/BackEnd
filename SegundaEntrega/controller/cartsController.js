import ContenedorArchivo from '../ContenedorArchivo.class.js';
import ContenedorMongoAtlas from '../ContenedorMongoAtlas.class.js';

async function saveCart(cart) {
    const carrito = new ContenedorArchivo('./cart.json');
    const saved = await carrito.save(cart);
    const carritoMongoAtlas = new ContenedorMongoAtlas('carts');
    const savedMongoAtlas = await carritoMongoAtlas.save(cart);
    return savedMongoAtlas
} 

async function saveAllCarts(carts) {
    const allCarts = new ContenedorArchivo('./cart.json');
    const saved = await allCarts.saveAll(carts);
    return saved 
}

async function saveProductInCartByIdFile(res, newProd, id_cart){
    const allCarts = await getCarts();
    const cart = allCarts.find( (cart) => cart.id === id_cart);
    let actualizadoArchivo = {actualizado: cart};
    if(!cart){
        // res.send({Error: `No se encuentra el carrito ${id_cart}`})
        actualizadoArchivo = {Error: `No se encuentra el carrito ${id_cart}`}
    }else{
        newProd.timestamp = new Date().toLocaleString("en-GB");
        cart.productos.push(newProd);
        const allSaved = await saveAllCarts(allCarts);
        if (allSaved === 'ok'){
            // res.send({actualizado: cart})
        }else{
            actualizadoArchivo = {error: allSaved};
            // res.send({error: allSaved})
        }
    }
    console.log("Actualizado en Archivo: ", actualizadoArchivo)
}

async function getCarts() {
    const carrito = new ContenedorArchivo('./cart.json');
    const cart = await carrito.getAll();
    const carritoMongoAtlas = new ContenedorMongoAtlas('carts');
    const cartMongoAtlas = await carritoMongoAtlas.getAll();
    return cartMongoAtlas
} 

async function getCartById(id) {
    const carritos = new ContenedorArchivo('./cart.json');
    const cart = await carritos.getById(id);
    const carritoMongoAtlas = new ContenedorMongoAtlas('carts');
    const cartMongoAtlas = await carritoMongoAtlas.getById(id);
    return cartMongoAtlas
}

async function deleteCartById(id_cart) {
    const carts = new ContenedorArchivo('./cart.json');
    const cart = await carts.deleteById(id_cart);
    const carritoMongoAtlas = new ContenedorMongoAtlas('carts');
    const cartMongoAtlas = await carritoMongoAtlas.deleteById(id_cart);
    return cartMongoAtlas
}

async function deleteProductInCartById(id_prod, id_cart) {
    const carts = new ContenedorArchivo('./cart.json');
    const cart = await carts.deleteProductInCartById(id_prod, id_cart);
    const cartsMongoAtlas = new ContenedorMongoAtlas('carts');
    const cartMongoAtlas = await cartsMongoAtlas.deleteProductInCartById(id_prod, id_cart);
    return cartMongoAtlas
}

export async function showCart(res) {
    const cart = await getCarts(); 
    console.log('El carrito es: \n', cart);
    res.send({carrito: cart})
    // res.render('pages/index', {products: allProducts, msgs: allMessages})
}

export async function showCartById(res, id) {
    let cartById = await getCartById(id);
    console.log(cartById);
    if (!cartById){
        res.send({error:"Carrito no encontrado"});
    }else{
        res.send({productoCarrito: cartById.productos});
        console.log(cartById.productos);
    }
}

export async function doDeleteCartById(res, id) {
    let deletedCart = await deleteCartById(id);
    if (!deletedCart || deletedCart?.deletedCount == 0){
        deletedCart = {
            error: "Carrito no encontrado"
        }
        res.send(deletedCart)
    }else{
        res.send({eliminado: deletedCart})
    }
    // return deletedCart;
}

export async function doDeleteProductInCartById(res, id_prod, id_cart) {
    let deletedProduct = await deleteProductInCartById(id_prod, id_cart);
    console.log("Producto eliminado: ", deletedProduct);
    if (!deletedProduct && deletedProduct !== undefined){
        deletedProduct = {
            error: `Carrito ${id_cart} no encontrado`
        }
        res.send(deletedProduct)
    }else{
        if (deletedProduct === undefined){
            deletedProduct = {
                error: `Producto ${id_prod} no encontrado en el carrito ${id_cart}`
            }
            res.send(deletedProduct)
        }else{
            res.send({eliminado: deletedProduct})
        }
    }
    return deletedProduct;
}

export async function doSaveCart(res, cart) {
    const newCart = await saveCart(cart);
    res.send({Guardado: newCart})
}


export async function doSaveProductInCart(res, newProd, id_cart) {
    await saveProductInCartByIdFile(res, newProd, id_cart);
    const cartsMongoAtlas = new ContenedorMongoAtlas('carts');
    const cartMongoAtlas = await cartsMongoAtlas.getById(id_cart);
    if (cartMongoAtlas){
        cartMongoAtlas.productos.push(newProd);
        cartMongoAtlas.save()
        console.log("Se ha agregado el producto: \n", newProd);
        res.send({actualizadoMongo: cartMongoAtlas})
    }else{
        console.log("Carrito no encontrado");
        res.send({error: "Carrito no encontrado"})
    }

}

export async function updateCartById(res, updatedCart, id) {
    let cartById = await getCartById(id);
    if (!cartById){
        res.send({error: "Carrito no encontrado"});
    }else{
        const allCarts = await getCarts();
        const newCarts = allCarts.map((cart) => {
            if(cart.id === id){
                cart = updatedCart;
                cart.id = id;
                console.log(cart);
            }
            return cart;
        })
        console.log('La nueva lista de carritos es: ', newCarts);
        const allSaved = await saveAllCarts(newCarts);
        if (allSaved === 'ok'){
            res.send({actualizado: updatedCart})
        }else{
            res.send({error: allSaved})
        }
    }
}