export class Mock{
    generateProducts(){
        const names = ['Sanguches', 'Jugos naturales', 'Alfajores de maicena', 'Galletas con chips de chocolate', 'Mermelada de frutilla']
        const prices = [85, 120, 159, 500, 220]
        const images = ['http://localhost:8080/img/1639335105389galletasDeLino.jpg', 'http://localhost:8080/img/1639335043589a1a77120-6b48-478a-868f-691107e62a19.jpg', 'http://localhost:8080/img/1639335015316pan.jpg', 'http://localhost:8080/img/1639334977646pepas.jpg', 'http://localhost:8080/img/1639335170579pepitos.jpg']
        return{
            name:names[Math.floor(Math.random()*5)],
            price:prices[Math.floor(Math.random()*5)],
            image:images[Math.floor(Math.random()*5)]
        }
    }
}