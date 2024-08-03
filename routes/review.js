const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const Review=require('../models/review')
const wrapAsync=require('../utils/wrapAsync')
const ExpressError=require('../utils/ExpressError')
 const {reviewSchema}=require('../schema')





const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(',');
      throw new ExpressError(400,'validation fail');
    }else{
      next();
    }
  }



//reviews post 
router.post('/',validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
  
    listing.reviews.push(newReview);
    req.flash('success',"New Review Created");
  
    await newReview.save()
    await listing.save();
    console.log('review add successfull')
    res.redirect(`/listings/${listing._id}/show`);
  }
  ));
  
  //review delete route
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  //pull method return match data and delete that data
    await Review.findByIdAndDelete(reviewId);
    console.log('id in review=>',id,reviewId);
    req.flash('success'," Review Deleted");
    res.redirect(`/listings/${id}/show`);
  }))
  
  
  module.exports=router;