import express from 'express';
import mongoose from 'mongoose';
import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
import path from 'path';
import {fileURLToPath} from 'url';
import {getURL, serviceAccount} from './config.js';
import * as prdController from './controller/productsController.js';
import * as msgController from './controller/messagesController.js';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"
import admin from 'firebase-admin';
import { loadMocktoFireBase } from './functions.js';
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';


import {login} from './routes/login.js';
import {mensajes} from './routes/messages.js';
import {productos, productosTest} from './routes/products.js';
import {carrito} from './routes/carts.js';

mongoose.set('strictQuery', false);

console.log('\n################INICIO DE SERVIDOR################\n')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT, 10) || 8080;

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const mongoAtlasDb = 'ecommerce';
const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(cookieParser());
app.use(session({
    name: 'loggedUser',
    store: MongoStore.create({
        mongoUrl: getURL(mongoAtlasDb),
        mongoOptions: advancedOptions,
        collectionName: "sessions",
        ttl: 60,
    }),
    secret: 'adn1217',
    resave: false,
    // rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000,
        httpOnly: false
    }
}))

app.use('/login', login, (req, res) =>{
    res.sendStatus(400)
});
app.use('/productos', productos, (req, res) =>{
    res.sendStatus(400)
});
app.use('/productos-test', productosTest, (req, res) =>{
    res.sendStatus(400)
});
app.use('/carrito', carrito,(req, res) =>{
    res.sendStatus(400)
});
app.use('/mensajes', mensajes, (req, res) =>{
    res.sendStatus(400)
});

app.set('view engine', 'ejs');
// app.set('views', "./views"); //Por defecto.
app.use(express.static(__dirname + '/public'));

mongoAtlasConnect(mongoAtlasDb);
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
        io.sockets.emit('mensajes', {msgs: allMsgs});
    })

    socket.on('normMessageRequest', async () => {
        let allMsgs = await msgController.getNormMessages();
        // console.log('Mensajes Normalizados: ', JSON.stringify(allMsgs));
        io.sockets.emit('mensajes', {msgs: allMsgs});
    })
})

async function mongoAtlasConnect(db){
    try{
        const URL = getURL(db);
        await mongoose.connect(URL, advancedOptions)
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

app.get('/home', (req, res) => {
    if(req.session.user){
        console.log('SesiónIniciada: ', req.session);
        prdController.showProducts(req, res);
    }else{
        res.send({Error: 'Usuario no autenticado'})
    }
})

app.post('/home/:user', (req, res) => {
    const user = req.params.user;
    req.session.user = user;
    req.session.save();
    res.send({
        Usuario: user,
        Guardado: 'Ok'
    })
})

app.delete('/', (req, res) => {
    console.log('DeletedSesión: ', req.session);
    const user = req.session.user;
    console.log('DeletedUsuario : ', user);
    if(user){
        req.session.destroy();
        res.send({
            user: user,
            eliminado: 'Ok'})
    }else{
        res.render('pages/login')
    }
})

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));