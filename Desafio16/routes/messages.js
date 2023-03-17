import express from 'express';
import {isLogged} from '../functions.js';
import * as msgController from '../controller/messagesController.js';

const { Router } = express;
export const mensajes = new Router();

mensajes.use('/', isLogged);

mensajes.get('/', async (req, res) => {
    msgController.showMsgs(res);
    // res.send({msgs: allMessages})
})

mensajes.post('/', (req, res) => {
    msgController.doSaveMessage(req, res);
})

mensajes.post('/normalized', (req, res) => {
    msgController.doSaveNormMessage(req, res);
})