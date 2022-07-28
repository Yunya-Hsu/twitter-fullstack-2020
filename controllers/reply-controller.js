const { User, Reply, Tweet } = require('../models')
const replyController = {
  getReply: (req, res, next) => {
    // return User.findByPk(req.params.id, {
    //   include: [
    //     { model: Reply, include: Tweet }
    //   ]
    // })
    return User.findByPk(req.params.id, {
      include: [
        { model: Reply, include: Tweet }
      ]
    })
    // Tweet.findByPk(req.params.id, {
    //   raw: true,
    //   nest: true
    // })

      .then(user => {
        const replyId = req.params.id
        console.log('1233211234567', replyId)
        console.log('oneroijnfionforew2', user.toJSON().Replies)
        console.log('user', user.toJSON())
        // console.log('tweet', tweet)
        if (!user) throw new Error("user didn't exist!")
        res.render('reply', { user: user.toJSON(), replyId })
      })
      .catch(err => next(err))
  }
}

module.exports = replyController
