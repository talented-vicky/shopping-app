const path = require('path');
const express = require('express');

const router = express.Router();
const shopController = require('../controllers/products')

router.get('/', shopController.showProduct);

module.exports = router;


