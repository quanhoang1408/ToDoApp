const initializePassport = require("../models/Passport");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

initializePassport(
  passport,
  (email) => User.find({ email: email }),
  (_id) => User.find({ id: _id })
);

//routes
router
  .post("/register", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      let user = await User.find({ email: req.body.email });

      if (user.length > 0) {
        res.redirect("/index_register?error=Email%20already%20exists");
      } else {
        user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
        user.save();
        User.find();
        res.redirect("/index_login");
      }
    } catch (e) {
      console.log(e);
      res.redirect("/index_register");
    }
  })
  .post(
    "/login",
    passport.authenticate("local", {
      //use local strategy
      successRedirect: "/",
      failureRedirect: "/index_login",
      failureFlash: true,
    })
  )
  .delete("/logout", (req, res) => {
    req.logOut(req.user, (err) => {
      if (err) {
        return next(err);
      }
    });
    res.redirect("/index_login");
  });

module.exports = router;
