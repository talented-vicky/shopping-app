const User = require("../models/user")

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/main-login',
        isAuth: false
    })
}

exports.postLogin = (req, res, next) => {
    User.findById("63bb1d61c09b6bd8199a3297")
        .then(user => {
            req.session.isLoggedIn = true
            // now isLoggedIn is set as true
            req.session.user = user
            console.log('Session initiated for this user')
            res.session.save(err => {
                console.log(err)
                res.redirect('/')
                // I normally don't need to save but just to be sure my session
                // is saved before I continue due to that milisec gap stuff noticed

                // because a redirect is normally fired  independent of the session
                // and may finish hence trigger rendering of a new page before the 
                // session was updated in the server and db
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