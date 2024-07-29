const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-model-of-a-house-with-a-car-parked-in-front-of-it-TD5d-_Mw3xY",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/a-model-of-a-house-with-a-car-parked-in-front-of-it-TD5d-_Mw3xY"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:'Review',

    }
  ]
});

listingSchema.post('findOneAndDelete',async(listing)=>{
  if(listing){

    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});




const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;