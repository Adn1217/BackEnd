import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { LoginService } from './login.service';
import bCrypt from 'bCrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authServe: LoginService){
        super();
    }

    async validate(userName: string, pwd: string){
        console.log(`Passport validating user ${userName}.....`)
        const user = await this.authServe.findOneUserByName(userName);

        if (user &&  !bCrypt.compareSync(pwd, user.password)){
            throw new UnauthorizedException();
        }
        const {username, password, ...rest} = user;
        return rest;
    }
}