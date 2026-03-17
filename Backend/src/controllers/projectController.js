const { createProject, getUserProjects, updateProject, deleteProject } = require('../services/projectService');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS_CODES } = require('../constants/http');

const create = async (req, res) => {
  try {
    const project = await createProject({ ...req.body, userId: req.user.id });
    successResponse(res, HTTP_STATUS_CODES.CREATED, project);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const getAll = async (req, res) => {
  try {
    const projects = await getUserProjects(req.user.id);
    successResponse(res, HTTP_STATUS_CODES.OK, projects);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const update = async (req, res) => {
  try {
    const project = await updateProject(req.params.id, req.body, req.user.id);
    successResponse(res, HTTP_STATUS_CODES.OK, project);
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

const remove = async (req, res) => {
  try {
    await deleteProject(req.params.id, req.user.id);
    successResponse(res, HTTP_STATUS_CODES.OK, { message: 'Project deleted' });
  } catch (err) {
    errorResponse(res, err.status || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, err.message);
  }
};

module.exports = { create, getAll, update, remove };