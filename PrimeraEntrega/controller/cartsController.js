import Contenedor from '../Contenedor.class.js';

async function saveCart(cart) {
    const carrito = new Contenedor('./cart.json');
    const saved = await carrito.save(cart);
    return saved
} 

async function saveAllCarts(carts) {
    const allCarts = new Contenedor('./cart.json');
    const saved = await allCarts.saveAll(carts);
    return saved 
} 

async function getCarts() {
    const carrito = new Contenedor('./cart.json');
    const cart = await carrito.getAll();
    return cart
} 

async function getCartById(id) {
    const carritos = new Contenedor('./cart.json');
    const cart = await carritos.getById(id);
    return cart
}

async function deleteCartById(id_cart) {
    const carts = new Contenedor('./cart.json');
    const cart = await carts.deleteById(id_cart);
    return cart
}

async function deleteProductInCartById(id_prod, id_cart) {
    const carts = new Contenedor('./cart.json');
    const cart = await carts.deleteProductInCartById(id_prod, id_cart);
    return cart
}

export async function showCart(res) {
    const cart = await getCarts(); 
    console.log('El carrito es: \n', cart);
    res.send({carrito: cart})
    // res.render('pages/index', {products: allProducts, msgs: allMessages})
}

export async function showCartById(res, id) {
    let cartById = await getCartById(id);
    if (!cartById){
        res.send({error:"Carrito no encontrado"});
    }else{
        res.send({productoCarrito: cartById.productos});
        console.log(cartById.productos);
    }
}

export async function doDeleteCartById(res, id) {
    let deletedCart = await deleteCartById(id);
    if (!deletedCart){
        deletedCart = {
            error: "Carrito no encontrado"
        }
        res.send(deletedCart)
    }else{
        res.send({eliminado: deletedCart})
    }
    return deletedCart;
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
    const allCarts = await getCarts();
    const cart = allCarts.find( (cart) => cart.id === id_cart);
    if(!cart){
        res.send({Error: `No se encuentra el carrito ${id_cart}`})
    }else{
        newProd.timestamp = new Date().toLocaleString("en-GB");
        cart.productos.push(newProd);
        const allSaved = await saveAllCarts(allCarts);
        if (allSaved === 'ok'){
            res.send({actualizado: cart})
        }else{
            res.send({error: allSaved})
        }
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