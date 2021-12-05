import {fileURLToPath} from 'url';
import {dirname} from 'path';


const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);


export const authMiddle = (req,res,next)=>{
    if (!req.auth) res.status(403).send({error:-1, message:'Autorizacion denegada'})
    else next()
}

export default __dirname;