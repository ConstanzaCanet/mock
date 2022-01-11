import MongoContainer from '../../contenedores/MongoContainer.js'

export default class ChatsMongo extends MongoContainer{
    constructor(){
        super(
            'chats',
            {
                author:{type:Object, require:true},
                message:{type:String,require:true},
            },{timestamp:true}
        )
    }
}