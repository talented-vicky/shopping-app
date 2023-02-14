exports.errorPage = (req, res, next) => {
    res.status(404).render('error-page', {
        pageTitle: "Error Page",
        path: '/400',
        isAuth: req.isLoggedIn
    })
}

exports.serverError = (req, res, next) => {
    res.status(500).render('server-error', {
        pageTitle: "Server Error",
        path: '/500',
        isAuth: req.isLoggedIn
    })
}

// status codes
/*
2XX => success
    200 => operation
    201 => creation
3xx => (301) redirect
4xx => client  error
    401 => not authenticated
    403 => not authorized
    404 => not found
    422 => invalid input
5xx => (500) server error 
*/