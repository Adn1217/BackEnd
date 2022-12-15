import knex from 'knex';

export default class contenedor {
  
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
      let initialProds = [
      {
        "title": "Escuadra",
        "price": 123.5,
        "thumbnail": "https://http2.mlstatic.com/D_NQ_NP_2X_955707-MCO44495623436_012021-F.webp",
        "id": 1
      },
      {
        "title": "Calculadora",
        "price": 234.56,
        "thumbnail": "https://http2.mlstatic.com/D_NQ_NP_2X_771821-MCO52197432698_102022-F.webp",
        "id": 2
      },
      {
        "title": "Globo Terraqueo",
        "price": 345.67,
        "thumbnail": "https://panamericana.vteximg.com.br/arquivos/ids/190161-1600-1600/globo-terraqueo-politico-40-cm-1-7701016736787.jpg?v=636251722565900000",
        "id": 3
      }]
      return await this.knex(tableName).insert(initialProds);
    }else if(!exists && tableName === 'mensajes'){
      return await this.knex.schema.createTable(tableName, table => {
      table.increments('id').primary()
      table.string('fecha', 20).notNullable()
      table.string('usuario', 50).notNullable()
      table.string('mensaje', 200).notNullable()
    })
    //this.knex.destroy();
    }
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