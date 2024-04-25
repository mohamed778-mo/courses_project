const express =require("express")
const router = express.Router()

const blogcontroller = require("../controllers/blog_control")
const {adminAuth}=require("../middleware/auth")
const storage = require("../middleware/multer_upload")

router.post('/course_image',adminAuth,storage.single('file'),blogcontroller.createBlog_3)


module.exports = router;
