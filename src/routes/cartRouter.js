import express from 'express';
import Cart from '../class/cart.js';
import upload from '../services/upload.js';


const router =express.Router();

const carrito =new Cart();

/*GET---> trae carrito por su id*/
router.get('/:cid',(req,res)=>{
    let id= parseInt(req.params.cid);
    carrito.getId(id).then(result =>{
        if (result.statuss==='success') {
            res.status(200).send(result.playload);  
        }else{
            res.status(404).send(result.message);
        }
    })
});

/*POST---> creo carrito y devuelvo id*/
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

/*POST---> agrego producto a carrito existente*/
router.post('/:cid',upload.single('image'),(req, res)=>{
    let product=req.body;
    let id= parseInt(req.params.cid);
    carrito.postCartId(id,product).then(result=>{
        if (result.status=== 'success') {
            res.send(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
});
/*DELETE*/
/*Cancelo toda la compra----> eliminando el carrito por completo*/
router.delete('/:cid',(req, res)=>{
    let id= parseInt(req.params.cid)
    carrito.deleteCartById(id).then(result=>{
        if (result.status==='success'){
            res.send(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
});
/*DELETE---->Elimino solo un producto del carrito */
router.delete('/:cid/products/:pid',(req, res)=>{
    let idP= parseInt(req.params.pid);
    let idC= parseInt(req.params.cid)
    carrito.deleteProductById(idC,idP).then(result=>{
        if (result.status== 'success'){
            res.send(result.message)
        }else{
            res.status(404).send(result.message);
        }
    })
})


export default router;