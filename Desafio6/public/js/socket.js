const socket = io();
let lastData;

socket.on('welcome', data => {
    console.log(data)
    socket.emit('productRequest','msj')
})

socket.on('productos', data => {
    console.log('Productos: ', data);
    // if (!("error" in data) && lastData !==data){
    //     lastData = data;
        // fetch('http://localhost:8080/productos/');
        // results.innerHTML=`<h1>Respuesta</h1><p>${JSON.stringify(data)}</p>`;
        // !("error" in data) && (window.location.href = 'http://localhost:8080/productos/render')
    // }
})
