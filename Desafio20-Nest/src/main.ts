import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config({
    path: './.env'
})
const serviceAccount: string = JSON.parse(process.env.SERVICE_ACCOUNT); // Firebase

const userName = process.env.DB_MONGO_USER;
const pwd = process.env.DB_MONGO_PWD;
const mongoAtlasDb = process.env.DB_MONGOATLAS;
const sessionsCollection = process.env.DB_SESSIONS_COLLECTION;
const sessionSecret = process.env.SESSION_SECRET;

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

function getURL(db: string, userName: string, pwd: string) {
    const URL = `mongodb+srv://${userName}:${pwd}@backendcluster.mlmtmq6.mongodb.net/${db}?retryWrites=true&w=majority`;
    return URL
}

export let dbFS;

if (!dbFS){
    try{
        dbFS = fireBaseConnect()
        console.log(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
    }catch(error){
        console.log('Se ha presentado error al intentar conectarse con Firebase: ', error)
    }
}

export function fireBaseConnect(){
    try{
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        });
        // logger.info(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
        dbFS = admin.firestore();
        return dbFS;
    }catch(error){
        // logger.error(`Se ha presentado error al intentar conectar el servidor ${process.pid} con Firebase: ${error}`)
        console.log('Error al intentar conectar con Firebase', error);
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const swaggerOpts = new DocumentBuilder()
                        .setTitle('Routes')
                        .setDescription('The routes description')
                        .setVersion('1.0')
                        .addTag('Routes')
                        .build()

    const document = SwaggerModule.createDocument(app, swaggerOpts);
    SwaggerModule.setup('api', app, document);
    app.use(
    session({
        name: 'loggedUser',
        store: MongoStore.create({
            mongoUrl: getURL(mongoAtlasDb, userName, pwd),
            // mongoOptions: advancedOptions, //Con actualización no son necesarios.
            collectionName: sessionsCollection,
            ttl: 600,
        }),
        secret: sessionSecret,
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
            // httpOnly: false
        }
    })
    )

    app.use(passport.initialize());
    app.use(passport.session());

    // app.enableCors();
    await app.listen(process.env.PORT || 8080);
}
bootstrap();
