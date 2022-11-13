// const fs = require("fs");
import * as fs from "fs";

export default class Contenedor {
  constructor(ubicacion) {
    this.ruta = ubicacion;
  }

  async save(producto) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let id = 0;
      let idMax = id;
      data !== [] && (data = await JSON.parse(data))
      if (!data || data.length === 0) {
        console.log("No hay productos.");
      } else {
        data.forEach((producto) => {
          producto.id > idMax && (idMax = producto.id);
        });
      }
      id = idMax + 1;
      producto.id = id;
      if (producto.length > 1){
        await fs.promises.writeFile(this.ruta,JSON.stringify([...producto], null, 2));
      }else{
        await fs.promises.writeFile(this.ruta,JSON.stringify([...data, producto], null, 2));
      }
      return producto.id;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }

  async saveAll(productos) {
    try {
      await fs.promises.writeFile(this.ruta,JSON.stringify([...productos], null, 2));
      return 'ok'
    } catch (error) {
      console.log("Se ha presentado error ", error);
      return error
    }
  }

  async getById(Id) {
    try {
      let data = await fs.promises.readFile(this.ruta);
      let id = Id;
      data = await JSON.parse(data);
      let prod = data.find((producto) => producto.id === id);
      if (prod?.id) {
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
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      data = await JSON.parse(data);
      return data;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }

  async deleteById(Id) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let id = Id;
      data = await JSON.parse(data);
      let prod = data.find((producto) => producto.id === id);
      if (prod?.id) {
        data = data.filter((producto) => producto.id !== id);
        await fs.promises.writeFile(
          this.ruta,
          JSON.stringify(data, null, 2)
        );
        console.log(`\nSe elimina el producto con id=${id} (deleteById(${id})): \n`, prod);
        // console.log("Quedan los productos: ", data);
      } else {
        console.log("No existe el producto con id: ", id);
      }
      return data;
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