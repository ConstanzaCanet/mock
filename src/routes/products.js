import express, { application } from 'express';
import upload from '../services/upload.js';;
import {io} from '../server.js';
import {products,persistence} from '../daos/index.js'

import { generate } from '../utils.js';
import { Mock} from '../faker.js'

const router =express.Router();
/*FAKER GENERADOR DE ARCHIVOS CON DATA ESTABLECIDA */
const mock=new Mock();
router.get('/test',(req,res)=>{
    let testObject=mock.generateProducts();
    res.send({status:'success',productsFake:testObject})
})



/*FAKER--->npm*/
router.get('/testfake',(req,res)=>{
    let cant = req.query.cant?parseInt(req.query.cant):5;
    let products = generate(cant);
    res.send({status:'seccess',payload:products})
})

/*GET */
router.get('/',(req,res)=>{
    products.getAll().then(result =>{
        if (result.status==='success') {
            res.send(result.payload);  
        }else{
            res.send(result.message);
        }
    })
});


router.get('/:pid', (req,res)=>{
    let productId
    if (persistence ==='fileSystem') {
        productId = parseInt(req.params.pid)        
    }else{
        productId = req.params.pid
    }
products.getById(productId).then(result=>{
res.send(result);
})
})


/*POST---> con socket conecto la funcion de socket y con emit llamo el evento establecido en index.js*/

router.post('/', upload.single('image'),(req, res)=>{

    let file = req.file;
    let product = req.body;
    product.price= parseInt(product.price)
    product.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/img/'+file.filename;
    products.addObject(product).then(result=>{
        res.send(result);
        if (result.status=== 'success') {
            products.getAll().then(result=>{
                io.emit('updateProduct', result);
            }
            )
        }
    })
})

/*PUT */
router.put('/:pid', upload.any('image'),(req, res)=>{
    let productId
    if (persistence ==='fileSystem') {
        productId = parseInt(req.params.pid)        
    }else{
        productId = req.params.pid
    }

    let body = req.body;
    let file = req.file;
    if (file) {        
        body.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/img/'+file.filename;
    }
    products.updateProduct(productId,body).then(result=>{
        res.send(result.message);
    })
});

/*DELETE */
router.delete('/:pid',(req, res)=>{
    let productId
    if (persistence ==='fileSystem') {
        productId = parseInt(req.params.pid)        
    }else{
        productId = req.params.pid
    }
    products.deleteById(productId).then(result=>{
        res.send(result)
    })
})





export default router;