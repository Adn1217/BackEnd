import Contenedor from './Contenedor.class.js';
import express from 'express';
import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';
import { stringify } from 'querystring';

console.log('\n################INICIO DE SERVIDOR################\n')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Router } = express;
const app = express();
const productos = new Router();
const carrito = new Router();
const mensajes = new Router();
const port = parseInt(process.env.PORT, 10) || 8080;

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/productos', productos);
app.use('/carrito', carrito);
app.use('/mensajes', mensajes);
app.set('view engine', 'ejs');
app.set('views', "./views");
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('Usuario Conectado');
    socket.emit('welcome', 'Usuario conectado');

    socket.on('productRequest', async () => {
        const allProducts = await getProducts();
        io.sockets.emit('productos', {productos: allProducts});
    })

    socket.on('messageRequest', async () => {
        const allMsgs = await getMessages();
        io.sockets.emit('mensajes', {msgs: allMsgs});
    })
})



async function saveProduct(prod) {
    const productos = new Contenedor('./productos.json');
    const newProductId = await productos.save(prod);
    return newProductId
} 

async function saveMessage(msg) {
    const messages = new Contenedor('./mensajes.json');
    const newMessage = await messages.save(msg);
    return newMessage
} 

async function saveCart(cart) {
    const carrito = new Contenedor('./cart.json');
    const saved = await carrito.save(cart);
    return saved
} 

async function saveProductInCart(cart) {
    const carrito = new Contenedor('./cart.json');
    const saved = await carrito.saveProductInCart(cart);
    return saved
} 

async function saveAllProducts(prods) {
    const productos = new Contenedor('./productos.json');
    const saved = await productos.saveAll(prods);
    return saved 
} 

async function saveAllCarts(carts) {
    const allCarts = new Contenedor('./cart.json');
    const saved = await allCarts.saveAll(carts);
    return saved 
} 

async function getProducts() {
    const productos = new Contenedor('./productos.json');
    const allProducts = await productos.getAll();
    return allProducts
} 

async function getCarts() {
    const carrito = new Contenedor('./cart.json');
    const cart = await carrito.getAll();
    return cart
} 

async function getMessages() {
    const messages = new Contenedor('./mensajes.json');
    const allMessages = await messages.getAll();
    return allMessages
} 

async function getProductById(id) {
    const productos = new Contenedor('./productos.json');
    const product = await productos.getById(id);
    return product
}

async function getCartById(id) {
    const carritos = new Contenedor('./cart.json');
    const cart = await carritos.getById(id);
    return cart
}

async function deleteProductById(id) {
    const productos = new Contenedor('./productos.json');
    const product = await productos.deleteById(id);
    return product
}

async function deleteCartById(id_prod, id_cart) {
    const carts = new Contenedor('./cart.json');
    const cart = await carts.deleteById(id_prod, id_cart);
    return cart
}

async function deleteProductInCartById(id_prod, id_cart) {
    const carts = new Contenedor('./cart.json');
    const cart = await carts.deleteProductInCartById(id_prod, id_cart);
    return cart
}

productos.get('/', (req, res) => {
    const isAdmin = true;

    // function onlyAdmin(req, res, next) {
    //     console.log(next);
    //     if (isAdmin) { // si es admin
    //         next;
    //     } else { // si no es admin, devuelvo el error
    //         res.status(401).json({error:-1,descripcion:`Ruta ${req.originalUrl} metodo ${req.method} no autorizado`});
    //     }
    // }
    async function showProducts() {
        const allProducts = await getProducts(); 
        const allMessages = await getMessages();
        console.log('Los productos son: \n', allProducts);
        // res.send({products: allProducts, msgs: allMessages})
        res.render('pages/index', {products: allProducts, msgs: allMessages})
    }
    // onlyAdmin(req, res, showProducts());
    showProducts();
})

carrito.get('/', (req, res) => {
    async function showCart() {
        const cart = await getCarts(); 
        console.log('El carrito es: \n', cart);
        res.send({carrito: cart})
        // res.render('pages/index', {products: allProducts, msgs: allMessages})
    }
    showCart();
})

mensajes.get('/', (req, res) => {
    async function showMsgs() {
        const allMessages = await getMessages();
        console.log('Los mensajes son: \n', allMessages);
        res.send({msgs: allMessages})
        res.render('pages/index', {msgs: allMessages})
    }
    showMsgs();
})

