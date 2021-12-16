import database from "../config.js";

export default class Products{
    constructor(){
        database.schema.hasTable('products').then(result=>{
            if (!result) {
                database.schema.createTable('products',table=>{
                    table.increments();
                    table.string('name').notNullable();
                    table.string('description').notNullable();
                    table.integer('price').notNullable();
                    table.integer('stock').notNullable();
                    table.string('thumbnail').notNullable().defaultTo(false);
                    table.timestamp(true,true);
                }).then(result=>{
                    console.log("se creo producto nuevo")
                })
            }
        })
        
    }

    getAll =  async()=>{
        try {
            let products = await database.select().table('products');
            return {status:"success", payload:products}
        } catch (error) {
            return {status:"error", message:error}
        }

    };

    getById = async (id) =>{
        try {
            let product = await database.select().table('products').where('id',id).first();
            if (product) {
                return {status:"success", payload:product}
            }else{
                return {status:"error", message:'Lo siento eso no esta aqui'}
            }
        } catch (error) {
            return {status:"error", message:error}
        }
    }

    addObject = async (product)=>{
        try {
            let hay= database.table('products').select().where('name',product.name);

            let result =await database.table('products').insert(product)
            return {status:"success", payload:result,message:'Exelente, nuevo producto a la venta!'}
        } catch (error) {
            return {status:"error", message:'maldicion, hay un error, te muestro: '+error}
        }
    }

    updateProduct = async (id,body)=>{
        try {
            let product =  database.table('products').select().where('id',id).first();
            if (product) {
                await database.where('id',id).update(body)
                return {status:"success", payload:result, message:"Cambios ejecutados con exito, tu producto ya no sera el mismo!"}
            }else{
                return {status: "error", message:'Mmmm no encontre ese producto en la tienda...'}
            }
          
        } catch (error) {
            console.log(error)
            return {status:"error", message:error}
        }
    }

    deleteById = async (id)=>{
        try {
            let product =  database.table('products').select().where('id',id).first();
            if (product) {
                await database.table('products').del().where('id',id)
                return {status:"success", message:"Eliminado! ya no hay vuelta atras"}
            }
        } catch (error) {
            return {status:"error", message:error}
        }
    }

}