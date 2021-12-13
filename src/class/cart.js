import fs from 'fs';
import __dirname from '../utils.js';

const proURL= __dirname+'/files/objectCarrito.txt';


class Cart {

    /*funcion que cree el carrito---> POST*/
    
    async postCart(body){
        try{
        let data = await fs.promises.readFile(proURL,'utf-8')
        let objeticosA = JSON.parse(data);
        let largo = Number(objeticosA.length)
        let arrayN = objeticosA[largo-1].id+1;
        let id= arrayN;
            body = Object.assign({id:id},{timestamp:Date.now()},{productos:[body]})
            const objeticosN=[...objeticosA, body];
        try{
        await fs.promises.writeFile(proURL,JSON.stringify(objeticosN,null,2));
        return {status:"success",message:`carrito con numero de tiket: ${body.id}`}
        }catch(err){
        return {status:"error", message:"No se pudo crear el carrito, algo anda mal!"}
        }
        
        }catch{
        //El archivo no existe, entonces hay que crearlo.
        body = Object.assign({timestamp:Date.now()},{productos:[body]})
        body = Object.assign({id:0}, body)
        try{
        await fs.promises.writeFile(proURL,JSON.stringify([body],null,2))
        return {status:"success",message:`carrito con numero de tiket: ${body.id}`}
        }catch(error){
        return {status:"error",message:"No se pudo crear: "+error}
        }
        }
        };
      
    /*Mostrar carrito ---> GET */

    async getId(id){
        try{
            const carro= await fs.promises.readFile(proURL, 'utf-8');
            const data= JSON.parse(carro)
            const indexBuscado = data.find(element => element.id === id);
            return {statuss: "success", playload: indexBuscado.productos};
        }catch(error){
            return {status:'error', message:'Me parece que no hay nada...'}
        }
    }

    /*Actualizar los elementos del carrito --> POST POR ID DE CARRITO*/
    async postCartId(cartId,body){
        try {
            let data = await fs.promises.readFile(proURL,'utf-8')
            let carroP = JSON.parse(data);
            
            const indexBuscado = carroP.findIndex(element => element.id == cartId);
            if (indexBuscado === -1) {
                return {status:"success", message:'El carrito solicitado no se encuentra'}
            }else{
                let carroX= carroP[indexBuscado];
                if (carroX.productos.find(element=> element.id===body.id)) {
                    return {status:"success", message:"Ese producto ya se encuentra en el carro"}
                }else{
                    carroX.productos.push(body)
                }
                }

                try{
                await fs.promises.writeFile(proURL,JSON.stringify(carroP,null,2));
                return {status:"success",message:"Cambiaste atributos en tu carrito"}
                }catch(err){
                return {status:"error", message:"No se pudo cambiar"}
                }
  
        } catch (error) {
            return {status:"error",message:"No se pudo agregar: "+error}
        }
    }


    /*DELETE*/
    /*Por id, borro solo un producto del carrito */
    async deleteProductById(cartId,Productid){
        try{
            const array= await fs.promises.readFile(proURL,'utf-8')
            const carros= JSON.parse(array)
            const indexBuscado = carros.findIndex(element => element.id == cartId);

            if (indexBuscado === -1){
                return {status:"success", message:"Ese producto ya se encuentra en el carro"}
            
            }else{
                let carroBuscado=carros[indexBuscado]
                carroBuscado.productos = carroBuscado.productos.filter(element=> element.id != Productid)
                
                
                try{
                    await fs.promises.writeFile(proURL,JSON.stringify(carros,null,2));
                    return {status:"success",message:"Chau a ese producto"}
                }catch{
                    return {status:"error", message:"No se pudo eliminar ese producto"}
                }
        }
        }catch{
            return {status:"error", message:"No se pudo eliminar el objetivo"}
        }
    };

    /*DELETE---> borra todo, cancela la compra */
    async deleteCartById(cartId){
        try {
            const array= await fs.promises.readFile(proURL,'utf-8')
            const carros= JSON.parse(array)
            const indexBuscado = carros.findIndex(element => element.id === cartId);
            
            if ( indexBuscado === -1) {
                return {status:"success", message:'Ese carrito no existe'}
            }else{
                carros.splice(indexBuscado,1)
            }
            
            try {
                await fs.promises.writeFile(proURL,JSON.stringify(carros,null,2));
                return {status:"success",message:"Chau a ese carrito"}
            } catch (error) {
                return {status:"error",message:"No se pudo eliminar: "+error}
            }

        } catch (error) {
            return {status:"error",message:"No se puede eliminar este carrito: "+error}
        }
    }


};

export default Cart;
