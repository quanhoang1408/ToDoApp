const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const { get } = require("mongoose");
const User = require("./User");

function initialize(passport, getUserByEmail, getUserById) {
  
  const authenticateUser = async (email, password, done) => {
    //const {user} = getUserByEmail(email);
    let user = await (getUserByEmail(email));
    if (user == null) {
      console.log("No user");
    } 
    // console.log(user);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }
    try {
      console.log ('user', password);
      console.log('hash', user[0].password);
      if (await bcrypt.compare(password, user[0].password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      console.log(e);
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser)); //use email as username
  passport.serializeUser((user, done) => done(null, user[0].id)); //save user id inside session
  passport.deserializeUser((id, done) => {
    //get user id from session
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
