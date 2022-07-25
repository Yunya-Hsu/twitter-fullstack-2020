const tweetController = {
  getTweets: (req, res) => {
    return res.render('index')
  },
  getReply: (req, res) => {
    return res.render('reply')
  }
}

module.exports = tweetController
