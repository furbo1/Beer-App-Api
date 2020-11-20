const express = require('express');
const router = express.Router();
const employeeController = require('./employee.controller');


router.get('/', employeeController.getEmployees);

router.post('/', employeeController.createEmployee);

router.put('/', employeeController.updateEmployee )

router.delete('/', employeeController.deleteEmployee)



module.exports = router;