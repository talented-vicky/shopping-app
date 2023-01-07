const path = require('path');
const express = require('express');
const bp = require('body-parser'); 
const mongoose = require('mongoose')

// const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error');

const app = express();

app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically

app.set('view engine', 'ejs')
app.set('views', 'views')

// app.use((req, res, next) => {
//     User.findbyId("63af3a9564885bb7a6009d91")
//         .then(user => {
//             // req.user = user 
//             // only holds properties of the user from db and not the methods
//             req.user = new User(
//                 user.firstname, user.lastname, user.email, user.cart, user._id
//                 ) // now we have access to the user methods
//             // manually creating a user (from my model) method on request
//             // so I can always access user on all requests (see postAddproduct Ctrl)
//             next() // this enables to get to the next middleware => adminRoutes
//         })
//         .catch(err => {
//             console.log("Error finding user")
//         })
// })

app.use('/admin', adminRoutes) //filtering all paths from adminRoutes
app.use(shopRoutes) // its ideal this comes before admin routes though

app.use(errorController.errorPage)

mongoose.connect("mongodb+srv://talented_vicky:DameeBlaq@talented-vicky.uaveq.mongodb.net/shop?retryWrites=true&w=majority")
    .then(conn => {
        app.listen(4000)
        console.log('Connected to mongoDB')
    })
    .catch(err => {
        console.log(err)
    })