
import express from 'express';
import mongoose from 'mongoose';
import {
  createAppointment,
  getPendingAppointments,
  updateAppointmentStatus,
  getBookedSlots,
  updateAppointmentWithPrescription,
  getAppointmentsByStatus,
  getAppointmentsForPatient
} from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Appointment from '../models/appointment.js';

const router = express.Router();
const protect = authMiddleware();

// ------------------ Patient Routes ------------------

// Create new appointment
router.post('/', createAppointment);

// Get pending appointments (for all roles)
router.get('/appointments', protect, getPendingAppointments);

// Get booked slots for a doctor
router.get('/booked-slots/:doctorId', getBookedSlots);

// Get all appointments of logged-in patient
router.get('/status/patient', authMiddleware('patient'), getAppointmentsForPatient);

// Get only pending appointments of logged-in patient
router.get('/pending/patient', authMiddleware('patient'), async (req, res) => {
  try {
    const { _id } = req.user;
    const pendingAppointments = await Appointment.find({
      patientId: _id,
      status: 'Pending',
    }).sort({ date: 1, time: 1 });
    res.json(pendingAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch appointments' });
  }
});

// 🆕 Get appointments of a specific patient (admin/doctor view)
router.get('/status/patient/:patientId', protect, async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name')
      .exec();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------------ Doctor Routes ------------------

// Get appointments of logged-in doctor
router.get('/my', protect, async (req, res) => {
  try {
    const doctorId = new mongoose.Types.ObjectId(req.user._id);
    const appointments = await Appointment.find({
      doctorId,
      status: { $in: ['Approved', 'In Progress'] },
    }).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get appointments by status (doctor only)
router.get('/status/:status', authMiddleware('doctor'), getAppointmentsByStatus);

// Doctor updates appointment status and adds prescription
router.patch('/status/:id', authMiddleware('doctor'), async (req, res) => {
  try {
    const { status, prescription, medicines } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const validTransitions = {
      Approved: ['In Progress'],
      'In Progress': ['Completed'],
    };

    if (status && status !== appointment.status) {
      const allowed = validTransitions[appointment.status] || [];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: `Invalid transition from ${appointment.status} to ${status}` });
      }

      appointment.status = status;
    }


    if (status === 'In Progress') {
      // Convert appointment.date and appointment.time into accurate Date object in IST
      const [hourStr, minuteStr, period] = appointment.time.match(/(\d+):(\d+)\s*(am|pm)/i).slice(1);
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      if (period.toLowerCase() === 'pm' && hour !== 12) hour += 12;
      if (period.toLowerCase() === 'am' && hour === 12) hour = 0;

      const appointmentTime = new Date(appointment.date); // e.g. 2025-07-02T00:00:00.000Z
      appointmentTime.setHours(hour, minute, 0, 0); // Apply correct time

      // Get current time in IST
      const currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

      if (currentTime < appointmentTime) {
        return res.status(400).json({
          message: 'Cannot start treatment before scheduled appointment time',
        });
      }
    }



    if (status === 'Completed') {
      if (!prescription) {
        return res.status(400).json({ message: 'Prescription is required to complete appointment' });
      }
      appointment.prescription = prescription;

      appointment.medicines = medicines ?? [];
    }

    await appointment.save();
    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------ Admin/Manual ------------------

// Manual status update (e.g. approve/reject)
router.patch('/update-status/:appointmentId', protect, updateAppointmentStatus);

export default router;

