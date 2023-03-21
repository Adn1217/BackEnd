import ContainerFactory from './ContainerFactory.class.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

const productsCollection = process.env.DB_PRODUCTS_COLLECTION;
const factory = new ContainerFactory();    
const productosFirebase = factory.createContainer('Firebase', productsCollection);
const productosMongoAtlas = factory.createContainer('MongoAtlas', productsCollection);
const productosFile = factory.createContainer('File','./productos.json');

export async function getProducts() {
    const allProducts = await productosFile.getAll();
    const allProductsMongoAtlas = await productosMongoAtlas.getAll();
    const allProductsFirebase = await productosFirebase.getAll();
    return allProductsFirebase
}

export async function getProductById(id) {
    const product = await productosFile.getById(id);
    const productMongoAtlas = await productosMongoAtlas.getById(id);
    const productFirebase = await productosFirebase.getById(id);
    return productFirebase
}

export async function saveProduct(prod) {
    const newProductIdMongoAtlas = await productosMongoAtlas.save(prod);
    const newProductIdFirebase = await productosFirebase.save(prod);
    const newProductId = await productosFile.save(prod);
    return newProductIdFirebase
}

export async function saveAllProducts(prods) {
    const saved = await productosFile.saveAll(prods);
    return saved 
}

export async function deleteProductById(id){
    const productFirebase = await productosFirebase.deleteById(id);
    // const productMongoAtlas = await productosMongoAtlas.deleteById(id);
    const product = await productosFile.deleteById(id);
    return productFirebase;
}