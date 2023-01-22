import express from 'express';
import * as msgController from '../controller/messagesController.js';

const { Router } = express;
export const mensajes = new Router();

function isLogged(req, res, next){
    if (req.session.user){
        next()
    }else{
        res.send({error: 'Usuario no autenticado'});
    }
}

mensajes.use('/', isLogged);

mensajes.get('/', async (req, res) => {
    msgController.showMsgs(res);
    // res.send({msgs: allMessages})
})

mensajes.post('/', (req, res) => {
    const msg = req.body;
    if (Object.keys(msg).length === 0){
        res.send({Error: "Mensage no recibido"})
    }else{
        // console.log('Mensaje: ', msg);
        msgController.doSaveMessage(res, msg);
    }
})

mensajes.post('/normalized', (req, res) => {
    const msg = req.body;
    if (Object.keys(msg).length === 0){
        res.send({Error: "Mensage no recibido"})
    }else{
        // console.log('Mensaje: ', msg);
        msgController.doSaveNormMessage(res, msg);
    }
})