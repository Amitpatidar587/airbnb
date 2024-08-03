const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
})
userSchema.plugin(passportLocalMongoose); //we plugin passportlocalmongoose because username and passowrd related property is already implement in passportLocalMongoose we don't want to create this in schema
module.exports=mongoose.model('User',userSchema);
