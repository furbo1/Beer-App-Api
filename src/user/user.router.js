const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const authMiddleware = require('../middleware/middleware')


router.get('/filter', authMiddleware(['ADMIN', 'MANAGER', 'SALES']), userController.getUsersByName);

router.get('/',authMiddleware(['ADMIN', 'MANAGER', 'SALES']), userController.getUsers);

// router.get('/reset-password',authMiddleware(['ADMIN', 'MANAGER', 'SALES']), userController.getUsers);

router.get('/:id', authMiddleware(['ADMIN', 'MANAGER', 'SALES', 'CLIENT']), userController.getUser);

router.post('/create', userController.createUser);

router.put('/:id', authMiddleware(['ADMIN', 'MANAGER', 'SALES']), userController.updateUser);

router.delete('/:id', authMiddleware(['ADMIN', 'MANAGER']), userController.deleteUser);

router.post('/login', userController.login);

router.post('/reset-password', userController.resetPassword);

router.post('/confirm-reset-password', userController.confirmResetPassword);



module.exports = router;