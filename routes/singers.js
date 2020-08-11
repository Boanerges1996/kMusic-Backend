const expresss = require("express")
const controller = require("../controllers/singers")
const path = require("path")
const AUTH = require("../auth-token")
const multer = require("multer")
const router = expresss.Router()

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./static/images/songs")
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({storage:storage})


router.post("/singer/register",AUTH,controller.registerSinger)
router.post("/singer/upload/avatar",AUTH,upload.single("file"),controller.uploadCover)

router.put("/singer/put/image/db/:id",AUTH,controller.putImageInDB)

router.get("/singer/byDate",AUTH,controller.getSingerByDates)
router.get("/singer/searchone",AUTH,controller.searchParticularSinger)
router.get("/singer/get/total/singers",AUTH,controller.getTotalSingers)
router.get("/singer/get/image/:id",controller.getImage)

router.delete("/singer/delete/:id",AUTH,controller.deleteASinger)


module.exports = router