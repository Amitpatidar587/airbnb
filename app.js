const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session=require('express-session');
const path = require("path");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const mongoose = require("mongoose");
MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((error) => {
    console.log(error);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

//set method 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//use method
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

//session option
const sessionOption={
  secret:'mysupersecretcode',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,  //7 day  ke liye agr loguot krne k baad wapis aate ho to login karne ki need nahi he isme =((day * hour * minute * second * milisecond ))he  
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  // console.log(success);
  next();
})


//////
app.get("/", (req, res) => {
  res.send("port is working");
});

// pass router
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



//middleware error show in server side error
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  console.log(err);
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});




//port listing
app.listen(8080, () => {
  console.log("port is listining at 8080");
});
