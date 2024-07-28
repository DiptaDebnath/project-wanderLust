const mongoose = require('mongoose');
let Listing = require("../models/listing.js");
let initData = require("./data.js");

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log('Connected!'))
  .catch((err)=> console.log(err));

let customData = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>(
      {...obj, owner: '66237437be17d0569b894e47'}
    ));
    await Listing.insertMany(initData.data);

    console.log("data is initialize");
}

customData();


