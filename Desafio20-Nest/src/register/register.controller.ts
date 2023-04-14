
import { Controller, Get, Post, Body, Delete, Param, Req } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';

@Controller('register')
export class RegisterController {

    constructor(private readonly registerService: RegisterService){}

    @Post()
    register(@Body() registerUserDto: CreateUserDto, @Req() req: Request ){
        // console.log('Usuario recibido: ', createUserDto)
        let newProd = this.registerService.registerUser(registerUserDto);
        return newProd
    }

}
