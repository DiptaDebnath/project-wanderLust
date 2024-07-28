if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');
const {listingSchema , reviewSchema} = require("./Schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');





// app
const app = express();

//Routes 
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

//database model
let Listing = require("./models/listing.js");
let Review = require("./models/review.js");
let User = require("./models/User.js");

//In Built  middleware 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);


const sessionOptions ={
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,                     // day * hour * minute * second * mili Second
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  
  }
}

//session & flash middleware
app.use(flash());
app.use(session(sessionOptions));


// passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'))
  .catch((err)=> console.log(err));

app.listen(8080,()=>{
    console.log("app is running on port 8080");
})

// Routes
app.use("/listing" , listingRoute);
app.use("/listing/:id/reviews" ,reviewRoute);
app.use("/" ,userRoute);




app.all("*",(req,res,next)=>{
     next(new ExpressError(404 , "Invalid page"))
} );

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Somthing went wrong" } = err
    // console.log(err);
    res.status(statusCode).render("./listings/Error.ejs", {message});
    // res.status(statusCode).send(message);
});
