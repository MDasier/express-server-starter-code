require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

// conection to database
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/artists-db')
.then(()=>{
  console.log("Connected to db")
})
.catch((err)=>{
  console.log("Failed to connect",err)
})

// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(cors({
  origin: '*'
}));

// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array


const Artist = require("./models/Artist.model.js")

// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" })
})
// Route to create a new artist
app.post("/artist",(req,res,next)=>{
  Artist.create({
    name:req.body.name,
    awardsWon:req.body.awardsWon,
    isTouring:req.body.isTouring,
    genre:req.body.genre
  })
  .then(()=>{
    console.log("Artista creado!")
    res.json({message: "Artista creado"})
  })
  .catch((err)=>{
    res.json({message: err})
    console.log(err)
  })
})
//Route to get all the artist
app.get("/artist", async (req,res,next)=>{
  try {  
    const response = await Artist.find()//all documents of the collection
    res.json(response)
  } catch (error) {
    console.log(error)
  }
})
//Route with Querys
app.get("/artist/search", async (req,res,next)=>{
  try {
    const response = await Artist.find(req.query)//querys de busqueda recibidas como parametros dinamicos
    res.json(response)  
  } catch (error) {
    console.log(error)
  }
})
//Route to get an artist by ID
app.get("/artist/:artistId", async (req,res,next)=>{
  //res.json({message: "buscando artista"})
  try{
    const response = await Artist.findById(req.params.artistId)
    res.json(response)
  }catch (err){
    console.log(err)
  }  
})
//Route to delete an artist by ID
app.delete("/artist/:artistId", async (req,res,next)=>{
  try {
    await Artist.findByIdAndDelete(req.params.artistId)
    res.json("Artista borrado")
  } catch (error) {
    console.log(error)
  }
})
//Route to update (total) an artist by ID
app.put("/artist/:artistId", async (req,res,next)=>{
  try {
    await Artist.findByIdAndUpdate(req.params.artistId,{
      name:req.body.name,
      awardsWon:req.body.awardsWon,
      isTouring:req.body.isTouring,
      genre:req.body.genre
    })
    res.json("Artista actualizado")
  } catch (error) {
    console.log(error)
  }
})
//Route to edit an artist by ID
app.patch("/artist/:artistId/add-genre/:genre", async (req,res,next)=>{
  try {
    await Artist.findByIdAndUpdate(req.params.artistId,{
      $addToSet: {genre:req.params.genre}
    })
    res.json("Artista editado")
  } catch (error) {
    console.log(error)
  }
})
// server listen & PORT
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
