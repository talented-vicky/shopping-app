// const products = []
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product'
    })
}

exports.postAddProduct = (req, res, next) => {
    // products.push({title: req.body.title})
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.showProduct = (req, res, next) => {
    const product = Product.fetchAll();
    res.render('shop', {
        prods: product, 
        pageTitle: 'Shop Page',
        path: '/'
    })
}