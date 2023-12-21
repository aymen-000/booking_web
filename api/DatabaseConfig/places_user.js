const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    owner :{type : mongoose.Schema.Types.ObjectId, ref:'user'} , 
    title : String , 
    photos : [String] , 
    address :String , 
    perks  : [String] , 
    description : String , 
    checkin : Number , 
    checkout : Number , 
    maxguests : Number,
    extrainfo : String,
    bg : [String] ,
    price : Number ,
    liked : Boolean, 
})
const place = mongoose.model('places' , Schema)
module.exports = place