const express = require('express');

const rootDir = require('../helper/path');

const router = express.Router();

const prodController = require('../controllers/products')

// path is /admin/edit-product => & has to match the href in the nav.ejs file
router.get('/edit-product', prodController.getAddProduct);

// here, its /admin/product
router.post('/product', prodController.postAddProduct);
// note a get request simply links a path or url while a
// post req makes changes or modifications before pulling some stuff
// more like you've made changes before fetching from the server

// this one is /admin/show-product
router.get('/show-product', prodController.getShowProduct);

// this one is /admin/edit-product/:prodId
router.get('/edit-product/:prodId', prodController.getEditProduct)

router.post('/edit-product', prodController.postEditProduct)

router.post('/delete-product/:prodId', prodController.postDeleteProduct)
// router.post('/delete-product', prodController.postDeleteProduct)

module.exports = router