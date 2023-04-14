import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsContainer } from './container/products.container';
import { UserContainer } from 'src/register/container/register.container';
import { LocalStrategy } from 'src/login/login.strategy';
import { LoginService } from 'src/login/login.service';
import { SessionSerializer } from 'src/login/session.serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsContainer, LocalStrategy, LoginService, UserContainer, SessionSerializer]
})
export class ProductsModule {}