productos.post('/', (req, res) => {
    async function doSaveProduct(prod) {
        const newProd = await saveProduct(prod); 
        res.send({Guardado: newProd})
    }
    const product = req.body;
    if (Object.keys(product).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('Producto', product);
        doSaveProduct(product);
    }
})

productos.get('/:id', (req, res) => {
    async function showProductById(id) {
        let productById = await getProductById(id);
        if (!productById){
            res.send({error:"Producto no encontrado"});
        }else{
            res.send({producto: productById});
            console.log(productById);
        }
    }
    const id = req.params.id;
    console.log(id);
    showProductById(parseInt(id));
    
})

carrito.get('/:id/productos', (req, res) => {
    async function showCartById(id) {
        let cartById = await getCartById(id);
        if (!cartById){
            res.send({error:"Carrito no encontrado"});
        }else{
            res.send({productoCarrito: cartById.productos});
            console.log(cartById.productos);
        }
    }
    const id = req.params.id;
    console.log(id);
    showCartById(parseInt(id));
})

productos.put('/:id', (req, res) => {
    async function updateProductById(updatedProd, id) {
        let productById = await getProductById(id);
        if (!productById){
            res.send({error: "Producto no encontrado"});
        }else{
            const allProducts = await getProducts();
            const newAllProducts = allProducts.map((prod) => {
                if(prod.id === id){
                    prod = updatedProd;
                    prod.id = id;
                    console.log(prod);
                }
                return prod;
            })
            console.log('La nueva lista es: ', newAllProducts);
            const allSaved = await saveAllProducts(newAllProducts);
            if (allSaved === 'ok'){
                res.send({actualizado: updatedProd})
            }else{
                res.send({error: allSaved})
            }
        }
    }
    const prod = req.body;
    const id = req.params.id;
    updateProductById(prod, parseInt(id));
})

productos.delete('/:id', (req, res) => {

    async function doDeleteProductById(id) {
        let deletedProduct = await deleteProductById(id);
        if (!deletedProduct){
            deletedProduct = {
                error: "Producto no encontrado"
            }
            res.send(deletedProduct)
        }else{
            res.send({eliminado: deletedProduct})
        }
            return deletedProduct;
        }

    const {id} = req.params;
    console.log(id);
    doDeleteProductById(parseInt(id));
})

carrito.delete('/:id', (req, res) => {

    async function doDeleteCartById(id) {
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

    const {id} = req.params;
    console.log(id);
    doDeleteCartById(parseInt(id));
})

carrito.delete('/:id/productos/:id_prod', (req, res) => {

    async function doDeleteProductInCartById(id_prod, id_cart) {
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

    const {id, id_prod} = req.params;
    const id_cart = id;
    console.log(id, id_prod);
    doDeleteProductInCartById(parseInt(id_prod), parseInt(id_cart));
})

carrito.post('/', (req, res) => {
    async function doSaveCart(cart) {
        const newCart = await saveCart(cart);
        res.send({Guardado: newCart})
    }
    const cart = req.body;

    if (Object.keys(cart).length === 0){
        res.send({Error: "Carrito no recibido"})
    }else{
        console.log('Carrito: ', JSON.stringify(cart));
        doSaveCart(cart);
    }
    
})

carrito.post('/:id/productos', (req, res) => {
    async function doSaveProductInCart(newProd, id_cart) {
        const allCarts = await getCarts();
        const cart = allCarts.find( (cart) => cart.id === id_cart);
        if(!cart){
            res.send({Error: `No se encuentra el carrito ${id_cart}`})
        }else{
            prod.timestamp = new Date().toLocaleString("en-GB");
            cart.productos.push(prod);
            const allSaved = await saveAllCarts(allCarts);
            if (allSaved === 'ok'){
                res.send({actualizado: cart})
            }else{
                res.send({error: allSaved})
            }
        }
    }
    const prod = req.body;
    const {id} = req.params;
    if (Object.keys(prod).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('producto: ', JSON.stringify(prod));
        doSaveProductInCart(prod, parseInt(id));
    }
})

carrito.put('/:id/productos', (req, res) => {
    async function updateCartById(updatedCart, id) {
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
    const cart = req.body;
    const id = req.params.id;
    updateCartById(cart, parseInt(id));
})


mensajes.post('/', (req, res) => {
    async function doSaveMessage(msg) {
        const newMsg = await saveMessage(msg); 
        res.send({Guardado: newMsg})
    }
    const msg = req.body;
    if (Object.keys(msg).length === 0){
        res.send({Error: "Mensage no recibido"})
    }else{
        console.log('Mensaje: ', msg);
        doSaveMessage(msg);
    }
})

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));