import {serve, ServerRequest} from 'https://deno.land/std@0.100.0/http/server.ts';
import * as dejs from "https://deno.land/x/dejs@0.10.3/mod.ts";
const { cwd, stdout, copy } = Deno;

const PORT = 8080;
const server = serve({port: PORT});
let colors = [{
    id: 1,
    color: 'green'
}];

console.log(`http://localhost:${PORT}`);

async function handleReq(req){
    const query = req.url.replace(/\//g,"");
    const params = new URLSearchParams(query);

    let color = params.get('color');
    if (color){
        color = decodeURIComponent(color);
    }

    console.log('Renderizando....')
    const html = await dejs.renderFile(`${cwd()}/views/pages/index.ejs`, {colors});
    req.respond({
        status: 200,
        body: html
    })
}   
for await (const req of server){
    handleReq(req);
}