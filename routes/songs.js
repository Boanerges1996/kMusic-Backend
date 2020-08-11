const router = require("express").Router()
const controller = require("../controllers/songs")
const path = require("path")
const AUTH = require("../auth-token")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./static/images/songs_cover")
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
})
const singleStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./static/songs/single")
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({storage:storage})
const song = multer({storage:singleStorage})

router.post("/song/register",AUTH,controller.registerSingleSongDetails)
router.post("/song/cover/upload",AUTH,upload.single("file"),controller.uploadSongCover)
router.post("/song/single/upload",AUTH,song.single("file"),controller.uploadSingleSong)

router.put("/song/update/urls/:id",AUTH,controller.updateSingleUrl)

router.get("/song/get/all",AUTH,controller.getAllSongs)

module.exports = router