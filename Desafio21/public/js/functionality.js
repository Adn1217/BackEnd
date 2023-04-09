let port='';
if (port){
    port =`:${port}`
}
const server ='localhost';
const uri = `http://${server}${port}`;

function checkInputs(fields){
    let errorDiv = results;
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

async function sendColor() {
    const fields = [colorInput];
    const valideInputs = checkInputs(fields);
    if(valideInputs){
        let newColor = {
            // fecha: new Date().toLocaleString("en-GB"),
            fecha: new Date(),
            // usuario: userInput.value,
            color: colorInput.value
        }
        const endpoint = graphService ? '/graphql' : '';
        const url = `${uri}/mensajes${endpoint}`;
        const verb = 'POST';
        const response = await fetch(url, { method: verb,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newColor)
        })
        // console.log('Body: ', newMsg);
        const data = await response.json();
        console.log(data);
        // socket.emit('messageRequest','msj')
    }
}
sendColorButton.addEventListener('click', () => sendColor(colorInput.value))