const express =require("express")
const router = express.Router()
const storage = require("../middleware/multer_upload")

const blogcontroller = require("../controllers/blog_control")
const {auth}=require("../middleware/auth")

router.post('/profile',auth,storage.single('file'),blogcontroller.createBlog)


module.exports = router;
