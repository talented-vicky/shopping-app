const express = require('express');

const router = express.Router();

const shopController = require('../controllers/products');

router.get('/', shopController.showIndex);

// the path in router has to match that in the nav.ejs file
router.get('/products', shopController.showProducts);

router.get('/products/:prodId', shopController.showSingleProduct);
//prodId is what we're fetching from the .ejs file

router.get('/cart', shopController.showCart);

router.post('/add-cart', shopController.postCart);

// router.post('/cart-delete', shopController.postdeleteCart);

// router.get('/orders', shopController.showOrders);

// router.get('/checkout', shopController.showCheckout)

module.exports = router;


