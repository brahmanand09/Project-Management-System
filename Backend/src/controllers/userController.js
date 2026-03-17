const { registerUser, loginUser } = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/http');

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    successResponse(res, HTTP_STATUS_CODES.CREATED, user);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const login = async (req, res) => {
  try {
    const token = await loginUser(req.body);
    successResponse(res, HTTP_STATUS_CODES.OK, { token });
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

module.exports = { register, login };