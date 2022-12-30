import express from 'express';
import * as cartController from '../controller/cartsController.js';

const { Router } = express;
const app = express();
const carrito = new Router();

app.use('/carrito', carrito);

carrito.get('/', (req, res) => {
    cartController.showCart(res);
})

carrito.get('/:id/productos', (req, res) => {
    const id = req.params.id;
    console.log(id);
    cartController.showCartById(res, parseInt(id));
})

carrito.post('/', (req, res) => {
    const cart = req.body;
    if (Object.keys(cart).length === 0){
        res.send({Error: "Carrito no recibido"})
    }else{
        console.log('Carrito: ', JSON.stringify(cart));
        onlyAdmin(req, res, cartController.doSaveCart, [res, cart]);
    }
})

carrito.post('/:id/productos', (req, res) => {
    const prod = req.body;
    const {id} = req.params;
    if (Object.keys(prod).length === 0){
        res.send({Error: "Producto no recibido"})
    }else{
        console.log('producto: ', JSON.stringify(prod));
        onlyAdmin(req, res,cartController.doSaveProductInCart, [res, prod, parseInt(id)]);
    }
})

carrito.put('/:id/productos', (req, res) => {// No se expone a Front.
    const cart = req.body;
    const id = req.params.id;
    onlyAdmin(req, res,cartController.updateCartById, [res, cart, parseInt(id)]);
})

carrito.delete('/:id', (req, res) => {
    const {id} = req.params;
    onlyAdmin(req, res, cartController.doDeleteCartById, [res, parseInt(id)]);
})

carrito.delete('/:id/productos/:id_prod', (req, res) => {
    const {id, id_prod} = req.params;
    const id_cart = id;
    onlyAdmin(req, res, cartController.doDeleteProductInCartById, [res,parseInt(id_prod), parseInt(id_cart)]);
})

module.exports = carrito;