
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
import { doc, getDoc } from "firebase/firestore"
import { loadMocktoFireBase } from './functions.js';

import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import bCrypt from 'bCrypt'; 

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

mongoAtlasConnect(mongoAtlasDb);
firebaseConnect();
export const dbFS = admin.firestore();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

// const usuarios = []; // Persistencia local.

function encrypt(pwd){
    let encrypted = bCrypt.hashSync(pwd, bCrypt.genSaltSync(10), null)
    return encrypted
}

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

async function saveUserFirebase(newUser){
    let query = dbFS.collection('users');
    let data = await query.add(newUser);
    return data.id
}

async function searchUserFirebase(username){
    let query = dbFS.collection('users');
    let data = await query.where('username','==', username).get();
    console.log('Empty: ',data.empty);
    if (data.empty){
        return null ;
    }else{
        let usuario = null;
        data.forEach((doc) => {
            usuario = doc.data();
            console.log(doc.id + ' => ' + JSON.stringify(usuario));
        })
        // console.log('Usuario :', usuario);
        return usuario;
    }
}

passport.use('register', new LocalStrategy({
    passReqToCallback: true
}, async function(req, username, password, done){
    try{

        // const usuario = usuarios.find(usuario => usuario.username === username);
        const usuario = await searchUserFirebase(username);
        console.log('Usuario encontrado: ', usuario)

        if(usuario){
            return done(null, false, {message: 'El usuario ya está registrado'})
        }

        const newUser = {
            username: username,
            password: encrypt(password)
        }

        // usuarios.push(newUser); // Persistencia local.

        let newUserId = await saveUserFirebase(newUser);
        console.log('Nuevo Usuario Id: ', newUserId);
        done(null, newUser);
    }catch(err){
        done(err);
    }

}));

passport.use('login', new LocalStrategy( 
    async function(username, password, done){
        try{
            // const usuario = usuarios.find( usuario => usuario.username === username);
            const usuario = await searchUserFirebase(username);
            console.log('usuario: ', usuario)
            if(!usuario){
                return done(null, false, {message: 'El usuario no existe'});
            }
            
            if(!bCrypt.compare(password, usuario.password)){
                return done(null, false, {message: 'Contraseña incorrecta'});
            }

            return done(null, usuario);

        }catch(err){

            return done(err);
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.username);
})

passport.deserializeUser(async (username, done) => {
    // console.log('Usuarios: '+ JSON.stringify(usuarios) + ' Usuario autenticado: '+ username);
    // const usuario = usuarios.find(usuario => usuario.username === username); //Persistencia local
    const usuario = await searchUserFirebase(username);
    done(null, usuario);
})


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
    rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000,
        // httpOnly: false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
// app.set('views', "./views"); //Por defecto.
app.use(express.static(__dirname + '/public'));

app.post('/login',
    passport.authenticate('login', {
    failureRedirect: '/faillogin', 
    successRedirect: '/successlogin'
    })
)
app.use('/login', login, (req, res) =>{
    res.sendStatus(400);
});
app.post('/register',
    passport.authenticate('register', {
    failureRedirect: '/failregister', 
    successRedirect: '/successregister'
    })
)
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

app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/home', (req, res) => {
    if(req.isAuthenticated()){
        console.log('SesiónIniciada: ', req.session);
        prdController.showProducts(req, res);
    }else{
        res.sendStatus(401); //Unauthorized
        res.status(401).render({Error: 'Usuario no autenticado'})
        res.send({Error: 'Usuario no autenticado'})
    }
})

app.get('/faillogin', (req, res) =>{
    res.status(401).send({status: 'Autenticación incorrecta'});
})

app.get('/successlogin', (req, res) =>{
    res.status(200).send({status: 'Ok'});
})

app.get('/failregister', (req, res) => {
    res.status(400).send({status:'El usuario ya existe'});
})

app.get('/successregister', (req, res) => {
    res.status(200).send({status: 'Ok'});
})

app.use('*', (req, res) =>{
    res.sendStatus(404) //Not Found
});

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));
