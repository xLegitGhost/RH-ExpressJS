const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Todas las rutas de empleados están protegidas por el middleware JWT
router.use(verifyToken);

router.get('/', employeesController.getEmployees);
router.post('/', employeesController.createEmployee);
router.put('/:id', employeesController.updateEmployee);
router.delete('/:id', employeesController.deleteEmployee);

module.exports = router;
