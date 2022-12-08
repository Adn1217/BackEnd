import Contenedor from '../Contenedor.class.js';

export async function saveMessage(msg) {
    const messages = new Contenedor('./mensajes.json');
    const newMessage = await messages.save(msg);
    return newMessage
} 

export async function getMessages() {
    const messages = new Contenedor('./mensajes.json');
    const allMessages = await messages.getAll();
    return allMessages
} 

export async function showMsgs(res) {
    const allMessages = await getMessages();
    console.log('Los mensajes son: \n', allMessages);
    res.render('pages/index', {msgs: allMessages})
}

export async function doSaveMessage(res, msg) {
    const newMsg = await saveMessage(msg); 
    res.send({Guardado: newMsg})
}