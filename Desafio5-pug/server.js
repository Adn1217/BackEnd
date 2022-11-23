import Contenedor from './Contenedor.class.js';
import express from 'express';
// import pug from 'pug';
import path from 'path';
import {fileURLToPath} from 'url';

console.log('\n################INICIO DE SERVIDOR################\n')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Router } = express;
const app = express();
const productos = new Router();
const port = parseInt(process.env.PORT, 10) || 8080;

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/productos', productos);
// app.engine('pug', pug.__express)
app.set('view engine', 'pug');
app.set('views', "./views");
app.use(express.static(__dirname + '/public'));

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

async function getProducts() {
    const productos = new Contenedor('./productos.json');
    const allProducts = await productos.getAll();
    return allProducts
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

// app.get('/', (req, res) => {
//     async function showProducts() {
//         const allProducts = await getProducts(); 
//         console.log('Los productos son: \n', allProducts);
//         res.render('layouts/main', {products: allProducts})
//     }
//     showProducts();
// })


productos.get('/', (req, res) => {
    async function showProducts() {
        const allProducts = await getProducts(); 
        console.log('Los productos son: \n', allProducts);
        res.render('layouts/main', {products: allProducts})
    }
    showProducts();
})

productos.post('/', (req, res) => {
    async function doSaveProduct(prod) {
        const newProd = await saveProduct(prod); 
        res.send({Guardado: newProd})
    }
    const product = req.body;
    if (Object.keys(product).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('Producto', product);
        doSaveProduct(product);
    }
})

productos.get('/:id', (req, res) => {
    async function showProductById(id) {
        let productById = await getProductById(id);
        if (!productById){
            res.send({error:"Producto no encontrado"});
        }else{
            res.send({producto: productById});
            console.log(productById);
        }
    }
    const id = req.params.id;
    console.log(id);
    showProductById(parseInt(id));
    
})

productos.put('/:id', (req, res) => {
    async function updateProductById(updatedProd, id) {
        let productById = await getProductById(id);
        if (!productById){
            res.send({error: "Producto no encontrado"});
        }else{
            const allProducts = await getProducts();
            const newAllProducts = allProducts.map((prod) => {
                if(prod.id === id){
                    prod = updatedProd;
                    prod.id = id;
                    console.log(prod);
                }
                return prod;
            })
            console.log('La nueva lista es: ', newAllProducts);
            const allSaved = await saveAllProducts(newAllProducts);
            if (allSaved === 'ok'){
                res.send({actualizado: updatedProd})
            }else{
                res.send({error: saveAll})
            }
        }
    }
    const prod = req.body;
    const id = req.params.id;
    updateProductById(prod, parseInt(id));
})

productos.delete('/:id', (req, res) => {

    async function doDeleteProductById(id) {
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

    const {id} = req.params;
    console.log(id);
    doDeleteProductById(parseInt(id));
})

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
})

server.on('error', (error) => console.log('Se presentó error: ', error.message));