const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');

const mongoose = require('mongoose');
 
const app = express();

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/todo_express", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

//log requests
app.use(morgan('tiny'));

const AuthRoute = require('./routes/auth')

// parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}));

//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine", "ejs");

//routes
app.use(require("./routes/index"))
app.use(require("./routes/todo"))
app.use(require('./routes/auth'))

app.listen(PORT, ()=> console.log("listening on port", PORT));