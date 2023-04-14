import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { UserContainer } from './container/register.container';
@Module({
  controllers: [RegisterController],
  providers: [RegisterService, UserContainer]
})
export class RegisterModule {}
