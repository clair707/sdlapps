const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = require('chai');

const Pet = require('../models/Pet');
const { createPet, getAllPets, updatePet, deletePet } = require('../controllers/petController');

describe('Pet Controller Tests', () => {
    afterEach(() => {
        sinon.restore();
    }
    );

    it('should create a new pet successfully', async () => {
        const req = {
            body: {
                name: 'Boba',
                species: 'Dog',
                age: 3,
                ownerName: 'John Doe',
                ownerContact: '1234567890'
            }
        };

        const savedPet = { _id: new mongoose.Types.ObjectId(), ...req.body };
        sinon.stub(Pet.prototype, 'save').resolves(savedPet);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await createPet(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(savedPet)).to.be.true;
    });

    it('should return all pets', async () => {
        const mockPets = [{name: 'Boba' }, { name: 'Luna' }];
        sinon.stub(Pet, 'find').resolves(mockPets);

        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await getAllPets(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockPets)).to.be.true;
    });

    it('should update a pet successfully', async () => {
        const req = {
            params: { id: '123', },
            body: { name: 'UpdateName' }
        };

            const updatedPet = { _id: '123', name: 'UpdateName' };
            sinon.stub(Pet, 'findByIdAndUpdate').resolves(updatedPet);

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.spy()
            };
            await updatePet(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(updatedPet)).to.be.true;
        });

    it('should delete a pet successfully', async () => {
        const req = { params: { id: '123' } };
        const deletedPet = { _id: '123', name: 'Boba' };

        sinon.stub(Pet, 'findByIdAndDelete').resolves(deletedPet);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deletePet(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(sinon.match({ success: true }))).to.be.true;
    });
});
