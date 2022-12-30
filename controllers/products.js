const Product = require('../models/product')

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
    const product = new Product(title, img, price, des)
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

// exports.showCart = (req, res, next) => {
//     Cart.getCart(cart => {
//         Product.fetchAll(prods => {
//             const cartProducts = []
//             prods.forEach(prod => {
//                 console.log(prod)
//                 const cartProdData = cart.products.find(item => item.id === prod.id)
//                 if(cartProdData){
//                     cartProducts.push({prodData: prod, qty: cartProdData.qty})
//                 }
//                 // the prod value of prodData has title, imageUrl, price and 
//                 // description as it's object parameters
//             })
//             res.render('shop/cart', {
//                 pageTitle: 'Cart Page',
//                 path: '/user-cart',
//                 products: cartProducts
//             })
//         })
//     })
// }

// exports.postCart = (req, res, next) => {
//     const productId = req.body.prodId;
//     Product.fetchById(productId, prod => {
//         Cart.addProduct(productId, prod.price)
//     })
//     res.redirect('/')
// }

// exports.postdeleteCart = (req, res, next) => {
//     const productId = req.body.prodId;
//     Product.fetchById(productId, prod => {
//         const prodPrice = prod.price
//         Cart.deleteProduct(productId, prodPrice)
//         res.redirect('/cart')
//     })
//     // the prodId in req.body is coming from the input name 
//     // in form (cart.ejs file)
    
//     // Cart.deleteProduct(productId)
//     // using the Cart model requires the product price as a second argument
//     // so we need to get that from the product model, hence the need for
//     // nested callbacks
// }

// exports.showOrders = (req, res, next) => {
//     res.render('shop/orders', {
//         pageTitle: 'Your Order',
//         path: '/user-orders'
//     })
// }

// exports.showCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout Page',
//         path: '/user-checkout'
//     })
// }