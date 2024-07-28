const express = require("express");
const router =  express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/User.js");
const passport = require('passport'); 
const {saveRedirectUrl} =  require("../middlewar.js");
const userController = require("../controller/user.js");

// signup
router.route("/signup")
.get(userController.getSignupForm )
.post(wrapAsync(userController.getSignup));

// login 

router.route("/login")
.get(userController.getLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login" , failureFlash: true
    }), userController.getLogin
    );

router.get("/logout", userController.getLogout);


module.exports = router;