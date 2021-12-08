import fs from 'fs';
import __dirname from '../utils.js';

const proURL= __dirname+'/files/objectSaved.txt';

let ide=0;
/*Creo la clase contenedor que va a servir para la creacion del archivo que yo quiera */
class Contenedor{

    /*Funcion que guarde objeto en archivo---> Esto reescribe el archivo */
    save(name,price, description,img,stock){
        let data =[
            {
                nombre:name,
                id:ide,
                price:price,
                description:description,
                img:img,
                stock:stock,
                timestamp:Date.now(),
         }
        ];

        try{
            fs.writeFileSync(proURL, JSON.stringify(data))
            return console.log('Exelente');
        }catch(error){
            throw new Error('No se Rick, parece falso... algo salio mal!')
        }
    };
    /*Seleccionar o buscar por id */
    
    async getById(id){
        try{
            let array = await fs.promises.readFile(proURL, 'utf-8')
            let data = JSON.parse(array)
            const elementoX = data.filter(element => element.id === id);
            if (elementoX.length > 0) {
                return { status:'success', playload:elementoX}
            }else{
                return {status: "error", message:'Eso no lo tenemos'}
            }
        }catch(error){
            return {status: "error", message: 'Me parece que no'}
        }
    };

    /*Elimina el objeto que busco por id*/

    async deleteById(id){
        try{
            let data = await fs.promises.readFile(proURL,'utf-8');
            let array = JSON.parse(data);
            console.log(array)
            if(!array.find(prod=>prod.id===id)) return {status:"error", message:"Ese producto no esta, prueba de agregarlo"}
            let productsNew = array.filter(prod=>prod.id!=id);
            try{
                await fs.promises.writeFile(proURL,JSON.stringify(productsNew,null,2));
                return {status:"success",message:"Chau a ese producto"}
            }catch{
                return {status:"error", message:"No se pudo eliminar ese producto"}
            }
        }catch{
            let data = await fs.promises.readFile(proURL,'utf-8');
            let array = JSON.parse(data);
            return {status:"error", message:"No se pudo eliminar el objetivo"}
        }
    }

    /*Muestro todo lo que hay en el archivo */
    async getAll(){
        try{
            const todo= await fs.promises.readFile(proURL, 'utf-8');
            const productos= JSON.parse(todo)
            return {statuss: "success", playload:productos};
        }catch(error){
            return {status:'error', message:`Me parece que no hay nada...:` +error}
        }
    }
    
    /*Creo una funcion que agregue objeto */
    async addObject(body){
        try{
        let data = await fs.promises.readFile(proURL,'utf-8')
        let objeticosA = JSON.parse(data);
        let largo = Number(objeticosA.length)
        let arrayN = objeticosA[largo-1].id+1;
        let id= arrayN;
        if(objeticosA.some(element => element.nombre === body)){//Si existe
            return {satatus:'error', message: "No, no, ese producto ya esta!"}
        }else{//Si no existe
            body = Object.assign(body,{timestamp:Date.now()})
            body = Object.assign({id:id, body})
            const objeticosN=[...objeticosA, body];
        try{
        await fs.promises.writeFile(proURL,JSON.stringify(objeticosN,null,2));
        return {status:"success",message:"Exelente, agregado"}
        }catch(err){
        return {status:"error", message:"No se pudo agregar"}
        }
        }
        }catch{
        //El archivo no existe, entonces hay que crearlo.
        body = Object.assign(body,{timestamp:Date.now()})
        let body = Object.assign({id:id, body})
        try{
        await fs.promises.writeFile(proURL,JSON.stringify([body],null,2))
        return {status:"success",message:"creado con éxito"}
        }catch(error){
        return {status:"error",message:"No se pudo crear: "+error}
        }
        }
        };
    
    /*NUEVO!!!! CAMBIAR PROPIEDADES DE UN PRODUCTO EXISTENTE! */
   
    async updateProduct(id,body){
        try{
            let data = await fs.promises.readFile(proURL,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(pro=>pro.id===id)) return {status:"error", message:"No hay ningún usuario con el id especificado"}
            let result = products.map(pro=>{
                if(pro.id===id){
                        body.timestamp=Date.now()
                        body = {body}
                        body = Object.assign({id:pro.id,...body})
                        return body;
                }else{
                    return pro;
                }
            })
            try{
                await fs.promises.writeFile(proURL,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el producto: "+error}
        }
    }
    /*Elimina todo lo que hay en el archivo ----> hice uno que borra lo que hay adentro */
    deleteAll(){
        fs.truncate(proURL, 0, function(){console.log('eliminado')})
    };
    
    /*Creo uno que elimine el archivo en si */
    deletFile(){
    
        fs.unlink(proURL, error =>{
            if (error) {
                console.log('Upss! Algo salio mal!')
            }else{
                console.log('Objetivo eliminado')
            }
        })
    }

};



export default Contenedor;