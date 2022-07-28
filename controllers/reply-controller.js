const { User, Reply, Tweet } = require('../models')
const tweetServices = require('../services/tweet-services')
const handlebars = require('handlebars')
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'))

const replyController = {
  getReply: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId, {
      include: [
        { model: Reply, include: User },
        { model: User }
      ]
    })
      .then(tweet => {
        console.log(req.params.tweetId)
        console.log(tweet)
        if (!tweet) throw new Error("tweet didn't exist!")
        tweetServices.getFollowing(req, (err, users) => err ? next(err) : res.render('reply', { users: users.users, tweet: tweet.toJSON() }))
      })
      .catch(err => next(err))
  }
}

module.exports = replyController
