const express = require('express');

const router = express.Router();

const prodController = require('../controllers/products')
const authController = require('../middleware/auth')

// path is /admin/add-product => & has to match the href in the nav.ejs file
router.get('/edit-product', authController, prodController.getAddProduct);

// here, its /admin/product
router.post('/product', authController, prodController.postAddProduct);

// this one is /admin/show-product
router.get('/show-product', authController, prodController.getShowProduct);

// this one is /admin/edit-product/:prodId
router.get('/edit-product/:prodId', authController, prodController.getEditProduct)

router.post('/edit-product', authController, prodController.postEditProduct)

// router.post('/delete-product/:prodId', prodController.postDeleteProduct)
// didn't use this because then I'd have to use the commented form show-product.ejs file
router.post('/delete-product', authController, prodController.postDeleteProduct)

module.exports = router