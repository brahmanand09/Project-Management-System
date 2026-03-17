const z = require('zod');
const { TASK_STATUSES } = require('../constants/constants');

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(TASK_STATUSES),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  projectId: z.string().min(1), // Assuming ObjectId as string
});

module.exports = { taskSchema };