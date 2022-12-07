
function checkInputs(){
    if(titleInput.value === '' || priceInput.value === '' || thumbnailInput.value === ''){
        titleInput.classList.add('errorInput');
        priceInput.classList.add('errorInput');
        thumbnailInput.classList.add('errorInput');
        results.classList.add('errorLabel');
        results.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        return false
    }else{
        titleInput.classList.remove('errorInput');
        priceInput.classList.remove('errorInput');
        thumbnailInput.classList.remove('errorInput');
        idInput.classList.remove('errorInput');
        results.classList.remove('errorLabel');
        results.innerHTML='';
        return true
    }
}

function checkMsgInputs(){
    if(userInput.value === '' || msgInput.value === ''){
        userInput.classList.add('errorInput');
        msgInput.classList.add('errorInput');
        results.classList.remove('errorLabel');
        results.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        return false
    }else{
        userInput.classList.remove('errorInput');
        msgInput.classList.remove('errorInput');
        if (results.classList.contains("errorLabel")) {
            results.classList.remove("errorLabel");
            results.innerHTML = "";
          }
        return true
    }
}

async function submitForm(id) {
    let valideInputs = checkInputs();
    if(valideInputs){
        let newProd = {
            title: titleInput.value,
            price: priceInput.value,
            thumbnail: thumbnailInput.value
        }
        let url = 'http://localhost:8080/productos';
        let verb = 'POST';
        id && (url = url + `/${id}`);
        id && (verb = 'PUT');
        let response = await fetch(url, { method: verb,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProd)
        })
        let data = await response.json();
        !("error" in data) && ([titleInput.value, priceInput.value, thumbnailInput.value] = ['','','']);
        console.log(data);
    }
}

async function updateProduct(id){
    if (id === ''){
        idInput.classList.add('errorInput');
    }else{
        idInput.classList.remove('errorInput');
    }
    await submitForm(id);
}

async function getAllProducts(){
        results.classList.remove('errorLabel');
        let response = await fetch('http://localhost:8080/productos/', { method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
        let data = await response.json();
        // console.log(data);
        results.innerHTML=`<h1>Respuesta</h1><p><strong>Productos: <br></strong>${JSON.stringify(data)}</p>`;
}

async function getOneProduct(id){
        if (id === ''){
            idInput.classList.add('errorInput');
            results.classList.add('errorLabel');
            results.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        }else{
            idInput.classList.remove('errorInput');
            results.classList.remove('errorLabel');
            let response = await fetch(`http://localhost:8080/api/productos/${id}`, { method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            let data = await response.json();
            console.log(data);
            results.innerHTML=`<h1>Respuesta</h1>${JSON.stringify(data)}</p>`;
        }
}

async function deleteOneProduct(id){
        if (id === ''){
            idInput.classList.add('errorInput');
            results.classList.add('errorLabel');
            results.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        }else{
            idInput.classList.remove('errorInput');
            results.classList.remove('errorLabel');
            results.classList.remove('errorLabel');
            let response = await fetch(`http://localhost:8080/api/productos/${id}`, { method: 'DELETE',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            let data = await response.json();
            console.log(data);
            results.innerHTML=`<h1>Respuesta</h1><p><strong>Producto eliminado: <br></strong>${JSON.stringify(data)}</p>`;
            idInput.value = '';
        }
}

async function sendMessage(id) {
    let valideInputs = checkMsgInputs(id);
    if(valideInputs){
        let newMessage = {
            fecha: new Date().toLocaleString("en-GB"),
            usuario: userInput.value,
            mensaje: msgInput.value
        }
        let url = 'http://localhost:8080/mensajes';
        let verb = 'POST';
        id && (url = url + `/${id}`);
        id && (verb = 'PUT');
        let response = await fetch(url, { method: verb,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newMessage)
        })
        let data = await response.json();
        !("error" in data) && ([msgInput.value] = ['']);
        console.log(data);
        socket.emit('messageRequest','msj')
    }
}

submitButton.addEventListener('click', () => submitForm())
getAllButton.addEventListener('click', getAllProducts)
getOneButton.addEventListener('click', () => getOneProduct(idInput.value))
updateButton.addEventListener('click', () => updateProduct(idInput.value))
deleteOneButton.addEventListener('click', () => deleteOneProduct(idInput.value))
sendMsgButton.addEventListener('click', () => sendMessage())