import admin from 'firebase-admin';
import config from '../config.js';
import { cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../ecommerce-a50a0-firebase-adminsdk-88v5d-b223104bd4.json');

admin.initializeApp({
    credential:cert(serviceAccount),
    databaseURL:config.fb.baseUrl
})
const db = getFirestore()

export default class FirebaseContainer{
    constructor(currentCollection){
     this.currentCollection = db.collection(currentCollection);
  }

    getAll=  async() =>{
        try {            
            const data= await this.currentCollection.get();
            const dataDos = data.docs;
            const result = dataDos.map(docu=>docu.data())
            return {status:"success",payload:result}
        } catch (error) {
            return {status:"error", message:"Ayyyyy algo fallo amigo!"}
        }
    }

    getById = async (id)=>{
        try {
            const data = this.currentCollection.doc(id);
            let result = await data.get()
            let finish = result.data()
            if (finish!= undefined) {                
                return {status:"success",payload:finish}
            }else{
                return {status: "success", message:'Lo siento compañero pero ese objeto no se encuentra'}
            }
        } catch (error) {
            return {status:"error", message:"Oy! vigila lo que hiciste hay algo que no me cuadra! U.U"}
        }
    }

    addObject= async (body)=>{

        try {
            let doc = this.currentCollection.doc()
            let result = await doc.set(body)
            return {status:"success",payload:result} 
        } catch (error) {
            console.log(error)
            return {status:"error", message:"Algo en todo esto esta mal, revisa el codigo!"}
        }
    }

    updateProduct = async (id,body)=>{
        try {
            let doc = this.currentCollection.doc(id);
            //valido que exista
            let result = await doc.get()
            let finish = result.data()
            if (!finish) {
                return {status:"error", message:"mmmmm lo he buscado y aqui no esta, el universo se lo llevo"}
            }else{
                let result = await doc.update(body)
                return {status:"success",payload:result, message:'Has cambiado los datos exitosamente amigo, felicidades!'}
            }
        } catch (error) {
            return {status:"error", message:"Algo en todo esto esta mal, revisa el codigo!"}
        }
    }

    deleteById = async (id)=>{
        try {
            let doc = this.currentCollection.doc(id);
            //valido que exista
            let result = await doc.get()
            let finish = result.data()
            if (!finish) {
                return {status:"error", message:"mmmmm estas seguro que ese objeto existe? No esta por ningun lado"}
            }else{
                await doc.delete();
                return {status:"success",message:'Exitosamente eliminado, no volveras a ver ese objeto'}
            }
        } catch (error) {
            console.log(error)
            return {status:"error", message:"Algo en todo esto esta mal, revisa el codigo!"}
        }
    }

    //especial del carrito 
    postCart = async (body)=>{
        try {
            if (body.id) {                
                let objeto = {products: [body.id]} 
                let doc = this.currentCollection.doc()
                let result = await doc.set(objeto)
                return {status:"success",payload:result} 
            }else{
                let objeto = {products: []} 
                let doc = this.currentCollection.doc()
                let result = await doc.set(objeto)
                return {status:"success",payload:result} 
            }
        } catch (error) {
            console.log(error)
            return {status:"error", message:"Ayyyyy algo fallo amigo!"}
        }
    }

    postCartId = async (idCart,idProduct)=>{
        let doc = this.currentCollection.doc(idCart);
        let data = await doc.get()
        let finish = data.data()
        let array=finish.products
        if (array.some(element => element === idProduct)){
            return {satatus:'error', message: "No, no, ese producto ya esta!"}
        }else{
            let nuevo =[...array,idProduct]
            let result = await doc.update({products:nuevo})
            return {status:"success",payload:result, message:'Has agregado un producto!'}
        }
    }

    deleteProductById = async (idCart,idProduct)=>{
        let doc = this.currentCollection.doc(idCart);

        let data = await doc.get()
        let finish = data.data()
        //valido que cart exista el carro
        if (!finish) {
            return {status:"error", message:"Oye estoy confundido, no encuentro el carro que me pides :I"}
        }else{
            let array=finish.products
            //valido que exista el producto a eliminar
            if (array.some(element => element === idProduct)){
                let nuevo= array.filter(element=> element != idProduct)
                let result = await doc.update({products:nuevo})
                return {status:"success",payload:result, message:'Has eliminado un producto!'}
            }else{
                return {satatus:'error', message: "No encuentro ese objeto aqui!"}
                
            }
        }
    }
}

