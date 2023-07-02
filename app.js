const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("./models/Passport");
const app = express();
const methodOverride = require("method-override");
const User = require("./models/User");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(methodOverride("_method"));

const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//log requests
app.use(morgan("tiny"));

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //don't save session if unmodified
    saveUninitialized: false, //don't create session until something stored
  })
);
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions

//set view engine
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

//find user by email from collection User in database mongoDB



//Authentication
initializePassport(
  passport,
  (email) =>  User.find({email : email}),
  (_id) => User.find({id : _id})
);


app
  .post("/register", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      let user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
      })
      user.save()
      User.find();
      res.redirect("/index_login");
    } catch (e) {
      console.log(e);
      res.redirect("/index_register");
    }  })
  .post(
    "/login",
    passport.authenticate("local", { //use local strategy
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

//routes
//app.use(require("./routes/login"));
app.use(require("./routes/index"));
app.use(require("./routes/todo"));

app.listen(PORT, () => console.log("listening on port", PORT));
