let Listing = require("./models/listing.js");
let Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./Schema.js");
const {reviewSchema} = require("./Schema.js");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error" , "You have to logging!");
        return res.redirect("/login");
    } 
    next();
} 

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
} 

module.exports.isOwner = async(req, res, next) =>{
    let { id } = req.params;
    let list = await Listing.findById(id);
    if(res.locals.currUser && !list.owner._id.equals(res.locals.currUser._id) ){
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listing/${id}/show`)
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body)
    // let errMsg = error.details.message;
    // console.log(errMsg);
    // let errMsg = error.details.map((el)=> el.message).join(","); 
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        // console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
  } 

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body)
    // let errMsg = error.details.message;
    // console.log(errMsg);
    // let errMsg = error.details.map((el)=> el.message).join(","); 
    console.log(error);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        // console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
  } 

  module.exports.isReviewAuthor = async(req, res, next) =>{
    let { id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id) ){
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listing/${id}/show`)
    }
    next();
}