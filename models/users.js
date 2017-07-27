var User = require('../lib/mongo').User;

module.exports = {
  // Register an user
  create: function create(user) {
    return User.create(user).exec();
  },

  // Get the user info from username
  getUserByName: function getUserByName(name) {
    return User
      .findOne({ name: name})
      .addCreatedAt()
      .exec();
  }

};  