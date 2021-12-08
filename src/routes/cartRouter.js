import express from 'express';
import Cart from '../class/cart.js';
import upload from '../services/upload.js';


const router =express.Router();

const carrito =new Cart();

/*GET*/
router.get('/',(req,res)=>{
    carrito.getAll().then(result =>{
        if (result.statuss==='success') {
            res.status(200).send(result.playload);  
        }else{
            res.status(404).send(result.message);
        }
    })
});

/*POST*/
router.post('/',upload.single('image'),(req, res)=>{
    let product = req.body;
    carrito.postCart(product).then(result=>{
        res.send(result);
        if (result.status=== 'success') {
            console.log(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
});

/*PUT*/
router.put('/:pid',upload.single('image'),(req, res)=>{
    let product=req.body;
    let id= parseInt(req.params.pid);
    carrito.putCart(id,product).then(result=>{
        if (result.status=== 'success') {
            res.send(result);
            res.send(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
});
/*DELETE*/
/*Cancelo toda la compra */
router.delete('/',(req, res)=>{
    carrito.deleteCart().then(result=>{
        if (result.status==='success'){
            res.send(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
});
/*Elimino solo un producto del carrito */
router.delete('/:pid',(req, res)=>{
    let id= parseInt(req.params.pid);
    carrito.deleteById(id).then(result=>{
        if (result.status== 'success'){
            res.send(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
})


export default router;