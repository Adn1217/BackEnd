import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsContainer } from './container/products.container';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsContainer]
})
export class ProductsModule {}
