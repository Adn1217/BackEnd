import ContenedorArchivo from '../ContenedorArchivo.class.js';
import ContenedorMongoAtlas from '../ContenedorMongoAtlas.class.js';
import ContenedorFirebase from '../ContenedorFirebase.class.js';
import {schema, normalize, denormalize} from 'normalizr';


function normalizeMessage(msg){
    const authorSchema = new schema.Entity('author');
    const messageSchema = new schema.Entity('message',{
        author: authorSchema
    });
    const msgsSchema = new schema.Entity('messages', {
        msj: [messageSchema]
    }, {idAttribute: 'type'})

    const normalizedMessage = normalize(msg, msgsSchema);
    return normalizedMessage;
}

function denormalizeMessage(msg){
    const normalizedMessage = msg;
    const messageSchema = new schema.Entity('message',{
    });
    const msgsSchema = new schema.Entity('messages', {
        message: [messageSchema]
    }, {idAttribute: 'type'})
    const denormalizedMessage = denormalize(normalizedMessage.result, msgsSchema, 
    normalizedMessage.entities);
    return denormalizedMessage;
}

export async function saveNormalizedMessage(msg){
    const messagesFirebase = new ContenedorFirebase('normMsgs');
    const denormMsgFirebase = denormalizeMessage(msg);
    const newMessageFirebase = await messagesFirebase.save(denormMsgFirebase);
    return newMessageFirebase;
}

export async function saveMessage(msg) {
    const messagesFirebase = new ContenedorFirebase('messages');
    const newMessageFirebase = await messagesFirebase.save(msg);
    const messagesMongoAtlas = new ContenedorMongoAtlas('messages');
    const newMessageMongoAtlas = await messagesMongoAtlas.save(msg);
    const messages = new ContenedorArchivo('./mensajes.json');
    const newMessage = await messages.save(msg);
    return newMessageFirebase;
} 

export async function getMessages() {
    const messages = new ContenedorArchivo('./mensajes.json');
    const allMessages = await messages.getAll();
    const messagesMongoAtlas = new ContenedorMongoAtlas('messages');
    let allMessagesMongoAtlas = await messagesMongoAtlas.getAll();
    (allMessagesMongoAtlas[0]?.fecha) ?? (allMessagesMongoAtlas = allMessagesMongoAtlas.map( (msg) => ({...msg._doc, fecha: new Date(msg._id.getTimestamp()).toLocaleString('en-GB')})))
    const messagesFirebase = new ContenedorFirebase('messages');
    const allMessagesFirebase = await messagesFirebase.getAll();
    return allMessagesFirebase;
} 

export async function getNormMessages() {
    const messagesFirebase = new ContenedorFirebase('normMsgs');
    const allMessagesFirebase = await messagesFirebase.getAll();
    console.log('Mensajes desde Firebase', allMessagesFirebase);
    let newAllMessages  = [];
    let cont = 0;
    allMessagesFirebase.forEach((msg) => {
        let message = {};
        message.id = cont;
        message.msj = msg[0];
        newAllMessages.push(message);
        cont +=1;
    })
    newAllMessages = {type: 'msgList', messages: newAllMessages};
    console.log(newAllMessages);
    const allNormMessagesFirebase = normalizeMessage(newAllMessages);
    return allNormMessagesFirebase;
} 

export async function showMsgs(res) {
    const allMessages = await getMessages();
    // console.log('Los mensajes son: \n', allMessages);
    res.render('pages/index', {msgs: allMessages})
}

export async function doSaveMessage(res, msg) {
    const newMsg = await saveMessage(msg); 
    res.send({Guardado: newMsg})
}

export async function doSaveNormMessage(res, msg) {
    const newMsg = await saveNormalizedMessage(msg); 
    res.send({Guardado: newMsg})
}