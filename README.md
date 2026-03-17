# 🧩 Project Management System

A modern, full-stack **Project Management System** built using **React.js, Node.js, Express, MongoDB, Material-UI, and Docker**.  
This application helps users efficiently manage projects and tasks with a clean and elegant **dark-themed UI**.

---

## 🌟 Features

- 🔐 **Authentication & Authorization**
  - Secure login & registration using JWT
- 📁 **Project Management**
  - Create, update, delete, and view projects
- 📝 **Task Management**
  - Manage tasks within each project
- ⚡ **Real-time UI Updates**
  - Instant changes without page reload
- 📊 **Pagination Support**
  - Smooth handling of large datasets
- 📱 **Fully Responsive**
  - Works across mobile, tablet, and desktop
- 🌙 **Dark Mode UI**
  - Built with Material-UI for a modern experience

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React.js (TypeScript)
- Material-UI (MUI)
- React Router
- React Hook Form
- Axios
- React Toastify

### ⚙️ Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (Password Hashing)
- CORS

### 🐳 DevOps
- Docker (Containerization)

---

## 📂 Project Structure
Project-Management-System/
│
├── Backend/ # Express API
├── Frontend/ # React App
└── README.md

## ⚙️ Prerequisites

Make sure you have installed:

- Node.js (v14+)
- MongoDB (Local / Atlas)
- npm or yarn
- Docker (optional)

## ⚡ Quick Start

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/brahmanand09/Project-Management-System.git
cd Project-Management-System
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
npm run dev
```

✅ Backend will run on: **http://localhost:5000**

---

### 3️⃣ Frontend Setup

```bash
cd ../Frontend
npm install
npm start
```

✅ Frontend will run on: **http://localhost:3000**

---

### 4️⃣ Environment Configuration

Create a `.env` file inside the **Backend** folder and add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

### 5️⃣ Seed Data (Optional)

To populate the database with initial admin data:

```bash
cd Backend
npm run seed
```

✅ This will insert default admin credentials into your MongoDB database.

---

## 🔧 Available Scripts

### 🖥️ Backend

| Command        | Description                         |
|----------------|-------------------------------------|
| npm run dev    | Start development server (nodemon)  |
| npm start      | Start production server             |
| npm test       | Run backend tests                   |

---

### 💻 Frontend

| Command        | Description                         |
|----------------|-------------------------------------|
| npm start      | Start development server            |
| npm run build  | Build for production                |
| npm test       | Run frontend tests                  |
