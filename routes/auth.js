const express = require('express');
const router = express.Router();

const { body } = require('express-validator')

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.get('/reset', authController.getReset)

router.post('/login', 
    [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password', 'password can not have length smaller than 8')
        .isLength({min: 8})
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
)

router.post('/signup', 
    [
    body('email')
        .isEmail().withMessage('Please enter a valid email') 
        //the above only works when the "novalidator" param is passed in the form
        .custom((val, {req}) => {
            // express-validator checks custom validator to r-e-t-u-r-n a thrown 
            // ERROR or a PROMISE and hence waits for the userfindOne 
            // from mongoDB
            return User.findOne({email: val}) // promise => every then block implicitly returns a new promise
                // hence expressValidator waits for our promise to be fulfilled
                // involving reaching our database which is not an instantaneous stuff
                // fulfilling in this case means no error was thrown therefore
                // treating the validation as successful
                .then(userInfo => {
                    if(userInfo){
                        // making it into this block would trigger express
                        // validator to detect a rejection and store it as an error
                        return Promise.reject('Email already exists')
                    }
                }) 
        })
        .normalizeEmail(), // turning to lowercase
    body('password', 'Password should contain at least 8 char to include numbers and aphabets')
        .isLength({min: 8, max: 19}).isAlphanumeric()
        .isAlphanumeric()
        // .withMessage('Password should contain at least 8 char and only numbers and special characters')
        .trim(),
    body('confirmPassword')
        .trim() // removing all white spaces
        .custom((val, {req}) => {
            if(val !== req.body.password){
                // the default returns true or we throw an error to customize
                // our own error
                throw new Error('Passwords do not match')
            }
            return true; // this is if we succeed
        })
    ],
    authController.postSignup
)

router.post('/logout', authController.postLogout)

router.post('/reset', authController.postReset)

router.get('/passchange/:mytoken', authController.getPassChanged)

router.post('/passchange', authController.postPassChanged)

module.exports = router