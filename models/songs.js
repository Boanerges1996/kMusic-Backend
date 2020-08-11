const mongoose = require("mongoose")

const Songs = new mongoose.Schema({
    singer:{
        type:String,
        required:[true,"Please you have to pass the singer"]
    },
    type:{
        type:String,
        enum:["single","album"],
    },
    coverUrl:{
        type:String
    },
    songTitle:{
        type:String
    },
    numberOfSongs:{
        type:Number
    },
    songs:[
        {
            type:String
        }
    ],
    albumTitle:{
        type:String
    },
    views:{
        type:Number,
        default:0
    },
    premium:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("songs",Songs)