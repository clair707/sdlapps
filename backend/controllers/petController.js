const Pet = require('../models/Pet');

//Create
const createPet = async (req, res) => {
    try {
        const pet = new Pet(req.body);
        const savePet = await pet.save();
        res.status(201).json(savePet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Read all
const getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Read
const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//Update
const updatePet = async (req, res) => {
    try {
        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Delete
const deletePet = async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet
};
