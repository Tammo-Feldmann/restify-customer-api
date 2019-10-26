const errrors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = server => {
  //Register User
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        //Hash Password
        user.password = hash
        //Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next()
        } catch (err) {
          return next(new errors.InternalErrors(err.message));
        }
      });
    });
  });
}