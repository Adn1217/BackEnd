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
          table.string('title', 50).notNullable()
          table.float('price')
          table.string('thumbnail', 200).notNullable()
        })
    }else if(!exists && tableName === 'mensajes'){
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
      let insertedID= await this.knex(tableName).insert(prods);
      // this.knex.destroy();
      return insertedID ;
    }catch(error){
      console.log("Se ha presentado error: ", error);
    }
  }

  async saveAll(tableName,productos) {
    try {
      await this.knex(tableName).insert(productos);
      return 'ok'
    } catch (error) {
      console.log("Se ha presentado error ", error);
      return error
    }
  }

  async update(tableName, producto) {
    try {
      console.log('El producto recibido es: ', producto);
      await this.knex(tableName).where({id: producto.id}).update(producto);
      return 'ok'
    } catch (error) {
      console.log("Se ha presentado error ", error);
      return error
    }
  }
  
  async getById(tableName, id){
    try{
      let prod = await this.knex(tableName).where({id: id});
      // this.knex.destroy();
      return prod ;
    }catch(error){
      console.log("Se ha presentado error: ", error);
    }
  }

  async getAll(tableName) {
    try {
      let data = await this.knex(tableName).select('*');
      console.log(data);
      // this.knex.destroy();
      // data = await JSON.parse(data);
      return data;
    } catch (error) {
      console.log("Se ha presentado error ", error);
    }
  }

  async deleteById(tableName, id){
    try{
      let data = await this.knex(tableName).where({id: id}).del();
      console.log(`Se ha eliminado el producto con Id=${id}`);
      return data;
    }catch(error){
      console.log("Se ha presentado error ", error);
    }
  }

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