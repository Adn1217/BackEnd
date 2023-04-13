import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UserContainer } from 'src/register/container/register.container';

@Module({
  controllers: [LoginController],
  providers: [LoginService, UserContainer]
})
export class LoginModule {}
