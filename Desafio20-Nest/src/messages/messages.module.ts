import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesContainer } from './container/messages.container';
import dotenv from 'dotenv';
import { LocalStrategy } from 'src/login/login.strategy';
import { LoginService } from 'src/login/login.service';
import { UserContainer } from 'src/register/container/register.container';
import { SessionSerializer } from 'src/login/session.serializer';

dotenv.config({
    path: './.env'
})
@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesContainer, LocalStrategy, LoginService, UserContainer, SessionSerializer]
})
export class MessagesModule {}
