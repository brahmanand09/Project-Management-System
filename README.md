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
```

3️⃣ Frontend Setup
# Navigate to frontend directory (in a new terminal)
cd ../Frontend

# Install dependencies
npm install

# Start the frontend development server
npm start


✅ The frontend will run on http://localhost:3000

4️⃣ Environment Configuration

If the .env file is missing in the backend folder:

# Add environment file
.env
Then open the .env file and update it with your configuration:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

5️⃣Seeds

To populate the database with initial admin data, run:

# Navigate to backend directory
cd Backend

# Run the seed
npm run seed


✅ This will insert initial admin details into your MongoDB database.

🔧 Available Scripts
🖥️ Backend Scripts

npm start – Start the production server

npm run dev – Start the development server with nodemon

npm test – Run backend tests

💻 Frontend Scripts

npm start – Start the frontend development server

npm run build – Build the project for production

npm test – Run frontend tests
```bash
