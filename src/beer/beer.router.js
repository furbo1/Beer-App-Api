const express = require('express')
const router = express.Router()
const beerController = require('./beer.controller')

const authMiddleware = require('../middleware/middleware')

router.get('/name', authMiddleware(['ADMIN', 'MANAGER', 'SALES', 'CLIENT']), beerController.getBeerByName );

router.get('/all', beerController.getAllBeers);

router.post('/create', beerController.createBeer);

router.put('/update/:id', authMiddleware(['ADMIN', 'MANAGER', 'SALES']), beerController.updateBeer);

router.delete('/delete/:id', authMiddleware(['ADMIN', 'MANAGER', 'SALES']), beerController.deleteBeer);


module.exports = router;

