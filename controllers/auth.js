const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-transport-sendgrid')

const User = require("../models/user")

require('dotenv').config()
const api_key = process.env.api_key

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: api_key
    }
}))

exports.getLogin = (req, res, next) => {
    console.log(api_key)
    let message = req.flash('Error')
    if(message.length > 0){
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/main-login',
        isAuth: false,
        loginError: message
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('userError')
    if(message.length > 0){
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/main-signup',
        isAuth: false,
        signupError: message
    })
}

exports.postLogin = (req, res, next) => {
    const userEmail = req.body.email
    const userPassword = req.body.password

    User.findOne({email: userEmail})
        .then(user => {
            if(!user){
                req.flash('Error', "The user was not found in database, please sign up")
                return res.redirect('/login')
            }
            bcrypt.compare(userPassword, user.password)
                .then(passwordMatch => {
                    if(!passwordMatch){
                        req.flash('Error', 'passwords do not match')
                        return res.redirect('/login')
                    }
                    req.session.isLoggedIn = true
                    req.session.user = user
                    console.log('Passwords match and session initiated for this user')
                    return req.session.save(err => {
                        console.log(err)
                        res.redirect('/')
                        // I normally don't need to save but just to be sure my session
                        // is saved before I continue due to that milisec gap stuff noticed

                        // because a redirect is normally fired  independent of the session
                        // and may finish hence trigger rendering of a new page before the 
                        // session was updated in the server and db
                    })
                })
                .catch(compareErr => console.log(compareErr))
        })
        .catch(err => {
            console.log("Error finding user")
            console.log(err)
        })
}

exports.postSignup = (req, res, next) => {
    const userEmail = req.body.email
    const userPassword = req.body.password
    const confirmPassword = req.body.confirmPassword
    // do a normal confrim password check

    User.findOne({email: userEmail})
        .then(userDoc => {
            if(userDoc){
                req.flash('userError', 'user already exists, please login')
                return res.redirect('/signup')
            }
            return bcrypt
                .hash(userPassword, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: userEmail,
                        password: hashedPassword,
                        cart: {items: []}
                    })
                    return user.save()
                })
                .then(result => {
                    console.log('Successfully created account')
                    res.redirect('/login')
                    return transporter.sendMail({
                        to: userEmail,
                        from: 'nodejs_shopApp',
                        subject: 'Account creation successful',
                        html: '<h1> Congratulations, you have successfully created an account. Please go back to the login page and login with your email</h1>'
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}

// we typically use a session when we have sensitive data belonging to a 
// particular user we don't wanna lose after every response and which we 
// don't want shared across multiple users but which we want available 
// across multiple requests by the same user
// note that you can actually store anything in sessions (like cart) but
// by convention, you simply store user authentication status in them

// attached to every session is a cookie (an identifier which tells which
// user a session belongs to => so they're basically identifiers, nothing more)

// cookies on the other hand are useful for storing data on the client side
// which can be viewed (but also manipulated which is bad becauase then) 
// every user can always tamper with every other user's "secure" data
// case scenario => a user can manipulate his authenticity so as to carry
// out fraudulent acts, ygtv now yeah?

// TYPE-1 ==> session cookies (not session identifiers => which are cookies that are
// attached with sessions) are those whose expirations dates never outlive 
// the browser
// TYPE-2 ==> permanent cookies are session cookies with expiration dates (and their 
// names are not literal, they're just called permanent b'cos they don't
// necessarily have to die when the page on the browser is closed)