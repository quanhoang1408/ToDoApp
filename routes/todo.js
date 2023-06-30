const router = require('express').Router()
const Todo = require("../models/Todo")

//routes
router.post("/add/todo", (req,res)=>{
    const { todo } = req.body;
    const newTodo = new Todo({todo})
    newTodo.save()
    .then(()=>{
        console.log("success added")
        res.redirect("/")
    })
    .catch((err)=> console.log(err))
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
.get("/index_login", (req,res)=>{
    res.render("index_login");
})

.get("/index_register", (req,res)=>{
    res.render("index_register");
})
;
module.exports = router;