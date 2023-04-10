let port='8080';
if (port){
    port =`:${port}`
}
const server ='localhost';
const uri = `http://${server}${port}`;

function checkInputs(fields){
    const errorDiv = results;
    let invalide = false;

    fields.forEach((field) => {
            if (field.value === ''){
                field.classList.add('errorInput');
                invalide = true;
            }else{
                field.classList.remove('errorInput');
            }
        })
    if(invalide){
        errorDiv.classList.add('errorLabel');
        errorDiv.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        return false
    }else{
        fields.forEach((field) => {
            field.classList.remove('errorInput');
        })
        if (errorDiv.classList.contains("errorLabel")) {
            errorDiv.classList.remove("errorLabel");
            errorDiv.innerHTML = "";
          }
        return true
    }
}

function randomId(){
    const caracters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i<12; i++){
        const randNum = Math.random();
        const randInt = Math.floor(randNum*caracters.length);
        const randBool = Math.round(Math.random());
        code += (randBool && caracters[randInt].toUpperCase()) ? caracters[randInt].toUpperCase() : caracters[randInt];
    }
    console.log('Codigo generado: ', code);
    return code
}

async function sendColor(color) {
    const fields = [colorInput];
    const valideInputs = checkInputs(fields);
    if(valideInputs){
        const newColor = {
            // fecha: new Date().toLocaleString("en-GB"),
            id: randomId(),
            fecha: new Date(),
            // usuario: userInput.value,
            color: color
        }
        const endpoint = '';
        const url = `${uri}/${endpoint}`;
        console.log(url)
        const verb = 'POST';
        const response = await fetch(url, { method: verb,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newColor)
        })
        console.log('Body: ', newColor);
        const data = await response.json();
        console.log(data);
        // socket.emit('messageRequest','msj')
    }
}
submitButton.addEventListener('click', () => sendColor(colorInput.value))