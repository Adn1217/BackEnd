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

async function sendColor(color) {
    const fields = [colorInput];
    const valideInputs = checkInputs(fields);
    if(valideInputs){
        const newColor = {
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
        // console.log('Body: ', newColor);
        const data = await response?.json();
        console.log('Color guardado: ', data);
        const colors = await getColors();
        // console.log(colors);
        let table = '';
        for (let i=0; i <colors.length; i++){
            const row = `<tr style="color:${colors[i]?.color}">
                            <td>${colors[i]?.id}</td>
                            <td>${colors[i]?.fecha}</td>
                            <td>${colors[i]?.color}</td>
                        </tr>`
            table += row;
        }
        // console.log(table);
        tableBody.innerHTML = table;
        colorInput.value = '';
        // socket.emit('messageRequest','msj')
    }
}

async function getColors(){
    const endpoint = 'colors';
    const url = `${uri}/${endpoint}`;
    console.log(url)
    const verb = 'GET';
    const response = await fetch(url, { method: verb,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
    // console.log('Body: ', newColor);
    const data = await response?.json();
    console.log('Colores guardados: ', data);
    return data;
}

submitButton.addEventListener('click', () => sendColor(colorInput.value))