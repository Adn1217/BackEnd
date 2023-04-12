import { Injectable } from '@nestjs/common';
import {MessagesContainer as container} from './container/messages.container'
import { CreateMessageDto } from './dto/create-message.dto';
@Injectable()
export class MessagesService {

    constructor(private readonly messagesContainer: container){}

    async getMessages(){
        let allMessages = await this.messagesContainer.getMessages();
        return {mensajes: allMessages};
    }

    async saveMessage(msg : CreateMessageDto){
        if (Object.keys(msg).length === 0){
            return({Error: "Mensage no recibido"})
        }else{
            // console.log('Mensaje: ', msg);
            let newMsg = await this.messagesContainer.saveMessage(msg);
            return {Guardado: newMsg};
        }
    }
}
