import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('mensajes')
export class MessagesController {

    constructor(private readonly messagesService: MessagesService){}


    @Get()
    getProducts(){
        return this.messagesService.getMessages();
    }

    @Post()
    saveProduct(@Body() createMessageDto: CreateMessageDto, @Req() req: Request ){
        console.log('Mensaje recibido: ', createMessageDto)
        let newMsg = this.messagesService.saveMessage(createMessageDto);
        return newMsg
    }
}
