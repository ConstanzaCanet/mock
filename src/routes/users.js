import express from 'express';
const router = express.Router();
import { user } from '../daos/index.js';
import upload from '../services/upload.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from '../config.js'


let urlSession=process.env.STORE||"mongodb+srv://Constanza:Konecta+865@products.fq2mz.mongodb.net/session?retryWrites=true&w=majority"
export const baseSession = (session({
    store:MongoStore.create({mongoUrl:config.store}),
    resave:config.resave,
    saveUninitialized:false,
    secret:config.secret
}))

router.use(baseSession)

router.post('/',(req,res)=>{
    let Newuser = req.body;
    user.addObject(Newuser).then(result =>{
        res.send(result)
        console.log(result)
    })
}) 


router.get('/',(req,res)=>{
    user.getAll().then(result =>{
        res.send(result)
    })
})


router.get('/:uid',(req,res)=>{
    let id= req.params.uid;
    user.getById(id).then(result=>{
        res.send(result);
    })
})            


router.put('/:uid',(req,res)=>{
    let id= parseInt(req.params.uid)
    let body = req.body;
    user.update(id,body).then(result=>{
    res.send(result)
    })
})  
/*Registro de usuarios */


router.post('/login',upload.none(),async(req, res)=>{
    let {email, password}= req.body;
    console.log(email)
    if(!email||!password) return res.status(400).send({message:"Amigo te falta data"})
    const userSerch = await user.getBy(email)
    console.log(userSerch)
    if (!userSerch) return res.status(404).send({message:'no encuentro ese usuario'})
    if (userSerch[0].password!== password){
        console.log('olvidaste tu contraseña? Vuelve a intentar')
        return res.status(404).send({message:'Contraseña no valida'})
    }else{
        
        req.session.user={
            username:userSerch[0].user_name,
            email:userSerch[0].email
        }
        console.log(req.session.user)
        return res.send({status:'logged'})

    }
})


router.delete('/:uid',(req,res)=>{
    let id= parseInt(req.params.uid)
    user.deleteById(id).then(result=>{
        res.send(result)
    })

    
})


export default router;