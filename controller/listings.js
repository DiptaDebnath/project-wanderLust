// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const maptoken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: maptoken });

//database 
let Listing = require("../models/listing.js");

//Home
module.exports.index = async(req,res)=>{
    let lists = await Listing.find();
    res.render("./listings/Home.ejs", {lists});
}

// create
module.exports.renderCreateForm = (req,res)=>{
    res.render("./listings/create.ejs");
  }

  const axios = require('axios');

  module.exports.createListing = async (req, res) => {
      const location = req.body.listing.location;
      
      try {
          const response = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: {
                  q: location,
                  format: 'json',
                  addressdetails: 1,
                  limit: 1
              }
          });
  
          if (response.data.length === 0) {
              throw new Error('Location not found');
          }
  
          const geoData = response.data[0];
          const newItem = req.body.listing;
          const item = new Listing(newItem);
  
          item.image = {
              url: req.file.path,
              filename: req.file.filename
          };
          item.geometry = {
              type: "Point",
              coordinates: [geoData.lon, geoData.lat]
          };
          item.owner = req.user._id;
  
          await item.save();
          console.log(item);
  
          req.flash("success", "New listing is created");
          res.redirect("/listing");
      } catch (error) {
          console.error(error);
          req.flash("error", "Failed to create listing. Please try again.");
          res.redirect("/listing/new");
      }
  };
  
//Show listing 
module.exports.showListing = async(req,res)=>{
    let { id } = req.params;
    let list = await Listing.findById(id).populate({path: "reviews" , populate:{ path: "author"}}).populate("owner");
    if(!list){
      req.flash("error" , " Listing you requested for does not exist");
      res.redirect("/listing");
    }
    // console.log(list)
    res.render("./listings/show.ejs", {list});
    
  }


//Edit listing
module.exports.renderEditForm = async(req,res)=>{
    let { id } = req.params;
    let list = await Listing.findById(id);
    if(!list){
      req.flash("error" , " Listing you requested for does not exist");
      res.redirect("/listing");
    }
    originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_220,w_250");
    res.render("./listings/edit.ejs", {list,originalImageUrl});
    
  }

module.exports.updatelisting = async(req,res)=>{
    // if(!req.body.listing){
    //   throw new ExpressError(400 , "Send valid data for listing");
    // }
    let { id } = req.params;
    let newItem = req.body.listing;
    // console.log(newItem);
    let list = await Listing.findByIdAndUpdate(id, newItem,{runValidation : true , new : true});
    
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      list.image = {url,filename};
      await list.save();
    }
    
    req.flash("success" , " The listing edit success fully");
    // console.log(list);
    res.redirect(`/listing/${id}/show`);
    
  }

// delete listing
module.exports.deleteListing = async(req,res)=>{
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    // console.log(list);
    req.flash("success" , "listing is Deleted");
    res.redirect(`/listing`);
    
  }
  
  

// module.exports.createListing = async(req,res)=>{
//     let Response = await geocodingClient.forwardGeocode({
//       query: req.body.listing.location,
//       limit: 2
//     })
//     .send()
//     let url = req.file.path;
//     let filename = req.file.filename;
//     let newItem = req.body.listing;
//     let item = new Listing(newItem);
//     item.image = {url,filename};
//     item.geometry = Response.body.features[0].geometry;
//     item.owner = req.user._id;
//     await item.save();
//     console.log(item)
  
//     req.flash("success" , " New listing is created");
//     //  console.log(newItem);
//     res.redirect("/listing");
//   }  