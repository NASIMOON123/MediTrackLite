
import Doctor from '../models/doctor.js';

// ✅ Get all doctors (for admin dashboard)
export const getAllDoctorsForAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password'); // exclude password
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
};

// ✅ Approve a doctor by ID
export const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ message: 'Doctor approved successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: 'Approval failed', details: error.message });
  }
};