import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesContainer } from './container/messages.container';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesContainer]
})
export class MessagesModule {}
