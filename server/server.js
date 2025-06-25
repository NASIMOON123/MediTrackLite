// server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import chatbotRoute from './routes/chatbot.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import analyticsRoutes from './routes/analyticsroutes.js';
import adminAnalyticsRouter from './routes/adminAnalytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(express.json({ limit: '10mb' }));  // Or higher if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Middleware

app.use(cors({
  credentials: true
}));
// app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/appointments', appointmentRoutes);

app.use('/api/doctors', doctorRoutes);

app.use('/api/chatbot', chatbotRoute);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/analytics', adminAnalyticsRouter);

// DB Connection
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


