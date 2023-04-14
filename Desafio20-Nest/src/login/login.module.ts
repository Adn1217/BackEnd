import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UserContainer } from 'src/register/container/register.container';
import { LocalStrategy } from './login.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [LoginController],
  providers: [LoginService, UserContainer, LocalStrategy, SessionSerializer]
})
export class LoginModule {}
