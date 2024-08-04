const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// part 7 new route
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
}); //new wale ko part 6 wale se niche rakhenge to error aayega kyoki wo new ko as a _id search kr rha he

//part 6 show route
router.get(
  "/:id/show",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
          path:'author',
        },
      })
      .populate("owner");
    console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

//part 7 new route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save().then((res) => console.log("success"));
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//part 8  edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested for edit  does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    req.flash("success", " Listing Updated");
    await Listing.findByIdAndUpdate(id, { ...listing });
    res.redirect("/listings");
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
