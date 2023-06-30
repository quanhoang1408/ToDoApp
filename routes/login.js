const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const initializePassport = require("../models/passport-config");

const users =[];
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

router.post("/register", async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
           
        res.redirect("/index_login");

    }catch (e) {
        console.log(e);
        res.redirect("/index_register");

    }
    console.log(users); 
})

.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/index_login",
    failureFlash: true
}));

console.log(users);
module.exports = router;