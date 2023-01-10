const path = require('path');
const express = require('express');
const bp = require('body-parser'); 
const mongoose = require('mongoose')

require('dotenv').config()
const database_connection_url = process.env.database_connection_url

const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error');

const app = express();

app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
    User.findById("63bb1d61c09b6bd8199a3297")
        .then(user => {
            req.user = user
            next() // this enables to get to the next middleware => adminRoutes
        })
        .catch(err => {
            console.log("Error finding user")
        })
})

app.use('/admin', adminRoutes) //filtering all paths from adminRoutes
app.use(shopRoutes) // its ideal this comes before admin routes though

app.use(errorController.errorPage)


mongoose.connect(database_connection_url)
    .then(conn => {
        console.log('Connected to mongoDB')
        User.findOne()
            .then(userF => {
                if(!userF){
                    const user = new User({
                        name: 'talented_vicky',
                        email: 'vickytest@gmail.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
                app.listen(4000)
            })
    })
    .catch(err => {
        console.log(err)
    })

