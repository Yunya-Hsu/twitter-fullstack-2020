const { User, Reply, Tweet, Like } = require('../models')
const helpers = require('../_helpers')
const handlebars = require('handlebars')
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'))

const replyController = {
  getReply: (req, res, next) => {
    Promise.all([
      Tweet.findByPk(req.params.tid, {
        order: [
          [Reply, 'createdAt', 'desc']
        ],
        include: [
          { model: Reply, include: User },
          { model: User },
          { model: Like }
        ]
      }),
      User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'avatar', 'name', 'account'],
        include: [{
          model: User,
          attributes: ['id'],
          as: 'Followers'
        }],
        nest: true
      })
    ])
      .then(([tweet, users]) => {
        if (!tweet) throw new Error("tweet didn't exist!")
        tweet = JSON.parse(JSON.stringify(tweet))
        const likesNum = tweet.Likes.length
        const userInfo = tweet.User
        const currentUser = helpers.getUser(req)
        const likedTweetsId = helpers.getUser(req)?.LikeTweets ? helpers.getUser(req).LikeTweets.map(lt => lt.id) : []
        userInfo.isLiked = likedTweetsId.includes(tweet.id) ? tweet.isLiked = likedTweetsId.includes(tweet.id) : false
        console.log(currentUser)
        users = users.map(user => ({
          ...user.toJSON(),
          isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id)
        }))
        const filterSelfAndAdminUser = []
        users = users.forEach(user => {
          if (user.id !== helpers.getUser(req).id && user.role !== 'admin') {
            filterSelfAndAdminUser.push(user)
          }
        })
        users = filterSelfAndAdminUser.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
        res.render('reply', { users, tweet, userInfo, likesNum, currentUser })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const tweetId = Number(req.params.tid)
    const userId = Number(helpers.getUser(req).id)
    const comment = req.body.comment
    if (!comment) throw new Error('需要輸入文字.')
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('這則推文不存在!')
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
