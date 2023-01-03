import ContenedorArchivo from '../ContenedorArchivo.class.js';
import ContenedorMongoAtlas from '../ContenedorMongoAtlas.class.js';

export async function saveMessage(msg) {
    const messages = new ContenedorArchivo('./mensajes.json');
    const newMessage = await messages.save(msg);
    const messagesMongoAtlas = new ContenedorMongoAtlas('messages');
    const newMessageMongoAtlas = await messagesMongoAtlas.save(msg);
    return newMessageMongoAtlas;
} 

export async function getMessages() {
    const messages = new ContenedorArchivo('./mensajes.json');
    const allMessages = await messages.getAll();
    const messagesMongoAtlas = new ContenedorMongoAtlas('messages');
    let allMessagesMongoAtlas = await messagesMongoAtlas.getAll();
    (allMessagesMongoAtlas[0]?.fecha) ?? (allMessagesMongoAtlas = allMessagesMongoAtlas.map( (msg) => ({...msg._doc, fecha: new Date(msg._id.getTimestamp()).toLocaleString('en-GB')})))
    return allMessagesMongoAtlas;
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