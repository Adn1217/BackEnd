import { Controller, Get, Post, Body, Delete, Param, Req, UseGuards, Query } from '@nestjs/common';
import { LoginService } from './login.service';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { LocalGuard } from './login.guard';
import { AuthenticatedGuard } from './loggedin.guard';

@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService){}

    @UseGuards(AuthenticatedGuard)
    @Get()
    getUsers(@Req() req: Request, @Query('logged') query){
        console.log('Query: ', query);
        if(query==='true'){
            let loggedUser = this.getLoggedUser(req);
            return loggedUser;
        }else{
            console.log('Usuario que utiliza el método: ', req.user);
            return this.loginService.getUsers();
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Get(':name')
    getUserByName(@Param('name') name: string){
        return this.loginService.getUserByName(name)
    }

    @UseGuards(LocalGuard)
    @Post()
    login(@Body() loginUserDto: LoginUserDto, @Req() req: Request ){
        // console.log('Usuario recibido: ', createUserDto)
        let newProd = this.loginService.loginUser(loginUserDto);
        return newProd
    }

    getLoggedUser(req: Request){
        let loggedUser = this.loginService.getLoggedUser(req.user)
        return loggedUser
    }

}
