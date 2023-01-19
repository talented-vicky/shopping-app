/* 3rd-party packages */
const path = require('path');
const express = require('express');
const bp = require('body-parser'); 
const mongoose = require('mongoose')
const session = require('express-session')
const mongodbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf') // cross site request request forgeryv
const flash = require('connect-flash')


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
const csrfProtect = csrf()
// the cookie above helps identify the server-side session

/* styles & session middlewares */
app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically
app.use(session({
    secret: 'y789iuheghj', resave: false, 
    saveUninitialized: false, store: store
}))
app.use(csrfProtect)
app.use(flash())

/* templating engines */
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
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

app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken() // key gotten from logout form
    next()
    // locals let the above to be passed into every view rendered
    // I had to pass <input type="hidden" name="_csrf" value="<%= csrfToken %>"> 
    // into all post views
})

/* route middlewares */
app.use('/admin', adminRoutes) //filtering all paths from adminRoutes
app.use(shopRoutes) // its ideal this comes before admin routes though
app.use(authRoutes)

app.use(errorController.errorPage)


mongoose.connect(database_connection_url)
    .then(conn => {
        console.log('Connected to mongoDB')
        app.listen(4000)
    })
    .catch(err => {
        console.log(err)
    })

