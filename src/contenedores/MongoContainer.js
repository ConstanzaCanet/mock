import mongoose from 'mongoose';
import config from '../config.js'
import { normalize,schema } from "normalizr";

mongoose.connect(config.mongo.baseUrl,{useNewUrlParser:true,useUnifiedTopology:true})


export default class MongoContainer{
    constructor(collection,schema,timestamp){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema,timestamp))
    }

    getAll=  async() =>{
        try {
            let documents = await this.collection.find()
            return{status:"success", payload:documents}
        } catch (error) {
            return {status:"error", message:"Ayyyyy algo fallo amigo!"}
        }
    }
    getNormalizChats = async ()=>{
        try {
            let documents = await this.collection.find()
            const authors= new schema.Entity('autors');
            const message= new schema.Entity('message')

        } catch (error) {
            
        }
    }


    getById = async (idBuscado)=>{
        try {
            let documents = await this.collection.find({'_id':idBuscado})
            if (documents) {
                return {status:"success", payload:documents}
            }else if(documents.length === 0){
                return {status: "error", message:"No esta por ningun lado, lo siento!"}
            }
        } catch (error) {
            console.log(error)
            return {status:"error", message:"No es que no lo encuentre, es que hay algo que debes revisar en el codigo!"}
        }
    }


    addObject = async (object)=>{
        try {
            if (object=== null) {
                return {status:"error", message:"Me parece que eso necesita mas informacion!"}
            }else{
                let result= await this.collection.create(object);
                return {status:"success",payload:result}
            }
        } catch (error) {
            return {status:"error", message:"Algo en todo esto esta mal, revisa el codigo!"}
        }
    }

    /* me surgieron dudas haciendo el update--- deje el que tenia menos codigo
     y el que creo que seria mas correcto, pero dejo el otro por si sirve(al menos para consultar si esta bien o si esta muy mal jeje)


    updateProduct = async (id,body) =>{
        try {
            let documents = await this.collection.updateOne({_id:id},{name:body.name,description:body.description,price:body.price,stock:body.stock,thumbnail:body.thumbnail})
            return {status:"success", payload:documents, message:'Cambiaste cositas de tu objeto exitosamente :D'}
        } catch (error) {
            return {status:"error", message:"Algo en todo esto esta mal, revisa el codigo!"}
        }
    }

    */
    

    updateProduct = async (id,body) =>{
        try {
            let documents = await this.collection.find({ _id: id });
            if (documents.length === 0) {
                return {status:"error",message:"Mmmm estoy perdido, no encuentro lo que me pides"}
            }else{
                let documents = await this.collection.updateOne({_id:id}, {$set:body})
                return {status:"success", payload:documents, message:'Cambiaste cositas en tu objeto exitosamente :D'}
            }     
        } catch (error) {
            console.log(error)
            return {status:"error", message:"Algo chilla, revisa el codigo!"}
        }
    }


    
    deleteById = async (id)=>{
        try {
            await this.collection.deleteOne({_id:id})
            return {status:"success", message:'Objeto eliminado, no volveras a ver a ese pobre objeto...'}
        } catch (error) {
            return {status:"error", message:"Algo en todo esto esta mal, no encuentro mi objetivo!"}
        }
    }


    //especial para el carrito

    postCart = async(object) => {
        try{
            let result = await this.collection.create({object})
            return {status: "success", message: "Has creado un carrito nuevo! Numero de tiket: "+result._id, payload:result}
        }catch(error){
            console.log(error)
            return {status:"error", message:"Algo chilla, revisa el codigo!"}
            
        }
    }


    postCartId = async(CartId,ProductId) => {
        try{
            let result = await this.collection.updateOne({_id:CartId},{$push:{products:ProductId}})
            return {status : "success", message : "Has agregado un producto, exelente!", payload:result}
        }catch(error){
            console.log(error)
            return {status:"error", message:"Algo chilla, revisa el codigo!"}
        }
    }

    deleteProductById = async(CartId,ProductId) => {

        try {
            const result = await this.collection.updateOne({_id:CartId}, {$pull: {products:{_id: ProductId}}});
            console.log(result)
            return {status : "success", message:'Objeto eliminado, no volveras a ver a ese pobre objeto...', payload:result}
        }
        catch (error) {
            console.log(error)
            return {status:"error", message:"Algo sed ha roto, revisa el codigo!"}
        }
    }



}