'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {})

  Tweet.associate = function (models) {
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
  }
  return Tweet
}
