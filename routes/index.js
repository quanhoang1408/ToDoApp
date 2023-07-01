const router = require("express").Router();
const Todo = require("../models/Todo");

router.get("/", checkAuthenticated, async (req, res) => {
  const allTodo = await Todo.find();
  res.render("index", { todo: allTodo });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/index_login");
}

module.exports = router;
