const Singer = require("../models/singers")
const fs = require("fs")
const url = require("../url")

//image url 
const myurl = `${url}/singers/image` // here we append the image name


const registerSinger = async (req,res)=>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({
            message:"Please provide a body"
        })
    }
    else{
        // Checking if singer exists
        const email = req.body.email
        try{
            const ifExist = await Singer.findOne({email:email})
            if(ifExist){
                res.status(400).send({
                    message:"Please this singer is already registered",
                    exists:true
                })
            }
            else{
                const singer = new Singer({
                    ...req.body
                })
                const SavedSinger = await singer.save()
                res.send({
                    ...SavedSinger._doc,
                    success:true
                })
            }
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    }
}

// Uploading singers image
const uploadCover = async (req,res)=>{
    const file = req.file
    if(!req.file){
        res.status(400).send({message:"Please upload the singers cover image"})
    }
    else{
        res.status(200).send({url:`${myurl}/${req.file.filename}`})
    }
}

// Putting image base64 string in database
const putImageInDB = async (req,res)=>{
    const id = req.params.id
    try{
        const verifyId = await Singer.findOne({_id:id})
        const url = req.body.url
        if(verifyId){
            await Singer.updateOne({_id:id},{
                $set:{
                    url:url
                }
            })
            const updatedImage = await Singer.findOne({_id:id})
            // console.log(updatedImage)
            res.status(200).send(updatedImage)
        }
        else{
            // console.log("Why")
            res.status(400).send({message:"Register an account first"})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).send(err)
    }
}

// Retrieving image
const getImage =async(req,res)=>{
    const id=req.params.id
    try{
        const image = await Singer.findOne({_id:id},{url:1})
        if(image){
            res.status(200).send(image)
        }
        else{
            res.status(400).send({
                message:"User doesnt exist so you can't get his image"
            })
        }
    }
    catch(err){
        res.status(400).send(err)
    }
}

// Get singers according to date registered Pagination
const getSingerByDates = async(req,res)=>{
    try{
        const pageNumber = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        if(!pageNumber || !limit){
            res.status({message:"Please provide page number and limit"}).send({
                message:"Please provide page and limit"
            })
        }
        else{
            const SomeSingers = await Singer.find()
                .skip((pageNumber-1)*limit)
                .limit(limit)
                .sort({date:1})
            res.status(200).send(SomeSingers)
        }
        
    }
    catch(err){
        res.status(400).send(err)
    }
}

// Searching for a particular singer
const searchParticularSinger = async (req, res)=>{
    try{
        const name = req.query.name.split(",")
        const arr = []
        for(let i=0;i<name.length;i++){
            arr[i]= new RegExp(name[i],"i")
        }
        const singer = await Singer.findOne({name:arr})
        res.status(200).send(singer)
    }
    catch(err){
        // console.log(err)
        res.status(400).send(err)
    }
}

// Delete a singer
const deleteASinger = async(req,res)=>{
    const id = req.params.id
    try{
        const verifySinger = await Singer.findOne({_id:id})
        if(verifySinger){
            const deleteSinger = await Singer.deleteOne({_id:id})
            res.status(200).send({
                ...deleteSinger,
                delete:true
            })
        }
        else{
            res.status(401).send({
                message:"Singer doesnt exist",
                exists:false
            })
        }
    }
    catch(err){
        
        res.status(400).send(err)
    }
}

const getTotalSingers = async(req,res)=>{
    try{
        await Singer.countDocuments()
        .then(data=>{
            console.log(data)
            res.status(200).send({total:data})
        })
        .catch(err=>{
            res.status(400).send(err)
        })
        
    }
    catch(err){
        res.status(400).send(err)
    }
}


module.exports = {
    registerSinger,
    getSingerByDates,
    searchParticularSinger,
    deleteASinger,
    getTotalSingers,
    uploadCover,
    putImageInDB,
    getImage
}