
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
export let dbFS;

if (!dbFS){
    try{
        dbFS = fireBaseConnect(serviceAccount)
        console.log(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
    }catch(error){
        console.log('Se ha presentado error al intentar conectarse con Firebase: ', error)
    }
}

export function fireBaseConnect(account: string){
    try{
        admin.initializeApp({
        credential: admin.credential.cert(account)
        });
        // logger.info(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
        dbFS = admin.firestore();
        return dbFS;
    }catch(error){
        // logger.error(`Se ha presentado error al intentar conectar el servidor ${process.pid} con Firebase: ${error}`)
        console.log('Error al intentar conectar con Firebase', error);
    }
}
@Injectable()
export class MessagesContainer {
    messages = []; //Persistencia local.
    collection: string = process.env.DB_MESSAGES_COLLECTION;
    query = dbFS.collection(this.collection);

    async connect(){
        try{
            if(dbFS){
            // logger.info(`Servidor ${process.pid} ya se encuentra conectado a FireBase`)
            }else{
            dbFS = fireBaseConnect(serviceAccount);
            // logger.info(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
            console.log(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
            }
        }catch(error){
            // logger.error(`Se ha presentado error al intentar conectar el servidor ${process.pid} con Firebase: ${error}`)
            console.log(`Se ha presentado error al intentar conectar el servidor ${process.pid} con Firebase: ${error}`)
        }
    }

    async disconnect(){
        try{
            // await admin.app().delete();
            dbFS.delete;
            console.log(`El servidor ${process.pid} se ha desconectado exitosamente de Firebase.`)
            // logger.info(`El servidor ${process.pid} se ha desconectado exitosamente de Firebase.`)
        }catch(error){
            // logger.error(`Se ha presentado error al intentar desconectar el servidor ${process.pid} de Firebase: ${error}`)
            console.log(`Se ha presentado error al intentar desconectar el servidor ${process.pid} de Firebase: ${error}`)
        }
    }

    async saveMessage(elemento: CreateMessageDto) {
        try {
          let data = await this.query.add({fecha: JSON.stringify(new Date()), ...elemento});
          console.log('GuardadoFirebase: ', data.id);
          return data.id;
        } catch (error) {
          console.log("Se ha presentado error ", error);
        } finally {
          this.disconnect();
        }
      }

    async getMessages(){
        try{
            let data = await this.query.get();
            let docs = data.docs.map((doc) => {
                let id = doc.id;
                let element = doc.data();
                element.id = id
                return element;
            })
            console.log('Mensajes extraidos de Firebase ', docs);
            return docs;
        } catch (error) {
          console.log("Se ha presentado error al consultar mensajes ", error);
        } finally {
          this.disconnect();
        }
    }

    //----------------------PERSISTENCIA LOCAL -------------------
    saveMessageLocal(newProd: CreateMessageDto){
        let newId = this.randomId();
        let date = new Date();
        let savedProd ={id: newId, fecha: date, ...newProd};
        this.messages.push(savedProd);
        return savedProd;
    }

    getMessagesLocal(){
        return this.messages;
    }
    
    private randomId(){
        const caracters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i<12; i++){
            const randNum = Math.random();
            const randInt = Math.floor(randNum*caracters.length);
            const randBool = Math.round(Math.random());
            code += (randBool && caracters[randInt].toUpperCase()) ? caracters[randInt].toUpperCase() : caracters[randInt];
        }
        console.log('Codigo generado: ', code);
        return code;
    }
    
}
