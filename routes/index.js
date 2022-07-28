const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')
const tweets = require('./modules/tweets')

const followships = require('./modules/followships')
const userController = require('../controllers/user-controller')

const { authenticatedUser } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.use('/tweets', authenticatedUser, tweets)
router.use('/followships', authenticatedUser, followships)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', authenticatedUser, userController.logout)
router.get('/users/:userId', authenticatedUser, userController.getProfile)
router.use('/', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', generalErrorHandler)

module.exports = router
