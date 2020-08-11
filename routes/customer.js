const router = require("express").Router()
const controller = require("../controllers/customer")
const AUTH = require("../auth-token")

router.post("/register",controller.registerCustomer)
router.put("/update/followers/:id",AUTH,controller.updatefollowingArtist)
router.put("/update/theme/:id",AUTH,controller.updateTheme)
router.put("/update/premium/:id",AUTH,controller.makePremium)
router.get("/get/follows/:id",AUTH,controller.getAllFollowers)



module.exports = router