
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

import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {login, register, logout} from './routes/login.js';
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

const usuarios = [];

passport.use('register', new LocalStrategy({
    passReqToCallback: true
},(req, username, password, done) => {
    const usuario = usuarios.find(usuario => usuario.user === username);

    if(usuario){
        return done('El usuario ya está registrado')
    }

    const newUser = {
        username: username,
        password: password
    }

    usuarios.push(newUser);
    done(null, newUser);

}));

passport.use('login', new LocalStrategy( (username, password, done) => {
    const usuario = usuarios.find( usuario => usuario.username === username);

    if(!usuario){
        return done('El usuario no existe', false);
    }
    
    if(usuario.password !== password){
        return done('Contraseña incorrecta', false);
    }

    return done(null, usuario);
}))

passport.serializeUser((user, done) => {
    done(null, user.username);
})

passport.deserializeUser((username, done) => {
    const usuario = usuarios.find(usuario => usuario.username === username);
    done(null, usuario);
})


app.use(cookieParser());
app.use(session({
    name: 'loggedUser',
    store: MongoStore.create({
        mongoUrl: getURL(mongoAtlasDb),
        mongoOptions: advancedOptions,
        collectionName: "sessions",
        ttl: 10,
    }),
    secret: 'adn1217',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000,
        // httpOnly: false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
// app.set('views', "./views"); //Por defecto.
app.use(express.static(__dirname + '/public'));

app.use('/login', login, (req, res) =>{
    res.sendStatus(400);
});
app.use('/register', register, (req, res) =>{
    res.sendStatus(400);
});
app.use('/logout', logout, (req, res) =>{
    res.sendStatus(400);
});
app.use('/productos', productos, (req, res) =>{
    res.sendStatus(400);
});
app.use('/productos-test', productosTest, (req, res) =>{
    res.sendStatus(400);
});
app.use('/carrito', carrito,(req, res) =>{
    res.sendStatus(400);
});
app.use('/mensajes', mensajes, (req, res) =>{
    res.sendStatus(400); //Bad Request
});

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

app.get('/', (req, res) => {
     res.redirect('/login');
})

app.get('/home', (req, res) => {
    if(req.session.user){
        console.log('SesiónIniciada: ', req.session);
        prdController.showProducts(req, res);
    }else{
        res.sendStatus(401); //Unauthorized
        // res.status(401).render({Error: 'Usuario no autenticado'})
        // res.send({Error: 'Usuario no autenticado'})
    }
})

register.post('/',
    passport.authenticate('register', {
    failureRedirect: '/failRegister', 
    successRedirect: '/home'
}))

app.use('*', (req, res) =>{
    res.sendStatus(404) //Not Found
});

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));
