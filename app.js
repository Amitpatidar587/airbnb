const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review=require('./models/review')
const methodOverride=require('method-override');
const ejsMate= require('ejs-mate')
const wrapAsync=require('./utils/wrapAsync')
const ExpressError=require('./utils/ExpressError')
 const {listingSchema}=require('./schema')
 const {reviewSchema}=require('./schema')

const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')))

MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((error) => {
    console.log(error);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

//////
app.get("/", (req, res) => {
  res.send("port is working");
});

const validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(',');
    throw new ExpressError(400,'validation fail');
  }else{
    next();
  }
}
const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(',');
    throw new ExpressError(400,'validation fail');
  }else{
    next();
  }
}


app.get("/listings", wrapAsync(async(req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
})
);


// part 7 new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
}); //new wale ko part 6 wale se niche rakhenge to error aayega kyoki wo new ko as a _id search kr rha he

//part 6
app.get("/listings/:id/show",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/show.ejs", { listing });
})
);

//part 7
app.post("/listings",validateListing, wrapAsync(async(req,res,next) => {
 
    const newlisting= new Listing(req.body.listing);
    await newlisting.save()
     .then((res)=>console.log('success'));
    res.redirect('/listings') 
})
);

//part 8
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  console.log(listing);
   res.render('listings/edit.ejs',{listing})
})
);
app.put('/listings/:id',validateListing,wrapAsync(async(req,res)=>{
  let {id}=req.params;
  let listing=req.body.listing;
  await Listing.findByIdAndUpdate(id,{...listing});
  res.redirect('/listings');
})
);

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
})
);

//reviews
app.post('/listings/:id/reviews',validateReview,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save()
  await listing.save();
  console.log('review add successfull')
  res.redirect(`/listings/${listing._id}/show`);

}
));

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:'my new villa',
//         discription:'by the beach',
//         price:1200,
//         location:'calangute,goa',
//         country:'india',
//     })
//     await sampleListing.save()
//     console.log("sample was saved");
//     res.send("sending success")
// })

//middleware error show in server side error 
app.all('*',(req,res,next)=>{
  next(new ExpressError(404,'Page Not Found'))
})
app.use((err,req,res,next)=>{
  console.log(err);
  let{statusCode=500,message="Something Went Wrong"}=err;
  res.status(statusCode).render('listings/error.ejs',{err});
})

app.listen(8080, () => {
  console.log("port is listining at 8080");
});
