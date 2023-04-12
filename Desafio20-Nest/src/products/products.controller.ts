import { Controller, Req, Res, Param, Post, Get,Put, Delete, Query, Body } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Request } from 'express';

@Controller('productos')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}


    @Get(':id?')
    getProducts(@Req() req: Request){
        return this.productsService.getProducts(req);
    }

    // @Get()
    // getProducts(@Query('type') type: string){
    //     return [
    //         {
    //             query: type
    //         }
    //     ]
    // }
    // @Get(':id?')
    // getProducts(@Param('id') id: string){

    // }
    // @Get(':id')
    // getProduct(@Param('id') id: string, @Req() req: Request){
    //     console.log('Id recibido', id)
    //     let product = this.productsService.getProducts(req);
    //     return {
    //         id: id
    //     }
    // }

    @Post()
    saveProduct(@Body() createProductDto: CreateProductDto, @Req() req: Request ){
        console.log('Producto recibido: ', createProductDto)
        let newProd = this.productsService.saveProduct(createProductDto);
        return newProd
    }

    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() updateProductDto: updateProductDto ){
        console.log('Producto e id recibidos: ', {id, updateProductDto})
        let updatedProd = this.productsService.updateProductByIdFB(updateProductDto, id);
        return updatedProd;
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string){
        console.log('Id recibida: ', id);
        let deletedProd = this.productsService.deleteProductById(id);
        return deletedProd
    }

}

