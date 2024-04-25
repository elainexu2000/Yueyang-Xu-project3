const model = require('mongoose').model;
const PokemonSchema = require('./pokemon.schema.cjs');
const PokemonModel = model('Pokemon', PokemonSchema);

// add new entry
function insertPokemon(pokemon){
    return PokemonModel.create(pokemon);
}

// delete
function deletePokemon(id){
    return PokemonModel.deleteOne({_id: id});
}

function updatePokemon(id, newPokemon){
    return PokemonModel.findOneAndUpdate({_id: id}, newPokemon);
}

// queries: need .exec()
function getAllPokemon(){
    return PokemonModel.find().exec();
}

function getPokemonByOwner(owner){
    return PokemonModel.find({
        owner: owner,
    }).exec();
}

function getPokemonById(id){
    return PokemonModel.findById(id).exec();
}


module.exports = {
    insertPokemon,
    deletePokemon,
    updatePokemon,
    getAllPokemon,
    getPokemonByOwner,
    getPokemonById
}