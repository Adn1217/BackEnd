import express from 'express';

const { Router } = express;
export const login = new Router();

login.get('/', (req, res) => {
    res.render('pages/login')
})

login.post('/:user', (req, res) => {
    const user = req.params.user;
    if(user){
        req.session.user = user;
    }else{
        res.send({Error: 'Usuario no autenticado'})
    }
})