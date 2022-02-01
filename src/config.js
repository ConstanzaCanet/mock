import __dirname from "./utils.js"
import dotenv from 'dotenv';
import yargs from 'yargs';

dotenv.config();

const args = yargs(process.argv.slice(2));
const processedArgs = args.options({
  port: {
    alias: "p",
    default: 8080,
    describe: "Port to listen",
    type: "number",
  },
}).argv;

export default {
  PORT: processedArgs.port,

  store:process.env.STORE,
  
  resave:process.env.RESAVE,

  secret:process.env.SECRET||"LaclavesecretadeCoder",

  FileSystem:{ 
    baseUrl: __dirname+'/files/'
  },
  mongo:{ 
    baseUrl:"mongodb+srv://Constanza:Konecta+865@products.fq2mz.mongodb.net/ecommerce?retryWrites=true&w=majority"
  },
  fb:{
    baseUrl:"https://ecommerce-a50a0.firebaseio.com"
  }
}


