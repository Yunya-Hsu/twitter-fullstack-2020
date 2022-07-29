const { User, Reply, Tweet } = require('../models')
const helpers = require('../_helpers')
const handlebars = require('handlebars')
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'))

const replyController = {
  getReply: (req, res, next) => {
    Promise.all([
      Tweet.findByPk(req.params.tid, {
        include: [
          { model: Reply, include: User },
          { model: User }
        ]
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
    ])
      .then(([tweet, users]) => {
        if (!tweet) throw new Error("tweet didn't exist!")
        users = users.map(user => ({
          ...user.toJSON()
        }))
        const filterSelfAndAdminUser = []
        users = users.forEach(user => {
          if (user.id !== helpers.getUser(req).id && user.role !== 'admin') {
            filterSelfAndAdminUser.push(user)
          }
        })
        users = filterSelfAndAdminUser.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
        res.render('reply', { tweet: tweet.toJSON() })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const tweetId = Number(req.params.tid)
    const userId = Number(helpers.getUser(req).id)
    const comment = req.body.tweet
    if (!comment) throw new Error('Need to enter words.')

    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("The tweet isn't existed.")

        return Reply.create({
          comment,
          TweetId: tweetId,
          UserId: userId
        })
      })
      .then(() => {
        req.flash('success_messages', '成功新增回覆')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = replyController
