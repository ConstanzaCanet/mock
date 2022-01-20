let form = document.getElementById('registerForm');

form.addEventListener('submit',function(event){
    event.preventDefault();
    let info= new FormData(form);
    let sendObject={
        first_name:info.get('first_name'),
        last_name:info.get('last_name'),
        user_name:info.get('user_name'),
        age:info.get('age'),
        email:info.get('email'),
        password:info.get('password'),
    }
    fetch('api/users',{
        method:"POST",
        body:JSON.stringify(sendObject),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(result=>result.json()).then(json=>{
        form.reset();
        alert({
            message:'Exelente, estas logueado!'
        })
    })
})