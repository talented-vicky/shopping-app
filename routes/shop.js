const path = require('path');
const express = require('express');

const router = express.Router();
const shopController = require('../controllers/products')

router.get('/', shopController.showProduct);

router.get('/products', shopController.showProducts);

router.get('/cart', shopController.showCart);

module.exports = router;


