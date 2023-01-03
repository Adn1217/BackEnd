import express from 'express';
import mongoose from 'mongoose';
import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';
import {getURL} from './config.js';
import * as prdController from './controller/productsController.js';
import * as msgController from './controller/messagesController.js';
import {mensajes} from './routes/messages.js';
import {productos} from './routes/products.js';
import {carrito} from './routes/carts.js';

mongoose.set('strictQuery', false);

console.log('\n################INICIO DE SERVIDOR################\n')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
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
mongoAtlasConnect('ecommerce');

io.on('connection', (socket) => {
    console.log('Usuario Conectado');
    socket.emit('welcome', 'Usuario conectado');
    // mongoAtlasConnect('ecommerce');

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
        let allMsgs = await msgController.getMessages();
        // (allMsgs[0].fecha) ?? (
        //     allMsgs.forEach( msg => ({...msg, fecha: new Date(msg._id.getTimestamp()).toLocaleString('en-GB')})
        // ));
        io.sockets.emit('mensajes', {msgs: allMsgs});
    })
})

async function mongoAtlasConnect(db){
    try{
        const URL = getURL(db);
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Se ha conectado exitosamente a MongoAtlas");
    }catch(error){
        console.log("Se ha presentado el siguiente error al intentar conectarse a MongoAtlas: ", error);
    }
}

app.get('/', (req, res) => {
    prdController.showProducts(res);
})


const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));