import * as fs from "fs";
import knex from 'knex';

export default class contenedor {
//   constructor(ubicacion) {
//     this.ruta = ubicacion;
//   }
  
  constructor(options) {
    this.knex = knex(options);
  }

  async createTable(tableName){
    const exists = await this.knex.schema.hasTable(tableName)
    if(!exists && tableName === 'productos'){
        await this.knex.schema.createTable(tableName, table => {
          table.increments('id').primary()
          table.string('fecha').notNullable()
          table.string('title', 50).notNullable()
          table.float('price')
          table.string('thumbnail', 200).notNullable()
        })
    }else if(!exists && tableName === 'mensajes'){
      (tableName === 'mensajes') && 
        await this.knex.schema.createTable(tableName, table => {
          table.increments('id').primary()
          table.string('fecha', 20).notNullable()
          table.string('usuario', 50).notNullable()
          table.string('mensaje', 200).notNullable()
        })
    }
  // this.knex.destroy();
  }

  async save(tableName, prods){
    try{
      await this.knex(tableName).insert(prods);
      this.knex.destroy();
      return prods;
    }catch(error){
      console.log("Se ha presentado error: ", error);
    }
  }


  // async save(elemento) {
  //   try {
  //     let data = await fs.promises.readFile(this.ruta, "utf-8");
  //     let data = await knex.select
  //     let id = 0;
  //     let idMax = id;
  //     data !== [] && (data = await JSON.parse(data))
  //     if (!data || data.length === 0) {
  //       console.log("No hay datos.");
  //     } else {
  //       data.forEach((elemento) => {
  //         elemento.id > idMax && (idMax = elemento.id);
  //       });
  //     }
  //     id = idMax + 1;
  //     elemento.id = id;
  //     if (elemento.length > 1){
  //       await fs.promises.writeFile(this.ruta,JSON.stringify([...elemento], null, 2));
  //     }else{
  //       await fs.promises.writeFile(this.ruta,JSON.stringify([...data, elemento], null, 2));
  //     }
  //     return elemento;
  //   } catch (error) {
  //     console.log("Se ha presentado error ", error);
  //   }
  // }

  // async saveAll(productos) {
  //   try {
  //     await fs.promises.writeFile(this.ruta,JSON.stringify([...productos], null, 2));
  //     return 'ok'
  //   } catch (error) {
  //     console.log("Se ha presentado error ", error);
  //     return error
  //   }
  // }

  // async getById(Id) {
  //   try {
  //     let data = await fs.promises.readFile(this.ruta);
  //     let id = Id;
  //     data = await JSON.parse(data);
  //     let prod = data.find((producto) => producto.id === id);
  //     if (prod?.id) {
  //       // console.log("El producto es: ", prod);
  //       return prod;
  //     } else {
  //       return null;
  //     }
  //   } catch (error) {
  //     console.log("Se ha presentado error ", error);
  //   }
  // }

  async getAll(tableName) {
    try {
      // let data = await fs.promises.readFile(this.ruta, "utf-8");
      let data = await this.knex(tableName).select('*');
      console.log(data);
      this.knex.destroy();
      // data = await JSON.parse(data);
      return data;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }

  // async deleteById(Id) {
  //   try {
  //     let data = await fs.promises.readFile(this.ruta, "utf-8");
  //     let id = Id;
  //     data = await JSON.parse(data);
  //     let prod = data.find((producto) => producto.id === id);
  //     if (prod?.id) {
  //       data = data.filter((producto) => producto.id !== id);
  //       await fs.promises.writeFile(
  //         this.ruta,
  //         JSON.stringify(data, null, 2)
  //       );
  //       console.log(`\nSe elimina el producto con id=${id} (deleteById(${id})): \n`, prod);
  //       // console.log("Quedan los productos: ", data);
  //     } else {
  //       console.log("No existe el producto con id: ", id);
  //     }
  //     return prod;
  //   } catch (error) {
  //     console.log("Se ha presentado error ", error);
  //   }
  // }

  // async deleteAll() {
  //   try {
  //     let data = await fs.promises.readFile(this.ruta, "utf-8");
  //     if (!data) {
  //       console.log("No hay productos");
  //     } else {
  //       await fs.promises.writeFile(this.ruta, "[]");
  //       console.log("Se han borrado los productos ", data);
  //     }
  //   } catch (error) {
  //     console.log("Se ha presentado error ", error);
  //   }
  // }
}