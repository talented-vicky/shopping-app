const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const nodemailerSendgrid = require('nodemailer-sendgrid')
const { validationResult } = require('express-validator')

const technicalErrorCtr = (nexxx, err) => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return nexxx(error)
}

const User = require("../models/user")

require('dotenv').config()
const api_key = process.env.api_key

const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
        auth: {
            api_key: api_key
        }
    })
)

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/main-login',
        isAuth: false,
        loginError: null,
        inputValue: {
            email: "",
            password: ""
        },
        errorsArray: [] // for css dynamic style
    })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/main-signup',
        isAuth: false,
        signupError: null,
        inputValue: {
            email: "",
            password: ""
        },
        errorsArray: []
    })
}

exports.postLogin = (req, res, next) => {
    const userEmail = req.body.email
    const userPassword = req.body.password
    const errors = validationResult(req)

    // work on dynamic styling error on login form

    User.findOne({email: userEmail})
        .then(user => {
            if(!user){
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/main-login',
                    loginError: "The user was not found in database, please sign up",
                    inputValue: {
                        email: userEmail,
                        password: userPassword
                    },
                    errorsArray: errors.array() // for css dynamic style
                })
            }
            bcrypt.compare(userPassword, user.password)
                .then(passwordMatch => {
                    if(!passwordMatch){
                        return res.status(422).render('auth/login', {
                            pageTitle: 'Login',
                            path: '/main-login',
                            loginError: 'password entered is incorrect',
                            inputValue: {
                                email: userEmail,
                                password: userPassword
                            },
                            errorsArray: errors.array()
                        })
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
        .catch(err => technicalErrorCtr(next, err))
}

exports.postSignup = (req, res, next) => {
    const userEmail = req.body.email
    const userPassword = req.body.password
    const errors = validationResult(req)

    if(!errors.isEmpty()){ // false means there are errors
        console.log(errors.array()) // check this to understand code in the future
        
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/main-signup',
            isAuth: false,
            signupError: errors.array()[0].msg,
            inputValue: {
                email: userEmail,
                password: userPassword
            },
            errorsArray: errors.array()
        })
    }
    bcrypt
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
                from: 'victorotubure7@gmail.com',
                subject: 'Account creation successful',
                html: '<h1> Congratulations, you have successfully created an account. Please go back to the login page and login with your email</h1>'
            })
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('rError')
    if (message.length > 0){
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', {
        path: '/login', // as if we're still on login page
        pageTitle: 'Reset Password',
        resetError: message
    })
}

exports.postReset = (req, res, next) => {
    // cryto helps generate tokens with expiry dates which I can send
    // to the user (and I'll be sure it came only from my app)
    // and enhances the security of my app users
    crypto.randomBytes(32, (err, buff) => {
        if(err){
            req.flash('rError', 'Oops! Unable to generate token')
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buff.toString('hex')
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    req.flash('rError', 'Sorry, there is NO user with the email entered')
                    return res.redirect('/reset')
                }
                tokenReset = token
                tokenExpiration = Date.now() + 3600000 // expires in an hour
                return user.save()
            })
            .then(result => {
                res.redirect('/login')
                transporter.sendMail({
                    to: req.body.email,
                    from: 'nodejs_shopApp@gmail.com',
                    subject: 'Request for password reset',
                    html: `
                        <h1> Hellow ${User.email} </h1>
                        <h2> A request has been received to change your password </h2>
                        <p> click on this <a href="http://localhost:4000/passchange/${token}"> link </a> to continue reset </p>
                    `
                })
            })
            .catch(err => console.log(err))
    })
}

exports.getPassChanged = (req, res, next) => {
    const token = req.params.mytoken
    User.findOne({tokenReset: token, tokenExpiration: {$gt: Date.now()}})
        .then(user => {
            message = req.flash('pError')
            if(message.length > 0){
                message = message[0]
            } else {
                message = null
            }
            res.reder('auth/passchanged', {
                path: '/login',
                pageTitle: 'Password Changed',
                passError: message,
                storedUser: user._id.toString(), // Now passed into the ejs form file
                storedToken: token
            })
        })
        .catch(err => technicalErrorCtr(next, err))
}

exports.postPassChanged = (req, res, next) => {
    const userId = req.body.userID // retrieving from the ejs form file
    const token = req.body.tokenID
    const pass = req.body.password
    const confirmPass = req.body.confirmPassword

    if (confirmPass !== pass){
        console.log('passwords do not match')
        req.flash('pError', 'Passwords do not match!')
        return res.redirect('/')
    }
    let newUser;
    User.findOne({
        tokenReset: token, 
        tokenExpiration: {$gt: Date.now()},
        _id: userId.toString()
    })
        .then(user => {
            newUser = user
            return bcrypt.hash(pass, 12)
        })
        .then(hashedPassword => {
            newUser.tokenReset = undefined
            newUser.tokenExpiration = undefined
            newUser.password = hashedPassword
            return newUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => technicalErrorCtr(next, err))
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