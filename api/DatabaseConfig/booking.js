const mongoose = require('mongoose')
const booking1 = new mongoose.Schema({
    owner :{type : mongoose.Schema.Types.ObjectId, ref:'user'} , 
    price : Number,
    checkin : String , 
    checkout : String , 
    name :String , 
    phone : String ,
    num : Number , 
    photo : String , 

})

const booking = mongoose.model('booking' , booking1)
module.exports = booking 