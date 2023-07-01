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
const initializePassport = require("./models/passport-config");
const app = express();
const methodOverride = require("method-override");

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

//Authentication
const users = [];
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

app
  .post("/register", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      // const user = new User({
      //   id : Date.now().toString(),
      //   name: req.body.name,
      //   email: req.body.email,
      //   password: hashedPassword,
      // });
      // user.save();
      
      res.redirect("/index_login");
    } catch (e) {
      console.log(e);
      res.redirect("/index_register");
    }
    console.log(users);
  })

  .post(
    "/login",
    passport.authenticate("local", {
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
app.use(require("./routes/index"));
app.use(require("./routes/todo"));

app.listen(PORT, () => console.log("listening on port", PORT));
