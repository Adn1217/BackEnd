import * as fs from "fs";

export default class Contenedor {
  constructor(ubicacion) {
    this.ruta = ubicacion;
  }

  async save(elemento) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let id = 0;
      let idMax = id;
      data !== [] && (data = await JSON.parse(data))
      if (!data || data.length === 0) {
        console.log("No hay datos.");
      } else {
        data.forEach((elemento) => {
          elemento.id > idMax && (idMax = elemento.id);
        });
      }
      id = idMax + 1;
      elemento.id = id;
      if (elemento.length > 1){
        await fs.promises.writeFile(this.ruta,JSON.stringify([...elemento], null, 2));
      }else{
        await fs.promises.writeFile(this.ruta,JSON.stringify([...data, elemento], null, 2));
      }
      return elemento;
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

  async deleteById(Id, Id_prod = undefined) {
    try {
      let data = await fs.promises.readFile(this.ruta, "utf-8");
      let id = Id;
      let id_prod = Id_prod;
      let originalData = JSON.parse(data);
      data = JSON.parse(data);
      (Id_prod) && (data = data.find((cart) => cart.id === id));
      (data?.id) ?? (console.log("No existe el carrito con id: ", id));
      if(data?.id === undefined && Id_prod){
        return false
      }
      console.log(data);
      let prod = (Id_prod) ? data.productos.find((producto) => producto.id === id_prod) : data.find((producto) => producto.id === id);
      if (prod?.id) {
        data = (Id_prod) ? data.productos.filter((producto) => producto.id !== id_prod) : data.filter((producto) => producto.id !== id);
        Id_prod ?? await fs.promises.writeFile(this.ruta,JSON.stringify(data, null, 2));
        if (Id_prod){
          console.log(originalData.find((cart) => cart.id === id).productos)
          originalData.find((cart) => cart.id === id).productos = data;
          await fs.promises.writeFile(this.ruta,JSON.stringify(originalData, null, 2));
          (Id_prod) && console.log(`\nSe elimina el producto con id=${id} del carrrito con id=${id_prod}): \n`, prod);
        }
        Id_prod ?? console.log(`\nSe elimina el producto con id=${id}): \n`, prod);
        // console.log("Quedan los productos: ", data);
      } else {
        console.log("No existe el producto con id: ", id);
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