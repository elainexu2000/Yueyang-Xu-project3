const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

// debug switch
const pokemon_mode = false;

//Routers
const pokemonRouter = require('./backend/pokemon.cjs');
const pokemonUserRouter = require('./backend/pokemon.user.api.cjs');

const passwordRouter = require('./backend/password.api.cjs');
const passwordUserRouter = require('./backend/password.user.api.cjs');

const app = express();

const mongoDBEndpoint = "mongodb+srv://elainexu2000:Northeastern2022!@yueyangxuproject3.2xyac8j.mongodb.net/?retryWrites=true&w=majority&appName=YueyangXuProject3";
mongoose.connect(mongoDBEndpoint, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// debug switch
if(pokemon_mode){
    app.use('/api/pokemon', pokemonRouter);
    app.use('/api/pokemonUser', pokemonUserRouter);
}
else{
    app.use('/api/password', passwordRouter);
    app.use('/api/passwordUser', passwordUserRouter);
}

//uncomment when done
// let frontend_dir = path.join(__dirname, 'dist')

// app.use(express.static(frontend_dir));
// app.get('*', function (req, res) {
//     console.log("received request");
//     res.sendFile(path.join(frontend_dir, "index.html"));
// });

// app.listen(process.env.PORT || 8000, function() {
//     console.log("Starting app now...")
// })

app.listen(8000, function(){
    console.log("Starting app");
})

