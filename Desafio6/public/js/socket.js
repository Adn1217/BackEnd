const socket = io();

function tableRender(prods){
    let htmlTableRows = '';
    // console.log('Productos', data);
    prods.forEach((element) => {
        htmlTableRows += `<tr>
                    <td>${element.id}</td>
                    <td>${element.title}</td>
                    <td>${element.price}</td>
                    <td>${element.thumbnail}</td>
                    </tr>`
    })

    htmlTableHeaders = `<th>Id</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Thumbnail</th>`

    let htmlTable = `
        <table class="table">
            <thead>
                ${htmlTableHeaders}
            </thead>
            <tbody>
                ${htmlTableRows}
            </tbody>
        </table>`
    return htmlTable;
    }

function chatRender(msgs){
    let htmlChat = '';
    msgs.forEach((msg) => {
        htmlChat += `<div>
                        <p><strong>${msg.usuario}:</strong><br>${msg.mensaje}<br><em>Recibido el ${msg.fecha}</em></p>
                    </div>`
    })
    return htmlChat;
}

socket.on('welcome', data => {
    console.log(data)
    socket.emit('productRequest','msj')
})

socket.on('productos', prods => {
    console.log('Productos: ', prods);
    if (!("error" in prods)){
        results.innerHTML= tableRender(prods.productos);
    }
})

socket.on('mensajes', msgs => {
    console.log('mensajes: ', msgs);
    if (!("error" in msgs)){
        chat.innerHTML= chatRender(msgs.msgs);
    }
})
