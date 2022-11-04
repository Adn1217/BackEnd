import Contenedor from './Contenedor.class.js';
console.clear();
console.log("\n-------------------------------------------");
console.log("#######Desafío 2: Manejo de archivos#######");
console.log("-------------------------------------------\n");

let productos = new Contenedor("./productos.json");
// Esto se hace para que se pueda repetir la ejecución sin llenar de repetidos el archivo json.
console.log("Reseteo de archivo productos.json.");
await productos.deleteAll();
let productosIniciales = [
  {
    "title": "Escuadra",
    "price": 123.5,
    "thumbnail": "xxxyyyzzz111",
    "id": 1
  },
  {
    "title": "Calculadora",
    "price": 234.56,
    "thumbnail": "xxxyyyzzz222",
    "id": 2
  }
];

await productos.save(productosIniciales);
console.log("Se han cargado los productos por defecto.");
console.log("\n-----Inicio de pruebas-----\n");
// Aquí inician las pruebas de los métodos.
let prods = await productos.getAll();
console.log("Estos son los productos del archivo productos.json (getAll): \n", prods);
const nuevoProducto = {
  title: "Globo Terraqueo",
  price: 345.67,
  thumbnail: "xxxyyyzzz3333"
};
await productos.save(nuevoProducto);
console.log("\nSe guardó el producto (save): \n", nuevoProducto);
prods = await productos.getAll();
console.log("\nLa nueva lista de productos (getAll) es : \n", prods);
let id = 1;
let prod1 = await productos.getById(id);
console.log(`\nEl producto con id=${id} (getById(${id})) es: \n`, prod1);
let id2 = 3;
await productos.deleteById(id2);
prods = await productos.getAll();
console.log("\nLa nueva lista de productos (getAll) es: \n", prods);
await productos.deleteAll();
console.log("\nSe borró toda la lista de productos (deleteAll).");
prods = await productos.getAll();
console.log("\nLa nueva lista de productos es (getAll) :", prods);
