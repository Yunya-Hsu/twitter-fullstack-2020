const express = require('express')
const router = express.Router()

const replyController = require('../../controllers/reply-controller')
const tweetController = require('../../controllers/tweet-controller')

router.get('/:tid/replies', replyController.getReply)
router.post('/:tid/replies', replyController.postReply)
router.get('/', tweetController.getTweets)

module.exports = router
