const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../schemas/userSchemas');
const { HTTP_STATUS_CODES } = require('../constants/http');

const registerUser = async (data) => {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: parsed.error.errors[0].message };

  const { email, password } = parsed.data;

  let user = await User.findOne({ email });
  if (user) throw { status: HTTP_STATUS_CODES.CONFLICT, message: 'User already exists' };

  user = new User({ email, password }); // Password will be hashed in pre-save hook
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { user: { id: user._id, email }, token };
};

const loginUser = async (data) => {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) throw { status: HTTP_STATUS_CODES.BAD_REQUEST, message: parsed.error.errors[0].message };

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) throw { status: HTTP_STATUS_CODES.UNAUTHORIZED, message: 'Invalid credentials' };

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw { status: HTTP_STATUS_CODES.UNAUTHORIZED, message: 'Invalid credentials' };

  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { registerUser, loginUser };