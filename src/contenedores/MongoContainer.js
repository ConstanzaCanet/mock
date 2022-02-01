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
            let documents = await this.collection.find().lean()
            return{status:"success", payload:documents}
        } catch (error) {
            return {status:"error", message:"Ayyyyy algo fallo amigo!"}
        }
    }
    getNormalizChats = async ()=>{
        try {
            let documents = await this.collection.find()
            console.log(documents)
            const users = new schema.Entity('users');
            const message = new schema.Entity('message');
            const posts =new schema.Entity('chats',{
                author:users,
                message:[message]
            });

            const normalizedData = normalize(documents, posts)
            console.log(JSON.stringify(normalizedData,null,2))
            return {status:"success", payload:documents}

        } catch (error) {
            return {status:"error", message:"No puedo normalizar esto amigo! revisa tu codigo!"}
        }
    }


    getById = async (idBuscado)=>{
        try {
            let documents = await this.collection.find({'_id':idBuscado}).lean()
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

    getBy = async (atributo)=>{
        try {
            let document = await this.collection.find({'email':atributo})
            if (document) {
                return document
            }else if(!document){
                return {status:404, message:"no encuentro lo que me pides"}
            }
        } catch (error) {
            return {status:"error", message:"No es que no lo encuentre, es que hay algo que debes revisar en el codigo!Mira:"+error}
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
            console.log(error)
            return {status:"error", message:"Algo en todo esto esta mal, revisa el codigo! Observa el error para que te ayude"+error}
        }
    }
    

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

    update = async(id,body) =>{
        try{
            let docs = await this.collection.findById({ '_id': id }, { '__v': 0 });
            if(docs.length === 0){
                return {status:"success", message:"El id solicitado no tiene información"}
            }else{
                let docs = await this.collection.findByIdAndUpdate(id, { $set: body })
                return{status:"success", payload:docs}
            }
        }catch(error){
            return {status:"error",message:"Error al obtener el documento: " + error}
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