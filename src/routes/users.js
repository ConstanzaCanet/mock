import express from 'express';
const router = express.Router();
import { user } from '../daos/index.js';
import upload from '../services/upload.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';


export const baseSession = (session({
    store:MongoStore.create({mongoUrl:"mongodb+srv://Constanza:Konecta+865@products.fq2mz.mongodb.net/sessions?retryWrites=true&w=majority"}),
    resave:false,
    saveUninitialized:false,
    secret:'ChatComents'
}))

router.use(baseSession)


 
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

router.post('/',upload.none(),(req, res)=>{
    let userNew = req.body;
    console.log(userNew)
    try {
        user.addObject(userNew).then(result=>{
            res.send(result)
            let timestamp = Date.now();
            let time = new Date(timestamp);
            return {status:"success", message:'registrado a las '+time.toTimeString().split(" ")[0]}
        })
        
    } catch (error) {
        return {status:"error", message:"el error es:"+error}
    }
})

/*Registro de usuarios */


router.post('/login',upload.none(),async(req, res)=>{
    let {email, password}= req.body;
    console.log(email)
    if(!email||!password) return res.status(400).send({message:"Amigo te falta data"})
    const userSerch = await user.getBy(email)
    console.log(userSerch)
    if (!userSerch) return res.status(404).send({message:'no encuentro ese usuario'})
    if (userSerch[0].password!= password) return res.status(404).send({message:'Contraseña no valida'})
    req.session.user={
        username:userSerch[0].username,
        email:userSerch[0].email
    }
    console.log(req.session.user)
    res.send({status:'logged'})
})


router.delete('/:uid',(req,res)=>{
    let id= parseInt(req.params.uid)
    user.deleteById(id).then(result=>{
        res.send(result)
    })
})


export default router;