const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require("cors");


const mongoose = require('mongoose');
 
const app = express();
app.use(cors());


dotenv.config();
const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

//log requests
app.use(morgan('tiny'));

// parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}));

//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");

//routes
app.use(require("./routes/index"))
app.use(require("./routes/todo"))

app.listen(PORT, ()=> console.log("listening on port", PORT));