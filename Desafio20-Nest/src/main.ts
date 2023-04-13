import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})
const serviceAccount: string = JSON.parse(process.env.SERVICE_ACCOUNT);
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
  // app.enableCors();
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
