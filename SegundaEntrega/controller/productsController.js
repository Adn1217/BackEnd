import ContenedorArchivo from '../ContenedorArchivo.class.js';
import ContenedorMongoAtlas from '../ContenedorMongoAtlas.class.js';
import * as msgController from './messagesController.js'


export async function getProducts() {
    const productos = new ContenedorArchivo('./productos.json');
    const allProducts = await productos.getAll();
    const productosMongoAtlas = new ContenedorMongoAtlas('products');
    const allProductsMongoAtlas = await productosMongoAtlas.getAll();
    return allProductsMongoAtlas
} 

async function saveProduct(prod) {
    const productos = new ContenedorArchivo('./productos.json');
    const newProductId = await productos.save(prod);
    const productosMongoAtlas = new ContenedorMongoAtlas('products');
    const newProductIdMongoAtlas = await productosMongoAtlas.save(prod);
    return newProductIdMongoAtlas
} 

async function saveAllProducts(prods) {
    const productos = new ContenedorArchivo('./productos.json');
    const saved = await productos.saveAll(prods);
    return saved 
}

async function saveProductByIdFile(res, updatedProd, id){
    id = parseInt(id);
    const productos = new ContenedorArchivo('./productos.json');
    const allProducts = await productos.getAll();
    let actualizadoArchivo = {actualizadoArchivo: updatedProd};
    let productById = allProducts.find((product) => product.id === id) 
    if (!productById){
        actualizadoArchivo = {error: "Producto no encontrado"};
        // res.send({error: "Producto no encontrado"});
    }else{
        let newAllProducts = allProducts.map((prod) => {
            if(prod.id === id){
                prod = updatedProd;
                prod.id = id;
                // console.log(prod);
            }
            return prod;
        })
        console.log('La nueva lista es: ', newAllProducts);
        const allSaved = await saveAllProducts(newAllProducts);
        if (allSaved === 'ok'){
            // res.send({actualizado: updatedProd})
        }else{
            actualizadoArchivo = {error: allSaved};
            // res.send({error: allSaved})
        }
    }
    console.log("Actualizado en Archivo: ", actualizadoArchivo)
}

export async function getProductById(id) {
    const productos = new ContenedorArchivo('./productos.json');
    const product = await productos.getById(id);
    const productosMongoAtlas = new ContenedorMongoAtlas('products');
    const productMongoAtlas = await productosMongoAtlas.getById(id);
    return productMongoAtlas
}

async function deleteProductById(id) {
    const productos = new ContenedorArchivo('./productos.json');
    const product = await productos.deleteById(id);
    const productosMongoAtlas = new ContenedorMongoAtlas('products');
    const productMongoAtlas = await productosMongoAtlas.deleteById(id);
    return productMongoAtlas
}

export async function showProducts(res) {
    const allProducts = await getProducts(); 
    const allMessages = await msgController.getMessages();
    // console.log('Los productos son: \n', allProducts);
    // res.send({products: allProducts})
    res.render('pages/index', {products: allProducts, msgs: allMessages})
}

export async function doSaveProduct(product, res) {
    if (Object.keys(product).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('Producto', product);
        const newProd = await saveProduct(product); 
        res.send({Guardado: newProd})
    }
}

export async function showProductById(res, id) {
    let productById = await getProductById(id);
    if (!productById){
        res.send({error:"Producto no encontrado"});
    }else{
        res.send({producto: productById});
        console.log(productById);
    }
}

export async function updateProductById(res, updatedProd, id) {
    await saveProductByIdFile(res, updatedProd, id);
    const productosMongoAtlas = new ContenedorMongoAtlas('products');
    const productMongoAtlas = await productosMongoAtlas.updateById(updatedProd,id);
    if (productMongoAtlas){
        console.log("Se ha actualizado el producto: \n", productMongoAtlas);
        res.send({actualizadoMongo: productMongoAtlas})
    }else{
        console.log("Producto no actualizado");
        res.send({error: "Producto no encontrado"})
    }
}

export async function doDeleteProductById(res, id) {
    let deletedProduct = await deleteProductById(id);
    if (!deletedProduct){
        deletedProduct = {
            error: "Producto no encontrado"
        }
        res.send(deletedProduct)
    }else{
        res.send({eliminado: deletedProduct})
    }
    return deletedProduct;
}