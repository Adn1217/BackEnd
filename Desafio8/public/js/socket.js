const socket = io();

function tableRender(prods){
    let htmlTableRows = '';
    // console.log('Productos', prods);
    !(prods.id) ? prods.forEach((element) => {
        htmlTableRows += `<tr>
                    <td>${element.id}</td>
                    <td>${element.title}</td>
                    <td>$${element.price}</td>
                    <td><img src="${element.thumbnail}" alt="Imagen de producto ${element.id}"></td>
                    </tr>`
    }) : (
        htmlTableRows += `<tr>
                    <td>${prods.id}</td>
                    <td>${prods.title}</td>
                    <td>$${prods.price}</td>
                    <td><img src="${prods.thumbnail}" alt="Imagen de producto ${prods.id}"></td>
                    </tr>`)

    htmlTableHeaders = `<th>Id</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Imagen</th>`

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
    userInput.setAttribute('disabled', '');
    msgs.forEach((msg) => {
        htmlChat += `<div id="msj" class="rounded-3">
                        <p><strong>${msg.usuario}:</strong><br>${msg.mensaje}<br><em>Recibido el ${msg.fecha}</em></p>
                    </div>`
    })
    return htmlChat;
}

socket.on('welcome', data => {
    console.log(data)
    socket.emit('tablesRequest')
})

socket.on('ready', () => 
    socket.emit('productRequest','msj')
)

socket.on('productos', prods => {
    console.log('Productos: ', prods?.productos || prods);
    if (!("error" in prods)){
        results.innerHTML= tableRender(prods?.productos || prods);
    }
})

socket.on('mensajes', msgs => {
    console.log('mensajes: ', msgs);
    if (!("error" in msgs)){
        chat.innerHTML= chatRender(msgs.msgs);
    }
})

