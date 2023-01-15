import express from 'express';

const { Router } = express;
export const login = new Router();

login.get('/', (req, res) => {
    res.render('pages/login')
})

// login.post('/', (req, res) => {
//     if(req.headers.user){
//         console.log(req.headers.user);
//         res.redirect('http://localhost:8080/home')
//     }else{
//         res.send({Error: 'Usuario no autenticado'})
//     }
// })