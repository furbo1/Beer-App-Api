const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var BeerSchema = new Schema({
    beerName: {
        type:String,
        required: true,
        unique: [true, 'This beer already exists!']
    },
    beerDescription: {
        type:String,
        required: true
    },

    beerPicture: {
        type:String,
        required: true,
    },
    beerVotes: {
        type: Number,
        default: 0,
        required: false
    },
    beerAlc: Number
})

var Beer = mongoose.model('Beer', BeerSchema);

module.exports = Beer;
