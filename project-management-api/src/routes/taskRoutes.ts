import express from 'express';
import { createTask, getAllTasks, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateUser } from '../middleware/authUser';

const router = express.Router();

router.use(authenticateUser);

router.post('/', createTask);
router.get('/:projectId', getAllTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;