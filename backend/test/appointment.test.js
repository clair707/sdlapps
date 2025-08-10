const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = require('chai');

const Appointment = require('../models/Appointment');
const { createAppointment, getAllAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');

describe('Appointment Controller Tests', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should create a new appointment successfully', async () => {
        const req = {
            body: {
                petName: 'Boba',
                date: '2025-12-31',
                reason: 'Checkup',
                vetName: 'Dr. Smith'
            }
        };

        const saved = { _id: new mongoose.Types.ObjectId(), ...req.body };
        sinon.stub(Appointment.prototype, 'save').resolves(saved);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await createAppointment(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(saved)).to.be.true;
    });

    it('should return all appointments', async () => {
        const mockAppointments = [{ petName: 'Boba' }, { petName: 'Luna' }];
        sinon.stub(Appointment, 'find').resolves(mockAppointments);

        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        await getAllAppointments(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockAppointments)).to.be.true;
    }
    );

    it('should update an appointment successfully', async () => {
        const req = {
            params: { id: '456' }, 
            body: { reason: 'Updated Reason' }
        };
        const updated = { _id: '456', reason: 'Updated Reason' };
        sinon.stub(Appointment, 'findByIdAndUpdate').resolves(updated);
        
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateAppointment(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(updated)).to.be.true;
    });
});
