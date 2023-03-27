import axios from 'axios';
import logger from '../logger.js';
import dotenv from 'dotenv';
import parseArgs from 'minimist';

dotenv.config({
    path: './.env'
})
const user = process.env.USER;
const pwd = process.env.PASSWORD;

const options = {
    alias: {
        a: 'api',
        ad: 'admin',
        d: 'data',
        e: 'endpoint',
        i: 'id',
        p: 'port',
        sp: 'serverPort',
    }, 
    default: {
        admin: false,
        api: 'productos',
        data: {
            code: 'Prueba',
            description: 'Prueba',
            price: 999,
            stock: 999,
            thumbnail: 'Prueba',
            title: 'Prueba'
        },
        endpoint: 'all',
        id: null,
        serverPort: 8080
    }
};

const args = parseArgs(process.argv.slice(2), options);
if(!(['productos','carrito','mensajes'].findIndex((api) => api = args['api'])>=0)){
    args['api'] = 'productos';
    // console.warn('Modo inválido, se ejecutará en el modo fork por defecto.');
    logger.warn('Api inválida, se ejecutará a la api "productos" por defecto.');
}

if(!(['getAll', 'getAllFaker', 'getById', 'deleteById', 'updateById'].findIndex((endpoint) => endpoint = args['endpoint'])>=0)){
    args['endpoint'] = 'getAll';
    // console.warn(`Se ingresa puerto inválido. Se toma puerto ${args['port']} por defecto.`);
    logger.warn(`Se ingresa endpoint inválido. Se toma endpoint ${args['endpoint']} por defecto.`);
}else if((['getById', 'deleteById', 'updateById'].findIndex((endpoint)  => endpoint = args['endpoint']) >=0) && args['id'] === null){
    logger.warn(`Para el endpoint ${args['endpoint']} se debe ingresar un id.`);
}else if(args['endpoint'] === 'updateById'){
    logger.info(`Data ingresada: ${JSON.stringify(args['data'])}`);
    let dataNew = {
        code: 'Prueba',
        description: 'Prueba',
        price: 999,
        stock: 999,
        thumbnail: 'Prueba',
        title: 'Prueba'
    }
    args['data'] = {...dataNew,...JSON.parse(args['data'])};
    console.log(args['data']);
    logger.warn(`Para el endpoint ${args['endpoint']} se debe ingresar la nueva data a actualizar. Se actualizarán campos vacíos con "Prueba" o 999.`);
}

if(isNaN(args['serverPort']) || (typeof(args['serverPort']) !== 'number')){
    args['serverPort'] = 8080;
    // console.warn(`Se ingresa puerto inválido. Se toma puerto ${args['port']} por defecto.`);
    logger.warn(`Se ingresa puerto de servidor inválido. Se toma puerto ${args['port']} por defecto.`);
}

const api = args['api'];
const endpoint = args['endpoint'];
const id = args['id'];
const serverPort = args['serverPort'];
const data = args['data'];
const admin = args['admin'];

axios.defaults = {
    baseURL: `http://localhost`,
    withCredentials: true,
}

await authenticate(user, pwd);
async function authenticate(user, pwd){
    let url = '/login'
    let response = await axios.post(url,{username: user, password: pwd}, 
    {withCredentials: true});
    let logStatus = await response.data;
    console.log('Log status: ', logStatus);
    logger.info(`Log status: ${JSON.stringify(logStatus, null, '\t')}`);
}

// axios.interceptors.request.use((req) => {
//     req.user = {
//         username: 'Adrian',
//         password: '1234'
//         }
//     console.log('Request: ', req);
//     return req
//     })

async function getAll(){
    let url = `/${api}/?`
    let allProducts = await axios(url);
    return allProducts;
}

async function getById(id){
    let url =`/${api}/${id}` 
    let product = await axios(url);
    return product;
}

async function updateById(id, data, admin){
    let url =`/${api}/${id}` 
    let product = await axios.put(url, data, {
        headers: {
            'auth': admin
        }
    });
    return product;
}

if (endpoint === 'getAll'){
    logger.info(`Se inicia prueba de endpoint ${endpoint}`);
    try{
        let allProducts = await getAll(user, pwd);

        // console.log('Productos recibidos: ', allProducts.data);
        logger.info(`Productos recibidos: ${JSON.stringify(allProducts.data, null, '\t')}`);
    }catch(error){
        logger.error(`Se presenta error en prueba de endpoint ${endpoint} : ${error}`);
    }finally{
        logger.info(`Finaliza prueba de endpoint ${endpoint}`);
    }
}

if (endpoint === 'getById' && id){
    logger.info(`Se inicia prueba de endpoint ${endpoint}`);
    try{
        let product = await getById(id);
        logger.info(`Producto recibido: ${JSON.stringify(product.data, null, '\t')}`); 
    }catch(error){
        logger.error(`Se presenta error en prueba de endpoint ${endpoint} : ${error}`);
    }finally{
        logger.info(`Finaliza prueba de endpoint ${endpoint}`);
    }
}

if (endpoint === 'updateById' && id){
    logger.info(`Se inicia prueba de endpoint ${endpoint}`);
    try{
        let product = await updateById(id, data, admin);
        logger.info(`Producto recibido: ${JSON.stringify(product.data, null, '\t')}`); 
        logger.info(`Finaliza prueba de endpoint ${endpoint}`);
    }catch(error){
        logger.error(`Se presenta error en prueba de endpoint ${endpoint} : ${error}`);
    }finally{
        logger.info(`Finaliza prueba de endpoint ${endpoint}`);
    }
}
