/* 3rd-party packages */
const path = require('path');
const express = require('express');
const bp = require('body-parser'); 
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf'); // cross site request forgeryv
const flash = require('connect-flash');


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
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
        // null is what we pass as error value (telling nodejs all is well)
    },
    filename: (req, file, callback) => {
        const namePref = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, namePref + '-' + file.originalname)
        // I just set file name prefix by a snapshot of current date to
        // ensure uniqueness of images
    }
})
const filter = (req, file, callback) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        callback(null, true)
    } else { callback(null, false) }
}
const csrfProtect = csrf() // the cookie above helps identify the server-side session


/* styles & session middlewares */
app.use(bp.urlencoded({extended: false})); // converts all input data to text
app.use(multer({ storage: storage, fileFilter: filter }).single('image')) // nb: single param is form name

app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically
// app.use(express.static(path.join(__dirname, 'images')))
app.use('/images', express.static(path.join(__dirname, 'images')))
// serving folders statically means request to files in that folder will be
// handled bts by express and returned (add '/' toAll imgsrc so it is absolute)
// recall files in images are treated like they're in the root folder hence
// the need to condition express to add the /images checking for requests
// that begin with /images and serving them statically

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
        return next() // if there's no session, jump to session middleware
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next()
            }
            req.user = user
            next() // this enables to get to the next middleware
        })
        .catch(err => {
            next(new Error(err)) 
            // must use next to throw error inside async funcs(then, catch, etc)
            // this is better than consoling err cause it allows to 
            // reach next middleware
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

app.get('/500', errorController.serverError)
app.use(errorController.errorPage)

app.use((error, req, res, next) => {
    //this middleware is only reached when next is called with error 
    // passedd as its argument
    // res.redirect('/500')
    res.render('server-error', {
        pageTitle: 'Server Error',
        path: '/500',
        isAuth: req.isLoggedIn
    })
})

mongoose.connect(database_connection_url)
    .then(conn => {
        console.log('Connected to mongoDB')
        app.listen(4000)
    })
    .catch(err => {
        console.log(err)
    })

