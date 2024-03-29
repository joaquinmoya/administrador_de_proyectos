
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req,res) => {
//Revisar si hay errores

const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}


    try {
        const proyecto = new Proyecto(req.body);
        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        //Guardamos proyecto
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
        
    }
}

exports.obtenerProyectos = async(req,res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json(proyectos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
        
    }
}

exports.actualizarProyecto = async (req,res) => {
    //Revisar si hay errores

const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}

//Extraer la informacion del proyecto
const {nombre} = req.body;
const nuevoProyecto = {};

if(nombre){
    nuevoProyecto.nombre = nombre;
}

try {
    //Revisar el id
    let proyecto =  await Proyecto.findById(req.params.id);

    //Si el proyecto existe
    if(!proyecto){
        return res.status(404).json({msg:'Proyecto no encontrado'});
    }
    //verificar el creador del proyecto
    if(proyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No autorizado'});
    }
    //actualizar
    proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set:nuevoProyecto},{new:true});
    res.json(proyecto);
} catch (error) {
    console.log(error);
    res.status(500).send('Error en el servidor');
}
}

//Elimina un proyecto por su id

exports.eliminarProyecto = async (req,res) => {

    try {
           //Revisar el id
    let proyecto =  await Proyecto.findById(req.params.id);

    //Si el proyecto existe
    if(!proyecto){
        return res.status(404).json({msg:'Proyecto no encontrado'});
    }
    //verificar el creador del proyecto
    if(proyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No autorizado'});
    }
    //Eliminar el proyecto
    await Proyecto.findOneAndRemove({_id: req.params.id});
    res.json({msg: 'Proyecto eliminado'});
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

 
}