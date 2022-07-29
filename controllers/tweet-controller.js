const { User, Tweet } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        const filterSelfUser = []
        users = users.forEach(user => {
          if (user.id !== helpers.getUser(req).id && user.role !== 'admin') {
            filterSelfUser.push(user)
          }
        })
        users = filterSelfUser.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
        return res.render('index', { users })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const userId = Number(helpers.getUser(req).id)
    const { description } = req.body
    if (!description) throw new Error("Description didn't exist!")
    if (description.length > 140) throw new Error('Description too long!')

    return Tweet.create({ UserId: userId, description })
      .then(() => res.redirect('/'))
      .catch(err => next(err))
  }
}
module.exports = tweetController
