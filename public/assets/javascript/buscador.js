const selectBuscador = document.querySelector("#selectBuscador");
const formMascota=document.querySelector("#formMascota");
const formDueno=document.querySelector("#formDueno");

selectBuscador.addEventListener('change', (event) => {
    let valor=event.target.value;
    formMascota.innerHTML=``
    formDueno.innerHTML=``

    if (valor==="dueno"){
        formDueno.innerHTML=`
            <label for="rut">Rut</label>
            <input type="text" class="form-control" name="rut"  placeholder="Indique rut en formato XXXXXXXX-X" required>
        <br>
        `
    }
    else if(valor==="mascota"){
        formMascota.innerHTML=`
            <label for="nombre">Nombre</label>
            <input type="text" class="form-control" name="nombre"  placeholder="Indique el nombre de la mascota" required>
        <br>
        `
    }
});

