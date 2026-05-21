import express from 'express';
import * as employeesController from '../controllers/employees.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', employeesController.getEmployees);
router.post('/', employeesController.createEmployee);
router.put('/:id', employeesController.updateEmployee);
router.delete('/:id', employeesController.deleteEmployee);

export default router;
