
# 🏥 MediTrackLite

**MediTrackLite** is a feature-rich full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) based **clinic and appointment management system** with **role-based access** for **Admins**, **Doctors**, and **Patients**. It integrates modern features like a voice-enabled chatbot, real-time appointment flow, prescription management, theme switching, and more.

---

## 📌 Key Features

### 🔐 Role-Based Access

- **Admin**
- **Doctor**
- **Patient**

### 💬 Smart Voice Chatbot (MediBot)
- Integrated on all pages
- Supports **voice input and response**
- Answers categorized FAQs:
  - Booking appointments
  - Prescription download
  - Doctor approval status
- FAQ search with expandable FAQ drawer

### 🌓 Theme Switch
- Toggle between **Dark and Light mode**
- Persistent theme preference

### 💳  Payment Flow
- Frontend-only payment simulation
- Shows doctor & patient details
- Supports UPI, Debit, and Credit card UI
- Toast confirmation upon  payment

---

## 🌐 Public Pages

- Landing Page with Navbar
- Doctor/Patient Login
- Admin Login
- About Us
- Contact Page

---

## 🧑‍💼 Admin Dashboard

- View/manage all doctors:
  - ✅ Approved
  - 🕓 Pending Approval
- Approve or reject doctors
- Analytics:
  - Total counts (Doctors, Patients, Appointments)
  - Graphs and pie charts
- View/manage patient feedback
- Handle **feedback deletion requests**
- Chatbot assistance
- Logout

---

## 🧑‍⚕️ Doctor Dashboard

- View & edit profile (bio, specialization, timings, etc.)
- View and manage patient appointments
  - ✅ Approve / ❌ Reject
  - ⏳ Start Treatment (In-Progress)
  - 📜 Add Prescription (Complete)
- Toggle prescription visibility
- View feedback with **average rating**
- Dashboard analytics with pie chart
- **Request feedback deletion**
- Chatbot assistance
- Logout

---

## 👩‍💻 Patient Dashboard

- View & update profile
- Book appointments with **approved doctors**
  - Max **2 per day**
  - Past time slots hidden for current day
- Filter appointments by status:
  - Pending / Approved / In-Progress / Completed
- Download/view prescriptions (for completed)
- Submit feedback (once per completed appointment)
- View feedbacks submitted
- **Request feedback deletion**
- View doctors on “My Doctors” page
- Chatbot assistance
- Logout

---

## 📅 Appointment Workflow

1. Patient fills appointment form → redirected to **Fake Payment Page**
2. After successful payment → appointment saved with "Pending"
3. Doctor approves/rejects
4. If approved:
   - Doctor starts treatment → status: **In-Progress**
   - Doctor adds prescription → status: **Completed**
5. Patient can download prescription
6. Patient submits feedback

---

## 📊 Analytics (Admin & Doctor)

### Admin:
- Bar Graphs: Total Patients, Doctors, Appointments
- Pie Chart: Doctor Specializations
- Feedback Trends

### Doctor:
- Pie Chart: Appointment status
- Ratings overview

---

## 🛠️ Tech Stack

| Tech                  | Role                        |
|-----------------------|-----------------------------|
| **MongoDB**           | Database                    |
| **Express.js**        | Backend Framework           |
| **React.js**          | Frontend UI                 |
| **Node.js**           | Server Runtime              |
| **Axios**             | API Requests                |
| **JWT**               | Auth Token System           |
| **Multer**            | File Upload (Profile Pics)  |
| **Bootstrap + CSS**   | Responsive Styling          |
| **Speech Synthesis**  | Voice-enabled Chatbot       |
| **Chart.js / Recharts**| Dashboard Charts           |

---

## 📁 Project Structure

```
MediTrackLite/
├── client/         # React Frontend
├── server/         # Express Backend
├── screenshots/    # UI Snapshots
├── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### 🔩 Installation & Run

```bash
# Clone the repo
git clone https://github.com/N-Manisha-05/MediTrackLite.git
cd MediTrackLite

# Install backend
cd server
npm install
node server.js

# Install frontend
cd ../client
npm install
npm start
```

---

## 📷 Screenshots 

### 🏠 Home Page
![Home Page](screenshots/home.png)
![logins Page](screenshots/logins.png)
![About Page](screenshots/about_us.png)
![services Page](screenshots/services.png)
![Gallery Page](screenshots/gallery.png)
![Contactus Page](screenshots/contact_us.png)

### 🔐 Login Pages
![admin Login Page](screenshots/admin_login.png)
![login Page](screenshots/login_page.png)
![Registration Page](screenshots/register_page.png)
![Forgot Password Page](screenshots/forgot_password.png)
![Reset Password Page](screenshots/reset_password.png)
![OTP Verification](screenshots/otp_verification.png)

### 🧑‍💼 Admin Dashboard
![Admin Dashboard](screenshots/admin_pending_doctors.png)
![Approved doctors Page](screenshots/admin_approved_doctors.png)
![Admin Analytics Page](screenshots/admin_analytics.png)
![Admin Feedback Page](screenshots/admin_feedbacks&ratings.png)
![Admin Feedback deletion requests Page](screenshots/request_feedback_deletion.png)

### 🧑‍⚕️ Doctor Dashboard
![Doctor Dashboard](screenshots/doctors_dashboard.png)
![Doctor Profile](screenshots/doctor_profile.png)
![Doctor Pending Appointments](screenshots/doctor_pending.png)
![Doctor Feedback](screenshots/doctor_feedback.png)
![Doctor Myappointments Approved](screenshots/doctor_approved.png)
![Doctor Myappointments Inprogress](screenshots/doctor_inprogress.png)
![Doctor Myappointments Completed](screenshots/doctor_completed.png)
![Doctor Analytics](screenshots/doctor_analytics.png)
![Doctor Approved](screenshots/doctor_approval.png)
![Doctor Notapproved](screenshots/doctor_notapproved.png)

### 👩‍💻 Patient Dashboard
![Patient Dashboard](screenshots/patient_profile.png)
![Patient All Appointmnets](screenshots/patient_appointments.png)
![Patient Pending Appointmnets](screenshots/patient_pending.png)
![Patient Approved Appointmnets](screenshots/patient_approved.png)

![Patient Inprogress Appointmnets](screenshots/patient_inprogress.png)
![Patient Rejected Appointmnets](screenshots/patient_rejected.png)
![Patient Completed Appointmnets](screenshots/patient_completed.png)
![Patient MyDoctors](screenshots/our_doctors.png)


### 📅 Appointment Booking
![Appointment Booking](screenshots/book_appointment(1).png)
![Appointment Booking](screenshots/book_appointment(2).png)
![Payment](screenshots/patient-payemnt.png)


### 💬 Smart Chatbot
![Chatbot](screenshots/smartbot_faqs.png)
![Chatbot](screenshots/smartbot.png)

### Dark Theme
![Dark Theme](screenshots/darktheme.png)

---



## 🤝 Contributing

Pull requests are welcome. Fork the repo, make changes, and raise a PR.

---


