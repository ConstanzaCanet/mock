import FileContainer from "../../contenedores/FileContainer.js";

export default class ProductsFileSystem extends FileContainer{
    constructor(){
        super('objectSaved.txt');
    }
}