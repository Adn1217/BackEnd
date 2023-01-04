import {collection, addDoc, getFirestore} from 'firebase/firestore';
import fs from 'fs'
import { dbFS } from './server.js';

export function calculateId(elemento, data){
    let id = 0;
    let idMax = id;
    data.forEach((elemento) => {
        elemento.id > idMax && (idMax = elemento.id);
    });
    id = idMax + 1;
    elemento.id = id;
    console.log('ElementoWithId', elemento)
    return elemento
}

export async function loadMocktoFireBase(colecciones){

    for (let i = 0; i < colecciones.length;i++){
        if (colecciones[i] === 'products'){
            const stockData = './mockProductos.json';
            const productsTestCollection = dbFS.collection(colecciones[i]);
            await loadMockData(stockData, productsTestCollection);
        }else if (colecciones[i] ==='carts'){
            const stockData = './mockCart.json';
            const cartsTestCollection = dbFS.collection(colecciones[i]);
            await loadMockData(stockData, cartsTestCollection);
        }
    }
}

async function loadMockData(stockData, coleccion){
    let data = JSON.parse(fs.readFileSync(stockData));
    let resp = [];
    let ids = [];
    let success = true;
    let msg = '';
    console.log(`Cargando datos de ${JSON.stringify(coleccion._queryOptions.collectionId)} a Firebase...`)

    await Promise.all(data.map(async (doc) =>{
        try {
            resp = await coleccion.add(doc);
            ids.push(resp.id)
        }catch(error){
            success = false;
            console.log("Se ha presentado el siguiente error durante el proceso de carga", error);
        }finally{
            msg ="La carga ha " + (success ? "sido exitosa" : "fallado");
            console.log(msg);
        }
    }));
    (success) && (console.log('Fueron cargados productos con los siguientes ids: '+ids.join(', ')));
}