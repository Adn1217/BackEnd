
process.on('message', cant => {
    
    let conteo = {};
    if(cant) {
        process.send(`Se inicia proceso de conteo para una cantidad de ${cant} números. Este proceso puede tardar varios minutos. Para una cantidad de cien mil números el proceso tarda alrededor de 5 min.`);
        for (let i=0; i<cant; i++){
            // console.log(i);
            let randNumber = Math.floor(Math.random()*cant);
            if (Object.keys(conteo).includes(randNumber.toString())){
                conteo[randNumber] += 1;
            }else{
                conteo[randNumber] = 1;
            }
        }
        process.send(conteo);
        process.exit();
    }
})

process.on('exit', () => {
    console.log('Hilo terminado');
})

process.send('Listo');