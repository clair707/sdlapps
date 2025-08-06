const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true,},
    species: { type: String, required: true },
    age: { type: Number, required: true },
    ownerName: { type: String, required: true },
    ownerContact: { type: String, required: true },
});

module.exports = mongoose.model("Pet", petSchema);

