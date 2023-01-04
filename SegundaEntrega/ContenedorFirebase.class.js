import { ObjectId } from "mongodb";
import {productsModel} from './models/products.js';
import {msgsModel} from './models/messages.js';
import {cartsModel} from './models/carts.js';
import {dbFS} from './server.js';
import {doc, getDoc} from 'firebase/firestore';

export default class ContenedorFirebase {
  constructor(collection) {
    // this.dbFS = admin.firestore();
    this.collection = collection;
    this.query = dbFS.collection(this.collection);
  }

  async save(elemento) {
    try {
      let data = await this.query.add(elemento);
      console.log('Guardado: ', data.id);
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
      doc.id = data.id;
      if(data.id){
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

  async deleteProductInCartById(Id_prod, Id_cart = undefined) {
    try {
      let id_prod = Id_prod;
      let id_cart = Id_cart;
      let cart = await cartsModel.find({_id: ObjectId(id_cart)});
      cart = cart[0];
      console.log('Carrito encontrado: ',  cart);
      if(cart?._id === undefined) {
          console.log("No existe el carrito con id: ", id_cart);
          return false;
      }else{
        let cartProd = await cartsModel.find({'productos._id': ObjectId(id_prod)})
        console.log('Producto encontrado :',cartProd);
        if (cartProd && cartProd.length === 1){
          cartProd = cartProd[0];
          let deletedProd = cartProd.productos.splice(cartProd.productos.find( prod => prod._id === ObjectId(id_prod)),1)
          await cartProd.save();
          console.log(`Se elimina el producto con id = ${id_prod} del carrito con id = ${id_cart}`);
          return deletedProd;
        }else{
          console.log(`No existe el producto con id= ${id_prod} en el carrito con id=${id_cart}`);
          return undefined;
        }
      }
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }
  
}