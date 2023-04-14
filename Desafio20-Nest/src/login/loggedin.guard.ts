import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common/interfaces";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    
    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const isAuthenticated = request.isAuthenticated();
        return isAuthenticated;
    }
}