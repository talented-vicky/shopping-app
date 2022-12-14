const express = require('express');

const router = express.Router();

const shopController = require('../controllers/products');

router.get('/', shopController.showIndex);

// the path in router has to match that in the nav.ejs file
router.get('/products', shopController.showProducts);

//prodId is what we're fetching from the .ejs file
router.get('/products/:prodId', shopController.showSingleProduct);

router.get('/cart', shopController.showCart);

router.post('/add-cart', shopController.postCart);

router.post('/cart-delete', shopController.postdeleteCart);

router.get('/orders', shopController.showOrders);

router.post('/create-order', shopController.postOrders);

module.exports = router;


