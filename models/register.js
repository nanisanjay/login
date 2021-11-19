const mongoose = require('mongoose')

const userSchema =new mongoose.Schema({
    Name: {type:String, required:true},
    Contact:{type:String,required:true},
    Country:{type:String,required:true},
    Address:{type:String,required:true},
    Gender:{type:String,required:true},
    Password:{type:String,required:true},
},
{collection:"users"}
)

module.exports =mongoose.model("users",userSchema)

