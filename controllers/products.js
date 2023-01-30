const Product = require('../models/product')
const Order = require('../models/order')

const { validationResult } = require('express-validator')

/* 
ADMIN CONTROLLERS
*/
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        // the above is an ejs file in an admin folder
        pageTitle: 'Add Product',
        path: '/addEdit-product',
        // the above is the path in the nev.ejs file
        editing: false,
        // this is for => const editMode = req.query.edit boole
        addprodError: null,
        inputValue: { tit: '', image: '', price: '', desc: '' },
        errorArray: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const img = req.body.imageUrl
    const price = req.body.price
    const des = req.body.description

    const errors = validationResult(req)

    const product = new Product({ 
        title: title, imageUrl: img, price: price, 
        description: des, userId: req.user 
        // userId: req.user._id => would not be useful if I need more 
        // data than just the id of the user
        // userId: req.user => mongoose understands to store just 
        // the user._id and not all values
    })
    // keys point at prod schema while values point at const variable defined
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/addEdit-product',
            editing: false,
            addprodError: errors.array()[0].msg,
            inputValue: { tit: title, image: img, price: price, desc: des },
            errorArray: errors.array()
        })
    }
    product.save()
        .then(result => {
            console.log('Successfully created product')
            res.redirect('/')
        })
        .catch(err => console.log(err))
}

exports.getShowProduct = (req, res, next) => {
    Product.find({userId: req.user._id}) // confirming if it's logged in user
    // check app.js file for user initialization (req.user = user)
        // .select('title price -_id')
        // now I'm fetching just title and price, _id is automatically fetched
        // so I had to exclude it if I didn't want to retrieve it 4rm database
        // .populate('userId')
        // the above is now the field I wanna display 4rm what I've selected
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
    const productId = req.params.prodId

    Product.findById(productId)
        .then(product => {
            if(!product){
                res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/onlyEdit-product',
                editing: editMode,
                prod: product,
                addprodError: null,
                inputValue: { tit: '', image: '', price: '', desc: '' },
                errorArray: []
            })
        })
        .catch(err => console.log(err))
    // remember we have access to all the key values in the ejs files
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    // I just fetched the id (when on edit mode) from the hidden 
    // input in edit-product.ejs
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/')
    }
    const updTitle = req.body.title
    const updImg = req.body.imageUrl
    const updPrice = req.body.price
    const updDes = req.body.description
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/onlyEdit-product',
            editing: editMode,
            addprodError: errors.array()[0].msg,
            inputValue: { tit: updTitle, image: updImg, price: updPrice, desc: updDes },
            errorArray: errors.array()
        })
    }    
    Product.findById(prodId)
        .then(product => {
            // adding additional route protection peradventure a user
            // finds a way to get to the edit page of products not created
            // by him/her
            if(product.userId.toString() !== req.user._id.toString()){
                console.log('Unauthorized error, not permitted to edit product')
                return res.redirect('/')
            }
            product.title = updTitle 
            product.imageUrl = updImg
            product.price = updPrice
            product.description = updDes
            return product.save()
            // note I called save on the result "product" not on model "Product"
            .then(result => {
                console.log('Successfully updated product')
                res.redirect('/admin/show-product')
            })
        })
        .catch(err => console.log(err))
        // mongoose does a bts update when're we call save on an existing obj
}

exports.postDeleteProduct = (req, res, next) => {
    // const productId = req.params.prodId
    // didn't use this because I didnt's use params but body

    const productId = req.body.prodId
    // fetching prodId from the name field of the hidden input

    Product.deleteOne({_id: productId, userId: req.user._id})
        .then(prod => {
            console.log('product successfully deleted')
            res.redirect('admin/show-product')
        })
        .catch(err => {
            console.log(err)
        })
}




/* 
USER CONTROLLERS
*/
exports.showIndex = (req, res, next) => {
    Product.find()
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
    Product.find()
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
    Product.findById(productId)
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
    req.user
        .populate('cart.items.prodId')
        .then(user => {
            // console.log(user) uncomment this to undestand next line
            cartProducts = user.cart.items
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

    Product.findById(productId)
        // the above yields a product
        .then(product => {
            req.user.addtoCart(product)
            res.redirect('/')
        })
        .then()
        .catch(err => {
            console.log(err)
        })
}
// /* IMPORTANT */
// // add functionality to increase or reduce the cart on cart page

exports.postdeleteCart = (req, res, next) => {
    const productId = req.body.prodId;

    req.user
        .deleteCart(productId)
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => console.log(err))
}

exports.showOrders = (req, res, next) => {
    Order.find()
        .then(ordersData => {
            res.render('shop/orders', {
                pageTitle: 'Your Order',
                path: '/user-orders',
                orders: ordersData
            })
        })
}

exports.postOrders = (req, res, next) => {
    req.user
        .populate('cart.items.prodId')
        .then(cartItems => {
            const products = cartItems.cart.items.map(item => {
                // return {qty: item.qty, product: item.prodId}
                // the above won't give the actual doc I need but just the id
                return {qty: item.qty, product: {...item.prodId._doc}}
            })
            // console.log(products)
            // the above prevents me from doing stuff like =>
            // title: cartItems.cart.items.prodId.title
            const order = new Order({
                items: products,
                user: {
                    userId: req.user, // mongoose knows it'll get just the id
                    email: req.user.email
                }
            })
            return order.save()
        })
        .then(result => {
            return req.user
                .clearCart()
                .then(result => {
                    res.redirect('/cart')
                })
        })
        .catch(err => console.log(err))
}