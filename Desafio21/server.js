import {Application, Router, send} from "https://deno.land/x/oak@v6.2.0/mod.ts";
import {viewEngine, engineFactory, adapterFactory} from "https://deno.land/x/view_engine@v1.4.5/mod.ts";
const { cwd, stdout } = Deno;

const app = new Application();
const router = new Router();
const PORT = 8080;

const ejsEngine = await engineFactory.getEjsEngine();
const oakAdapter = await adapterFactory.getOakAdapter();
const urlBase = `http://localhost:${PORT}/`;
app.use(async (ctx, next) => {
    // console.log('URL: ', ctx.url.pathname)
    // if(ctx.url.pathname !== urlBase){
        await send(ctx, ctx.request.url.pathname,{
        root: `${cwd()}/public`,
        })
    // }
    next();
});

app.use(viewEngine(oakAdapter,ejsEngine));

let colors = [{
    id: "qI8iqQw0kBIT",
    fecha: "2023-04-10T00:27:07.911Z",
    color: "red"
}];

router.get("/", (ctx) => {
    ctx.render(`${cwd()}/views/pages/index.ejs`, {colors});
})

router.get("/colors", (ctx) => {
    ctx.response.body = colors;
})

router.post("/", async (ctx) => {
    const newColor = await ctx.request.body().value;
    console.log('Color recibido: ', newColor);
    // const newColorJS = JSON.parse(newColor);
    // console.log('Color recibido JSON: ', newColorJS);
    colors.push(newColor)
    // ctx.response.headers.set("Content-Type", "application/json");
    // ctx.response.body = newColor.id;
    // ctx.response.status = 200;
    console.log('Se ha guardado el color con id: ', newColor.id);
})

app.use(router.routes());
app.use(router.allowedMethods());
console.log(`Servidor escuchando en el puerto ${PORT}`);
await app.listen({port: PORT, hostname: "127.0.0.1"});