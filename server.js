const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cors());

// rutas
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/views/index.html");
});
app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/public/views/index.html");
});
app.get("/listado.html", (req, res) => {
    res.sendFile(__dirname + "/public/views/listado.html");
});
app.get("/buscador", (req, res) => {
    res.render("buscador",{data:"", error:"", tipo:""});
});
app.get("/registro.html", (req, res) => {
    res.sendFile(__dirname + "/public/views/registro.html");
});
app.get("/eliminar.html", (req, res) => {
    res.sendFile(__dirname + "/public/views/eliminar.html");
});

////////////////////////////////////////////////////////////////////

app.get("/api/mascotas", (req, res) => {
    //leer el archivo y enviar la data a /api/banco
    fs.readFile(__dirname + "/mascotas.json", "utf8", function (err, data) {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        var jsonData = JSON.parse(data);
        res.status(200).send(jsonData);
      }
    });
});

app.get("/buscar", (req, res) => {
    //tomar datos de la busqueda
    let tipo=req.query.tipo;
    let rut=req.query.rut;
    let nombre=req.query.nombre;
    let buscar

    //leer la data
    let data= JSON.parse(fs.readFileSync(__dirname + "/mascotas.json",  'utf-8'));
    
    //si se selecciono un rut buscar en la data, si esta renderizar la informacion, sino mandar el error
    if(rut){
        buscar=(data.find((x)=>{if(x.dueño.rut===rut){return x}}))
        if (buscar){
            res.render("buscador",{data:buscar,tipo:tipo, error:""})
        }
        else{
            res.render("buscador",{data:"",tipo:"",error:"Rut no encontrado"})
        }
    }
    //lo mismo del rut pero con el nombre
    else if(nombre){
        buscar=(data.find(
            (x)=>{ return x.mascotas.find((mascota) => mascota.nombreM.toLowerCase() === nombre.toLowerCase());}
        ))
        if (buscar){
            res.render("buscador",{data:{nombre:nombre, data:buscar}, tipo:tipo, error:""})
        }
        else{
            res.render("buscador",{data:"",tipo:"", error:"Mascota no encontrada"})
        }
    }


});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/registroMascota", (req, res) => {
    //recibir data del formulario
    let nombreDueno = req.body.nombreDueno;
    let rut = req.body.rut;
    let tipo = req.body.tipo;
    let nombreMascota=req.body.nombreMascota

    let data= JSON.parse(fs.readFileSync(__dirname + "/mascotas.json",  'utf-8'));

    //buscar si el rut existe, en ese caso agregar la mascota a su data
    let buscarRut=data.find((x)=>{if(x.dueño.rut===rut){return x}})
    console.log(buscarRut)

    if (buscarRut){
        let buscarMascota=buscarRut.mascotas.find((x)=>{if(x.nombreM===nombreMascota){return x}})
        if (buscarMascota){
            res.render("registro", { mensaje: "Ya tiene una mascota con ese nombre" });
        }
        else{
        let nuevaMascota={
            "nombreM": nombreMascota,
            "tipo": tipo
        }
        buscarRut.mascotas.push(nuevaMascota)
    }
    }
    else{
        let datoNuevo={
            "dueño": {
                "rut": rut,
                "nombreD": nombreDueno
            },
            "mascotas": [
                {
                    "nombreM": nombreMascota,
                    "tipo": tipo
                }
            ]
        }
        data.push(datoNuevo)
    }

    let dataJson = JSON.stringify(data);

    fs.writeFile("mascotas.json", dataJson, "utf8", function (err) {
        if (err) {
        return console.log(err);
        }
        console.log("Data Actualizada");
    });

    res.render("registro", { mensaje: "Mascota agregada correctamente" });
    
});

app.delete("/eliminarRut/:rut", (req, res) => {
    let rut = req.params.rut;
   
    let data= JSON.parse(fs.readFileSync(__dirname + "/mascotas.json",  'utf-8'));
    //buscar rut
    let buscarRut=data.find((x)=>{if(x.dueño.rut===rut){return x}})

    if(buscarRut){
        let filteredData = data.filter(function(item) {
            return item.dueño.rut != rut;
        });
        let dataJson = JSON.stringify(filteredData);
        fs.writeFile("mascotas.json", dataJson, "utf8", function (err) {
            if (err) {
            return console.log(err);
            }
            console.log("Data Actualizada");
        });

        console.log("eliminado")
 
    }
    else{
        console.log("rut no encontrado")
    }

  
    
});

app.delete("/eliminarNombre/:nombreM/:rut", (req, res) => {
    let nombreM = req.params.nombreM;
    let rut=req.params.rut;
    let mensaje
    console.log(rut,nombreM)
   
    let data= JSON.parse(fs.readFileSync(__dirname + "/mascotas.json",  'utf-8'));
    //buscar rut
    let buscarRut=data.find((x)=>{if(x.dueño.rut===rut){return x}})

    if(buscarRut){
        let buscarMascota=buscarRut.mascotas.find((x)=>{if(x.nombreM===nombreM){return x}})
        if (buscarMascota){
            for (let i = 0; i < data.length; i++) {
                if (data[i].dueño.rut === rut) {
                    for (let j = 0; j < data[i].mascotas.length; j++) {
                        if (data[i].mascotas[j].nombreM === nombreM) {
                            data[i].mascotas.splice(j, 1);
                        }
                    }
                }
            }
        mensaje="Mascota eliminada :("
        }
        
        else{
        mensaje="Mascota no encontrada"
        }
 
    }
    else{
        mensaje="Rut no encontrado"
        
    }

    let dataJson = JSON.stringify(data);

    fs.writeFile("mascotas.json", dataJson, "utf8", function (err) {
        if (err) {
        return console.log(err);
        }
        console.log("Data Actualizada");
    });

    res.render("eliminar", { mensaje: mensaje });
    
  
    
});

app.listen(3000);