//importamos libreria mongoose
const mongoose = require('mongoose')

//creamos esquema (filtro) de los datos 
const artistSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    awardsWon: {
        type:Number,
        min:0,
        default:0
    },
    isTouring:{
        type:Boolean,
        default:false
    },
    genre:[{
        type:String,
        enum: ["rock","alternative","pop","metal","trance","jazz","reggae","country","dust-rock"]
    }]
})

//creamos el modelo de datos
const Artist = mongoose.model("Artist", artistSchema)

//exportamos el modelo
module.exports = Artist