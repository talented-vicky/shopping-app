const Product = require('../models/product')
const User = require('../models/user')

/* 
ADMIN CONTROLLERS
*/
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        // the above is an ejs file in an admin folder
        pageTitle: 'Add Product',
        path: '/addEdit-product',
        // the above is the path in the nev.ejs file
        editing: false
        // this is for => const editMode = req.query.edit boolean
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const img = req.body.imageUrl
    const price = req.body.price
    const des = req.body.description
    // I'm extracting the name tags from the form body of 
    // the add-product.ejs file
    const product = new Product(title, img, price, des, null, req.user._id)
    // passing null for product id since we don't have it when creating a new prod
    // and req.user._id to make reference to the user's id which we passed in req
    // the userId was possible 'cause of the middleware in app.js
    
    product.save()
        .then(result => console.log('Successfully created product'))
        .catch(err => console.log(err))
        res.redirect('/')
}

exports.getShowProduct = (req, res, next) => {
    Product.fetchAll()
        .then(product => {
            res.render('admin/show-product', {
                prods: product,
                pageTitle: 'Admin All Products',
                path: '/show-product'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getEditProduct = (req, res, next) =>{
    const editMode = req.query.edit
    // check show-product.ejs file for query assignment
    if(!editMode){
        return res.redirect('/')
    }
    // fetching the value of the edit query param
    const productId = req.params.prodId
    Product.findbyId(productId)
        .then(product => {
            if(!product){
                res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/onlyEdit-product',
                editing: editMode,
                prod: product
            })
        })
        .catch(err => {
            console.log(err)
        })
    // remember we have access to all the key values in the ejs files
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    // I just fetched the id (when on edit mode) from the hidden 
    // input in edit-product.ejs
    
    const updTitle = req.body.title
    const updImg = req.body.imageUrl
    const updPrice = req.body.price
    const updDes = req.body.description

    const updProduct = new Product( updTitle, updImg, updPrice, updDes, prodId )    
    
    updProduct.save()
        .then(result => {
            console.log('Successfully updated product')
        })
        .catch(err => {
            console.log(err)
        })
        res.redirect('/admin/show-product')
}

exports.postDeleteProduct = (req, res, next) => {
    // const productId = req.params.prodId
    // didn't use this because I didnt's use params but body

    const productId = req.body.prodId
    // fetching prodId from the name field of the hidden input

    Product.deletebyId(productId)
        .then(prod => {
        console.log('product successfully deleted')
        res.redirect('admin/show-product')
        })
        .catch(err => {
            console.log(err)
        })
        res.redirect('/')
}




/* 
USER CONTROLLERS
*/
exports.showIndex = (req, res, next) => {
    Product.fetchAll()
        .then(product => {
            res.render('shop/index', {
                prods: product, 
                pageTitle: 'Index Page',
                path: '/'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.showProducts = (req, res, next) => {
    Product.fetchAll()
    .then(product => {
        res.render('shop/product-list', {
            prods: product, 
            pageTitle: 'Shop Page',
            path: '/user-products'
        })
    })
    .catch(err => {
        console.log(err)
    });
}

exports.showSingleProduct = (req, res, next) => {
    const productId = req.params.prodId
    // we're getting the params of the url from the shop.js showSingleProject
    // routes file same way we use req.body.title/imageUrl to get name from a form
    Product.findbyId(productId)
        .then(product => {
            res.render('shop/product-detail', {
                prod: product,
                pageTitle: product.title,
                path: '/user-products' 
                // it'll seem as if we're still on products page
            })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.showCart = (req, res, next) => {
    req.user.getCart()
    // this gives access to the cart and its content
        .then(cartProducts => {
            res.render('shop/cart', {
                pageTitle: 'Cart Page',
                path: '/user-cart',
                products: cartProducts
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const productId = req.body.prodId;
    // this is from the hidden input in the form

    Product.findbyId(productId)
        // the above yields a product
        .then(product => {
            req.user.addtoCart(product)
        })
        .then()
        .catch(err => {
            console.log(err)
        })
    res.redirect('/')
}
/* IMPORTANT */
// add functionality to increase or reduce the cart on cart page

exports.postdeleteCart = (req, res, next) => {
    const productId = req.body.prodId;

    req.user.deleteProdFromCart(productId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
    
}

exports.showOrders = (req, res, next) => {
    req.user.getOrder()
        .then(ordersData => {
            res.render('shop/orders', {
                pageTitle: 'Your Order',
                path: '/user-orders',
                orders: ordersData
            })
        })
}

exports.postOrders = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

// exports.showCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout Page',
//         path: '/user-checkout'
//     })
// }