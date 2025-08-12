const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, controller.createAppointment);
router.get('/', protect, controller.getAllAppointments);
router.get('/:id', protect, controller.getAppointmentById);
router.put('/:id', protect, controller.updateAppointment);
router.delete('/:id', protect, controller.deleteAppointment);

module.exports = router;