const { User, Tweet, Reply } = require('../models')

const apiController = {
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        Reply,       
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(data => {
        const user = data.toJSON()
        delete user.password
        res.json({ status: 'success', data: user })
      })
      .catch(err => next(err))
  }
}

module.exports = apiController
