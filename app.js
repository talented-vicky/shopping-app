const path = require('path');
const express = require('express');
const bp = require('body-parser'); 

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express();

app.use(bp.urlencoded({extended: false}));

app.use('/admin', adminRoutes) //filtering all paths from adminRoutes

app.use(shopRoutes) // its ideal this before admin routes

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'error-page.html'))
})

app.listen(4000) //this creates server and listens too