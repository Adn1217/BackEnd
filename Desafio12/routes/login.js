import express from 'express';

const { Router } = express;
export const login = new Router();
export const register = new Router();
export const logout = new Router();

function requireAuthentication(req, res, next){
    if(req.isAuthenticated()){
        next()
    }else{
        res.render('pages/login')
    }
}

login.get('/', (req, res) => {
    res.render('pages/login')
})

register.get('/', (req, res) => {
    res.render('pages/register', {error: null})
})

logout.get('/:user', (req, res) => {
    let user = req.params.user;
    res.render('pages/logout', {user: user})
})

login.post('/:user', (req, res) => {
    const user = req.params.user;
    if(user){
        req.session.user = user;
        // req.session.save();
        res.send({
        Usuario: user,
        Guardado: 'Ok'
    })
    }else{
        res.send({Error: 'Usuario no autenticado'})
    }
})

// register.post('/', (req, res) => {
//     console.log(req.body);
// })

register.get('/failregister', (req, res) => {
    res.render('pages/register', {error: 'El usuario ya existe'})
})

login.delete('/', (req, res) => {
    console.log('DeletedSesión: ', req.session);
    const user = req.session.user;
    console.log('DeletedUsuario : ', user);
    req.session.destroy();
    res.send({
        user: user || 'desconocido',
        eliminado: 'Ok'});
})
