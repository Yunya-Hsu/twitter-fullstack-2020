const { User } = require('../models')
const tweetServices = {
  getFollowing: (req, cb) => {
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
          if (user.id !== req.user.id) {
            filterSelfUser.push(user)
          }
        })
        users = filterSelfUser
        return cb(null, { users: users })
      })
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
