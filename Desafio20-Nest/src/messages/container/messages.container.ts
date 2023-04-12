
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';

@Injectable()
export class MessagesContainer {
    messages = [];

    saveMessage(newProd: CreateMessageDto){
        let newId = this.randomId();
        let date = new Date();
        let savedProd ={id: newId, fecha: date, ...newProd};
        this.messages.push(savedProd);
        return savedProd;
    }

    getMessages(){
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
