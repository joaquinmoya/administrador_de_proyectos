const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario= async(req,res) => {
    const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
}
//extraer email y password
const {email, password} = req.body;

try {
    //Revisar que sea un usuario registrado
    let usuario = await Usuario.findOne({email});
    if(!usuario){
        return res.status(400).json({msg:'El usuario no existe'})
    }
    //Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);

    if(!passCorrecto){
        return res.status(400).json({msg:'Password incorrecto'});
    }

    //Si todo es correcto rear y firmar el jwt
    const payload = {
        usuario:{
            id: usuario.id
        }

    };
    //Firmar el jwt
    jwt.sign(payload, process.env.SECRETA,{
        expiresIn:3600 //1hs
    }, (error,token) => {
        if(error) throw error;

        //Mensaje de confirmacion
        res.json({token});
    })


} catch (error) {
    console.log(error);
}
}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req,res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'})
    }
}