import express from 'express';
import mongoose from 'mongoose';
import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';
import {getURL, serviceAccount} from './config.js';
import * as prdController from './controller/productsController.js';
import * as msgController from './controller/messagesController.js';
import {mensajes} from './routes/messages.js';
import {productos, productosTest} from './routes/products.js';
import {carrito} from './routes/carts.js';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"
import admin from 'firebase-admin';
import { loadMocktoFireBase } from './functions.js';
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

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
app.use('/productos-test', productosTest);
app.use('/carrito', carrito);
app.use('/mensajes', mensajes);
app.set('view engine', 'ejs');
app.set('views', "./views");
app.use(express.static(__dirname + '/public'));
mongoAtlasConnect('ecommerce');
firebaseConnect();

export const dbFS = admin.firestore();
// loadMocktoFireBase(['products']); // Habilitar solo al requerirse recargar mocks originales.

io.on('connection', (socket) => {
    console.log('Usuario Conectado');
    socket.emit('welcome', 'Usuario conectado');
    // mongoAtlasConnect('ecommerce');

    socket.on('productRequest', async () => {
        const allProducts = await prdController.getProducts();
        io.sockets.emit('productos', {productos: allProducts});
    })
    
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

function firebaseConnect(){
    try{
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        });
        console.log("Se ha conectado exitosamente a FireBase")
    }catch(error){
        console.log("Se ha presentado error al intentar conectar con Firebase: ", error)
    }
}

app.get('/', (req, res) => {
    prdController.showProducts(res);
})


const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));