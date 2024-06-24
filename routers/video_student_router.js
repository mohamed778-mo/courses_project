const express = require("express")
const router=express.Router()
const {getVideoinCourse,buyVideo,getvideosstudent}=require('../controllers/video_control')
const {auth}=require("../middleware/auth")




router.post('/buyvideo/:video_id',auth,buyVideo)
router.get('/getvideo/:course_id',auth,getVideoinCourse)
router.get('/getvideos',auth,getvideosstudent)



module.exports = router;