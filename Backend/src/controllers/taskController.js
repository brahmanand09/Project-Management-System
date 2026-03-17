const { createTask, getTasks, updateTask, deleteTask } = require('../services/taskService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/http');

const create = async (req, res) => {
  try {
    const task = await createTask(req.body, req.user.id);
    successResponse(res, HTTP_STATUS_CODES.CREATED, task);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const getAll = async (req, res) => {
  try {
    const tasks = await getTasks(req.query, req.user.id);
    successResponse(res, HTTP_STATUS_CODES.OK, tasks);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const update = async (req, res) => {
  try {
    const task = await updateTask(req.params.id, req.body, req.user.id);
    successResponse(res, HTTP_STATUS_CODES.OK, task);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const remove = async (req, res) => {
  try {
    await deleteTask(req.params.id, req.user.id);
    successResponse(res, HTTP_STATUS_CODES.OK, { message: 'Task deleted' });
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

module.exports = { create, getAll, update, remove };