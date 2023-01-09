import ContenedorArchivo from '../ContenedorArchivo.class.js';
import ContenedorMongoAtlas from '../ContenedorMongoAtlas.class.js';
import ContenedorFirebase from '../ContenedorFirebase.class.js';

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

export async function showMsgs(res) {
    const allMessages = await getMessages();
    // console.log('Los mensajes son: \n', allMessages);
    res.render('pages/index', {msgs: allMessages})
}

export async function doSaveMessage(res, msg) {
    const newMsg = await saveMessage(msg); 
    res.send({Guardado: newMsg})
}