const express = require("express")
const storage = require("../middleware/multer_upload")
const router=express.Router()
const {uploadVideo,getVideoinCourse,deletevideo,createCode,getCodes,getusedCodes,postvideofromviemotoDB}=require('../controllers/video_control')
const {adminAuth}=require("../middleware/auth")


router.post('/upload/:course_id',adminAuth,storage.single('file'),uploadVideo)
router.get('/getvideos/:course_id',adminAuth,getVideoinCourse)
router.delete('/deletevideo/:course_id/:video_id',adminAuth,deletevideo)
router.put('/createcode/:video_id',createCode)
router.get('/getcodes/:video_id',adminAuth,getCodes)
router.get('/getusedcodes/:video_id',adminAuth,getusedCodes)
router.put('/download-video/:course_id',adminAuth,postvideofromviemotoDB)





module.exports = router;