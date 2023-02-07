import express from 'express';
import { fork } from 'child_process'
// import {isLogged} from '../functions.js';

const { Router } = express;
export const random = new Router();

// random.use('/', isLogged);

random.get('/?', async (req, res) => {
    let quantity = req.query.cant || 1e8;
    let calculoThread = fork('./randomCalculation.js');
    calculoThread.on('message', (msg) =>{
        if(msg==='Listo'){
            calculoThread.send(quantity);
        }else if(typeof(msg) !== 'object'){
            console.log(msg);
        }else {
            res.send(msg);
        }
    })
})