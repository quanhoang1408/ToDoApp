const router = require("express").Router();
const Todo = require("../models/Todo");

//routes
router
  .post("/add/todo", (req, res) => {
    const { todo } = req.body;
    console.log(req.body);
    console.log(todo);
    const newTodo = new Todo({ todo });
    newTodo
      .save()
      .then(() => {
        console.log("success added");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })

  .get("/delete/todo/:_id", (req, res) => {
    const { _id } = req.params;
    Todo.deleteOne({ _id })
      .then(() => {
        console.log("Deleted Todo Successfully!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })

  .get("/index_login", checkNotAuthenticated, (req, res) => {
    res.render("index_login");
  })

  .get("/index_register", checkNotAuthenticated, (req, res) => {
    res.render("index_register");
  });

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
