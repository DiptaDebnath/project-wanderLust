const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let User = require("./User.js");

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type:Schema.Types.ObjectId,
        ref: "User",
    }
})
module.exports = mongoose.model("Review", reviewSchema);