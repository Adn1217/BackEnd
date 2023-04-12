import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsContainer } from './container/products.container';

@Module({
  imports: [ProductsContainer],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
