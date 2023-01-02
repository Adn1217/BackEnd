import * as fs from "fs";
import { ObjectId } from "mongodb";
import {productsModel} from './models/products.js';
import {msgsModel} from './models/messages.js';
import {cartsModel} from './models/carts.js';

export default class ContenedorMongoAtlas {
  constructor(collection) {
    this.collection = collection;
  }

  async save(elemento) {
    let newElement;
    try {
      if (this.collection === 'products'){
        newElement = new productsModel(elemento);
      }else if (this.collection === 'messages'){
        newElement = new msgsModel(elemento);
      }else{
        newElement = new cartsModel(elemento);
      }
      let data = await newElement.save();
      // console.log(data);
      return elemento;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
    //  finally {
    //   mongoose.disconnect();
    // }
  }

  async getById(Id) {
    try {
      let prod = await productsModel.find({_id: ObjectId(Id)});
      console.log(prod);
      if (prod[0]?._id) {
        // console.log("El producto es: ", prod);
        return prod;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }

  async getAll() {
    try {
      let data;
      if (this.collection === 'products'){
        data = await productsModel.find();
      }else if (this.collection === 'messages'){
        data = await msgsModel.find();
      }else{
        data = await cartsModel.find();
      }
      // console.log(data);
      // console.log(new Date(data[0]._id.getTimestamp()).toLocaleDateString());
      return data;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    } 
    // finally {
    //   mongoose.disconnect();
    // }
  }

  async deleteById(Id) {
    
    try {
      let prod = await productsModel.deleteOne({_id: ObjectId(Id)});
      console.log(prod);
      if (prod[0]?._id) {
        console.log(`\nSe elimina el producto con _id=${Id} (deleteById(${Id})): \n`, prod);
        // console.log("Quedan los productos: ", data);
      } else {
        console.log("No existe el producto con id: ", Id);
      }
      return prod;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }
  
  async updateById(elemento, id) {
    try {
      let data = await productsModel.findByIdAndUpdate(id, elemento );
      return data;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
    //  finally {
    //   mongoose.disconnect();
    // }
  }

  async deleteProductInCartById(Id_prod, Id_cart = undefined) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let id_prod = Id_prod;
      let id_cart = Id_cart;
      let originalData = JSON.parse(data);
      data = JSON.parse(data);
      (id_cart) && (data = data.find((cart) => cart.id === id_cart));
      (data?.id) ?? (console.log("No existe el carrito con id: ", id_cart));
      if(data?.id === undefined && Id_cart){
        return false
      }
      console.log(data);
      let prod = (id_cart) ? data.productos.find((producto) => producto.id === id_prod) : data.find((producto) => producto.id === id_prod);
      if (prod?.id) {
        data = (id_cart) ? data.productos.filter((producto) => producto.id !== id_prod) : data.filter((producto) => producto.id !== id_prod);
        (id_cart) ?? await fs.promises.writeFile(this.ruta,JSON.stringify(data, null, 2));
        if (id_cart){
          console.log(originalData.find((cart) => cart.id === id_cart).productos)
          originalData.find((cart) => cart.id === id_cart).productos = data;
          await fs.promises.writeFile(this.ruta,JSON.stringify(originalData, null, 2));
          console.log(`\nSe elimina el producto con id=${id_prod} del carrrito con id=${id_cart}: \n`, prod);
        }
        id_cart ?? console.log(`\nSe elimina el producto con id=${id_prod}): \n`, prod);
        // console.log("Quedan los productos: ", data);
      } else {
        console.log("No existe el producto con id: ", id_prod);
      }
      return prod;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }
  
  async deleteAll() {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      if (!data) {
        console.log("No hay productos");
      } else {
        await fs.promises.writeFile(this.ruta, "[]");
        console.log("Se han borrado los productos ", data);
      }
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }
}