const express = require("express");

const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost/todo_express", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});
//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine", "ejs");

//routes
app.use(require("./routes/index"))
app.use(require("./routes/todo"))

app.listen(5002, ()=> console.log("listening on port 5002"));