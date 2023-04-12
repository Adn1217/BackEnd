import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { ProductsContainer } from './products/container/products.container';

@Module({
  imports: [ProductsModule, CartsModule, ProductsContainer],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
