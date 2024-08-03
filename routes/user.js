const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.flash("success", "welcome to wanderLust");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    console.log(req.body);
    req.flash("success", "welcome back to wanderLust!");
    res.redirect('/listings');
  }
);
router.get('/logout',(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next()
        }
        req.flash('success','you are logged out')
        res.redirect('/listings');
    })
})

module.exports = router;
