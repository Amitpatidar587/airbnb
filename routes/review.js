const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review=require('../models/review')
const wrapAsync=require('../utils/wrapAsync')
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");


//reviews post 
router.post('/',isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
      newReview.author=req.user._id;
      console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save()
    await listing.save();
    console.log('listing review post =>',listing);
    req.flash('success',"New Review Created");
    res.redirect(`/listings/${listing._id}/show`);
  }
  ));
  
  //review delete route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  //pull method return match data and delete that data
    await Review.findByIdAndDelete(reviewId);
    console.log('id in review=>',id,reviewId);
    req.flash('success'," Review Deleted");
    res.redirect(`/listings/${id}/show`);
  }))
  
  
  module.exports=router;