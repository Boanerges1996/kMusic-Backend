const mongoose = require("mongoose")
const Customer = new mongoose.Schema({
    email:{
        type:String
    },
    number:{
        type:String
    },
    birthday:{
        type:Date
    },
    password:{
        type:String,
        min:6,
        max:1024
    },
    premium:{
        type:Boolean,
        default:false
    },
    darkTheme:{
        type:Boolean,
        default:true
    },
    follows:{
        type:Array,
        default:[]
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("customer",Customer)