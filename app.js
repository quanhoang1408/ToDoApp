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
app.use(cors());
app.use(express.json());
dotenv.config();
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
//make app can view ejs
app.engine("html", require("ejs").renderFile);

//set view engine
app.set("view engine", "ejs");
//LOGIN
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
  );
//routes
app.use(require("./routes/index"));
app.use(require("./routes/todo"));

//LOGIN

//
app.listen(PORT, () => console.log("listening on port", PORT));
