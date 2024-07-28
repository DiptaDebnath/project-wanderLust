// Data base
const User = require("../models/User.js");


module.exports.getSignupForm = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.getSignup = async(req,res)=>{
    try{
        let { username, email, password} = req.body;
        let newUser = new User({
        email,username
         })

        let registerUser = await User.register(newUser, password);
        // console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Wellcome to WanderLust");
            res.redirect("/listing")
        })
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}


module.exports.getLoginForm = (req,res)=>{
    res.render("user/login.ejs");
}


module.exports.getLogin = async(req,res)=>{
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listing" ;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
} 

module.exports.getLogout = (req,res)=>{
    req.logout((err)=>{
       if(err){
            return next(err);
       }
       req.flash("success", "You are Logout");
       res.redirect("/listing"); 
    });
}
