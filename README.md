
# 🏥 MediTrackLite

**MediTrackLite** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) based clinic and appointment management system with role-based access control for **Admin**, **Doctors**, and **Patients**.

---

## 📌 Features

### 🔐 Role-Based Access

- **Admin**
- **Doctor**
- **Patient**

### 💬 Smart Chatbot 

- Integrated chatbot available on every page
- Answers predefined FAQs like:
  - How to book appointments
  - Prescription download
  - Doctor approval status
- Improves user support and experience

---

## 🌐 Public Pages

- Landing Page with Navigation
- Doctor/Patient Login
- Admin Login
- About Us Section
- Contact Section

---

## 🧑‍💼 Admin Dashboard

- View and manage all doctors:
  - ✅ Approved Doctors
  - 🕓 Pending Approval
- Manually approve or reject doctor applications
- View system analytics:
  - Total Patients, Doctors, and Appointments
  - Pie chart of specializations
  - Appointment and approval statistics via graphs
- View and manage patient feedback
- 🔎 Get help instantly using the integrated chatbot
- logout

---

## 🧑‍⚕️ Doctor Dashboard

- View and update profile
- View appointment requests from patients
- ✅ Approve or ❌ Reject appointments
- Start treatment (status changes to **In-Progress**)
- Add prescription and mark treatment as **Completed**
- Toggle prescription visibility for completed appointments
- View feedback with average star rating
- Analytics dashboard with appointment status pie chart
- 🔎 Get help instantly using the integrated chatbot
- Logout

---

## 👩‍💻 Patient Dashboard

- View and update profile
- Book appointments with **admin-approved** doctors
  - Cannot book more than **2 appointments per day**
- Filter appointments by status:
  - Pending / Approved / In-Progress / Completed
- View or download prescription (for completed appointments)
- Submit and view feedback with star ratings
- Explore all approved doctors on “My Doctors” page
- 🔎 Get help instantly using the integrated chatbot
- Logout

---

## 📅 Appointment Workflow

1. Patient books appointment with a selected doctor
2. Doctor approves or rejects request
3. If approved:
   - Doctor starts treatment (status becomes **In-Progress**)
   - Doctor adds prescription and marks it as **Completed**
4. Patient views/downloads the prescription
5. Patient submits feedback

---

## 📊 Analytics (Admin & Doctor Dashboards)

- **Admin**:
  - Bar graphs: Total doctors, patients, appointments
  - Pie chart: Doctor specialization
  - Feedback analysis

- **Doctor**:
  - Pie chart: Appointment status (Approved, In-Progress, Completed)

---

## 🛠️ Tech Stack

| Tech            | Role                   |
|-----------------|------------------------|
| **MongoDB**     | NoSQL Database         |
| **Express.js**  | Backend Framework      |
| **React.js**    | Frontend Library       |
| **Node.js**     | Server Runtime         |
| **Axios**       | HTTP Requests          |
| **JWT**         | Authentication         |
| **Multer**      | File Uploads           |
| **Bootstrap + Custom CSS** | Styling     |

---

## 📁 Project Structure

```
MediTrackLite/
├── client/      # React Frontend
├── server/      # Express Backend
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### 🔩 Installation & Running

```bash
# Clone the repository
git clone https://github.com/your-username/MediTrackLite.git
cd MediTrackLite

# Install server dependencies
cd server
npm install

# Start backend server
node server.js

# Install frontend dependencies
cd ../client
npm install

# Start frontend
npm start
```

---

## 📷 Screenshots 

### 🏠 Home Page
![Home Page](screenshots/home.png)
![logins Page](screenshots/logins.png)
![About Page](screenshots/aboutus.png)
![services Page](screenshots/services.png)
![Gallery Page](screenshots/gallery.png)
![Contactus Page](screenshots/contactus.png)

### 🔐 Login Pages
![admin Login Page](screenshots/admin_login.png)
![login Page](screenshots/login_page.png)
![Registration Page](screenshots/register_page.png)
![Forgot Password Page](screenshots/forgotpassword.png)
![Reset Password Page](screenshots/resetpassword.png)

### 🧑‍💼 Admin Dashboard
![Admin Dashboard](screenshots/admin_dashboard.png)
![Approved doctors Page](screenshots/admin_approved_doctors.png)
![Admin Analytics Page](screenshots/admin_analytics.png)
![Admin Feedback Page](screenshots/admin_feedbacks.png)

### 🧑‍⚕️ Doctor Dashboard
![Doctor Dashboard](screenshots/doctor_dashboard.png)
![Doctor Profile](screenshots/doctor_profile.png)
![Doctor Editprofile](screenshots/doctor_edit.png)
![Doctor Pending Appointments](screenshots/doctor_pendingappointments.jpeg)
![Doctor Feedback](screenshots/doctor_feedback.png)
![Doctor Myappointments Approved](screenshots/doctor_approved.png)
![Doctor Myappointments Inprogress](screenshots/doctor_inprogressappointments.jpeg)
![Doctor Myappointments Completed](screenshots/doctor_completed_appoinments.jpeg)
![Doctor Analytics](screenshots/doctor_analytics.jpeg)
![Doctor Approved](screenshots/doctor_approval.jpeg)
![Doctor Notapproved](screenshots/doctor_notapproved.jpeg)

### 👩‍💻 Patient Dashboard
![Patient Dashboard](screenshots/patient_dashboard.png)
![Patient All Appointmnets](screenshots/patient_all.jpeg)
![Patient Approved Appointmnets](screenshots/patient_approved.png)
![Patient Pending Appointmnets](screenshots/patient_pending.png)
![Patient Inprogress Appointmnets](screenshots/patient_inprogress.jpeg)
![Patient Rejected Appointmnets](screenshots/patient_rejected.png)
![Patient Completed Appointmnets](screenshots/patient_completed.jpeg)
![Patient MyDoctors](screenshots/patient_doctors.jpeg)


### 📅 Appointment Booking
![Appointment Booking](screenshots/patient_appointmentbooking1.jpeg)
![Appointment Booking](screenshots/patient_appointmentbooking.jpeg)


### 💬 Smart Chatbot
![Chatbot](screenshots/chatbot.png)
![Chatbot](screenshots/chatbot1.jpeg)

---



## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, make changes, and submit a pull request.

---

