/* 3rd-party packages */
const path = require('path');
const express = require('express');
const bp = require('body-parser'); 
const mongoose = require('mongoose')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')(session)


require('dotenv').config()
const database_connection_url = process.env.database_connection_url

const User = require('./models/user')

/* ROUTES */
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const errorController = require('./controllers/error');

/* methods */
const app = express();
const store = new mongodbStore({
    uri: database_connection_url,
    collection: 'sessions'
})
// the cookie here helps identify the server-side session

/* styles & session middlewares */
app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically
app.use(session({
    secret: 'y789iuheghj', resave: false, 
    saveUninitialized: false, store: store
}))

/* templating engines */
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
    // User.findById("63bb1d61c09b6bd8199a3297")
    //     .then(user => {
    //         req.session.user = user
    //         next()
    //     })
    // using this would mean I'd have to change all req.session.user to req.user
    if(!req.session.user){
        return next()
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user
            next() // this enables to get to the next middleware => adminRoutes
        })
        .catch(err => {
            console.log("Error finding user")
        })
})

/* route middlewares */
app.use('/admin', adminRoutes) //filtering all paths from adminRoutes
app.use(shopRoutes) // its ideal this comes before admin routes though
app.use(authRoutes)

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

