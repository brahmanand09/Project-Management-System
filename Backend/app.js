const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();
app.use(express.json());

// cors origin 
app.use(cors({
  origin: process.env.FRONTEND_URI || 'http://localhost:3000',
  optionsSuccessStatus:200,
}));


// Connect to MongoDB
connectDB();

// Import routers from modules
const { userRouter, projectRouter, taskRouter } = require('./src/modules');

// Routes
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));