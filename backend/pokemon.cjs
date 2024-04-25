// To use this router, we need to require it in server.js:
// const pokemonRouter = require('./pokemon (the rel path)');
// And specify a URL for it: 
// app.use('/pokemon', pokemonRouter);

const express = require('express');
const pokemonRouter = express.Router();
const PokemonModel = require('./db/pokemon.model.cjs');

const cookieHelper = require('./cookie.helper.cjs');

let pokemonColors = [
    {name: "pikachu", color: "yellow"},
    {name: "charizard", color: "red"},
];

// path params: more complicated case
// pokemonRouter.get('/:pokemonName/trainer/:pokemonTrainer', function(request, response){
    //the above can be mapped to localhost:8000/pokemon/pikachu/trainer/ash,
    // where const pokemonName = pikachu; const pokemonTrainer = ash;


// post request: add new resource
// the new resource is in request.body
// remember to set headers: Content-Type, application/json
pokemonRouter.post('/', async function(req, res){
    const requestBody = req.body;
    const username = cookieHelper.cookieDecryptor(req);

    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to create a pokemon!")
    }
    if(!requestBody.name || !requestBody.color){
        res.status(401);
        return res.send("Invalid pokemon!")
    }
    const newPokemon = {
        name : requestBody.name,
        color: requestBody.color,
        owner: username
    }

    try{
        const insertPokemonResponse = await PokemonModel.insertPokemon(newPokemon);
        return res.send(insertPokemonResponse);
    } catch(error){
        res.status(400);
        return res.send(error);
    }
})

// get pokemons by logged in username
// query params
// localhost:8000/pokemon?name=pikachu ==> The color of pikachu is yellow
// specifically, if a query is made to localhost:8000/pokemon?name=pikachu, 
// where ? indicates a query and name indicates a search category
pokemonRouter.get('/', async function(req, res){
    // const pokemonName = request.query.name
    // for(let i = 0; i < pokemonColors.length; i++){
    //     const pokemonRow = pokemonColors[i];
    //     if(pokemonRow.name === pokemonName){
    //         return response.send("The color of " + pokemonName + " is " + pokemonRow.color);
    //     }
    // }
    // return res.send(pokemonColors);

    const username = cookieHelper.cookieDecryptor(req);
    try{
        //const allPokemonResponse = await PokemonModel.getAllPokemon();
        const allPokemonResponse = await PokemonModel.getPokemonByOwner(username);
        return res.send(allPokemonResponse);
    }
    catch(error){
        res.status(400);
        return res.send("Error retrieving pokemon from database. ");
    }
})

// path params
// localhost:8000/pokemon/pikachu ==> The color of pikachu is yellow
// whatever after the URL is interpreted as a value
// -> /pokemon/pikachu => request.params.pokemonName === pikachu
// pokemonRouter.get('/:pokemonName', function(req, res){
//     // can extract variable pokemonName
//     const pokemonName = req.params.pokemonName;
//     for(let i = 0; i < pokemonColors.length; i++){
//         const pokemonRow = pokemonColors[i];
//         if(pokemonRow.name === pokemonName){
//             return res.send("The color of " + pokemonName + " is " + pokemonRow.color);
//         }
//     }
//     res.status(404);
//     return res.send("Pokemon with name " + pokemonName + " not found.");
// })

pokemonRouter.get('/:pkId', async function(req, res){
    const pokemonId = req.params.pkId;
    try{
        const getPokemonResponse = await PokemonModel.getPokemonById(pokemonId);
        return res.send(getPokemonResponse);
    }catch(error){
        res.send(400);
        return res.send(error);
    }
})


// put request: update an existing resource
// specify resource via req.params.some_identifier
// specify update info via req.body
// remember to set headers: Content-Type, application/json
// pokemonRouter.put('/:pokemonName', function(req, res){
    // const pokemonName = req.params.pokemonName;
    // const requestBody = req.body;
    // if(!requestBody.name || !requestBody.color){
    //     res.status(400);
    //     return res.send("Invalid input: please include pokemon name and color. ")
    // }
    // Local database:
    // for(let i = 0; i < pokemonColors.length; i++){
    //     const pokemonRow = pokemonColors[i];
    //     if(pokemonRow.name === pokemonName){
    //         pokemonRow.name = requestBody.name;
    //         pokemonRow.color = requestBody.color;
    //         return res.send('Pokemon ' + pokemonName + " successfully updated! ");
    //     }
    // }
    // return res.send('Pokemon ' + pokemonName + " not found. ");
// })

pokemonRouter.put('/:pkId', async function(req, res){
    const pokemonId = req.params.pkId;
    const pokemonData = req.body;
    //const owner = req.cookies.username; // get it from user's side
    const username = cookieHelper.cookieDecryptor(req);

    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to modify a pokemon!")
    }
    if(!pokemonData.name || !pokemonData.color){
        res.status(400);
        return res.send("Invalid input: please include pokemon name and color. ")
    }
    try{
        const getPokemonResponse = await PokemonModel.getPokemonById(pokemonId);
        //verify that the pokemon is owned by this user
        if(getPokemonResponse != null && getPokemonResponse.owner !== username){
            res.status(400);
            return res.send("You do not own this pokemon! ");
        }
        const pokemonUpdateResponse = await PokemonModel.updatePokemon(pokemonId, pokemonData);
        return res.send('Successfully updated pokemon ID ' + pokemonId);
    }
    catch(error){
        res.status(400);
        return res.send(error);
    }
})

// deletions are always successful even if not found
// pokemonRouter.delete('/:pokemonName', function(req, res){
//     const pokemonName = req.params.pokemonName;
//     pokemonColors = pokemonColors.filter(function(pokemon){
//         return pokemon.name !== pokemonName; 
//     })
//     res.send("Pokemon " + pokemonName + " successfully deleted.");
// })

pokemonRouter.delete('/:pkId', async function(req, res){
    const pokemonId = req.params.pkId;
    //const owner = req.cookies.username;
    const username = cookieHelper.cookieDecryptor(req);
    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to delete a pokemon!")
    }
    try{
        const getPokemonResponse = await PokemonModel.getPokemonById(pokemonId);
        //verify that the pokemon is owned by this user
        if(getPokemonResponse != null && getPokemonResponse.owner !== username){
            res.status(400);
            return res.send("You do not own this pokemon! ");
        }
        const deletePokemonResponse = await PokemonModel.deletePokemon(pokemonId);
        return res.send(deletePokemonResponse);
    }
    catch(error){
        res.status(400);
        return res.send(error);
    }
})

module.exports = pokemonRouter;