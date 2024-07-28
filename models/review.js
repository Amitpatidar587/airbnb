//lecture 53 part 3

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema=new Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

const Review=mongoose.model('Reviews',reviewSchema);

module.exports=Review;