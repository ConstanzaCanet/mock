import express from 'express';
import upload from './services/upload.js';
import { engine } from 'express-handlebars';
import productRouter from './routes/products.js';
import cartRouter from './routes/cartRouter.js';
import usersRouter from './routes/users.js';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import {authMiddle, fechaActual} from './utils.js'
import {products, chats, persistence} from './daos/index.js'
import config from './config.js';
/*rutas de desafio */
import infoRouter from './routes/processChild/info.js';
import random from './routes/processChild/random.js';

const app= express();
const PORT = config.PORT;

/*Para el desafio utilizariamos yargs o minimist para pasar el puerto o darle un valor por defecto*/

const server = app.listen( PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});

export const io= new Server(server);



/*Variable que maneja el grado de autorizacion, admin(true) o user(false) */
export const admin= true;

/*PARA EL METODO POST, DEBO CONFIGURAR QUE RECIBE MI APP*/
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    req.auth=admin;
    next();
})
/*Vistas, rutas, midelwere */
app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


app.use(express.static(__dirname+'/public'));
app.use('/api/products', authMiddle,productRouter);
app.use('/api/cart',authMiddle, cartRouter);
app.use('/api/users',usersRouter)

app.use('/api/random',random)
app.use('/info',infoRouter)





/*Vistas de Handlebars--->  traigo plantilla con data */

app.get('/views/products',(req, res)=>{
    products.getAll().then(result=>{
        let info = result.payload;
        let prepareObject={
            list : info
        }
        res.render('products', prepareObject);
    })
})

app.get('/views/:pid',(req, res)=>{
    let productId
    if (persistence ==='fileSystem') {
        productId = parseInt(req.params.pid)        
    }else{
        productId = req.params.pid
    }
    products.getById(productId).then(result=>{

        let info = result.payload;
        let prepareObject={
            product : info
        }

        res.render('productId', prepareObject);
    })
})

/*Normalizr*/

app.get('/norm',(req, res)=>{
    chats.getNormalizChats().then(result=>{
        res.send(result)
    })
})

/*RUTA NO IMPLEMENTADA---ERROR NOT FOUND----> al final de las rutas*/
app.use(function(req, res){
    res.status(404).send(`{ error : -2, descripcion: ruta '/404' m??todo 'GET' no implementada}`);
});


/*MULTER */

app.post('/api/uploadfile', upload.single('image'),(req,res)=>{
    const file= req.file;
    if (!file||file.length==0) {
        res.status(500).send({message: 'No se subio el archivo, algo no esta bien'})
    }
    res.send(file)
})



server.on('error', (error)=> console.log('Algo no esta bien... error: '+error))

/*SOCKET products en tiempo real*/





/*Comentarios array socket */
let comentarios=[];



io.on('connection',async socket=>{
    console.log(`Socket ${socket.id} esta conectado ahorita`)
    let productos= await products.getAll();
    socket.emit('updateProduct',productos);
    socket.on('message',data=>{
        console.log(data)
    })

});

/* Socket ChatComents*/

io.on('connection',socket=>{
    socket.emit("messagelog",comentarios);
    
    socket.on('message',data=>{
        comentarios.push({id:socket.id,time:fechaActual,message:data})
        chats.addObject({author:{user:data.user,id:data.id},message:data.message}).then(result=>{
            res.send(result)
        })
        io.emit('messagelog',comentarios)
    })
})

