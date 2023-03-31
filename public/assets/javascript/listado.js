axios
.get("http://localhost:3000/api/mascotas")
.then((response) => {
    lista(response.data);
})
.catch(function (error) {
    console.log(error);
});

let lista=(data)=>{
    const resp=document.querySelector("#lista")
    let informacion=``
    for (let dato of data){
        let dueno=dato.dueño
        let mascotas=dato.mascotas
        let infoMascotas=``
        for(let mascota of mascotas){
            infoMascotas+=`<li>${mascota.nombreM} (${mascota.tipo})</li>`
        }
        informacion+=`
        <b>${dueno.nombreD}</b> (${dueno.rut}) 
        <ul>${infoMascotas}</ul>
        `
    }
    resp.innerHTML=`<div class="m-3">${informacion}</div>`
}