const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')
const followships = require('./modules/followships')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const { authenticatedUser } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
router.use(express.static('public'))
router.use('/admin', admin)
router.use('/followships', authenticatedUser, followships)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', authenticatedUser, userController.logout)
router.get('/users/:userId', authenticatedUser, userController.getProfile)
router.get('/tweets', authenticatedUser, tweetController.getTweets)
router.get('/reply', authenticatedUser, tweetController.getReply)
router.use('/', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', generalErrorHandler)

module.exports = router
