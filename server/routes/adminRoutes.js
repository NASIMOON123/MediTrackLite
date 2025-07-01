
// import express from 'express';
// import jwt from 'jsonwebtoken';
// import {
//   approveDoctor,
//  getApprovalStatus,
//   getAllDoctorsForAdmin, 
//   getAllFeedbacksSorted
// } from '../controllers/adminController.js';
// import authMiddleware from '../middleware/authMiddleware.js';

// const router = express.Router();

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;


// // 🔐 Admin Login Route
// router.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
//     return res.status(401).json({ msg: 'Unauthorized: Invalid credentials' });
//   }

//   const token = jwt.sign(
//     { email, role: 'admin' },
//     process.env.JWT_SECRET || 'secretkey',
//     { expiresIn: '1h' }
//   );

//   res.json({ token, role: 'admin' });
// });

// // 🔐 Admin-only middleware
// const adminProtect = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ msg: 'Token missing' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ msg: 'Access denied: Admins only' });
//     }

//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Invalid token' });
//   }
// };

// // ✅ Get all doctors (admin dashboard)
// router.get('/doctors', adminProtect, getAllDoctorsForAdmin);

// // ✅ Approve doctor manually
//  router.put('/approve-doctor/:id', adminProtect, approveDoctor);
// router.get('/approval-status', authMiddleware, getApprovalStatus);


// router.get('/analytics/all-feedbacks', adminProtect, getAllFeedbacksSorted);

// router.put('/deactivate-doctor/:id', async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndUpdate(
//       req.params.id,
//       { isApproved: false },
//       { new: true }
//     );
//     res.status(200).json({ message: 'Doctor deactivated', doctor });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error deactivating doctor' });
//   }
// });


// export default router;

import express from 'express';
import jwt from 'jsonwebtoken';
import {
  approveDoctor,
  getApprovalStatus,
  getAllDoctorsForAdmin, 
  deactivateDoctor,
  getAllFeedbacksSorted
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Doctor from '../models/doctor.js'; // ✅ Fix: import Doctor model

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// 🔐 Admin Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ msg: 'Unauthorized: Invalid credentials' });
  }

  const token = jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1h' }
  );

  res.json({ token, role: 'admin' });
});

// 🔐 Admin-only middleware
const adminProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ msg: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// ✅ Admin routes
router.get('/doctors', adminProtect, getAllDoctorsForAdmin);
router.put('/approve-doctor/:id', adminProtect, approveDoctor);
router.get('/approval-status', authMiddleware, getApprovalStatus);
router.get('/analytics/all-feedbacks', adminProtect, getAllFeedbacksSorted);

// ✅ Deactivate doctor route (fixed)
router.put('/deactivate-doctor/:id', deactivateDoctor);

export default router;
