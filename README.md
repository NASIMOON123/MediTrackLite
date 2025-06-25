
# 🏥 MediTrackLite

**MediTrackLite** is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) based clinic and appointment management system with role-based access control for **Admin**, **Doctors**, and **Patients**.

---

## 📌 Features

### 🔐 Role-Based Access

- **Admin**
- **Doctor**
- **Patient**

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
  - Patient feedback & average ratings

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


---

## 📡 API Overview 
> You can optionally provide a link to Postman documentation or list core API endpoints and structure here.

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, make changes, and submit a pull request.

---

