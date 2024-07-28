const express = require("express");
const router =  express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../Schema.js");
const { isLoggedIn , validateReview,isReviewAuthor } = require("../middlewar.js");
const reviewsController = require("../controller/reviews.js");

//database
let Listing = require("../models/listing.js");
let Review = require("../models/review.js");

  
//Reviews
//Post review Route
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewsController.postReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewsController.deleteReview));


module.exports = router;