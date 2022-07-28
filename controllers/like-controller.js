const { Tweet } = require('../models')
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
    }
}

module.exports = likeController