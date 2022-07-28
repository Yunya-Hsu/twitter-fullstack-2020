const express = require('express')
const router = express.Router()
const replyController = require('../../controllers/reply-controller')

router.use(express.static('public'))
router.get('/:id/replies', replyController.getReply)

module.exports = router
