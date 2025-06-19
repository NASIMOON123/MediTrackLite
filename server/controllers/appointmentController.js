
import Appointment from '../models/appointment.js';
import mongoose from 'mongoose';

export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      patientName,
      email,
      date,
      time,
      symptoms,
      phone,
      gender
    } = req.body;

    // Ensure a patient can't book more than 2 appointments on the same day
    const existing = await Appointment.find({
      patientId,
      date
    });

    if (existing.length >= 2) {
      return res.status(400).json({ msg: 'Cannot book more than 2 appointments on the same day' });
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      patientName,
      email,
      date,
      time,
      symptoms,
      phone,
      gender,
      status: 'Pending',                    
      createdAt: new Date()               
    });

    await appointment.save();

    res.status(201).json({ msg: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Shared endpoint: Get all pending appointments (for admin/shared view)

export const getPendingAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id; 

    const pending = await Appointment.find({ status: 'Pending', doctorId })
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch appointments' });
  }
};




  export const getBookedSlots = async (req, res) => {
    try {
      const { doctorId } = req.params;
      const appointments = await Appointment.find({ doctorId });
  
      const bookedSlots = appointments.map(app => `${app.date}|${app.time}`);
      res.json(bookedSlots);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Failed to fetch booked slots' });
    }
  };
  // Doctor updates appointment status (approve/reject)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // ✅ Only allow certain statuses
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    // ✅ Update appointment
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    res.status(200).json({ msg: `Appointment ${status.toLowerCase()}`, appointment: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update appointment status' });
  }
};

export const getAppointmentsForPatient = async (req, res) => {
  try {
    const patientId = req.user._id;
    const appointments = await Appointment.find({ patientId }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch your appointments' });
  }
};




export const getAppointmentsByStatus = async (req, res) => {
  try {
    // If you have auth middleware that sets req.user._id:
    const doctorId = req.user._id;

    const { status } = req.params;

    // console.log('doctorId:', doctorId);
    // console.log('status:', status);

    const appointments = await Appointment.find({
      doctorId,
      status: { $regex: new RegExp(`^${status}$`, 'i') }
    });

    // console.log('found appointments:', appointments.length);
    res.json(appointments); // console.log('found appointments:', appointments.length);
  } catch (error) {
    console.error('Error in getAppointmentsByStatus:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};


export const updateAppointmentWithPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, prescription, medicines } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;

    if (status === 'Completed') {
      appointment.prescription = prescription;
      appointment.medicines = medicines;
    }

    await appointment.save();
    res.json({ message: 'Appointment updated successfully', appointment });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Failed to update appointment status' });
  }
};
