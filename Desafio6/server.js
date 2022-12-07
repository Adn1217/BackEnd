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

    socket.on('messageRequest', async () => {
        const allMsgs = await msgController.getMessages();
        io.sockets.emit('mensajes', {msgs: allMsgs});
    })
})

productos.get('/', (req, res) => {
    prdController.showProducts(res);
// onlyAdmin(req, res, showProducts());
})

carrito.get('/', (req, res) => {
    cartController.showCart();
})

mensajes.get('/', async (req, res) => {
    msgController.showMsgs(res);
    // res.send({msgs: allMessages})
})

productos.post('/', (req, res) => {
    const product = req.body;
    if (Object.keys(product).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('Producto', product);
        prdController.doSaveProduct(res, product);
    }
})

productos.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    prdController.showProductById(parseInt(id));
    
})

carrito.get('/:id/productos', (req, res) => {
    const id = req.params.id;
    console.log(id);
    cartController.showCartById(parseInt(id));
})

productos.put('/:id', (req, res) => {
    const prod = req.body;
    const id = req.params.id;
    prdController.updateProductById(prod, parseInt(id));
})

productos.delete('/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    prdController.doDeleteProductById(parseInt(id));
})

carrito.delete('/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    cartController.doDeleteCartById(parseInt(id));
})

carrito.delete('/:id/productos/:id_prod', (req, res) => {
    const {id, id_prod} = req.params;
    const id_cart = id;
    console.log(id, id_prod);
    cartController.doDeleteProductInCartById(parseInt(id_prod), parseInt(id_cart));
})

carrito.post('/', (req, res) => {
    const cart = req.body;
    if (Object.keys(cart).length === 0){
        res.send({Error: "Carrito no recibido"})
    }else{
        console.log('Carrito: ', JSON.stringify(cart));
        cartController.doSaveCart(cart);
    }
})

carrito.post('/:id/productos', (req, res) => {
    const prod = req.body;
    const {id} = req.params;
    if (Object.keys(prod).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('producto: ', JSON.stringify(prod));
        cartController.doSaveProductInCart(prod, parseInt(id));
    }
})

carrito.put('/:id/productos', (req, res) => {
    const cart = req.body;
    const id = req.params.id;
    cartController.updateCartById(cart, parseInt(id));
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

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));