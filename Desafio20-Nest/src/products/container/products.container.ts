import { Injectable } from '@nestjs/common';
import { updateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import dotenv from 'dotenv';
// import {fireBaseConnect, dbFS} from '../../messages/container/messages.container';
import { dbFS } from '../../main';

dotenv.config({
    path: './.env'
})

@Injectable()
export class ProductsContainer {
    products = []; // Persistencia Local.
    collection: string = process.env.DB_PRODUCTS_COLLECTION;
    query = dbFS.collection(this.collection);

    async disconnect(){
        try{
            // await admin.app().delete();
            process.exit[0];
            console.log(`El servidor ${process.pid} se ha desconectado exitosamente de Firebase.`)
            // logger.info(`El servidor ${process.pid} se ha desconectado exitosamente de Firebase.`)
        }catch(error){
            // logger.error(`Se ha presentado error al intentar desconectar el servidor ${process.pid} de Firebase: ${error}`)
            console.log(`Se ha presentado error al intentar desconectar el servidor ${process.pid} de Firebase: ${error}`)
        }
    }

    async saveProduct(newProd: CreateProductDto){
        try {
            let data = await this.query.add({fecha: JSON.stringify(new Date()), ...newProd});
            console.log('GuardadoFirebase: ', data.id);
            return data.id;
          } catch (error) {
            console.log("Se ha presentado error ", error);
          } finally {
            this.disconnect();
          }
    }

    async getProducts(){
        try{
            let data = await this.query.get();
            let docs = data.docs.map((doc) => {
                let id = doc.id;
                let element = doc.data();
                element.id = id
                return element;
            })
            console.log('Mensajes extraidos de Firebase ', docs);
            return docs;
        } catch (error) {
            console.log("Se ha presentado error al consultar mensajes ", error);
        } finally {
            this.disconnect();
        }
    }

    async getProductById(Id: string) {
        try {
          
            let data = await this.query.doc(Id).get();
            let doc = data.data();
            if(doc){
                doc.id = data.id;
                // console.log('Documento extraidos de Firebase ', doc);
                return doc;
            }else {
                return null;
            }
        } catch (error) {
            console.log("Se ha presentado error ", error);
        } finally{
            this.disconnect();
        }
      }

    async updateProductById( id: string, element: updateProductDto) {
        try {
            let data = await this.query.doc(id).get();
            if (data?.data()){
            await this.query.doc(id).update(element);
            console.log("Elemento editado" ,data?.data())
            }else{
            console.log(`El elemento ${id} no existe`);
            }
            data = await this.query.doc(id).get();
            return data?.data();
        } catch (error) {
            console.log("Se ha presentado error ", error);
        } finally{
            this.disconnect();
        }
    }

    async deleteProductById(Id: string) {
        try {
          let data = await this.query.doc(Id).get();
          if (data?.data()) {
            await this.query.doc(Id).delete();
            console.log(`\nSe elimina el elemento con _id=${Id} (deleteById(${Id})): \n`, data?.data());
            // console.log("Quedan los productos: ", data);
          } else {
            console.log(`El elemento ${Id} no existe`, Id);
          }
          return data?.data();
        } catch (error) {
          console.log("Se ha presentado error ", error);
        } finally{
          this.disconnect();
        }
    }
    
    // --------------Persistencia Local-------------------
    saveProductLocal(newProd: CreateProductDto){
        let newId = this.randomId();
        let savedProd ={id: newId,...newProd}
        this.products.push(savedProd);
        return savedProd;
    }

    getProductsLocal(){
        console.log('Coleccion de productos: ', this.collection);
        return this.products;
    }

    getProductByIdLocal(id: string){
        let product = this.products.find((product) => product.id === id);
        return product;
    }
    
    updateProductByIdLocal(id: string, newProd: updateProductDto){
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

    deleteProductByIdLocal(id: string){
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
