let btnDueno=document.querySelector("#eliminar-dueno")
btnDueno.addEventListener("click",async(event)=>{
    event.preventDefault();
    let rut=document.querySelector("#rut").value
    await axios.delete(`/eliminarRut/${rut}`)
    .then(()=>{console.log("Eliminado")})
    .catch(()=>{console.log(error);});

})

let btnMascota=document.querySelector("#eliminar-mascota")

btnMascota.addEventListener("click",async(event)=>{
    event.preventDefault();
    let rut=document.querySelector("#rutD").value
    let nombreM=document.querySelector("#nombreM").value
    await axios.delete(`/eliminarNombre/${nombreM}/${rut}`)
    .then(()=>{console.log("Eliminado")})
    .catch(()=>{console.log(error);});

})