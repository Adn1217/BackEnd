import { Injectable } from '@nestjs/common';
import ContainerFactory from '../../container/DAOs/ContainerFactory.class';
import { transformToDTO } from '../../container/DTOs/products.js';
import dotenv from 'dotenv';
import { ContenedorFirebase } from 'src/container/DAOs/ContenedorFirebase.class';

dotenv.config({
    path: './.env'
})


@Injectable()
export class ProductsContainer {
    static productsCollection = process.env.DB_PRODUCTS_COLLECTION;
    static factory = new ContainerFactory();    
    // const private [productosfirebase, productosmongoatlas, productosfile] = createcontainers();
    // const private [productosfirebase, productosmongoatlas, productosfile] = createcontainers();
    static productosFirebase = ProductsContainer.createContainers();

    static async createContainers(){
        const productosFirebase = this.factory.createContainer('Firebase', this.productsCollection);
        // const productosMongoAtlas = this.factory.createContainer('MongoAtlas', this.productsCollection);
        // const productosFile = this.factory.createContainer('File','./productos.json');
        // return [productosFirebase, productosMongoAtlas, productosFile]
        return productosFirebase
    }

    static async getProducts() {
        // const allProducts = await this.productosFile.getAll();
        // const allProductsMongoAtlas = await productosMongoAtlas.getAll();
        const allProductsFirebase = await ContenedorFirebase.getAll();
        // console.log('Productos recibidos: ', allProductsFirebase)
        const allProductsDTO = transformToDTO(allProductsFirebase);
        // console.log(allProductsDTO);
        return allProductsDTO
    }

    static async getProductById(id) {
        // const [productosFirebase, productosMongoAtlas, productosFile] = this.createContainers();
        // const product = await productosFile.getById(id);
        // const productMongoAtlas = await productosMongoAtlas.getById(id);
        const productFirebase = await ContenedorFirebase.getById(id);
        const productDTO = transformToDTO(productFirebase);
        return productDTO
    }
}
