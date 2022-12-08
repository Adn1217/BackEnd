import Contenedor from './Contenedor.class.js';
import express from 'express';
import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';
import * as prdController from './controller/productsController.js';
import * as msgController from './controller/messagesController.js';
import * as cartController from './controller/cartsController.js';

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
        const allProducts = await prdController.getProducts();
        io.sockets.emit('productos', {productos: allProducts});
    })
    
    // socket.on('oneProductRequest', async (id) => {
    //     const product = await prdController.getProductById(id);
    //     console.log(product);
    //     io.sockets.emit('productos', {productos: product});
    // })

    socket.on('messageRequest', async () => {
        const allMsgs = await msgController.getMessages();
        io.sockets.emit('mensajes', {msgs: allMsgs});
    })
})

const isAdmin = true;

async function onlyAdmin(req, res, next) {
    if (isAdmin) { 
        next;
    } else { 
        res.status(401).json({error:-1,descripcion:`Ruta ${req.originalUrl} metodo ${req.method} no autorizado`});
    }
}

app.get('/', (req, res) => {
    prdController.showProducts(res);
})

// RUTRAS PRODUCTOS ----------------------

productos.get('/:id?', async(req, res) => {
    if(Object.keys(req.query).length > 0 || req.params.id){
        const id = req.query.id || req.params.id
        prdController.showProductById(res, parseInt(id));
    }else{
        let allProducts = await prdController.getProducts()
        res.send(allProducts);
    }
})

productos.post('/', (req, res) => {
    onlyAdmin(req, res, prdController.doSaveProduct(req.body, res));
})

productos.put('/:id', (req, res) => {
    const prod = req.body;
    const id = req.params.id;
    onlyAdmin(req, res, prdController.updateProductById(res, prod, parseInt(id)));
})

productos.delete('/:id', (req, res) => {
    const {id} = req.params;
    onlyAdmin(req, res, prdController.doDeleteProductById(res, parseInt(id)));
})

// RUTAS CARRITOS -----------------------

carrito.get('/', (req, res) => {
    cartController.showCart(res);
})

carrito.get('/:id/productos', (req, res) => {
    const id = req.params.id;
    console.log(id);
    cartController.showCartById(res, parseInt(id));
})

carrito.post('/', (req, res) => {
    const cart = req.body;
    if (Object.keys(cart).length === 0){
        res.send({Error: "Carrito no recibido"})
    }else{
        console.log('Carrito: ', JSON.stringify(cart));
        cartController.doSaveCart(res, cart);
    }
})

carrito.post('/:id/productos', (req, res) => {
    const prod = req.body;
    const {id} = req.params;
    if (Object.keys(prod).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('producto: ', JSON.stringify(prod));
        cartController.doSaveProductInCart(res, prod, parseInt(id));
    }
})

carrito.put('/:id/productos', (req, res) => {
    const cart = req.body;
    const id = req.params.id;
    cartController.updateCartById(res, cart, parseInt(id));
})

carrito.delete('/:id', (req, res) => {
    const {id} = req.params;
    cartController.doDeleteCartById(res, parseInt(id));
})

carrito.delete('/:id/productos/:id_prod', (req, res) => {
    const {id, id_prod} = req.params;
    const id_cart = id;
    cartController.doDeleteProductInCartById(res,parseInt(id_prod), parseInt(id_cart));
})

// RUTAS MENSAJES --------------------------

mensajes.get('/', async (req, res) => {
    msgController.showMsgs(res);
    // res.send({msgs: allMessages})
})

mensajes.post('/', (req, res) => {
    const msg = req.body;
    if (Object.keys(msg).length === 0){
        res.send({Error: "Mensage no recibido"})
    }else{
        console.log('Mensaje: ', msg);
        msgController.doSaveMessage(res, msg);
    }
})

//----------------------------------------------

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));