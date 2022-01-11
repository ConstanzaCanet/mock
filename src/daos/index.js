let products;
let carrito;
let chats;
let persistence = "mongo";

switch(persistence){
    case "fileSystem": 
        const {default:ProductsFileSystem} = await import('./productos/productsFileSystem.js')
        const { default:CarritoFileSystem } = await import('./carrito/carritoFileSystem.js')
        products = new ProductsFileSystem();
        carrito = new CarritoFileSystem();
        break;
    case "mongo":
        const{ default:ProductsMongo} =await import('./productos/productsMongo.js');
        const { default:CartMongo } = await import('./carrito/carritoMongo.js');
        const { default:ChatsMongo } = await import('./chats/chatsMongo.js');
        products = new ProductsMongo();
        carrito = new CartMongo();
        chats = new ChatsMongo();
        break;
    case "firebase":
        const { default: ProductsFirebase} = await import('./productos/productsFirebase.js');
        const { default: CartsFirebase} = await import('./carrito/carritoFirebase.js');
        products = new ProductsFirebase();
        carrito = new CartsFirebase();
        break;

    default:

    }
    
    
export {products, carrito, persistence,chats}