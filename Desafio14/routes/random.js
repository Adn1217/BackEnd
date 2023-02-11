import express from 'express';
import { fork } from 'child_process';

import dotenv from 'dotenv';
import parseArgs from 'minimist';

// import {isLogged} from '../functions.js';

const { Router } = express;
export const random = new Router();

// random.use('/', isLogged);

const options = {
    alias: {
        p: 'port',
        m: 'mode'
    }, 
    default: {
        port: 8080,
        mode: 'fork'
    }
};

const args = parseArgs(process.argv.slice(2), options);

random.get('/?', async (req, res) => {
    let quantity = req.query.cant || 1e8;
    let calculoThread = fork('./randomCalculation.js');
    calculoThread.on('message', (msg) =>{
        if(msg==='Listo'){
            calculoThread.send(quantity);
        }else if(typeof(msg) !== 'object'){
            console.log(msg);
        }else {
            res.send({port: args['port'], conteo:msg});
        }
    })
})