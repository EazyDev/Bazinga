const mongoose = require('mongoose');
const orderBazingaSchema = mongoose.Schema({
    _id :mongoose.Schema.Types.ObjectId,
    email : {type:String},
    phone : {type:Number}, 
    ordercreated : {type:Date,required:true},
    country :{type:String},
    province : {type:String},
    orderID: {type:Number,unique:true},
    firstname : {type:String},
    lastname : {type:String},
    quantity : {type:Number}
});

module.exports = mongoose.model('orderBazinga',orderBazingaSchema);