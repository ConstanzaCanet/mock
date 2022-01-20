import express from 'express';
const router = express.Router();
import { user } from '../daos/index.js';
import upload from '../services/upload.js';

 
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


router.delete('/:uid',(req,res)=>{
    let id= parseInt(req.params.uid)
    user.deleteById(id).then(result=>{
        res.send(result)
    })
})


export default router;