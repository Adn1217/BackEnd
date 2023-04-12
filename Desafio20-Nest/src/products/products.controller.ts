import { Controller, Req, Res, Param, Post, Get,Put, Delete, Query, Body } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { updateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';


@Controller('productos')
export class ProductsController {
    constructor(private readonly productsService: ProductsService){}


    @Get()
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
    @Get(':id')
    getProduct(@Param('id') id: string){
        return {
            id: id
        }
    }

    @Post()
    saveProduct(@Body() createProductDto: CreateProductDto){
        console.log('Producto recibido: ', createProductDto)
        return {
            code: createProductDto.code,
            title: createProductDto.title,
            description: createProductDto.description,
            price: createProductDto.price,
            stock: createProductDto.stock,
            thumbnail: createProductDto.thumbnail
        }
    }

    @Put(':id')
    updateProduct(@Param('id') id: string, @Body() updateProductDto: updateProductDto ){
        return {
            id,
            code: updateProductDto.code,
            title: updateProductDto.title,
            description: updateProductDto.description,
            price: updateProductDto.price,
            stock: updateProductDto.stock,
            thumbnail: updateProductDto.thumbnail
        }
    }

    @Delete(':id')
    deleteProduct(@Param('id') id: string){
        return {
            id: id
        }
    }

}

