const Product = require('../models/product')

// admin controllers
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/add-product'
    })
}

exports.postAddProduct = (req, res, next) => {
    // products.push({title: req.body.title})
    const product = new Product(req.body.title)
    
    product.save()
    res.redirect('/')
}

exports.getShowProduct = (req, res, next) => {
    res.render('admin/show-product', {
        pageTitle: 'Admin All Products',
        path: '/show-product'
    })
}



// user controllers
exports.showProduct = (req, res, next) => {
    // const product = Product.fetchAll();
    // this is me simply calling the class itself
    Product.fetchAll(product => {
        res.render('shop/product-list', {
            prods: product, 
            pageTitle: 'Shop Page',
            path: '/user'
        })
    });
}

exports.showProducts = (req, res, next) => {
    res.render('shop/products', {
        pageTitle: 'All Products',
        path: '/user-products'
    })
}

exports.showCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart Page',
        path: '/user-cart'
    })
}