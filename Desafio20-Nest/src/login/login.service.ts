import { Injectable } from '@nestjs/common';
import { UserContainer } from 'src/register/container/register.container';
import { CreateUserDto } from 'src/register/dto/create-user.dto';

@Injectable()
export class LoginService {

    constructor(private readonly userContainer: UserContainer){}
    // async saveUser(user: CreateUserDto){
    //     if (Object.keys(user).length === 0){
    //         console.log('Usuario no recibido');
    //         // logger.error('Producto no recibido');
    //         return({Error: "Usuario no recibido"})
    //     }else{
    //         let newUser = await this.userContainer.saveUser(user);
    //         console.log('UserFront', user);
    //         return({Registrado: newUser})
    //     }
    // }
    
    async loginUser(user){
        if (Object.keys(user).length < 2){
            console.log('Información incompleta');
            // logger.error('Producto no recibido');
            return({Error: "Información incompleta"})
        }else{
            let newUser = await this.userContainer.loginUser(user);
            // console.log('UserFront', user);
            return({Access: newUser})
        }
    }

    async getUsers(){
        const allUsers = await this.userContainer.getUsers();
        return {Users: allUsers};
    }

    async getUserByName(name: string) {
        let userByName = await this.userContainer.getUserByName(name);
        if (!userByName || Object.keys(userByName).length === 0){
            // logger.error(`Producto ${id} no encontrado`);
            return({usuario: {
                error:`usuario ${name} no encontrado`}
            });
        }else{
            console.log(userByName);
            // logger.debug(`userByName: ${JSON.stringify(userByName)}`);
            return({user: userByName});
        }
    }
}
