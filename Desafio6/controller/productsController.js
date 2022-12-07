import Contenedor from '../Contenedor.class.js';
import * as msgController from './messagesController.js'
// const isAdmin = true;

// function onlyAdmin(req, res, next) {
//     console.log(next);
//     if (isAdmin) { // si es admin
//         next;
//     } else { // si no es admin, devuelvo el error
//         res.status(401).json({error:-1,descripcion:`Ruta ${req.originalUrl} metodo ${req.method} no autorizado`});
//     }
// }


export async function getProducts() {
    const productos = new Contenedor('./productos.json');
    const allProducts = await productos.getAll();
    return allProducts
} 

async function saveProduct(prod) {
    const productos = new Contenedor('./productos.json');
    const newProductId = await productos.save(prod);
    return newProductId
} 

async function saveAllProducts(prods) {
    const productos = new Contenedor('./productos.json');
    const saved = await productos.saveAll(prods);
    return saved 
} 

async function getProductById(id) {
    const productos = new Contenedor('./productos.json');
    const product = await productos.getById(id);
    return product
}

async function deleteProductById(id) {
    const productos = new Contenedor('./productos.json');
    const product = await productos.deleteById(id);
    return product
}

export async function showProducts(res) {
    const allProducts = await getProducts(); 
    const allMessages = await msgController.getMessages();
    console.log('Los productos son: \n', allProducts);
    // res.send({products: allProducts, msgs: allMessages})
    res.render('pages/index', {products: allProducts, msgs: allMessages})
}

export async function doSaveProduct(res, prod) {
    const newProd = await saveProduct(prod); 
    res.send({Guardado: newProd})
}

export async function showProductById(id) {
    let productById = await getProductById(id);
    if (!productById){
        res.send({error:"Producto no encontrado"});
    }else{
        res.send({producto: productById});
        console.log(productById);
    }
}

export async function updateProductById(updatedProd, id) {
    const allProducts = await getProducts();
    let productById = allProducts.find((product) => product.id === id) 
    if (!productById){
        res.send({error: "Producto no encontrado"});
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
            res.send({actualizado: updatedProd})
        }else{
            res.send({error: allSaved})
        }
    }
}

export async function doDeleteProductById(id) {
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