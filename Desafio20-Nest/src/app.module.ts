import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [ProductsModule, CartsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
