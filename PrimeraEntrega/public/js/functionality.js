
function checkInputs(){
    if(titleInput.value === '' || codeInput.value === '' || priceInput.value === ''
       || stockInput.value === ''|| thumbnailInput.value === ''){
        titleInput.classList.add('errorInput');
        codeInput.classList.add('errorInput');
        priceInput.classList.add('errorInput');
        stockInput.classList.add('errorInput');
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
//-----------PRODUCTS FORM -------------------------
async function submitForm(id) {
    let valideInputs = checkInputs();
    if(valideInputs){
        let newProd = {
            code: codeInput.value,
            title: titleInput.value,
            description: descriptionInput.value,
            price: priceInput.value,
            stock: stockInput.value,
            thumbnail: thumbnailInput.value,
            rol: productRolRadioButton.checked // Se agrega para probar roles en Front
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
        let prod = await response.json();
        if (("error" in prod)){
            results.classList.add('errorLabel');
            results.innerHTML=`<h1>Error</h1>${JSON.stringify(prod)}</p>`;
        }else{
            results.classList.remove('errorLabel');
            socket.emit("productRequest", "msj");
            idInput.value = '';
            [titleInput.value, descriptionInput.value, codeInput.value, priceInput.value, stockInput.value, thumbnailInput.value] = ['','','','','',''];
        }
        console.log(prod);
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
        let prods = await response.json();
        console.log("productos: ",prods)
        results.innerHTML= tableRender(prods);
        // console.log(data);
        // results.innerHTML=`<h1>Respuesta</h1><p><strong>Productos: <br></strong>${JSON.stringify(data)}</p>`;
}

async function getOneProduct(id){
        if (id === ''){
            idInput.classList.add('errorInput');
            results.classList.add('errorLabel');
            results.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        }else{
            idInput.classList.remove('errorInput');
            results.classList.remove('errorLabel');
            let response = await fetch(`http://localhost:8080/productos/${id}`, { method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            let prod = await response.json();
            if (("error" in prod)){
                results.classList.add('errorLabel');
                results.innerHTML=`<h1>Error</h1>${JSON.stringify(prod)}</p>`;
            }else{
                results.classList.remove('errorLabel');
                results.innerHTML= tableRender(prod.producto);
            }
            console.log(prod);
            // socket.emit('oneProductRequest', parseInt(id));
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
            let response = await fetch(`http://localhost:8080/productos/${id}`, { method: 'DELETE',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Auth: productRolRadioButton.checked
                }
            })
            let prod = await response.json();
            if (("error" in prod)){
                console.log("Error", prod);
                results.classList.add('errorLabel');
                results.innerHTML=`<h1>Error</h1>${JSON.stringify(prod)}</p>`;
            }else{
                console.log("Producto eliminado: ", prod);
                results.classList.remove('errorLabel');
                socket.emit("productRequest", "msj");
                idInput.value = '';
            }
        }
}


//---------CARTS FORM----------------------------------
async function getAllCarts(){
    cartResults.classList.remove('errorLabel');
    idCartInput.classList.remove('errorInput');
    idProdInput.classList.remove('errorInput');
    let response = await fetch('http://localhost:8080/carrito/?', { method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
    let carts = await response.json();
    console.log("Carritos: ",carts)
    // results.innerHTML= tableRender(carts);
    cartResults.innerHTML=`<h1>Respuesta</h1><p><strong>Carritos: <br></strong>${JSON.stringify(carts)}</p>`;
    idCartInput.value = '';
    idProdInput.value = '';
}


async function getOneCart(id){
        if (id === ''){
            idCartInput.classList.add('errorInput');
            cartResults.classList.add('errorLabel');
            cartResults.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        }else{
            idCartInput.classList.remove('errorInput');
            idProdInput.classList.remove('errorInput');
            cartResults.classList.remove('errorLabel');
            let response = await fetch(`http://localhost:8080/carrito/${id}/productos`, { method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            let cart = await response.json();
            if (("error" in cart)){
                cartResults.classList.add('errorLabel');
                cartResults.innerHTML=`<h1>Error</h1>${JSON.stringify(cart)}</p>`;
            }else{
                cartResults.classList.remove('errorLabel');
                // cartResults.innerHTML= tableRender(prod.producto);
                cartResults.innerHTML=`<h1>Respuesta</h1><p><strong>ProductosCarrito${id}: <br></strong>${JSON.stringify(cart)}</p>`;
                idCartInput.value = '';
            }
            idProdInput.value = '';
            console.log(cart);
            // socket.emit('oneProductRequest', parseInt(id));
        }
}

async function deleteOneProductInCart(idCart, idProd){
        if (idCart === '' || idProd === ''){
            idCartInput.classList.add('errorInput');
            idProdInput.classList.add('errorInput');
            cartResults.classList.add('errorLabel');
            cartResults.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        }else{
            idCartInput.classList.remove('errorInput');
            idProdInput.classList.remove('errorInput');
            cartResults.classList.remove('errorLabel');
            cartResults.classList.remove('errorLabel');
            let response = await fetch(`http://localhost:8080/carrito/${idCart}/productos/${idProd}`, { method: 'DELETE',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            let prod = await response.json();
            if (("error" in prod)){
                console.log("Error", prod);
                cartResults.classList.add('errorLabel');
                cartResults.innerHTML=`<h1>Error</h1>${JSON.stringify(prod)}</p>`;
            }else{
                console.log("Producto eliminado: ", prod);
                cartResults.classList.remove('errorLabel');
                cartResults.innerHTML=`<h1>Respuesta</h1><p><strong>ProductoEliminadoDelCarrito${idCart}: <br></strong>${JSON.stringify(prod)}</p>`;
                // socket.emit("productRequest", "msj");
                idCartInput.value = '';
                idProdInput.value = '';
            }
        }
}

async function deleteOneCart(id){
        if (id === ''){
            idCartInput.classList.add('errorInput');
            cartResults.classList.add('errorLabel');
            cartResults.innerHTML=`<p>Los campos resaltados son obligatorios</p>`;
        }else{
            idCartInput.classList.remove('errorInput');
            idProdInput.classList.remove('errorInput');
            cartResults.classList.remove('errorLabel');
            let response = await fetch(`http://localhost:8080/carrito/${id}`, { method: 'DELETE',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            let cart = await response.json();
            if (("error" in cart)){
                console.log("Error", cart);
                cartResults.classList.add('errorLabel');
                carResults.innerHTML=`<h1>Error</h1>${JSON.stringify(cart)}</p>`;
            }else{
                console.log("Carrito eliminado: ", cart);
                results.classList.remove('errorLabel');
                // socket.emit("productRequest", "msj");
                cartResults.innerHTML=`<h1>Respuesta</h1><p><strong>Carrito${id}Eliminado: <br></strong>${JSON.stringify(cart)}</p>`;
                idCartInput.value = '';
                idProdInput.value = '';
            }
        }
}


//-----------MESSAGES----------------------------------------
async function sendMessage() {
    let valideInputs = checkMsgInputs();
    if(valideInputs){
        let newMessage = {
            fecha: new Date().toLocaleString("en-GB"),
            usuario: userInput.value,
            mensaje: msgInput.value
        }
        let url = 'http://localhost:8080/mensajes';
        let verb = 'POST';
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
//------PRODUCTS FORM---------------------------
submitButton.addEventListener('click', () => submitForm())
getAllButton.addEventListener('click', getAllProducts)
getOneButton.addEventListener('click', () => getOneProduct(idInput.value))
updateButton.addEventListener('click', () => updateProduct(idInput.value))
deleteOneButton.addEventListener('click', () => deleteOneProduct(idInput.value))

//------CARTS FORM-----------------------------------

getAllCartsButton.addEventListener('click', getAllCarts)
getCartButton.addEventListener('click', () => getOneCart(idCartInput.value))
deleteProductInCartButton.addEventListener('click', () => deleteOneProductInCart(idCartInput.value, idProdInput.value));
deleteCartButton.addEventListener('click', () => deleteOneCart(idCartInput.value))

//-------MESSAGES------------------------------------
sendMsgButton.addEventListener('click', () => sendMessage())