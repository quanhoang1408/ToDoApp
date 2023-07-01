const router = require("express").Router();
const Todo = require("../models/Todo");
const passport = require("passport");
router.get("/", checkAuthenticated, async (req, res) => {
  console.log( req.session.passport);
  const {user} = req.session.passport;
  console.log(user);
  const allTodo = await Todo.find({user: user});
  res.render("index", { todo: allTodo });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/index_login");
}

module.exports = router;
