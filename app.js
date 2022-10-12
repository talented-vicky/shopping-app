const path = require('path');
const express = require('express');
const bp = require('body-parser'); 

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error');

const app = express();

app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use('/admin', adminRoutes) //filtering all paths from adminRoutes

app.use(shopRoutes) // its ideal this comes before admin routes
app.use(errorController.errorPage)

app.listen(4000) //this creates server and listens too


// // 10) to convert a time from 12hr AM/PM format into a military(24-hr) time
// const timeConversion = s => {
//     //
// }
// timeConversion('12:00')


// storing data in an array
// const products = []


// module.exports = class Product {
//     constructor(tit){
//         this.title = tit
//     }

//     save() {
//         products.push(this)
//     };
//     // this would refer to the object created based on the class
//     // or simply say, on any instantiated object based on 'Product'

//     static fetchAll() {
//         return products;
//     };
//     // static ensures I'm calling fetchall directly on the class itself and
//     // not on an istantiated object
// }