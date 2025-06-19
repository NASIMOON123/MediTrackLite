# MediTrackLite 🏥💊

**MediTrackLite** is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for efficient clinic and appointment management with role-based access for **Admin**, **Doctors**, and **Patients**.

---



## 📌 Features

### 🔐 User Roles
- **Admin**
- **Doctor**
- **Patient**

---

### 🌐 Public Home Page
- Landing page with navigation
- Doctor/Patient login
- Admin login
- About Us section
- Contact section

---

## 🧑‍💼 Admin Dashboard
- View all doctors categorized as:
  - ✅ Approved Doctors
  - 🕓 Pending Approval
- Manually approve/reject doctors

---

## 🧑‍⚕️ Doctor Dashboard
- View & update profile
- View appointments booked by patients
- Approve/Reject appointment requests
- Start treatment (In-Progress state)
- Mark treatment as Completed
- View list of all approved and in-progress appointments
- Logout

---

## 👩‍💻 Patient Dashboard
- View and update patient profile
- **Book Appointment** with admin-approved doctors
- **Filter appointments** by status (Pending / Approved / In-Progress / Completed)
- **View & Download Prescriptions** for completed appointments
- View all doctors
- Logout

---

## 📅 Appointment Workflow
1. Patient books appointment with selected doctor
2. Doctor approves or rejects
3. If approved:
   - Doctor can start treatment (status: In-Progress)
   - Once done, marks it as Completed
4. Patient can then view/download the prescription

---

## 🛠️ Tech Stack

| Tech          | Role                |
|---------------|---------------------|
| **MongoDB**   | Database             |
| **Express.js**| Backend Framework   |
| **React.js**  | Frontend Library     |
| **Node.js**   | Server Runtime       |
| **Axios**     | API Requests         |
| **JWT**       | Authentication       |
| **Multer**    | File Uploads         |
| **Bootstrap + Custom CSS** | Styling  |

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
- Node.js
- MongoDB

### 🔩 Install & Run

```bash
# From root folder

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start client
npm start

# Start server
cd ../server
node server.js
```

---
