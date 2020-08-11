const mongoose = require("mongoose")

const Singer = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String
    },
    biography:{
        type:String
    },
    date:{
        type:Date,
        default: Date.now()
    },
    cover:{
        type:String
    },
    url:{
        type:String,
        min:10,
        maxlength:1024
    }
})

module.exports = mongoose.model("singer",Singer)