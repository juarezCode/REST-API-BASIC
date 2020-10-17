import express from 'express';
import productsController from '../../controllers/v1/products';

const router = express.Router();

router.post('/create', productsController.createProduct);
router.delete('/delete', productsController.deleteProduct);
router.get('/get-all', productsController.getProducts);
router.get('/get-by-user/:userId', productsController.getProductsByUser);

export default router;

// const express = require('express');

// const productsController = require('../../controllers/v1/products');

// const router = express.Router();

// router.post('/create', productsController.createProduct);
// router.delete('/delete', productsController.deleteProduct);
// router.get('/get-all', productsController.getProducts);
// router.get('/get-by-user/:userId', productsController.getProductsByUser);

// module.exports = router;
