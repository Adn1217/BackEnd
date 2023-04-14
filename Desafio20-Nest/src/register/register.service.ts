import { Injectable } from '@nestjs/common';
import { UserContainer } from './container/register.container';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class RegisterService {

    constructor(private readonly userContainer: UserContainer){}
    async registerUser(user: CreateUserDto){
        if (!user.username || !user.password){
            console.log('Información de usuario insuficiente');
            // logger.error('Producto no recibido');
            return({Error: "Información de usuario insuficiente"})
        }else{
            let newUser = await this.userContainer.saveUser(user);
            console.log('UserFront', user);
            return({Registrado: newUser})
        }
    }
}
