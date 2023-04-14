import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthenticatedGuard } from 'src/login/loggedin.guard';

@Controller('mensajes')
export class MessagesController {

    constructor(private readonly messagesService: MessagesService){}

    @UseGuards(AuthenticatedGuard)
    @Get()
    getProducts(){
        return this.messagesService.getMessages();
    }

    @UseGuards(AuthenticatedGuard)
    @Post()
    saveProduct(@Body() createMessageDto: CreateMessageDto, @Req() req: Request ){
        console.log('Mensaje recibido: ', createMessageDto)
        let newMsg = this.messagesService.saveMessage(createMessageDto);
        return newMsg
    }
}
