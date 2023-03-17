
import ContenedorArchivo from './ContenedorArchivo.class.js';
import ContenedorMongoAtlas from './ContenedorMongoAtlas.class.js';
import ContenedorFirebase from './ContenedorFirebase.class.js';

export async function getProducts() {
    const productos = new ContenedorArchivo('./productos.json');
    const allProducts = await productos.getAll();
    const productosMongoAtlas = new ContenedorMongoAtlas(productsCollection);
    const allProductsMongoAtlas = await productosMongoAtlas.getAll();
    const productosFirebase = new ContenedorFirebase(productsCollection);
    const allProductsFirebase = await productosFirebase.getAll();
    return allProductsFirebase
}

export async function getProductById(id) {
    const productos = new ContenedorArchivo('./productos.json');
    const product = await productos.getById(id);
    const productosMongoAtlas = new ContenedorMongoAtlas(productsCollection);
    const productMongoAtlas = await productosMongoAtlas.getById(id);
    const productosFirebase = new ContenedorFirebase(productsCollection);
    const productFirebase = await productosFirebase.getById(id);
    return productFirebase
}

export async function saveProduct(prod) {
    const productosMongoAtlas = new ContenedorMongoAtlas(productsCollection);
    const newProductIdMongoAtlas = await productosMongoAtlas.save(prod);
    const productosFirebase = new ContenedorFirebase(productsCollection);
    const newProductIdFirebase = await productosFirebase.save(prod);
    const productos = new ContenedorArchivo('./productos.json');
    const newProductId = await productos.save(prod);
    return newProductIdFirebase
}

export async function saveAllProducts(prods) {
    const productos = new ContenedorArchivo('./productos.json');
    const saved = await productos.saveAll(prods);
    return saved 
}

export async function deleteProductById(id){
    const productosFirebase = new ContenedorFirebase(productsCollection);
    const productFirebase = await productosFirebase.deleteById(id);
    // const productosMongoAtlas = new ContenedorMongoAtlas(productsCollection);
    // const productMongoAtlas = await productosMongoAtlas.deleteById(id);
    const productos = new ContenedorArchivo('./productos.json');
    const product = await productos.deleteById(id);
    return productFirebase;
}