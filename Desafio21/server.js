import {Application, Router, send} from "https://deno.land/x/oak@v6.2.0/mod.ts";
import {viewEngine, engineFactory, adapterFactory} from "https://deno.land/x/view_engine@v1.4.5/mod.ts";
import { isString } from "https://dev.jspm.io/npm:@jspm/core@2.0.1/nodelibs/util";
const { cwd, stdout } = Deno;

const app = new Application();
const router = new Router();
const PORT = 8080;

const ejsEngine = await engineFactory.getEjsEngine();
const oakAdapter = await adapterFactory.getOakAdapter();
const publicPath = '/public';
app.use(async (ctx, next) => {

    if(ctx.request?.url?.pathname.search(publicPath) >= 0){
        await send(ctx, ctx.request.url.pathname,{
        root: `${cwd()}`,
        })
    }
    else{
        await next();
    }
});

app.use(viewEngine(oakAdapter,ejsEngine));

let colors = [];

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

router.get("/", (ctx) => {
    // console.log(ctx);
    ctx.render(`${cwd()}/views/pages/index.ejs`, {colors});
})

router.get("/colors", (ctx) => {
    ctx.response.body = colors;
})

function saveColor(newColor){
    console.log('Color recibido: ', newColor);
    colors.push(newColor)
    console.log('Se ha guardado el color con id: ', newColor.id);
    return [200, newColor]
}

router.post("/", async ({request, response}) => {
    let newColor = await (await request.body()).value; // value is also a promise!!!!.
    console.log('Body String? ',isString(newColor));
    if (isString(newColor)){
        console.log('JSON object: ', JSON.parse(newColor));
        const newColor2  = JSON.parse(newColor);
        newColor = newColor2;
    }
    console.log('Color recibido: ', newColor);
    newColor.id = randomId();
    newColor.fecha = new Date().toLocaleString("en-GB");
    const data = saveColor(newColor);
    response.status = data[0];
    response.body = data[1];
    console.log('Respuesta del servidor: ', data);
})

app.use(router.routes(), router.allowedMethods());
console.log(`Servidor escuchando en el puerto ${PORT}`);
await app.listen({port: PORT, hostname: "127.0.0.1"});