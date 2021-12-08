import {fileURLToPath} from 'url';
import {dirname} from 'path';


const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

/*fecha*/
var d = new Date()
let año=d.getFullYear();
let mes=d.getMonth()+1;
let num=d.getDate();
let dia=new Array(7);
dia[0]="Domingo";
dia[1]="Lunes";
dia[2]="Martes";
dia[3]="Miercoles";
dia[4]="Jueves";
dia[5]="Viernes";
dia[6]="Sabado";

let h=d.getHours();
let m=d.getMinutes();
/*Establezco la fecha y hora para enviar en comentarios */
export const fechaActual= dia[d.getDay()]+' '+num+'/'+mes+'/'+año+' Hora: '+h+':'+m+'hs'






export const authMiddle = (req,res,next)=>{
    if (!req.auth) res.status(403).send({error:-1, message:'Autorizacion denegada'})
    else next()
}

export default __dirname;