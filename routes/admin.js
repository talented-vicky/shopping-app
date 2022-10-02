const path = require('path');
const express = require('express');

const rootDir = require('../helper/path');

const router = express.Router();

const prodController = require('../controllers/products')

// path is /admin/add-product
router.get('/add-product', prodController.getAddProduct);

// here, its /admin/product
router.post('/product', prodController.postAddProduct);

module.exports = router