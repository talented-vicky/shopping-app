const Product = require('../models/product')
const Order = require('../models/order')
const fs = require('fs')
const path = require('path')
const pdfDoc = require('pdfkit')

const stripe = require('stripe')("sk_test_51MqN5FKLUvbrwYJxl03b6yAiHNnjbMvf5NNzd6Pg5jTnzNJ46McbBYQ59Uu42as2S3p5nuRE7ORsSxWFxMaLpROF003yLkYdcH")

const urlPathDelete = require('../helper/url')
const { validationResult } = require('express-validator')

const technicalErrorCtr = (nexxx, err) => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return nexxx(error) 
}
const item_per_page = 2;
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
        errorPresent: false,
        addprodError: null,
        errorArray: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const image = req.file
    const price = req.body.price
    const des = req.body.description
    const errors = validationResult(req)

    if(!image){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/addEdit-product',
            editing: false,
            errorPresent: true,
            addprodError: 'Attached file is not an image',
            prod: { title: title, price: price, description: des },
            errorArray: []
        }) 
    }

    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/addEdit-product',
            editing: false,
            errorPresent: true,
            addprodError: errors.array()[0].msg,
            prod: { title: title, price: price, description: des },
            errorArray: errors.array()
        })
    }

    const product = new Product({ 
        title: title, imageUrl: image.path, price: price, 
        description: des, userId: req.user 
        // userId: req.user => mongoose understands to store just 
        // the user._id and not all values
    })
    // keys point at prod schema while values point at const variable defined
    product.save()
        .then(result => {
            console.log('Successfully created product')
            res.redirect('/')
        })
        .catch(err => technicalErrorCtr(next, err))
}

exports.getMyProduct = (req, res, next) => {
    const page = +req.query.page || 1
    let prodQty;
    Product.find()
        .countDocuments()
        .then(docCount => {
            prodQty = docCount
            return Product.find({userId: req.user._id}) // confirming if it's logged in user
                    .skip((page - 1) * item_per_page)
                    .limit(item_per_page)
            // check app.js file for user initialization (req.user = user)
            // .select('title price -_id')
            // now I'm fetching just title and price, _id is automatically fetched
            // so I had to exclude it if I didn't want to retrieve it 4rm database
            // .populate('userId')
            // the above is now the field I wanna display 4rm what I've selected        
        })
        .then(product => {
            res.render('admin/show-product', {
                prods: product,
                pageTitle: 'Admin All Products',
                path: '/show-product',
                currentPage: page,
                prevPage: page - 1,
                nextPage: page + 1,
                hasNextpage: (page * item_per_page) < prodQty,
                semilastPage: Math.ceil(prodQty / item_per_page) - 1,
                lastPage: Math.ceil(prodQty / item_per_page)
            })
        })
        .catch(err => technicalErrorCtr(next, err))
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
                errorPresent: false,
                prod: product,
                addprodError: null,
                errorArray: []
            })
        })
        .catch(err => technicalErrorCtr(next, err))
    // remember we have access to all the key values in the ejs files
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId
    // I just fetched the id {name: productId, value: prod._id} 
    // (when on edit mode) from the hidden input in edit-product.ejs
    const updTitle = req.body.title
    const image = req.file
    const updPrice = req.body.price
    const updDes = req.body.description
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/onlyEdit-product',
            editing: true,
            errorPresent: true,
            addprodError: errors.array()[0].msg, // displaying error
            errorArray: errors.array(), // searching through errors
            prod: { 
                title: updTitle, price: updPrice, description: updDes, 
                _id: prodId //which will now be re-available in form
            }, // keeping original user input
        })
    }    

    // getting to this stage means we made it past the validation
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
            if(image){
                urlPathDelete.deteleFile(product.imageUrl)
                product.imageUrl = image.path
            } // if the user doesn't pick an image, url will be the old one
            product.price = updPrice
            product.description = updDes
            product.userId = req.user
            return product.save()
            // note I called save on the result "product" not on model "Product"
            .then(result => {
                console.log('Successfully updated product')
                res.redirect('/admin/show-product')
            })
        })
        .catch(err => technicalErrorCtr(next, err))
        // mongoose does a bts update anytime we call save on an existing obj
}

exports.deleteProduct = (req, res, next) => {
    // const productId = req.body.prodId
    // fetching prodId from the name field of the hidden input
    
    const productId = req.params.prodId
    Product.findById(productId)
        .then(prod => {
            if(!prod){
                return next(new Error('Product not found, sorry!'))
            }
            urlPathDelete.deteleFile(prod.imageUrl)
            return Product.deleteOne({_id: productId, userId: req.user._id})
        })
        .then(prod => {
            console.log('product successfully deleted')
            res.status(200).json({msg: "delete success!"})
        })
        .catch(err => res.status(500).json({msg: "server error deleting"}));
}




/* 
USER CONTROLLERS
*/
exports.showIndex = (req, res, next) => {
    const page = +req.query.page || 1//plus ensures I always have an int
    // fetched from param passed into index.ejs file (value after equal sign)
    let prodQty;

    Product.find()
        .countDocuments()
        .then(prodQuantity => {
            prodQty = prodQuantity
            return Product.find()
                .skip((page - 1) * item_per_page)
                .limit(item_per_page)
        })
        .then(product => {
            res.render('shop/index', {
                prods: product, 
                pageTitle: 'Index Page',
                path: '/',
                currentPage: page,
                nextPage: page + 1,
                prevPage: page - 1,
                hasNextpage: (page * item_per_page) < prodQty,
                // hasPrevpage: prodQty < 1,
                semilastPage: Math.ceil(prodQty / item_per_page) - 1,
                lastPage: Math.ceil(prodQty / item_per_page)
            })
        })
        .catch(err => technicalErrorCtr(next, err))
}

