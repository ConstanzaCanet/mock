import fs from 'fs';
import config from '../config.js'
export default class FileContainer{
    constructor(file_endpoint){
        this.url=`${config.FileSystem.baseUrl}${file_endpoint}`
    }

    getAll= async() =>{
        try {
            let data = await fs.promises.readFile(this.url,'utf-8');
            return {status:"success", payload: JSON.parse(data)}
        } catch (error) {
            return {status:"error", error:"Lo siento amigo no puedo leer eso, hay algo que esta fallando"}
        }
    }

    getById = async (id)=>{
        try {
            let data = await fs.promises.readFile(this.url,'utf-8');
            let objects = JSON.parse(data);
            let search = objects.find(object=>object.id === id)
            if (search) {
                return {status:"success", payload :search}
            }else{
                return {status:"error", message:"No se pudo encontrar lo que buscas, lo siento compañero"}
            }
        } catch (error) {
            return {status:"error", message:"AAAAyyyyy algo fallo amigo!"}
        }
    }

    addObject = async (body)=>{
        try{
            let data = await fs.promises.readFile(this.url,'utf-8')
            let objeticosA = JSON.parse(data);
            let largo = Number(objeticosA.length)
            let arrayN = objeticosA[largo-1].id+1;
            let id= arrayN;
            if(objeticosA.some(element => element.name === body.name)){//Si existe
                return {satatus:'error', message: "No, no, ese objeto ya esta!"}
            }else{//Si no existe
                body = Object.assign(body,{timestamp:Date.now()})
                body = Object.assign({id:id}, body)
                const objeticosN=[...objeticosA, body];
            try{
            await fs.promises.writeFile(this.url,JSON.stringify(objeticosN,null,2));
            return {status:"success",message:"Exelente, agregado"}
            }catch(error){
            return {status:"error", message:"No se pudo agregar, que desastre!"}
            }
            }
            }catch{
            //El archivo no existe, entonces hay que crearlo.
            body = Object.assign(body,{timestamp:Date.now()})
            body = Object.assign({id:0}, body)
            try{
            await fs.promises.writeFile(this.url,JSON.stringify([body],null,2))
            return {status:"success",message:"creado con éxito"}
            }catch(error){
            return {status:"error",message:"No se pudo crear: "+error}
            }
            }
    }

    async updateProduct(id,body){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(pro=>pro.id===id)) return {status:"error", message:"No hay ningún objeto con el id especificado"}
            let result = products.map(pro=>{
                if(pro.id===id){
                        body.timestamp=Date.now()
                        body = {body}
                        body = Object.assign({id:pro.id},body)
                        return body;
                }else{
                    return pro;
                }
            })
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(result,null,2));
                return {status:"success", message:"Objeto actualizado"}
            }catch(error){
                console.log(error)
                return {status:"error", message:"Error al actualizar"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el objeto, mira,mira: "+error}
        }
    }

        /*Elimina el objeto que busco por id*/

        async deleteById(id){
            try{
                let data = await fs.promises.readFile(this.url,'utf-8');
                let array = JSON.parse(data);
                console.log(array)
                if(!array.find(prod=>prod.id===id)) return {status:"error", message:"Ese objetito no esta, prueba de agregarlo"}
                let productsNew = array.filter(prod=>prod.id!=id);
                try{
                    await fs.promises.writeFile(this.url,JSON.stringify(productsNew,null,2));
                    return {status:"success",message:"Chau a ese objetito"}
                }catch{
                    return {status:"error", message:"No se pudo eliminar ese objetito"}
                }
            }catch{
                let data = await fs.promises.readFile(this.url,'utf-8');
                let array = JSON.parse(data);
                return {status:"error", message:"No se pudo eliminar el objetivo"}
            }
        }

        //SPECIAL CARTS

    
        async postCart(body){
            try{
            let data = await fs.promises.readFile(this.url,'utf-8')
            let objeticosA = JSON.parse(data);
            let largo = Number(objeticosA.length)
            let arrayN = objeticosA[largo-1].id+1;
            let id= arrayN;
                body = Object.assign({id:id},{timestamp:Date.now()},{productos:[body]})
                const objeticosN=[...objeticosA, body];
            try{
            await fs.promises.writeFile(this.url,JSON.stringify(objeticosN,null,2));
            return {status:"success",message:`carrito con numero de tiket: ${body.id}`}
            }catch(err){
            return {status:"error", message:"No se pudo crear el carrito, algo anda mal!"}
            }
            
            }catch{
            //El archivo no existe, entonces hay que crearlo.
            body = Object.assign({timestamp:Date.now()},{productos:[body]})
            body = Object.assign({id:0}, body)
            try{
            await fs.promises.writeFile(this.url,JSON.stringify([body],null,2))
            return {status:"success",message:`carrito con numero de tiket: ${body.id}`}
            }catch(error){
            return {status:"error",message:"No se pudo crear: "+error}
            }
            }
            };

            async postCartId(cartId,body){
                try {
                    let data = await fs.promises.readFile(this.url,'utf-8')
                    let carroP = JSON.parse(data);
                    
                    const indexBuscado = carroP.findIndex(element => element.id == cartId);
                    if (indexBuscado === -1) {
                        return {status:"success", message:'El carrito solicitado no se encuentra'}
                    }else{
                            let carroX= carroP[indexBuscado]
                            carroX.productos.push(body)
                        }
        
                        try{
                        await fs.promises.writeFile(this.url,JSON.stringify(carroP,null,2));
                        return {status:"success",message:"Cambiaste atributos en tu carrito"}
                        }catch(err){
                        return {status:"error", message:"No se pudo cambiar"}
                        }
          
                } catch (error) {
                    return {status:"error",message:"No se pudo agregar: "+error}
                }
            }
        

            async deleteProductById(cartId,Productid){
                try{
                    const array= await fs.promises.readFile(this.url,'utf-8')
                    const carros= JSON.parse(array)
                    const indexBuscado = carros.findIndex(element => element.id === cartId);
        
                    if (indexBuscado === -1){
                        return {status:"success", message:"Ese producto ya se encuentra en el carro"}
                    
                    }else{
                        let carroBuscado=carros[indexBuscado]
                        carroBuscado.productos = carroBuscado.productos.filter(element=> element.id != Productid)
                        
                        
                        try{
                            await fs.promises.writeFile(this.url,JSON.stringify(carros,null,2));
                            return {status:"success",message:"Chau a ese producto"}
                        }catch{
                            return {status:"error", message:"No se pudo eliminar ese producto"}
                        }
                }
                }catch{
                    return {status:"error", message:"No se pudo eliminar el objetivo"}
                }
            };
        
}