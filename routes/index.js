const router = require("express").Router();
const Todo = require("../models/Todo");
const passport = require("passport");
const User = require("../models/User");
router.get("/", checkAuthenticated, async (req, res) => {
  console.log( req.session.passport);
  const {user} = req.session.passport;
  console.log(user);
  const allTodo = await Todo.find({user: user});
  const getUser = await User.find({_id: user});
  console.log(getUser)
  res.render("index", { 
    todo: allTodo,
    name: getUser[0].name
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/index_login");
}

module.exports = router;
