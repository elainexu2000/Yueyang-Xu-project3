const Schema = require('mongoose').Schema;

module.exports = new Schema({ //column specifications
    name: {
        type: String,
        required: true
    },
    color: String, 
    owner: String,
    created: {
        type: Date,
        default: Date.now
    }
}, {collection: 'pokemons'}) // table name
