
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { fireBaseConnect, dbFS } from '../../main';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

@Injectable()
export class MessagesContainer {
    messages = []; //Persistencia local.
    collection: string = process.env.DB_MESSAGES_COLLECTION;
    query = dbFS.collection(this.collection);

    async disconnect(){
        try{
            // await admin.app().delete();
            process.exit[0];
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
