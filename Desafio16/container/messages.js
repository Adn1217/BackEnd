
import ContenedorArchivo from './ContenedorArchivo.class.js';
import ContenedorMongoAtlas from './ContenedorMongoAtlas.class.js';
import ContenedorFirebase from './ContenedorFirebase.class.js';
import { messagesCollection} from '../server.js';
import {schema, normalize, denormalize} from 'normalizr';
import logger from '../logger.js';

export async function getMessages() {
    const messages = new ContenedorArchivo('./mensajes.json');
    const allMessages = await messages.getAll();
    const messagesMongoAtlas = new ContenedorMongoAtlas(messagesCollection);
    let allMessagesMongoAtlas = await messagesMongoAtlas.getAll();
    (allMessagesMongoAtlas[0]?.fecha) ?? (allMessagesMongoAtlas = allMessagesMongoAtlas.map( (msg) => ({...msg._doc, fecha: new Date(msg._id.getTimestamp()).toLocaleString('en-GB')})))
    const messagesFirebase = new ContenedorFirebase(messagesCollection);
    const allMessagesFirebase = await messagesFirebase.getAll();
    return allMessagesFirebase;
} 

export async function saveMessage(msg) {
    const messagesFirebase = new ContenedorFirebase(messagesCollection);
    const newMessageFirebase = await messagesFirebase.save(msg);
    const messagesMongoAtlas = new ContenedorMongoAtlas(messagesCollection);
    const newMessageMongoAtlas = await messagesMongoAtlas.save(msg);
    const messages = new ContenedorArchivo('./mensajes.json');
    const newMessage = await messages.save(msg);
    return newMessageFirebase;
} 

function denormalizeMessage(msg){
    const normalizedMessage = msg;
    const authorSchema = new schema.Entity('authorSchema',{},{idAttribute: 'id'});
    const messageSchema = new schema.Entity('messageSchema',{
        author: authorSchema
    }, {idAttribute: 'author'})
    const msgsSchema = new schema.Entity('msgsSchema',{
        messages: [messageSchema]
    }, {idAttribute: 'type'} );
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

function normalizeMessage(msg){
    const authorSchema = new schema.Entity('authorSchema');
    const msjSchema = new schema.Entity('msjSchema',{
        author: authorSchema
    }, {idAttribute: 'id'})
    const msgSchema = new schema.Entity('msgSchema',{
        messages: [msjSchema]
    })
    const messageSchema = new schema.Entity('messageSchema',{
        msj: msgSchema
    }, {idAttribute: 'id'})
    const msgsSchema = new schema.Entity('msgsSchema',{
        messages: [messageSchema]
    }, {idAttribute: 'type'} );

    const normalizedMessage = normalize(msg, msgsSchema);
    return normalizedMessage;
}


export async function getNormMessages() {
    const messagesFirebase = new ContenedorFirebase('normMsgs');
    const allMessagesFirebase = await messagesFirebase.getAll();
    // console.log('Mensajes desde Firebase: ', allMessagesFirebase);
    logger.debug(`Mensajes desde Firebase: ${JSON.stringify(allMessagesFirebase)}`);
    let newAllMessages  = [];
    let cont = 0;
    allMessagesFirebase.forEach((msg) => {
        let message = {};
        message.id = cont;
        message.msj = msg;
        newAllMessages.push(message);
        cont +=1;
    })
    newAllMessages = {type: 'msgList', messages: newAllMessages};
    // console.log('Mensajes desde Firebase restructurados', JSON.stringify(newAllMessages));
    const allNormMessagesFirebase = normalizeMessage(newAllMessages);
    return allNormMessagesFirebase;
} 