//database
let Listing = require("../models/listing.js");
let Review = require("../models/review.js");

//Reviews
//Post review 
module.exports.postReview = async(req,res)=>{
    const { id } = req.params;
    const { review } = req.body;
    let newReview = new Review(review);
    let listing = await Listing.findById(id)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , " New Review is added");
    res.redirect(`/listing/${listing._id}/show`);
}


// Delete review
module.exports.deleteReview = async(req,res)=>{
    let {id ,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , " Review is Deleted");
    res.redirect(`/listing/${id}/show`);
}