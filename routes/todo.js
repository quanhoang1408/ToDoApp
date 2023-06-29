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

  .get("/edit/todo/:_id", (req, res) => {
    console.log(req.body);
    const _id = req.params._id;
    const newNoteContent = req.body.content;
    Todo.updateOne({ _id }, { $set: { todo: newNoteContent } })
      .then(() => {
        console.log("Updated Todo Successfully!");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });
module.exports = router;