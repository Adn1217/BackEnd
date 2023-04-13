import { Controller, Get, Post, Body, Delete, Param, Req } from '@nestjs/common';
import { LoginService } from './login.service';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService){}

    @Get()
    getUsers(){
        return this.loginService.getUsers();
    }

    @Get(':name')
    getUserByName(@Param('name') name: string){
        return this.loginService.getUserByName(name)
    }

    @Post()
    login(@Body() loginUserDto, @Req() req: Request ){
        // console.log('Usuario recibido: ', createUserDto)
        let newProd = this.loginService.loginUser(loginUserDto);
        return newProd
    }

    @Delete()
    deleteUser(){

    }

}
