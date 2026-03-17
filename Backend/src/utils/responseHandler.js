const { HTTP_STATUS_CODES } = require('../constants/http');

const successResponse = (res, status, data) => {
  res.status(status || HTTP_STATUS_CODES.OK).json({ success: true, data });
};

const errorResponse = (res, status, message) => {
  res.status(status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message });
};

module.exports = { successResponse, errorResponse };