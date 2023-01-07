const express = require('express');

const router = express.Router();

const prodController = require('../controllers/products')

// path is /admin/add-product => & has to match the href in the nav.ejs file
router.get('/edit-product', prodController.getAddProduct);

// here, its /admin/product
router.post('/product', prodController.postAddProduct);

// this one is /admin/show-product
router.get('/show-product', prodController.getShowProduct);

// this one is /admin/edit-product/:prodId
router.get('/edit-product/:prodId', prodController.getEditProduct)

router.post('/edit-product', prodController.postEditProduct)

// router.post('/delete-product/:prodId', prodController.postDeleteProduct)
// didn't use this because then I'd have to use the commented form show-product.ejs file
router.post('/delete-product', prodController.postDeleteProduct)

module.exports = router