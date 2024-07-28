const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Review = require("./review.js");
let User = require("./User.js");

const listingSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type : Number,
        required : true
    },
    location: {
        type : String,
        required : true
    },
    country: {
        type : String,
        required : true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },    
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    category:{
        type: String,
        required: true
    }  
})
//mongoose middleware
listingSchema.post("findOneAndDelete",async(listingData)=>{
    if(listingData){
        await Review.deleteMany({_id : {$in: listingData.reviews}});
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;