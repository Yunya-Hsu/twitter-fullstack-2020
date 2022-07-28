const express = require('express')
const router = express.Router()

const replyController = require('../../controllers/reply-controller')
const tweetController = require('../../controllers/tweet-controller')

router.get('/:id/replies', replyController.getReply)
router.get('/', tweetController.getTweets)

module.exports = router
