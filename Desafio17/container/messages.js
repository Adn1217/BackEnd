
import ContainerFactory from './ContainerFactory.class.js';
import {schema, normalize, denormalize} from 'normalizr';
import logger from '../logger.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

const messagesCollection = process.env.DB_MESSAGES_COLLECTION;
const normMessagesCollection = process.env.DB_NORM_MESSAGES_COLLECTION;

const factory = new ContainerFactory();    
const messagesFirebase = factory.createContainer('Firebase', messagesCollection);
const messagesFirebaseNorm = factory.createContainer('Firebase', normMessagesCollection);
const messagesMongoAtlas = factory.createContainer('MongoAtlas', messagesCollection);
const messagesFile = factory.createContainer('File','./mensajes.json');

export async function getMessages() {
    const allMessages = await messagesFile.getAll();
    let allMessagesMongoAtlas = await messagesMongoAtlas.getAll();
    (allMessagesMongoAtlas[0]?.fecha) ?? (allMessagesMongoAtlas = allMessagesMongoAtlas.map( (msg) => ({...msg._doc, fecha: new Date(msg._id.getTimestamp()).toLocaleString('en-GB')})))
    const allMessagesFirebase = await messagesFirebase.getAll();
    return allMessagesFirebase;
} 

export async function saveMessage(msg) {
    const newMessageFirebase = await messagesFirebase.save(msg);
    const newMessageMongoAtlas = await messagesMongoAtlas.save(msg);
    const newMessage = await messagesFile.save(msg);
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
    const denormMsgFirebase = denormalizeMessage(msg);
    const newMessageFirebase = await messagesFirebaseNorm.save(denormMsgFirebase);
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
    const allMessagesFirebase = await messagesFirebaseNorm.getAll();
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