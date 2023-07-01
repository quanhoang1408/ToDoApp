const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");


function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
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
  passport.serializeUser((user, done) => done(null, user.id)); //save user id inside session
  passport.deserializeUser((id, done) => {
    //get user id from session
    return done(null, getUserById(id));
  });
}

module.exports = initialize;