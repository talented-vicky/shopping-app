module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
        console.log("Access denied, please login")
        return res.redirect('/login')
    }
}

// checking authentication status with session on server side
// this helps for routes protection, preventing user from manipulating the web
// page to make changes