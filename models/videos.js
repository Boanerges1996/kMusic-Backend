const mongoose = require("mongoose")

const Videos = new mongoose.Schema({
    singer:{
        type:ObjectId,
        required:true
    },
    title:{
        type:String
    },
    coverUrl:{
        type:String
    },
    video:{
        type:String
    }
})

module.exports = Videos