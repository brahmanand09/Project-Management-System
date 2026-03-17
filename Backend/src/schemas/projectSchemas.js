const z = require('zod');
const { PROJECT_STATUSES } = require('../constants/constants');

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(PROJECT_STATUSES),
});

module.exports = { projectSchema };