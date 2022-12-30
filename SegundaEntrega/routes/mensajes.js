import express from 'express';
import * as msgController from './controller/messagesController.js';

const { Router } = express;
const app = express();
const mensajes = new Router();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use('/mensajes', mensajes);

mensajes.get('/', async (req, res) => {
    msgController.showMsgs(res);
    // res.send({msgs: allMessages})
})

mensajes.post('/', (req, res) => {
    const msg = req.body;
    if (Object.keys(msg).length === 0){
        res.send({Error: "Mensage no recibido"})
    }else{
        console.log('Mensaje: ', msg);
        msgController.doSaveMessage(res, msg);
    }
})

module.exports = mensajes;