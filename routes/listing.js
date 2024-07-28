const express = require("express");
const router =  express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../Schema.js");
const { isLoggedIn , isOwner , validateListing} = require("../middlewar.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

//database 
let Listing = require("../models/listing.js");
 

// Home route
router.get("/", wrapAsync(listingController.index));

// create route
router.route("/create")
.get(isLoggedIn, listingController.renderCreateForm)
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

//Show route
router.get("/:id/show",wrapAsync(listingController.showListing));

//edit route
// update route
router.route("/:id/edit")
.get(isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm))
.put(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updatelisting));

//delete Route
router.delete("/:id/delete",isOwner,isLoggedIn,wrapAsync(listingController.deleteListing));

//search Route 
router.get("/search", async(req,res)=>{
    let {search} = req.query

    let words = search.split(' ');

    // Capitalize the first letter of each word
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }

    // Join the words back into a sentence
    search = words.join(' ');

    let places = await Listing.find({country:search})
    if(places.length>0){
        res.render("./listings/searchItem.ejs",{places});
    }else{
        req.flash("error","This country places doesn't have now");
        res.redirect("/listing");
    }
})

// category saearch
router.get("/category", async(req,res)=>{
    let {search} = req.query
    let categoryItems = await Listing.find({category:search})
    if(categoryItems.length>0){
        res.render("./listings/categoryItem.ejs",{categoryItems});
    }else{
        req.flash("error","This category places doesn't have now");
        res.redirect("/listing");
    }
})
module.exports = router;