import express from 'express';

const { Router } = express;
export const login = new Router();

login.get('/', (req, res) => {
    res.render('pages/login')
})

login.get('/logout/:user', (req, res) => {
    let user = req.params.user;
    res.render('pages/logout', {user: user})
})

login.post('/:user', (req, res) => {
    const user = req.params.user;
    if(user){
        req.session.user = user;
    }else{
        res.send({Error: 'Usuario no autenticado'})
    }
})

login.delete('/', (req, res) => {
    console.log('DeletedSesión: ', req);
    const user = req.cookies;
    console.log('DeletedUsuario : ', user);
    if(user){
        req.session.destroy();
        res.send({
            user: user,
            eliminado: 'Ok'})
    }else{
        res.render('pages/login')
    }
})
