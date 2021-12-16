import express from 'express';
import upload from '../services/upload.js';
import Contenedor from '../class/manager.js';
import {io} from '../server.js';
import Products from '../services/productsServer.js';

const router =express.Router();


const productsService = new Products();
/*GET */
router.get('/',(req,res)=>{
    productsService.getAll().then(result =>{
        console.log(result)
        if (result.status==='success') {
            res.status(200).send(result.payload);  
        }else{
            res.status(404).send(result.message);
        }
    })
});

router.get('/:pid', async (req, res)=>{
    const productId = parseInt(req.params.pid);
    let datos = await productsService.getById(productId);
    if (datos.status === 'success') {
        res.send(datos.payload)
    }else{
        res.send(datos.message)
    }
});


/*POST---> con socket conecto la funcion de socket y con emit llamo el evento establecido en index.js*/

router.post('/', upload.single('image'),(req, res)=>{

    let file = req.file;
    let product = req.body;
    if (!product.name) return res.send({status:"error", message:"No se como se llama esto, porfa ponle un nombre"})
    if(!product.price) return res.send({status:"error", message:"Lo siento, pero necesito saber a que precio venderlo"})
    if(!product.stock) return res.send({status:"error", message:"No se cuanto producto hay en la tienda"})
    product.price= parseInt(product.price)
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/img/'+file.filename;
    productsService.addObject(product).then(result=>{
        res.send(result);
        if (result.status=== 'success') {
            productsService.getAll().then(result=>{
                io.emit('updateProduct', result);
            }
            )
        }
    })
})

/*PUT */
router.put('/:pid', upload.single('image'),(req, res)=>{
    let body = req.body;
    let file = req.file;
    body.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/img/'+file.filename;
    let id = parseInt(req.params.pid);
    productsService.updateProduct(id,body).then(result=>{
        res.send(result.message);
    })
});

/*DELETE */
router.delete('/:pid',(req, res)=>{
    let id= parseInt(req.params.pid);
    productsService.deleteById(id).then(result=>{
        res.send(result)
    })
})





export default router;