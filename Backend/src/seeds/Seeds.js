const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Project.deleteMany({});
  await Task.deleteMany({});

  // Create user (password will be hashed via pre-save hook)
  const user = await User.create({
    email: 'test@example.com',
    password: 'Test@123',
  });

  // Create projects
  const project1 = await Project.create({
    title: 'Project 1',
    description: 'Description for project 1',
    status: 'active',
    user: user._id,
  });

  const project2 = await Project.create({
    title: 'Project 2',
    description: 'Description for project 2',
    status: 'active',
    user: user._id,
  });

  // Create tasks for project1
  await Task.create({
    title: 'Task 1.1',
    description: 'Desc 1.1',
    status: 'todo',
    dueDate: new Date('2025-11-01'),
    project: project1._id,
  });
  await Task.create({
    title: 'Task 1.2',
    description: 'Desc 1.2',
    status: 'in-progress',
    dueDate: new Date('2025-11-15'),
    project: project1._id,
  });
  await Task.create({
    title: 'Task 1.3',
    description: 'Desc 1.3',
    status: 'done',
    dueDate: new Date('2025-10-30'),
    project: project1._id,
  });

  // Create tasks for project2
  await Task.create({
    title: 'Task 2.1',
    description: 'Desc 2.1',
    status: 'todo',
    dueDate: new Date('2025-12-01'),
    project: project2._id,
  });
  await Task.create({
    title: 'Task 2.2',
    description: 'Desc 2.2',
    status: 'in-progress',
    dueDate: new Date('2025-12-15'),
    project: project2._id,
  });
  await Task.create({
    title: 'Task 2.3',
    description: 'Desc 2.3',
    status: 'done',
    dueDate: new Date('2025-11-30'),
    project: project2._id,
  });

  console.log('Data seeded successfully');
  process.exit(0);
};

seedData();