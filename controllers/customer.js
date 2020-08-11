const Customer = require("../models/customer")
const Singers = require("../models/singers")
const bcrypt = require("bcryptjs")


// Registering Customer
const registerCustomer = async (req,res)=>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({message:"Please provide a body"})
    }
    else{
        try{
            const email = req.body.email
            const IfExists = await Customer.findOne({email:email})
            if(IfExists){
                res.status(400).send({
                    message:"Account already exists",
                    exist:true
                })
            }
            else{
                const pass = req.body.password
                const salt = await bcrypt.genSalt(10)
                const myPassword = await bcrypt.hash(pass,salt)
                const customer = new Customer({
                    ...req.body,
                    password:myPassword
                })
                const savedCustomer = await customer.save()
                const getSavedCustomer = await Customer.findOne({email:email},{password:0})
                res.status(200).send(getSavedCustomer)
            }
        }
        catch(err){
            res.status(400).send(err)
        }
    }
}

//Updating Following Aritist
const updatefollowingArtist = async (req,res)=>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({message:"Please provide the Artist that you are following"})
    }
    else{
        try{
            const id = req.params.id
            await Customer.updateOne({_id:id},{
                $set:{
                    follows :[...req.body.followers]
                }
            })
            const UpdatedCustomer = await Customer.findOne({_id:id},{password:0})
            res.status(200).send(UpdatedCustomer)
        }
        catch(err){
            res.status(400).send(err)
        }
    }
}

// Updating theme
const updateTheme = async(req,res)=>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({message:"Please provide the Artist that you are following"})
    }
    else{
        try{
            const id = req.params.id
            await Customer.updateOne({_id:id},{
                $set:{
                    darkTheme:req.body.theme
                }
            })
            const UpdatedCustomer = await Customer.findOne({_id:id},{password:0})
            res.status(200).send(UpdatedCustomer)
        }
        catch(err){
            res.status(400).send(err)
        }
    }
}

// Getting all followers
const getAllFollowers = async (req,res)=>{
    try{
        const id = req.params.id
        const verifyID = await Customer.findOne({_id:id})
        if(verifyID){
            const myFollows = []
            const follower = [...verifyID.follows]
            for(let i=0;i<follower.length;i++){
                const singers = await Singers.findOne({_id:follower[i]})
                myFollows[i] = singers
            }
            res.status(200).send(myFollows)
        }
        else{
            res.status(400).send({message:"Account doesnt exist"})
        }
    }
    catch(err){
        res.status(400).send(err)
    }
}

// Premium Registration
const makePremium = async (req,res)=>{
    if(Object.entries(req.body).length === 0 && req.body.constructor === Object){
        res.status(400).send({message:"Please provide a body"})
    }
    else{
        const id = req.params.id
        try{
            const verifyID = await Customer.findOne({_id:id})
            if(verifyID){
                const premium = req.body.premium
                await Customer.updateOne({_id:id},{
                    $set:{
                        premium:premium
                    }
                })
                const getUpdatedPremium = await Customer.findOne({_id:id})
                res.status(200).send(getUpdatedPremium)
            }
            else{
                res.status(400).send({
                    message:"Account doesnt exist"
                })
            }
        }
        catch(err){
            res.status(400).send(err)
        }
    }
}


module.exports = {
    registerCustomer,
    updatefollowingArtist,
    updatefollowingArtist,
    updateTheme,
    getAllFollowers,
    makePremium
}