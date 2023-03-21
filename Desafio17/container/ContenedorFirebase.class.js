
import admin from 'firebase-admin';
// import {doc, getDoc} from 'firebase/firestore';
import dotenv from 'dotenv';
import dbClient from "./dbClient.class.js";
import logger from '../logger.js';

dotenv.config({
    path: './.env'
})

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
let instance = null;
export let dbFS;

function fireBaseConnect(account){
    try{
        admin.initializeApp({
        credential: admin.credential.cert(account)
        });
        logger.info(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
        return admin.firestore();
    }catch(error){
        logger.error(`Se ha presentado error al intentar conectar el servidor ${process.pid} con Firebase: ${error}`)
    }
}


if (!dbFS){
  dbFS = fireBaseConnect(serviceAccount)
}

export class ContenedorFirebase extends dbClient {
  constructor(collection) {
    super();
    this.collection = collection;
    this.query = dbFS.collection(this.collection);
  }

  static getInstance(collection){
    if(!instance){ // SINGLETON
      instance = new ContenedorFirebase(collection);
      return instance
    }else{
      return instance;
    }
  }

  async connect(){
    try{
        if(dbFS){
          logger.info(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
        }else{
          dbFS = fireBaseConnect(serviceAccount);
          logger.info(`Servidor ${process.pid} se ha conectado exitosamente a FireBase`)
        }
    }catch(error){
        logger.error(`Se ha presentado error al intentar conectar el servidor ${process.pid} con Firebase: ${error}`)
    }
  }

  async disconnect(){
    try{
      admin.app.delete()
    }catch(error){
        logger.error(`Se ha presentado error al intentar desconectar el servidor ${process.pid} con Firebase: ${error}`)
    }
  }

  async save(elemento) {
    try {
      let data = await this.query.add(elemento);
      console.log('GuardadoFirebase: ', data.id);
      return data.id;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
    //  finally {
    //   mongoose.disconnect();
    // }
  }

  async getById(Id) {
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
    }
  }
  
  async getAll() {
    try {
      let data = await this.query.get();
      let docs = data.docs.map((doc) => {
        let id = doc.id;
        let element = doc.data();
        element.id = id
        return element;
      })
      // console.log('Documentos extraidos de Firebase ', docs);
      return docs;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    } 
    // finally {
    //   mongoose.disconnect();
    // }
  }

  async deleteById(Id) {
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
    }
  }
  
  async updateById(element, id) {
    try {
      let data = await this.query.doc(id).get();
      if (data?.data()){
        await this.query.doc(id).update(element);
        console.log("Elemento editado" ,data?.data())
      }else{
        console.log(`El elemento ${id} no existe`);
      }
      return data?.data();
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
    //  finally {
    //   mongoose.disconnect();
    // }
  }

  async deleteProductInCartById(Id_prod, Id_cart= undefined) {
    try {
      let id_prod = Id_prod;
      let id_cart = Id_cart;
      let data = await this.query.doc(Id_cart).get();
      let cart = data?.data();
      console.log('Carrito encontrado en Firebase: ',  cart);
      if(!cart) {
          console.log("No existe en Firebase el carrito con id: ", id_cart);
          return false;
      }else{
        let cartProd = cart.productos.find((prod) => prod.id === parseInt(id_prod))
        console.log('Producto encontrado en Firebase :',cartProd);
        if (cartProd){
          let index  = cart.productos.findIndex( (prod) => prod.id === parseInt(id_prod));
          let deletedProd = cart.productos.splice(index,1)
          await this.query.doc(Id_cart).update(cart);
          console.log(`Se elimina en Firebase el producto con id = ${id_prod} del carrito con id = ${id_cart}`);
          return deletedProd;
        }else{
          console.log(`No existe en Firebase el producto con id= ${id_prod} en el carrito con id=${id_cart}`);
          return undefined;
        }
      }
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }

  async deleteByAll() {
    try {
      let data = await this.query.get();
      data.forEach( doc => {
        doc.ref.delete()
      })
      console.log(`\nSe eliminan los documentos de la colección ${this.collection} \n`);
      // console.log("Quedan los productos: ", data);
      return data;
    } catch (error) {
      console.log(`Se ha presentado error al intentar todos los documentos de la colección ${this.collection} \n`, error);
    }
  }
  
}