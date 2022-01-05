import MongoContainer from '../../contenedores/MongoContainer.js'

export default class ProductMongo extends MongoContainer{
    constructor(){
        super(
            'products',
            {
                name:{type:String, require:true},
                description:{type:String,require:true},
                thumbnail:{type:String, require:true},
                price:{type:String, require:true},
                stock:{type:String, require:true}
            },{timestamp:true}
        )
    }
}