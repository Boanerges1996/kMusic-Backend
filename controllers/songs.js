const Songs = require("../models/songs")
const Singers = require("../models/singers")
const url = require("../url")

const songCoverUrl = `${url}/single/songs/cover`
const singleSong = `${url}/single/songs`

const registerSingleSongDetails = async (req,res) =>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({
            message:"Please provide a body"
        })
    }
    else{
        try{
            let singer = req.body.singer
            const song = new Songs({...req.body})
            await song.save()
            const savedSong = await Songs.findOne({singer:singer})
            res.status(201).send(savedSong)
        }
        catch(err){
            res.status(400).send(err)
        }
    }
} 

const uploadSongCover = async (req,res)=>{
    if(!req.file){
        res.status(400).send({message:"Please upload the singers cover image"})
    }
    else{
        res.status(200).send({url:`${songCoverUrl}/${req.file.filename}`})
    }
}

const uploadSingleSong = async (req,res)=>{
    if(!req.file){
        res.status(400).send({message:"Please upload the song"})
    }
    else{
        res.status(200).send({url:`${singleSong}/${req.file.filename}`})
    }
}

const updateSingleUrl = async (req,res)=>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({
            message:"Please provide a body"
        })
    }
    else{
        const id = req.params.id
        const cover = req.body.cover
        const song = req.body.song
        try{
            await Songs.updateOne({_id:id},{
                $set:{
                    coverUrl:cover,
                    songs:[song]
                }
            })
            const getUpdated = await Songs.findOne({_id:id})
            res.status(200).send(getUpdated)
        }
        catch(err){
            res.status(400).send(err)
        }
    }
}

const getAllSongs = async (req,res)=>{
    try{
        const songs = await Songs.find()
        let info = []
        songs.forEach(async (data)=>{
            const singer = await Singers.findOne({_id:data.singer})
            const name = singer.name
            // console.log(name)
            info.push({
                ...data._doc,
                singer:name
            })
            // console.log(info)
        })
        // console.log(info)
        // const singer = await Singers.findOne({singer:songs.singer})
        res.status(200).send(info)
    }
    catch(err){
        res.status(400).send(err)
    }
}

module.exports = {
    registerSingleSongDetails,
    uploadSongCover,
    uploadSingleSong,
    updateSingleUrl,
    getAllSongs
}