exports.showProducts = (req, res, next) => {
    const page = +req.query.page || 1
    let totalQty;
        
    Product.find()
        .countDocuments()
        .then(docCount => {
            totalQty = docCount
            return Product.find()
                .skip((page - 1) * item_per_page)
                .limit(item_per_page)
        })
        .then(product => {
            res.render('shop/product-list', {
                prods: product, 
                pageTitle: 'Shop Page',
                path: '/user-products',
                currentPage: page,
                prevPage: page - 1,
                nextPage: page + 1,
                hasNextpage: (page * item_per_page) < totalQty,
                semilastPage: Math.ceil(totalQty / item_per_page) - 1,
                lastPage: Math.ceil(totalQty / item_per_page)
            })
        })
        .catch(err => technicalErrorCtr(next, err))
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
        .catch(err => technicalErrorCtr(next, err))
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
        .catch(err => technicalErrorCtr(next, err))
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
        .catch(err => technicalErrorCtr(next, err))
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
        .catch(err => technicalErrorCtr(next, err))
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
        .catch(err => technicalErrorCtr(next, err))
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
        .catch(err => technicalErrorCtr(next, err))
}

exports.showCheckoutSuccess = (req, res, next) => {

}

exports.showCheckout = (req, res, next) => {
    const orderID = req.params.orderId;
    let sum;
    let orderDetails;
    
    Order.findById(orderID)
        .then(order => {
            if(!order){
                return next(new Error('No order found'))
            }
            if(order.user.userId.toString() !== req.user._id.toString()){
                return next(new Error('Not authorized to checkout'))
            }
            orderDetails = order.items;
            sum = 0;
            order.items.forEach(o => {
                sum += o.qty * o.product.price
            })
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: orderDetails.map(order => {
                    return {
                        name: order.product.title,
                        description: order.product.description,
                        amount: Math.round(order.product.price),
                        currency: 'usd',
                        quantity: order.qty
                    }
                }),
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
                // translates to 'http://localhost/checkout/success'
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            })
        })
        // check back reset password funtionality
        // fix is definitely be removing apikey from .env variable
        .then(session => {
            res.render('shop/checkout', {
                pageTitle: 'Checkout',
                path: '/user-checkout',
                orders: orderDetails,
                totalsum: sum,
                sessionId: session.id
            })
        })
        .catch(err => console.log(err))
        // .catch(err => technicalErrorCtr(next, err))
}

exports.getInvoice = (req, res, next) => {
    const invoiceID = req.params.invoiceId
    Order.findById(invoiceID)
        .then(order => {
            if(!order){
                return next(new Error('No order found'))
            }
            if(order.user.userId.toString() !== req.user._id.toString()){
                // left = user Id attached to current invoice // right = Id of current logged in user
                return next(new Error('Not authorized to view/download invoice'))
            }
            const invoiceName = 'invoice-' + invoiceID + '.pdf'
            const invoicePath = path.join('data', 'invoices', invoiceName)
            const doc = new pdfDoc()

            res.setHeader('Content-type', 'application/pdf') // helps open files in browser as inline (by default)
            res.setHeader('Content-Disposition', 'inline: filename="' + invoiceName + '"') // provides save as option
            
            doc.pipe(fs.createWriteStream(invoicePath))
            doc.pipe(res)

            doc.font('Times-Roman').fontSize(40).text('Invoice')

            doc.fontSize(14).text('talented_vicky')
            doc.fontSize(14).text('14, George Wells Street, NY')
            doc.fontSize(14).text('+234 708 878 0964')
            doc.fontSize(14).text('victorotubure7@gmail.com')
            doc.moveDown()

            const currentDate = new Date()
            const day = currentDate.getDay()
            const month = currentDate.getMonth()
            const year = currentDate.getFullYear()
            doc.fontSize(14).text('Issued Date: ' + day + '/' + month + '/' + year, {align: 'right'})
            doc.fontSize(14).text('Due Data: ' + (day + 7) + '/' + month + '/' + year, {align: 'right'})
            doc.moveDown()

            doc.lineCap('square').moveTo(250, 20).circle(275, 30, 15).stroke();
            doc.fontSize(18).text('ITEMS DESCRIPTION  QTY  UNIT_PRICE  TOTAL')
            
            let total = 0
            order.items.forEach(prod => {
                doc.fontSize(15).text(prod.product.title + ' ' + prod.qty + ' ' + prod.product.price + ' ' +(prod.qty * prod.product.price), {align: 'justify'})
                total = total + (prod.qty * prod.product.price)
            })
            doc.moveDown()
            
            const vat = 0.05 * total
            const dis = 0.02 * total
            doc.text('Subtotal == ' + '$' + total, {align: 'right'})
            doc.text('VAT (5%) == ' + '$' + vat.toFixed(3), {align: 'right'})
            doc.text('Discount (2% off) == ' + '$' + dis.toFixed(3), {align: 'right'}).moveDown()
            doc.text('Total == ' + '$' + (total + vat - dis), {align: 'right'}).moveDown()

            doc.font('Times-Roman').fontSize(16).text('Thank you for shopping with us')
            doc.end()
        })
        .catch(err => next(err))

}
