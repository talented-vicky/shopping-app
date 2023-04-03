const express = require('express');

const router = express.Router();

const shopController = require('../controllers/products');
const authController = require('../middleware/auth')

router.get('/', shopController.showIndex);

// the path in router has to match that in the nav.ejs file
router.get('/products', shopController.showProducts);

//prodId is what we're fetching from the .ejs file
router.get('/products/:prodId', shopController.showSingleProduct);

router.get('/cart', authController, shopController.showCart);

router.post('/add-cart', authController, shopController.postCart);

router.post('/cart-delete', authController, shopController.postdeleteCart);

router.get('/orders', authController, shopController.showOrders);

// router.post('/create-order', authController, shopController.postOrders);

router.get('/checkout/success', shopController.showCheckoutSuccess);

// router.get('/checkout/:orderId/cancel', shopController.showCheckout);
router.get('/checkout/cancel', shopController.showCheckout);

// router.get('/checkout/:orderId', authController, shopController.showCheckout);
router.get('/checkout', authController, shopController.showCheckout);

router.get('/order/:invoiceId', authController, shopController.getInvoice)

module.exports = router;


