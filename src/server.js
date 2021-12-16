import express from 'express';
import upload from './services/upload.js';
import { engine } from 'express-handlebars';
import productRouter from './routes/products.js';
import cartRouter from './routes/cartRouter.js'
import Contenedor from './class/manager.js';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import {authMiddle, fechaActual} from './utils.js'
import Productos from './services/productsServer.js'
const manager=new Contenedor();
const productos= new Productos();
const app= express();

const PORT = 8080;
//8080,8081,3000,3001----process.env.port

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
app.use('/api/cart',authMiddle, cartRouter)



/*Vistas de Handlebars--->  traigo plantilla con data */

app.get('/views/products',(req, res)=>{
    productos.getAll().then(result=>{
        let info = result.payload;
        let prepareObject={
            list : info
        }
        res.render('products', prepareObject);
    })
})

app.get('/views/:pid',(req, res)=>{
    const productId = parseInt(req.params.pid);
    productos.getById(productId).then(result=>{

        let info = result.payload;
        let prepareObject={
            product : info
        }

        res.render('productId', prepareObject);
    })
})


/*RUTA NO IMPLEMENTADA---ERROR NOT FOUND----> al final de las rutas*/
app.use(function(req, res){
    res.status(404).send(`{ error : -2, descripcion: ruta '/404' método 'GET' no implementada}`);
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

/*SOCKET Productos en tiempo real*/
/*Comentarios array socket */
let comentarios=[];





io.on('connection',async socket=>{
    console.log(`Socket ${socket.id} esta conectado ahorita`)
    let products= await productos.getAll();
    socket.emit('updateProduct',products);
    socket.on('message',data=>{
        console.log(data)
    })

});

/* Socket ChatComents*/

io.on('connection',socket=>{
    socket.emit("messagelog",comentarios);
    
    socket.on('message',data=>{
        comentarios.push({id:socket.id,time:fechaActual,message:data})
        io.emit('messagelog',comentarios)
    })
})

