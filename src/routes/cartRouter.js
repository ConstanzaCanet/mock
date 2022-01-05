import express from 'express';
import upload from '../services/upload.js';
import {carrito, persistence} from '../daos/index.js'

const router =express.Router();



router.get('/',(req, res)=>{
    carrito.getAll().then(result=>{
        res.send(result)
    })
})
/*GET---> trae carrito por su id*/
router.get('/:cid',(req,res)=>{
    let cartId
    if (persistence ==='fileSystem') {
        cartId = parseInt(req.params.cid)        
    }else{
        cartId = req.params.cid
    }
    carrito.getById(cartId).then(result =>{
            res.send(result);  
    })
});
/*POST---> creo carrito y devuelvo id*/
router.post('/',upload.single('image'),(req, res)=>{
    let product = req.body.id;
    carrito.postCart(product).then(result=>{
        res.send(result);
    })
});

/*POST---> agrego producto a carrito existente*/
router.post('/:cid',upload.any('image'),(req, res)=>{
    let cartId
    if (persistence ==='fileSystem') {
        cartId = parseInt(req.params.cid)     
    }else{
        cartId = req.params.cid
    }
    idProduct=req.body.id;
    
    carrito.postCartId(cartId,idProduct).then(result=>{
       res.send(result)
    })
});
/*DELETE*/
/*Cancelo toda la compra----> eliminando el carrito por completo*/
router.delete('/:cid',(req, res)=>{
    let cartId
    if (persistence ==='fileSystem') {
        cartId = parseInt(req.params.cid)     
    }else{
        cartId = req.params.cid
    }
    carrito.deleteById(cartId).then(result=>{
            res.send(result.message)
    })
});
/*DELETE---->Elimino solo un producto del carrito */
router.delete('/:cid/products/:pid',(req, res)=>{
    let cartId
    let idProduct
    if (persistence ==='fileSystem') {
        cartId = parseInt(req.params.cid) 
        idProduct= parseInt(req.params.pid);
    }else{
        cartId = req.params.cid;
        idProduct= req.params.pid;
    }

    carrito.deleteProductById(cartId,idProduct).then(result=>{
        if (result.status== 'success'){
            res.send(result.message)
        }else{
            res.send(result.message);
        }
    })
})


export default router;