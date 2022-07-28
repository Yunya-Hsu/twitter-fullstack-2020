const { Tweet, Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
    getUserLike: (req, res, next) => {
        const userId = Number(req.params.id)

        return Tweet.findAll({ where: { userId }, raw: true, nest: true })
            .then(tweets => {
                if (!tweets.length) throw new Error("There isn't tweet that user liked.")

                res.json({ status: 'success', ...tweets })
            })
            .catch(err => next(err))
    },
    postLike: (req, res, next) => {
        const tweetId = Number(req.params.id)
        const userId = Number(helpers.getUser(req))

        return Tweet.findByPk(tweetId)
            .then(tweet => {
                if (!tweet) throw new Error("This tweet isn't Existed.")

                return Like.create({
                    UserId: userId,
                    TweetId: tweetId
                })
            })
            .then(() => res.redirect('back'))
            .catch(err => next(err))
    }
}

module.exports = likeController