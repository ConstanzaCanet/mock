import fs from 'fs';
import __dirname from '../utils.js';

const proURL= __dirnameproURL;


class Cart {

    /*funcion que cree el carrito---> POST*/
    async postCart(body){
        try{
        let data = await fs.promises.readFile(proURL,'utf-8')
        let carroP = JSON.parse(data);
        let products = carroP.products
        let id=carroP.id

        
        if(products.some(element => element.id === body.id)){//Si existe
            return {satatus:'error', message: "Cuidado, ese producto ya esta en el carro!"}
        }else{//Si no existe
            products.push(body)
            const objeticosN= {id, products}
        try{
        await fs.promises.writeFile(proURL,JSON.stringify(objeticosN,null,2));
        return {status:"success",message:"Nuevo producto en el carro"}
        }catch(err){
        return {status:"error", message:"No se pudo adquirir"}
        }
        }
        }catch{
        //El archivo no existe, entonces hay que crearlo.
        let products=[body]
        let id=Date.now()
        let carro = {id, products}
        try{
        await fs.promises.writeFile(proURL,JSON.stringify(carro,null,2))
        return {status:"success",message:`carrito con numero de tiket: ${carro.id}`}
        }catch(error){
        return {status:"error",message:"No se pudo crear: "+error}
        }
        }
        };
    
    /*Mostrar carrito ---> GET */

    async getAll(){
        try{
            const carro= await fs.promises.readFile(proURL, 'utf-8');
            const data= JSON.parse(carro)
            return {statuss: "success", playload:data};
        }catch(error){
            return {status:'error', message:'Me parece que no hay nada...'}
        }
    }

    /*Actualizar los elementos del carrito --> PUT*/
    async putCart(body){
        try {
            let data = await fs.promises.readFile(proURL,'utf-8')
            let carroP = JSON.parse(data);
            let products = carroP.products
            let id=carroP.id

            
            const elementoX = products.filter(element => element.id === body.id);
            if (elementoX.length > 0) {

                const filtrado = products.filter(element => element.id != body.id);
                filtrado.push(body)

                products= Object.assign(filtrado)

                const objeticosN= {id, products}
                try{
                await fs.promises.writeFile(proURL,JSON.stringify(objeticosN,null,2));
                return {status:"success",message:"Cambiaste atributos en tu carrito"}
                }catch(err){
                return {status:"error", message:"No se pudo cambiar"}
                }
            }else{
                return {status: "error", message:'Eso no lo tenemos'}
            }
  
        } catch (error) {
            return {status:"error",message:"No se pudo cambiar: "+error}
        }
    }

    /*DELETE*/
    /*Por id, borro solo un producto del carrito */
    async deleteById(Productid){
        try{
            const array= await fs.promises.readFile(proURL,'utf-8')
            const data= JSON.parse(array)
            let products = data.products
            let id=data.id

            const filtrado = products.filter(element => element.id != Productid);
            if (filtrado.length != 0){
                products = Object.assign(filtrado)
                const objeticosN= {id, products}
            
            try{
                await fs.promises.writeFile(proURL,JSON.stringify(objeticosN,null,2));
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
    async deleteCart(){
        try {
            await fs.promises.unlink(proURL,'utf-8')
            return {status:"success",message:"La compra fue anulada con exito"}

        } catch (error) {
            return {status:"error",message:"No se puede cancelar la compra, error: "+error}
        }
    }

};

export default Cart;
