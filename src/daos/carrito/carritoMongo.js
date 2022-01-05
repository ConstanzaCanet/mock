import MongoContainer from '../../contenedores/MongoContainer.js'
import Schema from "mongoose";

export default class CartMongo extends MongoContainer{
    constructor(){
        super(
            'carts',
            {
                products:
                    {
                        type:[{
                            type:Schema.Types.ObjectId,
                            ref:'products'
                        }],
                        default:[] 
                    }
            },{timestamp:true}
        )
    }
}