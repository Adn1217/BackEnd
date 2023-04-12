import { Injectable } from '@nestjs/common';
import { updateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductsContainer {
    products = [];

    saveProduct(newProd: CreateProductDto){
        let newId = this.randomId();
        let savedProd ={id: newId,...newProd}
        this.products.push(savedProd);
        return savedProd;
    }

    getProducts(){
        return this.products;
    }

    getProductById(id: string){
        let product = this.products.find((product) => product.id === id);
        return product;
    }
    
    updateProductById(id: string, newProd: updateProductDto){
        let productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex >=0){
            let updatedProd = {id: id, ...newProd};
            let product = this.products.splice(productIndex, 1, {id: id, ...newProd})
            return updatedProd;
        }else{
            let updatedProd = {id: id, error: "Producto no encontrado"}
            return updatedProd;
        }
    }

    deleteProductById(id: string){
        let productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex >= 0){
            let deletedProduct = this.products.splice(productIndex, 1)
            return deletedProduct
        }else{
            // let deletedProduct = {id: id, error: "Producto no encontrado"}
            return undefined
        }
    }

    private randomId(){
        const caracters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i<12; i++){
            const randNum = Math.random();
            const randInt = Math.floor(randNum*caracters.length);
            const randBool = Math.round(Math.random());
            code += (randBool && caracters[randInt].toUpperCase()) ? caracters[randInt].toUpperCase() : caracters[randInt];
        }
        console.log('Codigo generado: ', code);
        return code;
    }
    
}
