const path = require('path');
const express = require('express');

const router = express.Router();

// path is /admin/add-product
router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
});

// here, its /admin/product
router.post('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/')
});

module.exports = router;